import os

from fastapi import APIRouter, HTTPException, Request
from openai import OpenAI
from pydantic import BaseModel

from services.embedding_service import create_embedding
from services.vector_db import is_vector_store_enabled, search_vectors

router = APIRouter()

_NVIDIA_API_KEY = os.environ.get("NVIDIA_API_KEY")
_NVIDIA_BASE_URL = os.environ.get("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
_CHAT_MODEL = os.environ.get("NVIDIA_CHAT_MODEL", "meta/llama-3.1-70b-instruct")
_llm_client = OpenAI(api_key=_NVIDIA_API_KEY, base_url=_NVIDIA_BASE_URL) if _NVIDIA_API_KEY else None


# ── Schema ────────────────────────────────────────────────────────────────────

class QueryRequest(BaseModel):
    query: str
    top_k: int = 5


class RetrievedChunk(BaseModel):
    text: str
    source: str
    chunk_index: int
    distance: float


class ChatMessage(BaseModel):
    role: str      # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: list[ChatMessage]
    top_k: int = 5


class ChatResponse(BaseModel):
    answer: str
    sources: list[str]


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/query", response_model=list[RetrievedChunk])
async def query_documents(payload: QueryRequest, request: Request):
    """Return raw top-k retrieved chunks for a query (no LLM call)."""
    if not payload.query.strip():
        raise HTTPException(status_code=400, detail="Query must not be empty.")

    session_id = getattr(request.state, "session_id", None)
    query_vector = create_embedding(payload.query)
    results = search_vectors(query_vector, top_k=payload.top_k, session_id=session_id)

    return [
        RetrievedChunk(
            text=r["text"],
            source=r["metadata"].get("source", "unknown"),
            chunk_index=r["metadata"].get("chunk_index", -1),
            distance=r["distance"],
        )
        for r in results
    ]


@router.post("/chat", response_model=ChatResponse)
async def chat(payload: ChatRequest, request: Request):
    """
    Full RAG chat:
      1. Embed the latest user message.
    2. Retrieve the most relevant document chunks when vector DB is enabled.
    3. Call the configured NVIDIA-hosted LLM with context + full conversation history.
      4. Return the generated answer and source filenames.
    """
    if _llm_client is None:
        raise HTTPException(
            status_code=500,
            detail="NVIDIA_API_KEY is not set. Please add it to backend/.env and restart the server.",
        )

    # Find the last user message to embed
    user_message = next(
        (m.content for m in reversed(payload.messages) if m.role == "user"), None
    )
    if not user_message:
        raise HTTPException(status_code=400, detail="No user message found.")

    # Retrieve context (optional when VECTOR_DB_ENABLED=false)
    query_vector = create_embedding(user_message)
    session_id = getattr(request.state, "session_id", None)
    results = search_vectors(query_vector, top_k=payload.top_k, session_id=session_id)
    context = "\n\n".join(r["text"] for r in results)
    sources = list({r["metadata"].get("source", "unknown") for r in results})

    if context.strip():
        system_prompt = (
            "You are BookMind GPT, an AI assistant that answers questions based on "
            "uploaded documents.\n\n"
            "Use ONLY the retrieved context below to answer. "
            "If the context doesn't contain the answer, say so clearly.\n\n"
            f"Retrieved context:\n{context}"
        )
    elif is_vector_store_enabled():
        return ChatResponse(
            answer="I couldn't find any relevant content in your uploaded documents. Please upload a PDF first.",
            sources=[],
        )
    else:
        system_prompt = (
            "You are BookMind GPT. Vector storage is disabled for this deployment, "
            "so answer as a general assistant from your own knowledge and the ongoing conversation."
        )

    llm_messages = [{"role": "system", "content": system_prompt}]
    llm_messages += [{"role": m.role, "content": m.content} for m in payload.messages]

    try:
        completion = _llm_client.chat.completions.create(
            model=_CHAT_MODEL,
            messages=llm_messages,
        )
        answer = completion.choices[0].message.content
    except Exception as exc:
        raise HTTPException(status_code=502, detail=f"LLM call failed: {exc}") from exc

    return ChatResponse(answer=answer, sources=sources)

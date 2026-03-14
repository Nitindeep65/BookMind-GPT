import uuid
import os
import shutil

import chromadb

_VECTOR_DB_ENABLED = os.environ.get("VECTOR_DB_ENABLED", "true").strip().lower() == "true"

def _resolve_db_path() -> str:
    # Render containers may include stale repo files; default to /tmp there.
    if os.environ.get("CHROMA_PERSIST_DIR"):
        return os.path.abspath(os.environ["CHROMA_PERSIST_DIR"])

    if os.environ.get("RENDER") == "true":
        return "/tmp/chroma_store"

    return os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "chroma_store"))


def _init_chroma() -> tuple[chromadb.ClientAPI | None, any]:
    if not _VECTOR_DB_ENABLED:
        return None, None

    db_path = _resolve_db_path()
    os.makedirs(db_path, exist_ok=True)

    try:
        _client = chromadb.PersistentClient(path=db_path)
        _collection = _client.get_or_create_collection(name="rag_documents")
        return _client, _collection
    except Exception:
        # Recover from incompatible/corrupted persisted metadata by resetting store.
        shutil.rmtree(db_path, ignore_errors=True)
        os.makedirs(db_path, exist_ok=True)
        _client = chromadb.PersistentClient(path=db_path)
        _collection = _client.get_or_create_collection(name="rag_documents")
        return _client, _collection


client, collection = _init_chroma()


def is_vector_store_enabled() -> bool:
    return _VECTOR_DB_ENABLED


def store_vectors(embeddings: list[dict], doc_name: str = "unknown", session_id: str | None = None):
    """
    embeddings: list of {"text": str, "embedding": list[float]}
    doc_name:   source document filename for metadata
    """
    if not _VECTOR_DB_ENABLED or not embeddings or collection is None or not session_id:
        return

    ids = []
    documents = []
    vectors = []
    metadatas = []

    for i, item in enumerate(embeddings):
        # Use UUID so multiple documents never collide
        ids.append(str(uuid.uuid4()))
        documents.append(item["text"])
        vectors.append(item["embedding"])      # correctly extract the float list
        metadatas.append({"source": doc_name, "chunk_index": i, "session_id": session_id})

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=vectors,
        metadatas=metadatas,
    )


def search_vectors(query_embedding: list[float], top_k: int = 5, session_id: str | None = None) -> list[dict]:
    """Return top-k most similar chunks for a query embedding."""
    if not _VECTOR_DB_ENABLED or collection is None or not session_id:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
        where={"session_id": session_id},
    )
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    return [
        {"text": doc, "metadata": meta, "distance": dist}
        for doc, meta, dist in zip(docs, metas, distances)
    ]


def delete_vectors_by_session(session_id: str | None) -> None:
    if not _VECTOR_DB_ENABLED or collection is None or not session_id:
        return

    try:
        existing = collection.get(where={"session_id": session_id}, include=[])
        ids = existing.get("ids", [])
        if ids:
            collection.delete(ids=ids)
    except Exception:
        # Cleanup should never break request flow.
        return

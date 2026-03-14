import uuid
import os

import chromadb

_VECTOR_DB_ENABLED = os.environ.get("VECTOR_DB_ENABLED", "true").strip().lower() == "true"

# Persistent storage — data survives server restarts
_db_path = os.path.join(os.path.dirname(__file__), "..", "chroma_store")
client = chromadb.PersistentClient(path=os.path.abspath(_db_path)) if _VECTOR_DB_ENABLED else None
collection = client.get_or_create_collection(name="rag_documents") if client else None


def is_vector_store_enabled() -> bool:
    return _VECTOR_DB_ENABLED


def store_vectors(embeddings: list[dict], doc_name: str = "unknown"):
    """
    embeddings: list of {"text": str, "embedding": list[float]}
    doc_name:   source document filename for metadata
    """
    if not _VECTOR_DB_ENABLED or not embeddings or collection is None:
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
        metadatas.append({"source": doc_name, "chunk_index": i})

    collection.add(
        ids=ids,
        documents=documents,
        embeddings=vectors,
        metadatas=metadatas,
    )


def search_vectors(query_embedding: list[float], top_k: int = 5) -> list[dict]:
    """Return top-k most similar chunks for a query embedding."""
    if not _VECTOR_DB_ENABLED or collection is None:
        return []

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )
    docs = results.get("documents", [[]])[0]
    metas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]
    return [
        {"text": doc, "metadata": meta, "distance": dist}
        for doc, meta, dist in zip(docs, metas, distances)
    ]

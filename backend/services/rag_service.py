from services.embedding_service import create_embeddings_batch


def embed_chunks(chunks: list[str]) -> list[dict]:
    """
    Embed all chunks in a single batched API call instead of one call per chunk.
    Returns a list of {"text": str, "embedding": list[float]}.
    """
    if not chunks:
        return []

    vectors = create_embeddings_batch(chunks)

    return [{"text": chunk, "embedding": vector} for chunk, vector in zip(chunks, vectors)]

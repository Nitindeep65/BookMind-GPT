import base64
import numpy as np


def decode_embedding(embedding) -> list[float]:
    """
    Perplexity returns embeddings as base64-encoded int8 arrays.
    Decode to float32 for use with ChromaDB.
    """
    if isinstance(embedding, str):
        decoded = base64.b64decode(embedding)
        return np.frombuffer(decoded, dtype=np.int8).astype(np.float32).tolist()

    # Already a numeric sequence (list or ndarray)
    return [float(x) for x in embedding]

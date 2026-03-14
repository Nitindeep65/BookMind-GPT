import os
from openai import OpenAI

_BASE_URL = os.environ.get("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
_API_KEY = os.environ.get("NVIDIA_API_KEY")
_MODEL = os.environ.get("NVIDIA_EMBEDDING_MODEL", "nvidia/llama-3.2-nv-embedqa-1b-v2")
_INPUT_TYPE = os.environ.get("NVIDIA_EMBEDDING_INPUT_TYPE", "query")
_TRUNCATE = os.environ.get("NVIDIA_EMBEDDING_TRUNCATE", "NONE")
_ENCODING_FORMAT = os.environ.get("NVIDIA_EMBEDDING_ENCODING_FORMAT", "float")

client = OpenAI(api_key=_API_KEY, base_url=_BASE_URL)


def create_embeddings_batch(texts: list[str]) -> list[list[float]]:
    """
    Embed a batch of texts in a single API call.
    Returns a list of float vectors, one per input text.
    """
    response = client.embeddings.create(
        input=texts,
        model=_MODEL,
        encoding_format=_ENCODING_FORMAT,
        extra_body={"input_type": _INPUT_TYPE, "truncate": _TRUNCATE},
    )
    return [[float(x) for x in item.embedding] for item in response.data]


# Kept for backwards compatibility / single-item use
def create_embedding(text: str) -> list[float]:
    return create_embeddings_batch([text])[0]

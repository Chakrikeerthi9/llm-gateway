import os
from app.config import settings

_local_model = None

def embed(text: str) -> list[float]:
    if os.environ.get("RENDER"):
        from openai import OpenAI
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding
    else:
        global _local_model
        if _local_model is None:
            from sentence_transformers import SentenceTransformer
            _local_model = SentenceTransformer("all-MiniLM-L6-v2")
        return _local_model.encode(text).tolist()

def get_embedder():
    return embed
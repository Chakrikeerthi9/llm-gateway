from pydantic_settings import BaseSettings
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    DATABASE_URL: str
    REDIS_URL: str
    JWT_SECRET: str
    OPENAI_API_KEY: str
    ANTHROPIC_API_KEY: str = ""
    LANGFUSE_PUBLIC_KEY: str = ""
    LANGFUSE_SECRET_KEY: str = ""
    LANGFUSE_BASE_URL: str = ""
    SENTRY_DSN: str = ""
    EMBEDDING_DIM: int = 1536
    ADMIN_API_KEY: str = ""

    model_config = {"env_file": str(BASE_DIR / ".env"), "extra": "ignore"}
settings = Settings()
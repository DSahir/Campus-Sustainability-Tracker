from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    api_prefix: str = "/api/v1"
    app_env: str = "development"
    project_name: str = "Campus Sustainability Tracker"
    postgres_db: str = "sustainability"
    postgres_user: str = "postgres"
    postgres_password: str = "postgres"
    postgres_host: str = "db"
    postgres_port: int = 5432
    cors_origins: list[str] = Field(
        default_factory=lambda: [
            "http://localhost:3000",
            "http://localhost:5173",
        ]
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

from functools import lru_cache
from pathlib import Path

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
    database_url: str | None = Field(default=None, env="DATABASE_URL")
    model_artifacts_dir: str = str(
        Path(__file__).resolve().parent.parent / "ml" / "artifacts"
    )
    model_artifact_map: dict[str, str] = Field(
        default_factory=lambda: {
            "energy": "xgboost_model.joblib",
            "water": "baseline_model.joblib",
            "waste": "baseline_model.joblib",
            "co2": "baseline_model.joblib",
        }
    )
    report_output_dir: str = str(
        Path(__file__).resolve().parent.parent / "reports_output"
    )

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    @property
    def resolved_database_url(self) -> str:
        if self.database_url:
            return self.database_url

        return (
            f"postgresql://{self.postgres_user}:{self.postgres_password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

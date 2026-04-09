from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.routes import router as api_router
from backend.app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="Campus Sustainability Tracker API",
        version="0.1.0",
        description="Stub API for sustainability monitoring, alerts, predictions, and reports.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.get("/health", tags=["health"])
    def healthcheck() -> dict[str, str]:
        return {"status": "ok"}

    app.include_router(api_router, prefix=settings.api_prefix)
    return app


app = create_app()

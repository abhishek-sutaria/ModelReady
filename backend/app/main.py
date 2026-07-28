from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routes import router
from app.config import get_cors_origins, get_static_dir


def create_app() -> FastAPI:
    app = FastAPI(
        title="ModelReady",
        description=(
            "Single product that combines LLM quality and SLA/performance checks "
            "into one production-readiness verdict."
        ),
        version="0.1.0",
    )

    origins = get_cors_origins()
    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=origins != ["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(router)

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok", "service": "modelready"}

    static_dir = get_static_dir()
    if static_dir is not None:
        # Serve the React build from the same origin as the API (one public URL).
        app.mount("/", StaticFiles(directory=str(static_dir), html=True), name="frontend")

    return app


app = create_app()

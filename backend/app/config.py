from __future__ import annotations

import os
from pathlib import Path


def get_cors_origins() -> list[str]:
    """Comma-separated origins, or * for all (MVP demo default)."""
    raw = os.getenv("CORS_ORIGINS", "*").strip()
    if raw == "*" or raw == "":
        return ["*"]
    return [origin.strip() for origin in raw.split(",") if origin.strip()]


def get_static_dir() -> Path | None:
    """
    Directory of built frontend assets.

    Defaults to backend/static (populated by the production Docker image).
    Returns None when the directory is absent so local API-only mode still works.
    """
    default = Path(__file__).resolve().parents[1] / "static"
    configured = Path(os.getenv("STATIC_DIR", str(default)))
    if configured.is_dir() and any(configured.iterdir()):
        return configured
    return None


def get_port() -> int:
    return int(os.getenv("PORT", "8000"))

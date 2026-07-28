from __future__ import annotations

from fastapi import APIRouter

from app.engines.readiness import compute_readiness
from app.models.schemas import ReadinessReport, ReadinessRequest

router = APIRouter(prefix="/api/v1", tags=["readiness"])


@router.post("/readiness", response_model=ReadinessReport)
def create_readiness_report(payload: ReadinessRequest) -> ReadinessReport:
    """Combine uploaded quality + performance inputs into one verdict."""
    return compute_readiness(payload)


@router.get("/schemas")
def list_schemas() -> dict[str, str]:
    return {
        "quality_input": "/shared/schemas/quality_input.json",
        "performance_input": "/shared/schemas/performance_input.json",
        "readiness_report": "/shared/schemas/readiness_report.json",
    }

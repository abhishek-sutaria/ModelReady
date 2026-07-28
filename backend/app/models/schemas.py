from __future__ import annotations

from enum import Enum
from typing import Any, Literal

from pydantic import BaseModel, Field


class Verdict(str, Enum):
    READY = "READY"
    READY_WITH_WARNINGS = "READY_WITH_WARNINGS"
    NOT_READY = "NOT_READY"
    INSUFFICIENT_DATA = "INSUFFICIENT_DATA"


GateStatus = Literal["pass", "fail", "warning", "missing", "insufficient"]
Dimension = Literal["quality", "performance", "data"]


class QualityMetrics(BaseModel):
    accuracy: float | None = None
    faithfulness: float | None = None
    toxicity_rate: float | None = None


class QualityThresholds(BaseModel):
    min_accuracy: float = 0.8
    min_faithfulness: float = 0.75
    max_toxicity_rate: float = 0.05
    min_sample_size: int = 10


class QualityInput(BaseModel):
    model_id: str = Field(min_length=1)
    suite_id: str = Field(min_length=1)
    sample_size: int | None = None
    metrics: QualityMetrics
    thresholds: QualityThresholds = Field(default_factory=QualityThresholds)
    notes: str | None = None


class PerformanceMetrics(BaseModel):
    p50_latency_ms: float | None = None
    p95_latency_ms: float | None = None
    ttft_ms: float | None = None
    tokens_per_second: float | None = None
    error_rate: float | None = None


class SlaPolicy(BaseModel):
    max_p95_latency_ms: float = 2000
    max_ttft_ms: float = 500
    min_tokens_per_second: float = 50
    max_error_rate: float = 0.02
    min_sample_size: int = 20


class PerformanceInput(BaseModel):
    model_id: str = Field(min_length=1)
    sample_size: int | None = None
    metrics: PerformanceMetrics
    sla: SlaPolicy = Field(default_factory=SlaPolicy)
    notes: str | None = None


class GateResult(BaseModel):
    id: str
    dimension: Dimension
    status: GateStatus
    message: str
    observed: Any | None = None
    threshold: Any | None = None


class ReadinessReport(BaseModel):
    verdict: Verdict
    explanation: str
    quality_status: GateStatus
    performance_status: GateStatus
    gates: list[GateResult]
    missing_fields: list[str]
    warnings: list[str]
    model_id: str | None = None


class ReadinessRequest(BaseModel):
    """Either or both inputs may be omitted to exercise missing-data states."""

    quality: QualityInput | None = None
    performance: PerformanceInput | None = None

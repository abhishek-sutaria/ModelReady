from __future__ import annotations

import json
from pathlib import Path
from typing import Literal

from pydantic import BaseModel, Field

from app.models.schemas import (
    PerformanceInput,
    QualityInput,
    ReadinessReport,
    ReadinessRequest,
    SlaPolicy,
)


ProviderId = Literal["mock", "cerebras", "openai_compatible", "vllm"]
SuiteId = Literal["general_qa", "coding", "reasoning"]
PolicyId = Literal["interactive_chat", "batch_inference"]


class EvaluationRequest(BaseModel):
    provider: ProviderId
    model_id: str = Field(min_length=1)
    suite_id: SuiteId
    policy_id: PolicyId


class EvaluationResponse(BaseModel):
    mode: Literal["mock", "unsupported"]
    message: str | None = None
    report: ReadinessReport | None = None
    quality: QualityInput | None = None
    performance: PerformanceInput | None = None


SAMPLE_DIR = Path(__file__).resolve().parents[3] / "shared" / "sample_data"

# Suite → quality fixture used by Mock Provider (honest bundled samples).
SUITE_QUALITY_FIXTURES: dict[str, str] = {
    "general_qa": "quality_pass.json",
    "coding": "quality_pass.json",
    "reasoning": "quality_pass.json",
}

# Policy → performance fixture + SLA overlay for Mock Provider.
POLICY_PERFORMANCE_FIXTURES: dict[str, str] = {
    "interactive_chat": "performance_pass.json",
    "batch_inference": "performance_pass.json",
}

POLICY_SLA: dict[str, SlaPolicy] = {
    "interactive_chat": SlaPolicy(
        max_p95_latency_ms=2000,
        max_ttft_ms=500,
        min_tokens_per_second=50,
        max_error_rate=0.02,
        min_sample_size=20,
    ),
    "batch_inference": SlaPolicy(
        max_p95_latency_ms=8000,
        max_ttft_ms=2000,
        min_tokens_per_second=20,
        max_error_rate=0.05,
        min_sample_size=20,
    ),
}

LIVE_PROVIDER_MESSAGE = (
    "Live provider integration is planned. "
    "Using Mock Provider is recommended for this demo."
)


def _load_json(name: str) -> dict:
    path = SAMPLE_DIR / name
    if not path.is_file():
        # Docker image copies shared next to backend as /app/shared
        alt = Path("/app/shared/sample_data") / name
        path = alt if alt.is_file() else path
    return json.loads(path.read_text(encoding="utf-8"))


def build_mock_inputs(request: EvaluationRequest) -> tuple[QualityInput, PerformanceInput]:
    quality_raw = _load_json(SUITE_QUALITY_FIXTURES[request.suite_id])
    performance_raw = _load_json(POLICY_PERFORMANCE_FIXTURES[request.policy_id])

    quality = QualityInput.model_validate(quality_raw)
    performance = PerformanceInput.model_validate(performance_raw)

    quality.model_id = request.model_id
    quality.suite_id = request.suite_id
    quality.notes = (
        f"Mock Provider fixture ({SUITE_QUALITY_FIXTURES[request.suite_id]}) "
        f"for suite={request.suite_id}."
    )

    performance.model_id = request.model_id
    performance.sla = POLICY_SLA[request.policy_id]
    performance.notes = (
        f"Mock Provider fixture ({POLICY_PERFORMANCE_FIXTURES[request.policy_id]}) "
        f"for policy={request.policy_id}."
    )
    return quality, performance


def run_evaluation(request: EvaluationRequest) -> EvaluationResponse:
    """Run wizard evaluation. Only Mock Provider executes against bundled fixtures."""
    from app.engines.readiness import compute_readiness

    if request.provider != "mock":
        return EvaluationResponse(
            mode="unsupported",
            message=LIVE_PROVIDER_MESSAGE,
            report=None,
            quality=None,
            performance=None,
        )

    quality, performance = build_mock_inputs(request)
    report = compute_readiness(
        ReadinessRequest(quality=quality, performance=performance)
    )
    return EvaluationResponse(
        mode="mock",
        message=(
            "Evaluation used Mock Provider with bundled sample fixtures. "
            "No live model calls were made."
        ),
        report=report,
        quality=quality,
        performance=performance,
    )

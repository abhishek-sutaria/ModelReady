from __future__ import annotations

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.engines.evaluation import (
    LIVE_PROVIDER_MESSAGE,
    EvaluationRequest,
    build_mock_inputs,
)
from app.main import app


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_mock_evaluation_ready(client: TestClient) -> None:
    payload = {
        "provider": "mock",
        "model_id": "demo-model",
        "suite_id": "general_qa",
        "policy_id": "interactive_chat",
    }
    response = client.post("/api/v1/evaluations", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["mode"] == "mock"
    assert body["report"]["verdict"] == "READY"
    assert body["report"]["model_id"] == "demo-model"
    assert "Mock Provider" in (body["message"] or "")


def test_live_provider_not_fabricated(client: TestClient) -> None:
    for provider in ("cerebras", "openai_compatible", "vllm"):
        response = client.post(
            "/api/v1/evaluations",
            json={
                "provider": provider,
                "model_id": "llama3.1-8b",
                "suite_id": "coding",
                "policy_id": "batch_inference",
            },
        )
        assert response.status_code == 200
        body = response.json()
        assert body["mode"] == "unsupported"
        assert body["report"] is None
        assert LIVE_PROVIDER_MESSAGE in body["message"]


def test_mock_inputs_apply_wizard_selection() -> None:
    quality, performance = build_mock_inputs(
        EvaluationRequest(
            provider="mock",
            model_id="demo-model",
            suite_id="reasoning",
            policy_id="batch_inference",
        )
    )
    assert quality.model_id == "demo-model"
    assert quality.suite_id == "reasoning"
    assert performance.model_id == "demo-model"
    assert performance.sla.max_p95_latency_ms == 8000


def test_legacy_readiness_still_works(client: TestClient) -> None:
    root = Path(__file__).resolve().parents[2]
    quality = json.loads((root / "shared/sample_data/quality_pass.json").read_text())
    performance = json.loads(
        (root / "shared/sample_data/performance_pass.json").read_text()
    )
    body = client.post(
        "/api/v1/readiness",
        json={"quality": quality, "performance": performance},
    ).json()
    assert body["verdict"] == "READY"

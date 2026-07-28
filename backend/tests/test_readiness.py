from __future__ import annotations

import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.engines.readiness import compute_readiness
from app.main import app
from app.models.schemas import (
    PerformanceInput,
    PerformanceMetrics,
    QualityInput,
    QualityMetrics,
    ReadinessRequest,
    SlaPolicy,
    Verdict,
)

ROOT = Path(__file__).resolve().parents[2]
SAMPLE = ROOT / "shared" / "sample_data"


def _load(name: str) -> dict:
    return json.loads((SAMPLE / name).read_text())


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_ready_pass(client: TestClient) -> None:
    payload = {
        "quality": _load("quality_pass.json"),
        "performance": _load("performance_pass.json"),
    }
    response = client.post("/api/v1/readiness", json=payload)
    assert response.status_code == 200
    body = response.json()
    assert body["verdict"] == "READY"
    assert "ready for production" in body["explanation"].lower()
    assert body["quality_status"] == "pass"
    assert body["performance_status"] == "pass"
    assert body["missing_fields"] == []


def test_not_ready_on_quality_fail(client: TestClient) -> None:
    payload = {
        "quality": _load("quality_fail.json"),
        "performance": _load("performance_pass.json"),
    }
    body = client.post("/api/v1/readiness", json=payload).json()
    assert body["verdict"] == "NOT_READY"
    assert body["quality_status"] == "fail"
    assert "not ready" in body["explanation"].lower()


def test_not_ready_on_performance_fail(client: TestClient) -> None:
    payload = {
        "quality": _load("quality_pass.json"),
        "performance": _load("performance_fail.json"),
    }
    body = client.post("/api/v1/readiness", json=payload).json()
    assert body["verdict"] == "NOT_READY"
    assert body["performance_status"] == "fail"


def test_missing_quality_input(client: TestClient) -> None:
    payload = {"performance": _load("performance_pass.json")}
    body = client.post("/api/v1/readiness", json=payload).json()
    assert body["verdict"] == "INSUFFICIENT_DATA"
    assert "quality" in body["missing_fields"]
    assert body["quality_status"] == "missing"
    assert "missing" in body["explanation"].lower()


def test_missing_performance_input(client: TestClient) -> None:
    payload = {"quality": _load("quality_pass.json")}
    body = client.post("/api/v1/readiness", json=payload).json()
    assert body["verdict"] == "INSUFFICIENT_DATA"
    assert "performance" in body["missing_fields"]
    assert body["performance_status"] == "missing"


def test_insufficient_sample_size(client: TestClient) -> None:
    payload = {
        "quality": _load("quality_insufficient.json"),
        "performance": _load("performance_pass.json"),
    }
    body = client.post("/api/v1/readiness", json=payload).json()
    assert body["verdict"] == "INSUFFICIENT_DATA"
    assert body["quality_status"] == "insufficient"
    assert "sample" in body["explanation"].lower()


def test_ready_with_warnings_when_optional_metrics_absent() -> None:
    request = ReadinessRequest(
        quality=QualityInput(
            model_id="m1",
            suite_id="s1",
            sample_size=20,
            metrics=QualityMetrics(accuracy=0.9, faithfulness=None, toxicity_rate=None),
        ),
        performance=PerformanceInput(
            model_id="m1",
            sample_size=40,
            metrics=PerformanceMetrics(
                p95_latency_ms=400,
                ttft_ms=None,
                tokens_per_second=None,
                error_rate=None,
            ),
            sla=SlaPolicy(),
        ),
    )
    report = compute_readiness(request)
    assert report.verdict == Verdict.READY_WITH_WARNINGS
    assert report.warnings
    assert "warnings" in report.explanation.lower()


def test_model_id_mismatch_warning() -> None:
    request = ReadinessRequest(
        quality=QualityInput(
            model_id="model-a",
            suite_id="s1",
            sample_size=20,
            metrics=QualityMetrics(accuracy=0.9, faithfulness=0.9, toxicity_rate=0.01),
        ),
        performance=PerformanceInput(
            model_id="model-b",
            sample_size=40,
            metrics=PerformanceMetrics(
                p95_latency_ms=400,
                ttft_ms=100,
                tokens_per_second=100,
                error_rate=0.01,
            ),
        ),
    )
    report = compute_readiness(request)
    assert report.verdict == Verdict.READY_WITH_WARNINGS
    assert any("model_id" in w for w in report.warnings)

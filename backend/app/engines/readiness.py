from __future__ import annotations

from app.models.schemas import (
    GateResult,
    GateStatus,
    PerformanceInput,
    QualityInput,
    ReadinessReport,
    ReadinessRequest,
    Verdict,
)


def _rollup(statuses: list[GateStatus]) -> GateStatus:
    if not statuses:
        return "missing"
    priority = ["missing", "insufficient", "fail", "warning", "pass"]
    for status in priority:
        if status in statuses:
            return status  # type: ignore[return-value]
    return "pass"


def evaluate_quality(quality: QualityInput | None) -> tuple[GateStatus, list[GateResult], list[str], list[str]]:
    gates: list[GateResult] = []
    missing: list[str] = []
    warnings: list[str] = []

    if quality is None:
        missing.append("quality")
        gates.append(
            GateResult(
                id="quality.present",
                dimension="data",
                status="missing",
                message="Quality input was not provided.",
            )
        )
        return "missing", gates, missing, warnings

    thr = quality.thresholds
    metrics = quality.metrics

    if quality.sample_size is None:
        missing.append("quality.sample_size")
        gates.append(
            GateResult(
                id="quality.sample_size",
                dimension="data",
                status="missing",
                message="Quality sample_size is required to judge statistical sufficiency.",
            )
        )
    elif quality.sample_size < thr.min_sample_size:
        gates.append(
            GateResult(
                id="quality.sample_size",
                dimension="data",
                status="insufficient",
                message=(
                    f"Quality sample size {quality.sample_size} is below the minimum "
                    f"of {thr.min_sample_size}."
                ),
                observed=quality.sample_size,
                threshold=thr.min_sample_size,
            )
        )
    else:
        gates.append(
            GateResult(
                id="quality.sample_size",
                dimension="data",
                status="pass",
                message=f"Quality sample size {quality.sample_size} meets the minimum.",
                observed=quality.sample_size,
                threshold=thr.min_sample_size,
            )
        )

    if metrics.accuracy is None:
        missing.append("quality.metrics.accuracy")
        gates.append(
            GateResult(
                id="quality.accuracy",
                dimension="quality",
                status="missing",
                message="Accuracy is required for the quality gate.",
            )
        )
    elif metrics.accuracy < thr.min_accuracy:
        gates.append(
            GateResult(
                id="quality.accuracy",
                dimension="quality",
                status="fail",
                message=f"Accuracy {metrics.accuracy:.3f} is below {thr.min_accuracy:.3f}.",
                observed=metrics.accuracy,
                threshold=thr.min_accuracy,
            )
        )
    else:
        gates.append(
            GateResult(
                id="quality.accuracy",
                dimension="quality",
                status="pass",
                message=f"Accuracy {metrics.accuracy:.3f} meets the threshold.",
                observed=metrics.accuracy,
                threshold=thr.min_accuracy,
            )
        )

    if metrics.faithfulness is None:
        warnings.append("Faithfulness was not provided; quality judgment is incomplete.")
        gates.append(
            GateResult(
                id="quality.faithfulness",
                dimension="quality",
                status="warning",
                message="Faithfulness was not provided.",
            )
        )
    elif metrics.faithfulness < thr.min_faithfulness:
        gates.append(
            GateResult(
                id="quality.faithfulness",
                dimension="quality",
                status="fail",
                message=(
                    f"Faithfulness {metrics.faithfulness:.3f} is below "
                    f"{thr.min_faithfulness:.3f}."
                ),
                observed=metrics.faithfulness,
                threshold=thr.min_faithfulness,
            )
        )
    else:
        gates.append(
            GateResult(
                id="quality.faithfulness",
                dimension="quality",
                status="pass",
                message=f"Faithfulness {metrics.faithfulness:.3f} meets the threshold.",
                observed=metrics.faithfulness,
                threshold=thr.min_faithfulness,
            )
        )

    if metrics.toxicity_rate is None:
        warnings.append("Toxicity rate was not provided.")
        gates.append(
            GateResult(
                id="quality.toxicity_rate",
                dimension="quality",
                status="warning",
                message="Toxicity rate was not provided.",
            )
        )
    elif metrics.toxicity_rate > thr.max_toxicity_rate:
        gates.append(
            GateResult(
                id="quality.toxicity_rate",
                dimension="quality",
                status="fail",
                message=(
                    f"Toxicity rate {metrics.toxicity_rate:.3f} exceeds "
                    f"{thr.max_toxicity_rate:.3f}."
                ),
                observed=metrics.toxicity_rate,
                threshold=thr.max_toxicity_rate,
            )
        )
    else:
        gates.append(
            GateResult(
                id="quality.toxicity_rate",
                dimension="quality",
                status="pass",
                message=f"Toxicity rate {metrics.toxicity_rate:.3f} is within budget.",
                observed=metrics.toxicity_rate,
                threshold=thr.max_toxicity_rate,
            )
        )

    status = _rollup([g.status for g in gates])
    return status, gates, missing, warnings


def evaluate_performance(
    performance: PerformanceInput | None,
) -> tuple[GateStatus, list[GateResult], list[str], list[str]]:
    gates: list[GateResult] = []
    missing: list[str] = []
    warnings: list[str] = []

    if performance is None:
        missing.append("performance")
        gates.append(
            GateResult(
                id="performance.present",
                dimension="data",
                status="missing",
                message="Performance / SLA input was not provided.",
            )
        )
        return "missing", gates, missing, warnings

    sla = performance.sla
    metrics = performance.metrics

    if performance.sample_size is None:
        missing.append("performance.sample_size")
        gates.append(
            GateResult(
                id="performance.sample_size",
                dimension="data",
                status="missing",
                message="Performance sample_size is required to judge statistical sufficiency.",
            )
        )
    elif performance.sample_size < sla.min_sample_size:
        gates.append(
            GateResult(
                id="performance.sample_size",
                dimension="data",
                status="insufficient",
                message=(
                    f"Performance sample size {performance.sample_size} is below the "
                    f"minimum of {sla.min_sample_size}."
                ),
                observed=performance.sample_size,
                threshold=sla.min_sample_size,
            )
        )
    else:
        gates.append(
            GateResult(
                id="performance.sample_size",
                dimension="data",
                status="pass",
                message=(
                    f"Performance sample size {performance.sample_size} meets the minimum."
                ),
                observed=performance.sample_size,
                threshold=sla.min_sample_size,
            )
        )

    if metrics.p95_latency_ms is None:
        missing.append("performance.metrics.p95_latency_ms")
        gates.append(
            GateResult(
                id="performance.p95_latency_ms",
                dimension="performance",
                status="missing",
                message="p95 latency is required for the SLA gate.",
            )
        )
    elif metrics.p95_latency_ms > sla.max_p95_latency_ms:
        gates.append(
            GateResult(
                id="performance.p95_latency_ms",
                dimension="performance",
                status="fail",
                message=(
                    f"p95 latency {metrics.p95_latency_ms:.1f}ms exceeds "
                    f"{sla.max_p95_latency_ms:.1f}ms."
                ),
                observed=metrics.p95_latency_ms,
                threshold=sla.max_p95_latency_ms,
            )
        )
    else:
        gates.append(
            GateResult(
                id="performance.p95_latency_ms",
                dimension="performance",
                status="pass",
                message=(
                    f"p95 latency {metrics.p95_latency_ms:.1f}ms is within the SLA."
                ),
                observed=metrics.p95_latency_ms,
                threshold=sla.max_p95_latency_ms,
            )
        )

    if metrics.ttft_ms is None:
        warnings.append("TTFT was not provided.")
        gates.append(
            GateResult(
                id="performance.ttft_ms",
                dimension="performance",
                status="warning",
                message="TTFT was not provided.",
            )
        )
    elif metrics.ttft_ms > sla.max_ttft_ms:
        gates.append(
            GateResult(
                id="performance.ttft_ms",
                dimension="performance",
                status="fail",
                message=f"TTFT {metrics.ttft_ms:.1f}ms exceeds {sla.max_ttft_ms:.1f}ms.",
                observed=metrics.ttft_ms,
                threshold=sla.max_ttft_ms,
            )
        )
    else:
        gates.append(
            GateResult(
                id="performance.ttft_ms",
                dimension="performance",
                status="pass",
                message=f"TTFT {metrics.ttft_ms:.1f}ms is within the SLA.",
                observed=metrics.ttft_ms,
                threshold=sla.max_ttft_ms,
            )
        )

    if metrics.tokens_per_second is None:
        warnings.append("Tokens/sec was not provided.")
        gates.append(
            GateResult(
                id="performance.tokens_per_second",
                dimension="performance",
                status="warning",
                message="Tokens/sec was not provided.",
            )
        )
    elif metrics.tokens_per_second < sla.min_tokens_per_second:
        gates.append(
            GateResult(
                id="performance.tokens_per_second",
                dimension="performance",
                status="fail",
                message=(
                    f"Throughput {metrics.tokens_per_second:.1f} tok/s is below "
                    f"{sla.min_tokens_per_second:.1f}."
                ),
                observed=metrics.tokens_per_second,
                threshold=sla.min_tokens_per_second,
            )
        )
    else:
        gates.append(
            GateResult(
                id="performance.tokens_per_second",
                dimension="performance",
                status="pass",
                message=(
                    f"Throughput {metrics.tokens_per_second:.1f} tok/s meets the SLA."
                ),
                observed=metrics.tokens_per_second,
                threshold=sla.min_tokens_per_second,
            )
        )

    if metrics.error_rate is None:
        warnings.append("Error rate was not provided.")
        gates.append(
            GateResult(
                id="performance.error_rate",
                dimension="performance",
                status="warning",
                message="Error rate was not provided.",
            )
        )
    elif metrics.error_rate > sla.max_error_rate:
        gates.append(
            GateResult(
                id="performance.error_rate",
                dimension="performance",
                status="fail",
                message=(
                    f"Error rate {metrics.error_rate:.3f} exceeds "
                    f"{sla.max_error_rate:.3f}."
                ),
                observed=metrics.error_rate,
                threshold=sla.max_error_rate,
            )
        )
    else:
        gates.append(
            GateResult(
                id="performance.error_rate",
                dimension="performance",
                status="pass",
                message=f"Error rate {metrics.error_rate:.3f} is within the SLA.",
                observed=metrics.error_rate,
                threshold=sla.max_error_rate,
            )
        )

    status = _rollup([g.status for g in gates])
    return status, gates, missing, warnings


def _build_explanation(
    verdict: Verdict,
    quality_status: GateStatus,
    performance_status: GateStatus,
    missing: list[str],
    warnings: list[str],
    failed: list[GateResult],
) -> str:
    if verdict == Verdict.INSUFFICIENT_DATA:
        if missing:
            return (
                "Cannot determine production readiness: required data is missing "
                f"({', '.join(missing)}). Upload complete quality and performance inputs."
            )
        return (
            "Cannot determine production readiness: sample sizes are too small to "
            "trust the measured quality or SLA results. Collect more evaluation samples "
            "and re-run."
        )

    if verdict == Verdict.NOT_READY:
        reasons = "; ".join(g.message for g in failed) or "One or more hard gates failed."
        return f"Model is not ready for production. {reasons}"

    if verdict == Verdict.READY_WITH_WARNINGS:
        warn_text = "; ".join(warnings) if warnings else "Soft warnings were raised."
        return (
            "Model passes required quality and SLA gates, but warnings remain: "
            f"{warn_text}"
        )

    return (
        f"Model is ready for production. Quality status={quality_status}, "
        f"performance status={performance_status}; all required gates passed."
    )


def compute_readiness(request: ReadinessRequest) -> ReadinessReport:
    q_status, q_gates, q_missing, q_warnings = evaluate_quality(request.quality)
    p_status, p_gates, p_missing, p_warnings = evaluate_performance(request.performance)

    gates = q_gates + p_gates
    missing = q_missing + p_missing
    warnings = q_warnings + p_warnings

    model_ids = {
        mid
        for mid in [
            request.quality.model_id if request.quality else None,
            request.performance.model_id if request.performance else None,
        ]
        if mid
    }
    if len(model_ids) > 1:
        warnings.append(
            "Quality and performance inputs reference different model_id values."
        )

    failed = [g for g in gates if g.status == "fail"]
    has_insufficient = any(g.status == "insufficient" for g in gates)
    has_missing = any(g.status == "missing" for g in gates) or bool(missing)

    if has_missing or has_insufficient:
        verdict = Verdict.INSUFFICIENT_DATA
    elif failed:
        verdict = Verdict.NOT_READY
    elif warnings or q_status == "warning" or p_status == "warning":
        verdict = Verdict.READY_WITH_WARNINGS
    else:
        verdict = Verdict.READY

    explanation = _build_explanation(
        verdict, q_status, p_status, missing, warnings, failed
    )

    return ReadinessReport(
        verdict=verdict,
        explanation=explanation,
        quality_status=q_status,
        performance_status=p_status,
        gates=gates,
        missing_fields=missing,
        warnings=warnings,
        model_id=next(iter(model_ids), None),
    )

import { downloadReadinessReport } from "../api/exportReport";
import type { GateResult, ReadinessReport, Verdict } from "../types/readiness";

const VERDICT_COPY: Record<Verdict, string> = {
  READY: "READY",
  READY_WITH_WARNINGS: "READY_WITH_WARNINGS",
  NOT_READY: "NOT_READY",
  INSUFFICIENT_DATA: "INSUFFICIENT_DATA",
};

function nextActions(report: ReadinessReport): string[] {
  if (report.verdict === "READY") {
    return [
      "Promote this configuration to a staging canary.",
      "Keep the same suite and SLA policy in CI for regression gates.",
    ];
  }
  if (report.verdict === "READY_WITH_WARNINGS") {
    return [
      "Fill optional quality/performance metrics that were missing.",
      "Re-run after addressing soft warnings before full production traffic.",
    ];
  }
  if (report.verdict === "INSUFFICIENT_DATA") {
    return [
      "Collect larger evaluation samples until suite/policy minima are met.",
      "Re-import complete quality and performance results via Advanced.",
    ];
  }
  return [
    "Inspect blocking gates and fix failing quality or SLA thresholds.",
    "Re-run with Mock Provider fixtures or updated measurements.",
  ];
}

export function ResultPage({
  report,
  modeMessage,
  onAgain,
}: {
  report: ReadinessReport;
  modeMessage?: string | null;
  onAgain: () => void;
}) {
  const blocking = report.gates.filter((g) =>
    g.status === "fail" || g.status === "missing" || g.status === "insufficient",
  );
  const qualityGates = report.gates.filter((g) => g.dimension === "quality");
  const performanceGates = report.gates.filter(
    (g) => g.dimension === "performance",
  );

  return (
    <section
      className={`result-page verdict-panel--${report.verdict.toLowerCase()}`}
    >
      <p className="eyebrow">Overall verdict</p>
      <h2>{VERDICT_COPY[report.verdict]}</h2>
      <p className="explanation">{report.explanation}</p>
      {modeMessage ? <p className="mode-note">{modeMessage}</p> : null}

      <div className="status-row">
        <div>
          <span className="label">Quality summary</span>
          <strong className={`status status--${report.quality_status}`}>
            {report.quality_status}
          </strong>
          <GateSummary gates={qualityGates} />
        </div>
        <div>
          <span className="label">Performance summary</span>
          <strong className={`status status--${report.performance_status}`}>
            {report.performance_status}
          </strong>
          <GateSummary gates={performanceGates} />
        </div>
      </div>

      <div className="callout callout--missing">
        <h3>Blocking issues</h3>
        {blocking.length === 0 ? (
          <p>None.</p>
        ) : (
          <ul>
            {blocking.map((g) => (
              <li key={g.id}>
                <strong>{g.id}</strong>: {g.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="callout callout--warning">
        <h3>Warnings</h3>
        {report.warnings.length === 0 ? (
          <p>None.</p>
        ) : (
          <ul>
            {report.warnings.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="callout">
        <h3>Recommended next actions</h3>
        <ul>
          {nextActions(report).map((action) => (
            <li key={action}>{action}</li>
          ))}
        </ul>
      </div>

      <div className="result-actions">
        <button
          type="button"
          className="secondary"
          onClick={() => downloadReadinessReport(report)}
        >
          Download report
        </button>
        <button type="button" className="primary" onClick={onAgain}>
          Run another evaluation
        </button>
      </div>
    </section>
  );
}

function GateSummary({ gates }: { gates: GateResult[] }) {
  if (gates.length === 0) {
    return <p className="muted">No quality/performance gate details.</p>;
  }
  return (
    <ul className="compact-gates">
      {gates.map((g) => (
        <li key={g.id}>
          <span className={`status status--${g.status}`}>{g.status}</span>{" "}
          {g.id}
        </li>
      ))}
    </ul>
  );
}

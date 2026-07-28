import { downloadReadinessReport } from "../api/exportReport";
import type { GateResult, ReadinessReport, Verdict } from "../types/readiness";

const VERDICT_COPY: Record<Verdict, string> = {
  READY: "Ready for production",
  READY_WITH_WARNINGS: "Ready with warnings",
  NOT_READY: "Not ready",
  INSUFFICIENT_DATA: "Insufficient data",
};

function GateList({ gates }: { gates: GateResult[] }) {
  return (
    <ul className="gate-list">
      {gates.map((gate) => (
        <li key={gate.id} className={`gate gate--${gate.status}`}>
          <span className="gate__status">{gate.status}</span>
          <div>
            <strong>{gate.id}</strong>
            <p>{gate.message}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function VerdictPanel({ report }: { report: ReadinessReport | null }) {
  if (!report) {
    return (
      <section className="verdict-panel verdict-panel--empty">
        <h2>Verdict</h2>
        <p>Upload quality and performance inputs, then compute readiness.</p>
      </section>
    );
  }

  return (
    <section className={`verdict-panel verdict-panel--${report.verdict.toLowerCase()}`}>
      <div className="verdict-panel__top">
        <div>
          <p className="eyebrow">Final decision</p>
          <h2>{VERDICT_COPY[report.verdict]}</h2>
        </div>
        <button
          type="button"
          className="secondary"
          onClick={() => downloadReadinessReport(report)}
        >
          Download report
        </button>
      </div>

      <p className="explanation">{report.explanation}</p>

      <div className="status-row">
        <div>
          <span className="label">Quality</span>
          <strong className={`status status--${report.quality_status}`}>
            {report.quality_status}
          </strong>
        </div>
        <div>
          <span className="label">Performance / SLA</span>
          <strong className={`status status--${report.performance_status}`}>
            {report.performance_status}
          </strong>
        </div>
      </div>

      {report.missing_fields.length > 0 ? (
        <div className="callout callout--missing">
          <h3>Missing data</h3>
          <ul>
            {report.missing_fields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {report.warnings.length > 0 ? (
        <div className="callout callout--warning">
          <h3>Warnings</h3>
          <ul>
            {report.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      ) : null}

      <h3>Gate details</h3>
      <GateList gates={report.gates} />
    </section>
  );
}

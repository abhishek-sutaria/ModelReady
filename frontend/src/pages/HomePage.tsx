import { useState } from "react";
import { evaluateReadiness } from "../api/client";
import { JsonUpload } from "../components/JsonUpload";
import { VerdictPanel } from "../components/VerdictPanel";
import type { ReadinessReport } from "../types/readiness";

export function HomePage() {
  const [quality, setQuality] = useState<unknown | null>(null);
  const [performance, setPerformance] = useState<unknown | null>(null);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [performanceError, setPerformanceError] = useState<string | null>(null);
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [busy, setBusy] = useState(false);
  const [requestError, setRequestError] = useState<string | null>(null);

  async function onEvaluate() {
    setBusy(true);
    setRequestError(null);
    try {
      const result = await evaluateReadiness({
        quality: quality ?? undefined,
        performance: performance ?? undefined,
      });
      setReport(result);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : "Request failed");
      setReport(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="page">
      <header className="hero">
        <p className="brand">ModelReady</p>
        <h1>Is this model ready for production?</h1>
        <p className="lede">
          Upload quality evaluation results and SLA / performance metrics. One
          verdict combines both signals.
        </p>
      </header>

      <div className="workspace">
        <div className="uploads">
          <JsonUpload
            label="Quality input"
            hint="JSON matching shared/schemas/quality_input.json"
            value={quality}
            error={qualityError}
            onChange={(value, error) => {
              setQuality(value);
              setQualityError(error);
            }}
          />
          <JsonUpload
            label="Performance / SLA input"
            hint="JSON matching shared/schemas/performance_input.json"
            value={performance}
            error={performanceError}
            onChange={(value, error) => {
              setPerformance(value);
              setPerformanceError(error);
            }}
          />
          <div className="actions">
            <button
              type="button"
              className="primary"
              disabled={busy || Boolean(qualityError) || Boolean(performanceError)}
              onClick={() => void onEvaluate()}
            >
              {busy ? "Computing…" : "Compute readiness"}
            </button>
            <p className="actions__hint">
              You can compute with one file missing to see insufficient-data states.
            </p>
            {requestError ? <p className="upload-error">{requestError}</p> : null}
          </div>
        </div>

        <VerdictPanel report={report} />
      </div>
    </main>
  );
}

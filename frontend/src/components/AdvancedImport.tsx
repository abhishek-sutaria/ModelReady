import { useState } from "react";
import { evaluateReadiness } from "../api/client";
import { JsonUpload } from "./JsonUpload";
import type { ReadinessReport } from "../types/readiness";

export function AdvancedImport({
  onReport,
}: {
  onReport: (report: ReadinessReport) => void;
}) {
  const [open, setOpen] = useState(false);
  const [quality, setQuality] = useState<unknown | null>(null);
  const [performance, setPerformance] = useState<unknown | null>(null);
  const [qualityError, setQualityError] = useState<string | null>(null);
  const [performanceError, setPerformanceError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onCompute() {
    setBusy(true);
    setError(null);
    try {
      const report = await evaluateReadiness({
        quality: quality ?? undefined,
        performance: performance ?? undefined,
      });
      onReport(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="advanced">
      <button
        type="button"
        className="advanced__toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        Advanced → Import Existing Results
      </button>
      {open ? (
        <div className="advanced__body" data-testid="advanced-import">
          <p>
            Power-user / debugging path: upload quality and performance JSON
            directly into the existing readiness engine. This is not the default
            landing experience.
          </p>
          <div className="advanced__grid">
            <JsonUpload
              label="Quality input"
              hint="JSON matching shared/schemas/quality_input.json"
              value={quality}
              error={qualityError}
              onChange={(value, err) => {
                setQuality(value);
                setQualityError(err);
              }}
            />
            <JsonUpload
              label="Performance / SLA input"
              hint="JSON matching shared/schemas/performance_input.json"
              value={performance}
              error={performanceError}
              onChange={(value, err) => {
                setPerformance(value);
                setPerformanceError(err);
              }}
            />
          </div>
          <button
            type="button"
            className="secondary"
            disabled={busy || Boolean(qualityError) || Boolean(performanceError)}
            onClick={() => void onCompute()}
          >
            {busy ? "Computing…" : "Compute from imported JSON"}
          </button>
          {error ? <p className="upload-error">{error}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

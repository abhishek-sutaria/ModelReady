import { describe, expect, it, vi } from "vitest";
import {
  buildReportFilename,
  downloadReadinessReport,
  serializeReadinessReport,
} from "./exportReport";
import type { ReadinessReport } from "../types/readiness";

const sampleReport: ReadinessReport = {
  verdict: "READY",
  explanation: "Model is ready for production.",
  quality_status: "pass",
  performance_status: "pass",
  gates: [],
  missing_fields: [],
  warnings: [],
  model_id: "llama3.1-8b",
};

describe("exportReport", () => {
  it("serializes the readiness report as pretty JSON", () => {
    const contents = serializeReadinessReport(sampleReport);
    expect(contents).toContain('"verdict": "READY"');
    expect(JSON.parse(contents)).toEqual(sampleReport);
  });

  it("builds a stable download filename from model and verdict", () => {
    const filename = buildReportFilename(
      sampleReport,
      new Date("2026-07-28T12:34:56.789Z"),
    );
    expect(filename).toBe(
      "modelready-llama3.1-8b-ready-2026-07-28T12-34-56-789Z.json",
    );
  });

  it("invokes the download adapter with JSON contents", () => {
    const download = vi.fn();
    const result = downloadReadinessReport(
      sampleReport,
      download,
      new Date("2026-07-28T12:34:56.789Z"),
    );

    expect(download).toHaveBeenCalledOnce();
    expect(download).toHaveBeenCalledWith(
      result.filename,
      result.contents,
      "application/json",
    );
    expect(result.filename).toContain("ready");
    expect(JSON.parse(result.contents).verdict).toBe("READY");
  });
});

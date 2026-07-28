import type { ReadinessReport } from "../types/readiness";

export function serializeReadinessReport(report: ReadinessReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}

export function buildReportFilename(
  report: ReadinessReport,
  now: Date = new Date(),
): string {
  const stamp = now.toISOString().replace(/[:.]/g, "-");
  const model = (report.model_id ?? "model")
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const verdict = report.verdict.toLowerCase();
  return `modelready-${model || "model"}-${verdict}-${stamp}.json`;
}

export type DownloadFn = (filename: string, contents: string, mimeType: string) => void;

export function defaultBrowserDownload(
  filename: string,
  contents: string,
  mimeType: string,
): void {
  const blob = new Blob([contents], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/** Download the final ReadinessReport as JSON. */
export function downloadReadinessReport(
  report: ReadinessReport,
  download: DownloadFn = defaultBrowserDownload,
  now: Date = new Date(),
): { filename: string; contents: string } {
  const filename = buildReportFilename(report, now);
  const contents = serializeReadinessReport(report);
  download(filename, contents, "application/json");
  return { filename, contents };
}

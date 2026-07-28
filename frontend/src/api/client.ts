import type { ReadinessReport, ReadinessRequest } from "../types/readiness";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export async function evaluateReadiness(
  payload: ReadinessRequest,
): Promise<ReadinessReport> {
  const response = await fetch(`${API_BASE}/api/v1/readiness`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with ${response.status}`);
  }

  return response.json() as Promise<ReadinessReport>;
}

import type {
  EvaluationRequest,
  EvaluationResponse,
  ReadinessReport,
  ReadinessRequest,
} from "../types/readiness";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function parseError(response: Response): Promise<string> {
  const text = await response.text();
  return text || `Request failed with ${response.status}`;
}

export async function evaluateReadiness(
  payload: ReadinessRequest,
): Promise<ReadinessReport> {
  const response = await fetch(`${API_BASE}/api/v1/readiness`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<ReadinessReport>;
}

export async function runEvaluation(
  payload: EvaluationRequest,
): Promise<EvaluationResponse> {
  const response = await fetch(`${API_BASE}/api/v1/evaluations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json() as Promise<EvaluationResponse>;
}

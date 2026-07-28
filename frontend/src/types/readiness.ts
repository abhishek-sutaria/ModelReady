export type Verdict =
  | "READY"
  | "READY_WITH_WARNINGS"
  | "NOT_READY"
  | "INSUFFICIENT_DATA";

export type GateStatus =
  | "pass"
  | "fail"
  | "warning"
  | "missing"
  | "insufficient";

export interface GateResult {
  id: string;
  dimension: "quality" | "performance" | "data";
  status: GateStatus;
  message: string;
  observed?: unknown;
  threshold?: unknown;
}

export interface ReadinessReport {
  verdict: Verdict;
  explanation: string;
  quality_status: GateStatus;
  performance_status: GateStatus;
  gates: GateResult[];
  missing_fields: string[];
  warnings: string[];
  model_id: string | null;
}

export interface ReadinessRequest {
  quality?: unknown;
  performance?: unknown;
}

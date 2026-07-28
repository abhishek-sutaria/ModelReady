import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ResultPage } from "./ResultPage";
import type { ReadinessReport } from "../types/readiness";

vi.mock("../api/exportReport", () => ({
  downloadReadinessReport: vi.fn(),
}));

describe("ResultPage", () => {
  it("renders overall verdict and next actions", () => {
    const report: ReadinessReport = {
      verdict: "NOT_READY",
      explanation: "Model is not ready for production.",
      quality_status: "fail",
      performance_status: "pass",
      gates: [
        {
          id: "quality.accuracy",
          dimension: "quality",
          status: "fail",
          message: "Accuracy too low.",
        },
      ],
      missing_fields: [],
      warnings: ["Check thresholds."],
      model_id: "m1",
    };

    render(<ResultPage report={report} onAgain={() => undefined} />);
    expect(screen.getByText("NOT_READY")).toBeInTheDocument();
    expect(screen.getByText(/blocking issues/i)).toBeInTheDocument();
    expect(screen.getByText(/recommended next actions/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download report/i })).toBeInTheDocument();
  });
});

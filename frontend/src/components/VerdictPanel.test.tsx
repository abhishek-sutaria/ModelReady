import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerdictPanel } from "../components/VerdictPanel";
import type { ReadinessReport } from "../types/readiness";

describe("VerdictPanel", () => {
  it("shows empty state before a report exists", () => {
    render(<VerdictPanel report={null} />);
    expect(
      screen.getByText(/upload quality and performance inputs/i),
    ).toBeInTheDocument();
  });

  it("renders insufficient-data explanation and missing fields", () => {
    const report: ReadinessReport = {
      verdict: "INSUFFICIENT_DATA",
      explanation:
        "Cannot determine production readiness: required data is missing (quality).",
      quality_status: "missing",
      performance_status: "pass",
      gates: [
        {
          id: "quality.present",
          dimension: "data",
          status: "missing",
          message: "Quality input was not provided.",
        },
      ],
      missing_fields: ["quality"],
      warnings: [],
      model_id: "llama3.1-8b",
    };

    render(<VerdictPanel report={report} />);
    expect(screen.getByText("Insufficient data")).toBeInTheDocument();
    expect(screen.getByText(/required data is missing/i)).toBeInTheDocument();
    expect(screen.getByText("quality")).toBeInTheDocument();
  });

  it("renders ready verdict copy", () => {
    const report: ReadinessReport = {
      verdict: "READY",
      explanation: "Model is ready for production.",
      quality_status: "pass",
      performance_status: "pass",
      gates: [],
      missing_fields: [],
      warnings: [],
      model_id: "m1",
    };

    render(<VerdictPanel report={report} />);
    expect(screen.getByText("Ready for production")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /download report/i }),
    ).toBeInTheDocument();
  });
});

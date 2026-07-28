import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { EvaluationWizard } from "./EvaluationWizard";
import type { EvaluationResponse } from "../types/readiness";

const runEvaluation = vi.fn();

vi.mock("../api/client", () => ({
  runEvaluation: (...args: unknown[]) => runEvaluation(...args),
  evaluateReadiness: vi.fn(),
}));

function continueNext() {
  fireEvent.click(screen.getByRole("button", { name: /^continue$/i }));
}

describe("EvaluationWizard", () => {
  beforeEach(() => {
    runEvaluation.mockReset();
  });

  it("defaults to Mock Provider and walks to review", () => {
    render(<EvaluationWizard />);
    expect(screen.getByText("Mock Provider")).toBeInTheDocument();
    expect(screen.getByText("Recommended")).toBeInTheDocument();

    continueNext();
    expect(screen.getByText("Demo Model")).toBeInTheDocument();

    continueNext();
    expect(screen.getByText("General QA")).toBeInTheDocument();

    continueNext();
    expect(screen.getByText("Interactive Chat")).toBeInTheDocument();
    expect(screen.getByText(/TTFT ≤ 500ms/i)).toBeInTheDocument();

    continueNext();
    expect(screen.getByRole("heading", { name: /step 5 · review configuration/i })).toBeInTheDocument();
    expect(screen.getByText("demo-model")).toBeInTheDocument();
  });

  it("runs mock evaluation and shows READY result", async () => {
    const response: EvaluationResponse = {
      mode: "mock",
      message: "Evaluation used Mock Provider with bundled sample fixtures.",
      report: {
        verdict: "READY",
        explanation: "Model is ready for production.",
        quality_status: "pass",
        performance_status: "pass",
        gates: [],
        missing_fields: [],
        warnings: [],
        model_id: "demo-model",
      },
    };
    runEvaluation.mockResolvedValue(response);

    render(<EvaluationWizard />);
    continueNext();
    continueNext();
    continueNext();
    continueNext();
    fireEvent.click(screen.getByRole("button", { name: /run evaluation/i }));

    expect(await screen.findByText(/running evaluation/i)).toBeInTheDocument();

    await waitFor(
      () => {
        expect(screen.getByRole("heading", { name: "READY" })).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
    expect(screen.getByRole("button", { name: /download report/i })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /run another evaluation/i }),
    ).toBeInTheDocument();
  });

  it("shows honest live-provider notice without fabricating a report", async () => {
    runEvaluation.mockResolvedValue({
      mode: "unsupported",
      message:
        "Live provider integration is planned. Using Mock Provider is recommended for this demo.",
      report: null,
    });

    render(<EvaluationWizard />);
    fireEvent.click(screen.getByRole("button", { name: /Cerebras/i }));
    continueNext();
    continueNext();
    continueNext();
    continueNext();
    fireEvent.click(screen.getByRole("button", { name: /run evaluation/i }));

    await waitFor(
      () => {
        expect(
          screen.getByText(/live provider integration is planned/i),
        ).toBeInTheDocument();
      },
      { timeout: 4000 },
    );
    expect(screen.queryByRole("heading", { name: "READY" })).not.toBeInTheDocument();
  });
});

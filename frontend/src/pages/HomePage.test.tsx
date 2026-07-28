import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { HomePage } from "../pages/HomePage";

vi.mock("../api/client", () => ({
  runEvaluation: vi.fn(),
  evaluateReadiness: vi.fn(),
}));

describe("HomePage landing experience", () => {
  it("renders the guided wizard as the default page, not JSON upload", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: /step 1 · select provider/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Mock Provider")).toBeInTheDocument();
    expect(screen.getByText("Recommended")).toBeInTheDocument();
    expect(screen.getByText(/select evaluation suite/i)).toBeInTheDocument();
    expect(screen.getByText(/select sla policy/i)).toBeInTheDocument();
    expect(screen.getByText(/review configuration/i)).toBeInTheDocument();
    expect(screen.getByText(/run evaluation/i)).toBeInTheDocument();

    // Old default upload UI must not be visible on landing.
    expect(screen.queryByText(/choose a json file/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /compute readiness/i }),
    ).not.toBeInTheDocument();

    // Advanced import is present but collapsed.
    expect(
      screen.getByRole("button", {
        name: /advanced → import existing results/i,
      }),
    ).toHaveAttribute("aria-expanded", "false");
  });
});

const STEPS = [
  "Select Provider",
  "Select Model",
  "Select Evaluation Suite",
  "Select SLA Policy",
  "Review Configuration",
  "Run Evaluation",
] as const;

export function WizardSteps({ current }: { current: number }) {
  return (
    <ol className="wizard-steps" aria-label="Evaluation steps">
      {STEPS.map((label, index) => {
        const n = index + 1;
        const state =
          n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li
            key={label}
            className={`wizard-steps__item wizard-steps__item--${state}`}
            aria-current={state === "current" ? "step" : undefined}
          >
            <span className="wizard-steps__num" aria-hidden="true">
              {n}
            </span>
            <span className="wizard-steps__label">
              <span className="wizard-steps__stepnum">Step {n}</span>
              {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

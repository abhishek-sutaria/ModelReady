const STEPS = [
  "Provider",
  "Model",
  "Suite",
  "SLA Policy",
  "Review",
  "Run",
] as const;

export function WizardSteps({ current }: { current: number }) {
  return (
    <ol className="wizard-steps" aria-label="Evaluation steps">
      {STEPS.map((label, index) => {
        const n = index + 1;
        const state =
          n < current ? "done" : n === current ? "current" : "todo";
        return (
          <li key={label} className={`wizard-steps__item wizard-steps__item--${state}`}>
            <span className="wizard-steps__num">{n}</span>
            <span className="wizard-steps__label">{label}</span>
          </li>
        );
      })}
    </ol>
  );
}

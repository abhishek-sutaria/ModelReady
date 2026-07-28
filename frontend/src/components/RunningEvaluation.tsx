export type EvalStage =
  | "quality"
  | "performance"
  | "aggregating"
  | "done";

const STAGE_COPY: Record<Exclude<EvalStage, "done">, string> = {
  quality: "Quality Engine",
  performance: "Performance Engine",
  aggregating: "Aggregating Results",
};

export function RunningEvaluation({
  stage,
  progress,
}: {
  stage: EvalStage;
  progress: number;
}) {
  return (
    <section className="run-panel" aria-live="polite">
      <h2>Running evaluation…</h2>
      <p className="run-panel__stage">
        Current stage:{" "}
        <strong>
          {stage === "done" ? "Complete" : STAGE_COPY[stage]}
        </strong>
      </p>
      <div
        className="progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress)}
      >
        <div className="progress__bar" style={{ width: `${progress}%` }} />
      </div>
      <ul className="stage-list">
        {(Object.keys(STAGE_COPY) as Array<keyof typeof STAGE_COPY>).map(
          (key) => {
            const active = stage === key;
            const done =
              stage === "done" ||
              (key === "quality" &&
                (stage === "performance" || stage === "aggregating")) ||
              (key === "performance" && stage === "aggregating");
            return (
              <li
                key={key}
                className={`stage-list__item${done ? " is-done" : ""}${active ? " is-active" : ""}`}
              >
                {STAGE_COPY[key]}
              </li>
            );
          },
        )}
      </ul>
    </section>
  );
}

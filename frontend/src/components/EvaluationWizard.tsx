import { useEffect, useMemo, useState } from "react";
import { runEvaluation } from "../api/client";
import {
  DEFAULT_WIZARD,
  MODELS_BY_PROVIDER,
  POLICIES,
  PROVIDERS,
  SUITES,
  type PolicyId,
  type ProviderId,
  type SuiteId,
  type WizardState,
} from "../data/catalog";
import type { ReadinessReport } from "../types/readiness";
import { AdvancedImport } from "./AdvancedImport";
import { OptionCard } from "./OptionCard";
import { ResultPage } from "./ResultPage";
import { RunningEvaluation, type EvalStage } from "./RunningEvaluation";
import { WizardSteps } from "./WizardSteps";

type Phase = "wizard" | "running" | "result";

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function EvaluationWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState<WizardState>(DEFAULT_WIZARD);
  const [phase, setPhase] = useState<Phase>("wizard");
  const [stage, setStage] = useState<EvalStage>("quality");
  const [progress, setProgress] = useState(8);
  const [report, setReport] = useState<ReadinessReport | null>(null);
  const [modeMessage, setModeMessage] = useState<string | null>(null);
  const [liveNotice, setLiveNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const models = useMemo(
    () => MODELS_BY_PROVIDER[state.provider],
    [state.provider],
  );

  useEffect(() => {
    const available = MODELS_BY_PROVIDER[state.provider];
    if (!available.some((m) => m.id === state.modelId)) {
      setState((prev) => ({ ...prev, modelId: available[0]?.id ?? "" }));
    }
  }, [state.provider, state.modelId]);

  function selectProvider(provider: ProviderId) {
    const nextModels = MODELS_BY_PROVIDER[provider];
    setState((prev) => ({
      ...prev,
      provider,
      modelId: nextModels[0]?.id ?? "",
    }));
    setLiveNotice(null);
  }

  async function onRun() {
    setError(null);
    setLiveNotice(null);
    setPhase("running");
    setStage("quality");
    setProgress(12);

    const apiPromise = runEvaluation({
      provider: state.provider,
      model_id: state.modelId,
      suite_id: state.suiteId,
      policy_id: state.policyId,
    });

    // Keep UI responsive with staged progress while the request is in flight.
    const tick = async () => {
      await sleep(350);
      setStage("quality");
      setProgress(28);
      await sleep(400);
      setStage("performance");
      setProgress(58);
      await sleep(400);
      setStage("aggregating");
      setProgress(82);
    };

    try {
      const [, response] = await Promise.all([tick(), apiPromise]);
      setProgress(100);
      setStage("done");
      await sleep(200);

      if (response.mode === "unsupported") {
        setLiveNotice(
          response.message ??
            "Live provider integration is planned. Using Mock Provider is recommended for this demo.",
        );
        setPhase("wizard");
        setStep(1);
        return;
      }

      if (!response.report) {
        throw new Error("Evaluation returned no report.");
      }

      setReport(response.report);
      setModeMessage(response.message);
      setPhase("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Evaluation failed");
      setPhase("wizard");
      setStep(5);
    }
  }

  function resetWizard() {
    setPhase("wizard");
    setStep(1);
    setState(DEFAULT_WIZARD);
    setReport(null);
    setModeMessage(null);
    setLiveNotice(null);
    setError(null);
    setProgress(0);
    setStage("quality");
  }

  if (phase === "result" && report) {
    return (
      <ResultPage
        report={report}
        modeMessage={modeMessage}
        onAgain={resetWizard}
      />
    );
  }

  if (phase === "running") {
    return <RunningEvaluation stage={stage} progress={progress} />;
  }

  return (
    <div className="wizard">
      <WizardSteps current={step} />

      {liveNotice ? (
        <div className="callout callout--warning live-notice" role="status">
          <h3>Live providers</h3>
          <p>{liveNotice}</p>
        </div>
      ) : null}

      {step === 1 ? (
        <section className="wizard-panel" data-testid="wizard-step-provider">
          <h2>Step 1 · Select Provider</h2>
          <p className="lede-sm">
            Mock Provider is recommended for this demo — it drives the real
            readiness engine with bundled sample fixtures.
          </p>
          <div className="card-grid">
            {PROVIDERS.map((provider) => (
              <OptionCard
                key={provider.id}
                title={provider.label}
                description={provider.description}
                selected={state.provider === provider.id}
                onSelect={() => selectProvider(provider.id)}
                badge={provider.recommended ? "Recommended" : undefined}
                tooltip={provider.tooltip}
              />
            ))}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="wizard-panel" data-testid="wizard-step-model">
          <h2>Step 2 · Select Model</h2>
          <div className="card-grid card-grid--compact">
            {models.map((model) => (
              <OptionCard
                key={model.id}
                title={model.label}
                description={`Provider: ${state.provider}`}
                selected={state.modelId === model.id}
                onSelect={() =>
                  setState((prev) => ({ ...prev, modelId: model.id }))
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="wizard-panel" data-testid="wizard-step-suite">
          <h2>Step 3 · Select Evaluation Suite</h2>
          <div className="card-grid">
            {SUITES.map((suite) => (
              <OptionCard
                key={suite.id}
                title={suite.label}
                description={suite.description}
                selected={state.suiteId === suite.id}
                onSelect={() =>
                  setState((prev) => ({
                    ...prev,
                    suiteId: suite.id as SuiteId,
                  }))
                }
              />
            ))}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="wizard-panel" data-testid="wizard-step-policy">
          <h2>Step 4 · Select SLA Policy</h2>
          <div className="card-grid">
            {POLICIES.map((policy) => (
              <OptionCard
                key={policy.id}
                title={policy.label}
                description={policy.description}
                selected={state.policyId === policy.id}
                onSelect={() =>
                  setState((prev) => ({
                    ...prev,
                    policyId: policy.id as PolicyId,
                  }))
                }
                meta={[
                  policy.ttft,
                  policy.latency,
                  policy.throughput,
                  policy.tokens,
                ]}
              />
            ))}
          </div>
        </section>
      ) : null}

      {step === 5 ? (
        <section className="wizard-panel" data-testid="wizard-step-review">
          <h2>Step 5 · Review Configuration</h2>
          <dl className="review-list">
            <div>
              <dt>Provider</dt>
              <dd>
                {PROVIDERS.find((p) => p.id === state.provider)?.label}
                <button
                  type="button"
                  className="linkish"
                  onClick={() => setStep(1)}
                >
                  Edit
                </button>
              </dd>
            </div>
            <div>
              <dt>Model</dt>
              <dd>
                {state.modelId}
                <button
                  type="button"
                  className="linkish"
                  onClick={() => setStep(2)}
                >
                  Edit
                </button>
              </dd>
            </div>
            <div>
              <dt>Suite</dt>
              <dd>
                {SUITES.find((s) => s.id === state.suiteId)?.label}
                <button
                  type="button"
                  className="linkish"
                  onClick={() => setStep(3)}
                >
                  Edit
                </button>
              </dd>
            </div>
            <div>
              <dt>Policy</dt>
              <dd>
                {POLICIES.find((p) => p.id === state.policyId)?.label}
                <button
                  type="button"
                  className="linkish"
                  onClick={() => setStep(4)}
                >
                  Edit
                </button>
              </dd>
            </div>
          </dl>
        </section>
      ) : null}

      <div className="wizard-nav">
        <button
          type="button"
          className="secondary"
          disabled={step === 1}
          onClick={() => setStep((s) => Math.max(1, s - 1))}
        >
          Back
        </button>
        {step < 5 ? (
          <button
            type="button"
            className="primary"
            disabled={step === 2 && !state.modelId}
            onClick={() => setStep((s) => Math.min(5, s + 1))}
          >
            Continue
          </button>
        ) : (
          <button type="button" className="primary" onClick={() => void onRun()}>
            Run evaluation
          </button>
        )}
      </div>

      {error ? <p className="upload-error">{error}</p> : null}

      <AdvancedImport
        onReport={(imported) => {
          setReport(imported);
          setModeMessage(
            "Report generated from imported JSON via the legacy readiness endpoint.",
          );
          setPhase("result");
        }}
      />
    </div>
  );
}

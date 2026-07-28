import { EvaluationWizard } from "../components/EvaluationWizard";

export function HomePage() {
  return (
    <main className="page">
      <header className="hero">
        <p className="brand">ModelReady</p>
        <h1>Is this model ready for production?</h1>
        <p className="lede">
          Guided evaluation that combines quality checks and SLA / performance
          gates into one deployment-readiness verdict.
        </p>
      </header>

      <EvaluationWizard />
    </main>
  );
}

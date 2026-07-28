# ModelReady Architecture

## Product

**ModelReady** is one deployed app that decides whether an LLM is ready for production by combining:

1. **Quality checks**
2. **SLA / performance checks**

The primary UX is a **guided evaluation wizard**. The original JSON upload path remains under **Advanced → Import existing results**.

## High-level flow

```text
┌──────────────────────────────────────────────┐
│  React + TypeScript wizard                   │
│  Provider → Model → Suite → SLA → Review → Run│
│  (+ Advanced JSON import)                    │
└──────────────────────┬───────────────────────┘
                       │ POST /api/v1/evaluations
                       │ (or /api/v1/readiness for Advanced)
┌──────────────────────▼───────────────────────┐
│  FastAPI                                     │
│  Mock Provider → bundled fixtures            │
│  Quality + Performance inputs                │
│  Existing readiness engine → ReadinessReport │
└──────────────────────────────────────────────┘
```

## Providers

| Provider | Behavior today |
| --- | --- |
| **Mock Provider (default)** | Loads bundled `shared/sample_data` fixtures, overlays wizard model/suite/policy, runs the real readiness engine. **No live model calls.** |
| Cerebras / OpenAI Compatible / vLLM | Honest unsupported response: live integration is planned; Mock Provider recommended for the demo. |

## Verdicts

| Verdict | Meaning |
| --- | --- |
| `READY` | Quality and SLA gates both pass with sufficient data |
| `READY_WITH_WARNINGS` | Passes overall, but soft warnings exist |
| `NOT_READY` | Hard quality or SLA failure |
| `INSUFFICIENT_DATA` | Required fields missing or sample sizes too small |

## Components

| Path | Role |
| --- | --- |
| `shared/schemas/` | JSON Schema contracts |
| `shared/sample_data/` | Mock Provider fixtures |
| `backend/app/engines/readiness.py` | Gate logic + explanation text |
| `backend/app/engines/evaluation.py` | Wizard evaluation orchestration |
| `frontend/src/components/EvaluationWizard.tsx` | Guided multi-step UX |

## Out of MVP

Live LLM provider calls, multi-tenant auth, CI webhooks, agent-generated suites, distributed workers, historical run store.

## Public deployment

Prefer the root `Dockerfile` + Render web service: one container serves the React build and FastAPI on the same origin.

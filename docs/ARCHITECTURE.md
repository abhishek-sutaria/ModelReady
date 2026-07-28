# ModelReady Architecture (MVP)

## Product

**ModelReady** is one deployed app that decides whether an LLM is ready for production by combining:

1. **Quality checks** (uploaded quality evaluation results)
2. **SLA / performance checks** (uploaded latency, throughput, error metrics)

It does **not** run live model evals in MVP. Users upload structured JSON inputs; the backend computes a single verdict with an explanation.

## High-level flow

```text
┌──────────────────────────────────────┐
│  React + TypeScript (Vite)           │
│  Upload quality JSON                 │
│  Upload performance JSON             │
│  Show verdict + explanation          │
│  Show missing / insufficient data    │
└──────────────────┬───────────────────┘
                   │ POST /api/v1/readiness
┌──────────────────▼───────────────────┐
│  FastAPI                             │
│  1. Validate against shared schemas  │
│  2. Quality gate evaluation          │
│  3. SLA / performance gate eval      │
│  4. Aggregate → one ReadinessReport  │
└──────────────────────────────────────┘
                   │
            shared/schemas/*.json
```

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
| `shared/schemas/` | JSON Schema contracts (source of truth) |
| `shared/sample_data/` | Example quality / performance payloads |
| `backend/app/engines/readiness.py` | Gate logic + explanation text |
| `backend/app/api/` | REST endpoints |
| `frontend/` | Single-page upload + report UI |

## Out of MVP

Live LLM calls, multi-tenant auth, CI webhooks, agent-generated suites, distributed workers, historical run store.

## Public deployment

Prefer the root `Dockerfile` + `render.yaml`: one container serves the React build and FastAPI on the same origin (one public URL). See the README deployment section for exact steps.

# ModelReady

One product that decides whether an LLM is ready for production by combining **quality checks** and **SLA / performance checks** into a single verdict.

This is not two demos. It is one deployed app.

## Architecture (MVP)

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

```text
React + TypeScript UI
   uploads quality JSON + performance JSON
            │
            ▼
     FastAPI /api/v1/readiness
            │
            ▼
 shared schemas + readiness engine
            │
            ▼
   one ReadinessReport (verdict + explanation)
```

### Verdicts

| Verdict | When |
| --- | --- |
| `READY` | Quality and SLA gates pass with enough data |
| `READY_WITH_WARNINGS` | Required gates pass; optional metrics missing or soft issues |
| `NOT_READY` | Hard quality or SLA failure |
| `INSUFFICIENT_DATA` | Missing inputs or sample sizes too small |

## Repository layout

```text
shared/schemas/       JSON Schema contracts
shared/sample_data/   Example quality / performance payloads
backend/              FastAPI app + readiness engine + tests
frontend/             React + TypeScript UI + tests
docs/ARCHITECTURE.md  Architecture notes
docker-compose.yml    One-app local deploy
```

## Quick start

### Backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173 — Vite proxies `/api` to the backend.

### Docker (single deployed stack)

```bash
docker compose up --build
```

- UI: http://127.0.0.1:3000  
- API: http://127.0.0.1:8000/health  

## API

`POST /api/v1/readiness`

```json
{
  "quality": { "...": "QualityInput" },
  "performance": { "...": "PerformanceInput" }
}
```

Either side may be omitted to exercise missing-data states.

## Tests

```bash
# backend
cd backend && pip install -r requirements.txt && pytest

# frontend
cd frontend && npm install && npm test
```

## Sample inputs

Use files under `shared/sample_data/`:

- `quality_pass.json` + `performance_pass.json` → `READY`
- `quality_fail.json` + `performance_pass.json` → `NOT_READY`
- quality only or performance only → `INSUFFICIENT_DATA`

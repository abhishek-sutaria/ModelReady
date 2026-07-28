# ModelReady

**ModelReady** is one product that decides whether an LLM is ready for production by combining:

1. **Quality checks**
2. **SLA / performance checks**

It returns a single `ReadinessReport` with a verdict, explanation, gate details, and missing-data / insufficient-data states.

This is **not** two demos. The UI and API ship as one app.

## What it does (MVP)

Guided evaluation wizard:

1. Choose a **provider** (Mock Provider recommended)
2. Select a **model**
3. Pick an **evaluation suite** (General QA / Coding / Reasoning)
4. Choose an **SLA policy** (Interactive Chat / Batch Inference)
5. **Review** the configuration
6. **Run evaluation** with staged progress (Quality → Performance → Aggregate)
7. Read the verdict, summaries, blockers, warnings, and next actions
8. **Download report** or run another evaluation

**Advanced → Import existing results** still accepts manual quality/performance JSON for debugging.

## Live demo

> **Public URL:** https://modelready.onrender.com  
> Dashboard: https://dashboard.render.com/web/srv-d9kf14n10e5c73b2njtg

Demo path:

1. Open https://modelready.onrender.com  
2. Keep **Mock Provider** selected (default)  
3. Continue through Demo Model → General QA → Interactive Chat → Review  
4. Click **Run evaluation** → expect `READY`  
5. Download the report  
6. Optionally open **Advanced** and import sample JSON from `shared/sample_data/`

### Screenshots

| Landing / provider step | Suite & policy |
| --- | --- |
| ![Landing](docs/screenshots/01-landing.png) | ![Uploads](docs/screenshots/02-uploads.png) |

| Ready verdict | Insufficient / advanced path |
| --- | --- |
| ![Ready](docs/screenshots/03-ready-verdict.png) | ![Insufficient data](docs/screenshots/04-insufficient-data.png) |

## Mock Provider

Mock Provider is the **default and recommended** path for this demo.

- It loads bundled fixtures from `shared/sample_data/`
- It overlays your selected model, suite, and SLA policy
- It runs the **real** readiness engine (same gates as Advanced JSON import)
- It does **not** call Cerebras, OpenAI, or vLLM

## Live providers (planned)

Cerebras, OpenAI Compatible, and vLLM appear in the wizard so the product shape is clear.

Selecting them and running evaluation returns an honest message:

> Live provider integration is planned. Using Mock Provider is recommended for this demo.

ModelReady does **not** fabricate live provider responses.

## Deployment verification

Verified live on **https://modelready.onrender.com** (Render free Docker web service from `main`):

| Check | Result |
| --- | --- |
| Render service `modelready` (`srv-d9kf14n10e5c73b2njtg`) | Live |
| `GET /health` | `200` `{"status":"ok","service":"modelready"}` |
| `GET /` (UI HTML) | `200` (FastAPI serves the React build) |
| `GET /assets/*.css` and `/assets/*.js` | `200` |
| `POST /api/v1/readiness` with pass samples | `READY` |
| `POST /api/v1/readiness` with quality only | `INSUFFICIENT_DATA` |
| Browser upload → compute → **Download report** | Pass (Playwright) |
| Production JS bundle contains no `localhost` / `127.0.0.1` | Pass (same-origin `/api/v1/readiness`) |

## Architecture

```text
Wizard (Provider → Model → Suite → SLA → Review → Run)
        │
        ▼
POST /api/v1/evaluations
        │
        ├─ Mock Provider → fixtures → readiness engine → report
        └─ Live providers → unsupported message (no fake results)

Advanced JSON import → POST /api/v1/readiness → readiness engine
```

Details: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)

## Repository layout

```text
shared/schemas/       JSON Schema contracts
shared/sample_data/   Mock Provider fixtures
backend/              FastAPI API + readiness + evaluation engines
frontend/             React guided wizard UI
Dockerfile            Single-image public deploy (UI + API)
render.yaml           Render one-service blueprint
docker-compose.yml    Local one-URL stack
.env.example          Environment variable reference
docs/screenshots/     Demo screenshots
```

## Local setup

### Option A — one URL with Docker (closest to production)

```bash
docker compose up --build
```

Open http://127.0.0.1:8080

### Option B — API + Vite separately (faster iteration)

```bash
# terminal 1
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# terminal 2
cd frontend
npm install
npm run dev
```

Open http://127.0.0.1:5173 (Vite proxies `/api` and `/health` to the backend).

## Environment variables

See [`.env.example`](.env.example).

| Variable | Where | Purpose | Default |
| --- | --- | --- | --- |
| `PORT` | Backend / Docker | HTTP listen port | `8000` local API, `8080` Docker/Render |
| `CORS_ORIGINS` | Backend | Allowed browser origins (`*` or comma list) | `*` |
| `STATIC_DIR` | Backend | Built frontend directory for same-origin serve | unset locally; `/app/backend/static` in Docker |
| `VITE_API_BASE_URL` | Frontend build | API origin baked into the UI | empty (same-origin) |

MVP needs **no API keys**.

## Deployment setup (recommended): one public URL on Render

This uses the root `Dockerfile` so the React UI and FastAPI API share one origin.

### Exact steps

1. Ensure `main` includes the latest `Dockerfile`, `render.yaml`, and `.dockerignore`.  
2. Go to [https://render.com](https://render.com) → **New** → **Blueprint**  
   (or open [Deploy to Render](https://render.com/deploy?repo=https://github.com/abhishek-sutaria/ModelReady)).  
3. Connect the `ModelReady` GitHub repository / authorize Render.  
4. Apply the blueprint (`render.yaml` → service `modelready`).  
5. Wait for the Docker build + deploy.  
6. Open the service URL (for example `https://modelready.onrender.com`).  
7. Confirm `GET /health` returns `{"status":"ok","service":"modelready"}`.  

**Build:** Docker build from repo root (`Dockerfile`).  
**Start:** `./entrypoint.sh` → `uvicorn app.main:app --host 0.0.0.0 --port $PORT`  
**Health:** `GET /health`

## API

| Endpoint | Purpose |
| --- | --- |
| `POST /api/v1/evaluations` | Guided wizard evaluation (Mock Provider fixtures or unsupported live providers) |
| `POST /api/v1/readiness` | Advanced JSON import into the readiness engine |
| `GET /health` | Liveness |

## Tests

```bash
# backend
cd backend
source .venv/bin/activate   # or recreate the venv
pip install -r requirements.txt
pytest

# frontend
cd frontend
npm install
npm test
npm run build
```

## Limitations (MVP)

- No live Cerebras / OpenAI / vLLM calls yet (honest unsupported message)  
- No authentication or multi-tenant isolation  
- No run history / persistence beyond the current browser session  
- Free Render services may cold-start (first request can be slow)  
- Threshold defaults are intentionally simple and opinionated  

## Sample inputs (Advanced import)

| Files | Expected verdict |
| --- | --- |
| `quality_pass.json` + `performance_pass.json` | `READY` |
| `quality_fail.json` + `performance_pass.json` | `NOT_READY` |
| `quality_insufficient.json` + `performance_pass.json` | `INSUFFICIENT_DATA` |
| quality only or performance only | `INSUFFICIENT_DATA` |

# syntax=docker/dockerfile:1

# --- Frontend build ---
FROM node:22-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
# Empty base URL => browser calls same-origin /api (one public URL).
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# --- Single deployable app ---
FROM python:3.12-slim AS runtime
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app/backend \
    PORT=8080 \
    CORS_ORIGINS=* \
    STATIC_DIR=/app/backend/static

COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY backend /app/backend
COPY shared /app/shared
COPY --from=frontend-build /frontend/dist /app/backend/static

RUN chmod +x /app/backend/entrypoint.sh \
    && mkdir -p /app/backend/static

EXPOSE 8080
WORKDIR /app/backend
CMD ["./entrypoint.sh"]

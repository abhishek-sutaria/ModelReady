FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

COPY backend /app/backend
COPY shared /app/shared

WORKDIR /app/backend
ENV PYTHONPATH=/app/backend \
    PORT=8000 \
    CORS_ORIGINS=*

RUN chmod +x /app/backend/entrypoint.sh

EXPOSE 8000
CMD ["./entrypoint.sh"]

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY apps/api/requirements.txt ./apps/api/requirements.txt
COPY packages/ai-core /app/packages/ai-core

WORKDIR /app/apps/api
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/api /app/apps/api

ENV PYTHONPATH=/app/apps/api/src:/app/packages/ai-core/src

CMD ["uvicorn", "soloforge_api.main:app", "--host", "0.0.0.0", "--port", "8000"]

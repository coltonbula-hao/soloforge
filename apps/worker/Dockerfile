FROM python:3.11-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY apps/worker/requirements.txt ./apps/worker/requirements.txt
COPY packages/ai-core /app/packages/ai-core

WORKDIR /app/apps/worker
RUN pip install --no-cache-dir -r requirements.txt

COPY apps/worker /app/apps/worker

ENV PYTHONPATH=/app/apps/worker/src:/app/packages/ai-core/src

CMD ["celery", "-A", "soloforge_worker.main", "worker", "--loglevel=info", "--concurrency=2"]

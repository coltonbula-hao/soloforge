"""Celery 应用工厂。"""

from celery import Celery

from soloforge_worker.config import settings

celery_app = Celery(
    "soloforge_worker",
    broker=settings.celery_broker_url,
    backend=settings.celery_result_backend,
    include=["soloforge_worker.tasks.example"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,
    worker_prefetch_multiplier=1,
)

if __name__ == "__main__":
    celery_app.start()

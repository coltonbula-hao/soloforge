"""Celery 示例任务。"""

import logging
from typing import Any

from soloforge_worker.main import celery_app

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3)
def example_task(self: Any, name: str) -> dict[str, str]:
    """异步问候任务。"""
    logger.info("执行示例任务，目标用户: %s", name)
    return {"message": f"你好，{name}！"}

"""结构化 JSON 日志配置。"""

import logging
import sys
from typing import Any

from pythonjsonlogger import jsonlogger


class JsonFormatter(jsonlogger.JsonFormatter):
    """自定义 JSON 日志格式化器，补充 level 与 logger 名称。"""

    def add_fields(
        self,
        log_record: dict[str, Any],
        record: logging.LogRecord,
        message_dict: dict[str, Any],
    ) -> None:
        super().add_fields(log_record, record, message_dict)
        log_record["level"] = record.levelname
        log_record["logger"] = record.name


def setup_logging(level: str = "INFO") -> None:
    """配置根日志记录器，以结构化 JSON 格式输出到标准输出。"""
    log_handler = logging.StreamHandler(sys.stdout)
    formatter = JsonFormatter("%(timestamp)s %(level)s %(name)s %(message)s")
    log_handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.setLevel(level)
    root_logger.handlers = [log_handler]

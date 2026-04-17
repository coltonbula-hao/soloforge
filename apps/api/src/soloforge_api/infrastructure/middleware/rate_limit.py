"""基于 SlowAPI 的限流配置。"""

from fastapi import Request
from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.responses import JSONResponse

from soloforge_api.config import settings

limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[settings.api_rate_limit],
)


def _rate_limit_exceeded_handler(request: Request, exc: Exception) -> JSONResponse:
    """自定义中文限流超出响应。"""
    return JSONResponse(
        status_code=429,
        content={
            "error_code": "RATE_LIMIT_EXCEEDED",
            "message": "请求过于频繁，请稍后再试。",
            "detail": None,
        },
    )

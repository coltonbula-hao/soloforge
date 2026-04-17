"""全局异常处理中间件。"""

import logging
from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

logger = logging.getLogger(__name__)


class ErrorResponse(BaseModel):
    """标准化的错误响应结构。"""

    error_code: str
    message: str
    detail: dict[str, Any] | None = None


async def _http_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """统一处理 HTTP 异常与通用异常。"""
    from fastapi.exceptions import HTTPException

    if isinstance(exc, HTTPException):
        return JSONResponse(
            status_code=exc.status_code,
            content=ErrorResponse(
                error_code=f"HTTP_{exc.status_code}",
                message=str(exc.detail),
                detail=None,
            ).model_dump(),
        )

    logger.exception("发生未处理异常: %s", exc)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error_code="INTERNAL_SERVER_ERROR",
            message="服务器发生未知错误，请稍后重试。",
            detail=None,
        ).model_dump(),
    )


def setup_exception_handlers(app: FastAPI) -> None:
    """在 FastAPI 应用上注册全局异常处理器。"""
    app.add_exception_handler(Exception, _http_exception_handler)

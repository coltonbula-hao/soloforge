"""FastAPI 应用入口。"""

import logging
from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded

from soloforge_api.config import settings
from soloforge_api.infrastructure.db import async_engine
from soloforge_api.infrastructure.middleware.error_handling import setup_exception_handlers
from soloforge_api.infrastructure.middleware.logging import setup_logging
from soloforge_api.infrastructure.middleware.rate_limit import limiter, _rate_limit_exceeded_handler
from soloforge_api.presentation.routers import analytics, auth, content, health, knowledge

setup_logging(level=settings.log_level)


@asynccontextmanager
async def lifespan(app: FastAPI) -> None:
    """管理应用生命周期事件。"""
    logging.info("API 启动中...")
    yield
    await async_engine.dispose()
    logging.info("API 关闭中...")


app = FastAPI(
    title="SoloForge API",
    description="个人知识管理与内容创作平台 API",
    version="0.1.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

setup_exception_handlers(app)

app.include_router(health.router, prefix="/api/v1", tags=["健康检查"])
app.include_router(auth.router, prefix="/api/v1/auth", tags=["认证"])
app.include_router(knowledge.router, prefix="/api/v1/knowledge", tags=["知识库"])
app.include_router(content.router, prefix="/api/v1/content", tags=["内容创作"])
app.include_router(analytics.router, prefix="/api/v1/analytics", tags=["数据看板"])


if __name__ == "__main__":
    uvicorn.run(
        "soloforge_api.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )

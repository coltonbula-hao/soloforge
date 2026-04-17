"""健康检查路由。"""

from fastapi import APIRouter, Request

from soloforge_api.application.use_cases.health import HealthCheckUseCase
from soloforge_api.infrastructure.middleware.rate_limit import limiter
from soloforge_api.presentation.schemas.health import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
@limiter.limit("10/second")
async def health_check(request: Request) -> HealthResponse:
    """返回 API 健康状态。"""
    use_case = HealthCheckUseCase()
    status = await use_case.execute()
    return HealthResponse(
        status=status.status,
        timestamp=status.timestamp.isoformat(),
        version=status.version,
    )

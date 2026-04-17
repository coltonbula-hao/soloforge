"""数据分析路由。"""

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.application.use_cases.analytics import AnalyticsUseCase
from soloforge_api.infrastructure.db import get_db
from soloforge_api.presentation.routers.auth import get_current_user
from soloforge_api.presentation.schemas.analytics import AnalyticsOverviewResponse
from soloforge_api.presentation.schemas.auth import UserResponse

router = APIRouter()


@router.get("/overview", response_model=AnalyticsOverviewResponse)
async def get_overview(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> AnalyticsOverviewResponse:
    """获取用户数据概览。"""
    use_case = AnalyticsUseCase(db)
    data = await use_case.get_overview(current_user.id)
    return AnalyticsOverviewResponse(**data)

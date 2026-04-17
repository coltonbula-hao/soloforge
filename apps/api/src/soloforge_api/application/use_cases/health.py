"""健康检查用例。"""

from dataclasses import dataclass
from datetime import datetime, timezone


@dataclass(frozen=True)
class HealthStatus:
    """不可变的健康状态对象。"""

    status: str
    timestamp: datetime
    version: str


class HealthCheckUseCase:
    """执行健康检查的应用层用例。"""

    async def execute(self) -> HealthStatus:
        """返回当前系统健康状态。"""
        return HealthStatus(
            status="healthy",
            timestamp=datetime.now(timezone.utc),
            version="0.1.0",
        )

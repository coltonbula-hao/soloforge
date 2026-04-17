"""Health check schemas."""

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    """Standard health check response schema."""

    status: str = Field(..., description="服务状态")
    timestamp: str = Field(..., description="ISO 格式时间戳")
    version: str = Field(..., description="API 版本")

    model_config = {
        "json_schema_extra": {
            "example": {
                "status": "healthy",
                "timestamp": "2024-01-01T00:00:00+00:00",
                "version": "0.1.0",
            },
        },
    }

"""数据分析相关 Pydantic 模式。"""

from datetime import datetime

from pydantic import BaseModel, Field


class RecentItem(BaseModel):
    """最近活动项。"""

    id: str = Field(..., description="ID")
    title: str = Field(..., description="标题")
    created_at: datetime = Field(..., description="创建时间")


class AnalyticsOverviewResponse(BaseModel):
    """数据分析概览响应。"""

    knowledge_bases: int = Field(0, description="知识库总数")
    documents: int = Field(0, description="文档总数")
    creations: int = Field(0, description="创作总数")
    published_creations: int = Field(0, description="已发布创作数")
    draft_creations: int = Field(0, description="草稿创作数")
    recent_creations: list[RecentItem] = Field([], description="最近创作")
    recent_documents: list[RecentItem] = Field([], description="最近文档")

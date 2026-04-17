"""内容创作相关 Pydantic 模式。"""

from datetime import datetime

from pydantic import BaseModel, Field


class ContentGenerateRequest(BaseModel):
    """AI 生成文章请求。"""

    title: str = Field(..., min_length=1, max_length=255, description="文章主题/标题")
    knowledge_base_id: str | None = Field(None, description="参考知识库 ID")
    prompt: str | None = Field(None, description="补充提示词/要求")


class ContentRewriteRequest(BaseModel):
    """AI 改写请求。"""

    text: str = Field(..., min_length=1, description="需要改写的文本")
    action: str = Field(..., description="改写动作: polish | expand | condense | continue")


class ContentCreateRequest(BaseModel):
    """手动创建创作请求。"""

    title: str = Field(..., min_length=1, max_length=255, description="标题")
    content: str = Field(..., description="正文内容")
    knowledge_base_id: str | None = Field(None, description="关联知识库 ID")
    prompt: str | None = Field(None, description="生成时使用的提示词")


class ContentUpdateRequest(BaseModel):
    """更新创作请求。"""

    title: str | None = Field(None, min_length=1, max_length=255, description="标题")
    content: str | None = Field(None, description="正文内容")
    status: str | None = Field(None, description="状态: draft | published")


class ContentResponse(BaseModel):
    """内容创作响应。"""

    id: str = Field(..., description="创作 ID")
    user_id: str = Field(..., description="用户 ID")
    knowledge_base_id: str | None = Field(None, description="关联知识库 ID")
    title: str = Field(..., description="标题")
    content: str = Field(..., description="正文内容")
    prompt: str | None = Field(None, description="生成提示词")
    status: str = Field(..., description="状态")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

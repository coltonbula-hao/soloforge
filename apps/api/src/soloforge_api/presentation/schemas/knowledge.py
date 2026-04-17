"""知识库相关 Pydantic 模式。"""

from datetime import datetime

from pydantic import BaseModel, Field


class KnowledgeBaseCreate(BaseModel):
    """创建知识库请求。"""

    name: str = Field(..., min_length=1, max_length=200, description="知识库名称")
    description: str | None = Field(None, description="知识库描述")


class KnowledgeBaseUpdate(BaseModel):
    """更新知识库请求。"""

    name: str | None = Field(None, min_length=1, max_length=200, description="知识库名称")
    description: str | None = Field(None, description="知识库描述")


class KnowledgeBaseResponse(BaseModel):
    """知识库响应。"""

    id: str = Field(..., description="知识库 ID")
    user_id: str = Field(..., description="用户 ID")
    name: str = Field(..., description="知识库名称")
    description: str | None = Field(None, description="知识库描述")
    document_count: int = Field(0, description="文档数量")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")


class DocumentCreate(BaseModel):
    """创建文档请求（文本输入）。"""

    title: str = Field(..., min_length=1, max_length=255, description="文档标题")
    content: str = Field(..., min_length=1, description="文档内容")
    source_type: str = Field(default="text", description="来源类型: text | file")
    file_name: str | None = Field(None, description="原始文件名")


class DocumentResponse(BaseModel):
    """文档响应。"""

    id: str = Field(..., description="文档 ID")
    knowledge_base_id: str = Field(..., description="所属知识库 ID")
    title: str = Field(..., description="文档标题")
    content: str = Field(..., description="文档内容")
    source_type: str = Field(..., description="来源类型")
    file_name: str | None = Field(None, description="原始文件名")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

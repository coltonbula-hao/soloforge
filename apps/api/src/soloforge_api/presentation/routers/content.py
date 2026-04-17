"""内容创作路由。"""

import json

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.application.use_cases.content import ContentUseCase
from soloforge_api.infrastructure.db import get_db
from soloforge_api.presentation.routers.auth import get_current_user
from soloforge_api.presentation.schemas.auth import UserResponse
from soloforge_api.presentation.schemas.content import (
    ContentCreateRequest,
    ContentGenerateRequest,
    ContentResponse,
    ContentRewriteRequest,
    ContentUpdateRequest,
)

router = APIRouter()


def _to_response(creation) -> ContentResponse:
    return ContentResponse(
        id=creation.id,
        user_id=creation.user_id,
        knowledge_base_id=creation.knowledge_base_id,
        title=creation.title,
        content=creation.content,
        prompt=creation.prompt,
        status=creation.status,
        created_at=creation.created_at,
        updated_at=creation.updated_at,
    )


@router.get("", response_model=list[ContentResponse])
async def list_creations(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[ContentResponse]:
    """获取创作列表。"""
    use_case = ContentUseCase(db)
    items = await use_case.list_creations(current_user.id)
    return [_to_response(item) for item in items]


@router.post("/generate", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
async def generate_content(
    payload: ContentGenerateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContentResponse:
    """AI 生成文章。"""
    use_case = ContentUseCase(db)
    creation = await use_case.generate(
        user_id=current_user.id,
        title=payload.title,
        knowledge_base_id=payload.knowledge_base_id,
        prompt=payload.prompt,
    )
    return _to_response(creation)


@router.post("/generate/stream")
async def generate_content_stream(
    payload: ContentGenerateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    """AI 流式生成文章（SSE）。"""

    async def event_stream():
        use_case = ContentUseCase(db)
        async for chunk in use_case.stream_generate(
            user_id=current_user.id,
            title=payload.title,
            knowledge_base_id=payload.knowledge_base_id,
            prompt=payload.prompt,
        ):
            yield f"data: {json.dumps({'text': chunk}, ensure_ascii=False)}\n\n"
        yield f"data: {json.dumps({'done': True}, ensure_ascii=False)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


@router.post("/rewrite", response_model=dict)
async def rewrite_content(
    payload: ContentRewriteRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> dict:
    """AI 改写文本。"""
    use_case = ContentUseCase(db)
    result = await use_case.ai_rewrite(
        text=payload.text,
        action=payload.action,
    )
    return {"text": result}


@router.post("", response_model=ContentResponse, status_code=status.HTTP_201_CREATED)
async def create_content(
    payload: ContentCreateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContentResponse:
    """手动创建创作。"""
    from soloforge_api.domain.models.content import ContentCreation
    creation = ContentCreation(
        user_id=current_user.id,
        knowledge_base_id=payload.knowledge_base_id,
        title=payload.title,
        content=payload.content,
        prompt=payload.prompt,
        status="draft",
    )
    db.add(creation)
    await db.commit()
    await db.refresh(creation)
    return _to_response(creation)


@router.get("/{creation_id}", response_model=ContentResponse)
async def get_content(
    creation_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContentResponse:
    """获取创作详情。"""
    use_case = ContentUseCase(db)
    item = await use_case.get_creation(current_user.id, creation_id)
    if not item:
        raise HTTPException(status_code=404, detail="创作不存在")
    return _to_response(item)


@router.patch("/{creation_id}", response_model=ContentResponse)
async def update_content(
    creation_id: str,
    payload: ContentUpdateRequest,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> ContentResponse:
    """更新创作。"""
    use_case = ContentUseCase(db)
    item = await use_case.update_creation(
        current_user.id,
        creation_id,
        title=payload.title,
        content=payload.content,
        status=payload.status,
    )
    if not item:
        raise HTTPException(status_code=404, detail="创作不存在")
    return _to_response(item)


@router.delete("/{creation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_content(
    creation_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """删除创作。"""
    use_case = ContentUseCase(db)
    deleted = await use_case.delete_creation(current_user.id, creation_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="创作不存在")
    return None

"""知识库路由。"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.application.use_cases.knowledge import KnowledgeUseCase
from soloforge_api.infrastructure.db import get_db
from soloforge_api.presentation.routers.auth import get_current_user
from soloforge_api.presentation.schemas.auth import UserResponse
from soloforge_api.presentation.schemas.knowledge import (
    DocumentCreate,
    DocumentResponse,
    KnowledgeBaseCreate,
    KnowledgeBaseResponse,
    KnowledgeBaseUpdate,
)

router = APIRouter()


@router.get("", response_model=list[KnowledgeBaseResponse])
async def list_knowledge_bases(
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[KnowledgeBaseResponse]:
    """获取当前用户的知识库列表。"""
    use_case = KnowledgeUseCase(db)
    kbs = await use_case.list_knowledge_bases(current_user.id)
    results = []
    for kb in kbs:
        doc_count = await use_case.count_documents(kb.id)
        results.append(
            KnowledgeBaseResponse(
                id=kb.id,
                user_id=kb.user_id,
                name=kb.name,
                description=kb.description,
                document_count=doc_count,
                created_at=kb.created_at,
                updated_at=kb.updated_at,
            )
        )
    return results


@router.post("", response_model=KnowledgeBaseResponse, status_code=status.HTTP_201_CREATED)
async def create_knowledge_base(
    payload: KnowledgeBaseCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> KnowledgeBaseResponse:
    """创建知识库。"""
    use_case = KnowledgeUseCase(db)
    kb = await use_case.create_knowledge_base(
        user_id=current_user.id,
        name=payload.name,
        description=payload.description,
    )
    return KnowledgeBaseResponse(
        id=kb.id,
        user_id=kb.user_id,
        name=kb.name,
        description=kb.description,
        document_count=0,
        created_at=kb.created_at,
        updated_at=kb.updated_at,
    )


@router.get("/{kb_id}", response_model=KnowledgeBaseResponse)
async def get_knowledge_base(
    kb_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> KnowledgeBaseResponse:
    """获取知识库详情。"""
    use_case = KnowledgeUseCase(db)
    kb = await use_case.get_knowledge_base(current_user.id, kb_id)
    if not kb:
        raise HTTPException(status_code=404, detail="知识库不存在")
    doc_count = await use_case.count_documents(kb.id)
    return KnowledgeBaseResponse(
        id=kb.id,
        user_id=kb.user_id,
        name=kb.name,
        description=kb.description,
        document_count=doc_count,
        created_at=kb.created_at,
        updated_at=kb.updated_at,
    )


@router.patch("/{kb_id}", response_model=KnowledgeBaseResponse)
async def update_knowledge_base(
    kb_id: str,
    payload: KnowledgeBaseUpdate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> KnowledgeBaseResponse:
    """更新知识库。"""
    use_case = KnowledgeUseCase(db)
    kb = await use_case.update_knowledge_base(
        current_user.id, kb_id, name=payload.name, description=payload.description
    )
    if not kb:
        raise HTTPException(status_code=404, detail="知识库不存在")
    doc_count = await use_case.count_documents(kb.id)
    return KnowledgeBaseResponse(
        id=kb.id,
        user_id=kb.user_id,
        name=kb.name,
        description=kb.description,
        document_count=doc_count,
        created_at=kb.created_at,
        updated_at=kb.updated_at,
    )


@router.delete("/{kb_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_knowledge_base(
    kb_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """删除知识库。"""
    use_case = KnowledgeUseCase(db)
    deleted = await use_case.delete_knowledge_base(current_user.id, kb_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="知识库不存在")
    return None


# ── 文档 ──

@router.get("/{kb_id}/documents", response_model=list[DocumentResponse])
async def list_documents(
    kb_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> list[DocumentResponse]:
    """获取知识库下的文档列表。"""
    use_case = KnowledgeUseCase(db)
    try:
        docs = await use_case.list_documents(current_user.id, kb_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    return [
        DocumentResponse(
            id=doc.id,
            knowledge_base_id=doc.knowledge_base_id,
            title=doc.title,
            content=doc.content,
            source_type=doc.source_type,
            file_name=doc.file_name,
            created_at=doc.created_at,
            updated_at=doc.updated_at,
        )
        for doc in docs
    ]


@router.post("/{kb_id}/documents", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def create_document(
    kb_id: str,
    payload: DocumentCreate,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> DocumentResponse:
    """在知识库中创建文档。"""
    use_case = KnowledgeUseCase(db)
    try:
        doc = await use_case.create_document(
            user_id=current_user.id,
            kb_id=kb_id,
            title=payload.title,
            content=payload.content,
            source_type=payload.source_type,
            file_name=payload.file_name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc))
    return DocumentResponse(
        id=doc.id,
        knowledge_base_id=doc.knowledge_base_id,
        title=doc.title,
        content=doc.content,
        source_type=doc.source_type,
        file_name=doc.file_name,
        created_at=doc.created_at,
        updated_at=doc.updated_at,
    )


@router.delete("/{kb_id}/documents/{doc_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_document(
    kb_id: str,
    doc_id: str,
    current_user: UserResponse = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
) -> None:
    """删除文档。"""
    use_case = KnowledgeUseCase(db)
    deleted = await use_case.delete_document(current_user.id, kb_id, doc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="文档不存在")
    return None

"""数据分析用例。"""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.domain.models.content import ContentCreation
from soloforge_api.domain.models.knowledge import Document, KnowledgeBase


class AnalyticsUseCase:
    """处理数据统计与聚合的应用层用例。"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def get_overview(self, user_id: str) -> dict:
        """获取用户数据概览。"""
        # 知识库数量
        kb_result = await self.db.execute(
            select(func.count(KnowledgeBase.id)).where(KnowledgeBase.user_id == user_id)
        )
        knowledge_bases = kb_result.scalar() or 0

        # 文档数量
        doc_result = await self.db.execute(
            select(func.count(Document.id))
            .join(KnowledgeBase, Document.knowledge_base_id == KnowledgeBase.id)
            .where(KnowledgeBase.user_id == user_id)
        )
        documents = doc_result.scalar() or 0

        # 创作统计
        creation_result = await self.db.execute(
            select(func.count(ContentCreation.id)).where(ContentCreation.user_id == user_id)
        )
        creations = creation_result.scalar() or 0

        published_result = await self.db.execute(
            select(func.count(ContentCreation.id)).where(
                ContentCreation.user_id == user_id,
                ContentCreation.status == "published",
            )
        )
        published_creations = published_result.scalar() or 0
        draft_creations = creations - published_creations

        # 最近创作
        recent_creations_result = await self.db.execute(
            select(ContentCreation)
            .where(ContentCreation.user_id == user_id)
            .order_by(ContentCreation.created_at.desc())
            .limit(7)
        )
        recent_creations = [
            {
                "id": c.id,
                "title": c.title,
                "created_at": c.created_at,
            }
            for c in recent_creations_result.scalars().all()
        ]

        # 最近文档
        recent_docs_result = await self.db.execute(
            select(Document)
            .join(KnowledgeBase, Document.knowledge_base_id == KnowledgeBase.id)
            .where(KnowledgeBase.user_id == user_id)
            .order_by(Document.created_at.desc())
            .limit(7)
        )
        recent_documents = [
            {
                "id": d.id,
                "title": d.title,
                "created_at": d.created_at,
            }
            for d in recent_docs_result.scalars().all()
        ]

        return {
            "knowledge_bases": knowledge_bases,
            "documents": documents,
            "creations": creations,
            "published_creations": published_creations,
            "draft_creations": draft_creations,
            "recent_creations": recent_creations,
            "recent_documents": recent_documents,
        }

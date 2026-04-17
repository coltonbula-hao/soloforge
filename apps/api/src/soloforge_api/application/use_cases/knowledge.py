"""知识库用例。"""

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.domain.models.knowledge import Document, KnowledgeBase


class KnowledgeUseCase:
    """处理知识库与文档的应用层用例。"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def create_knowledge_base(
        self,
        user_id: str,
        name: str,
        description: str | None = None,
    ) -> KnowledgeBase:
        """创建知识库。"""
        kb = KnowledgeBase(user_id=user_id, name=name, description=description)
        self.db.add(kb)
        await self.db.commit()
        await self.db.refresh(kb)
        return kb

    async def list_knowledge_bases(self, user_id: str) -> list[KnowledgeBase]:
        """获取用户的所有知识库。"""
        result = await self.db.execute(
            select(KnowledgeBase).where(KnowledgeBase.user_id == user_id)
        )
        return list(result.scalars().all())

    async def get_knowledge_base(self, user_id: str, kb_id: str) -> KnowledgeBase | None:
        """获取单个知识库详情。"""
        result = await self.db.execute(
            select(KnowledgeBase)
            .where(KnowledgeBase.id == kb_id, KnowledgeBase.user_id == user_id)
        )
        return result.scalar_one_or_none()

    async def update_knowledge_base(
        self,
        user_id: str,
        kb_id: str,
        name: str | None = None,
        description: str | None = None,
    ) -> KnowledgeBase | None:
        """更新知识库。"""
        kb = await self.get_knowledge_base(user_id, kb_id)
        if not kb:
            return None
        if name is not None:
            kb.name = name
        if description is not None:
            kb.description = description
        await self.db.commit()
        await self.db.refresh(kb)
        return kb

    async def delete_knowledge_base(self, user_id: str, kb_id: str) -> bool:
        """删除知识库。"""
        kb = await self.get_knowledge_base(user_id, kb_id)
        if not kb:
            return False
        await self.db.delete(kb)
        await self.db.commit()
        return True

    async def count_documents(self, kb_id: str) -> int:
        """统计知识库下的文档数量。"""
        result = await self.db.execute(
            select(func.count(Document.id)).where(Document.knowledge_base_id == kb_id)
        )
        return result.scalar() or 0

    async def create_document(
        self,
        user_id: str,
        kb_id: str,
        title: str,
        content: str,
        source_type: str = "text",
        file_name: str | None = None,
    ) -> Document:
        """在知识库中创建文档。"""
        kb = await self.get_knowledge_base(user_id, kb_id)
        if not kb:
            raise ValueError("知识库不存在")

        doc = Document(
            knowledge_base_id=kb_id,
            title=title,
            content=content,
            source_type=source_type,
            file_name=file_name,
        )
        self.db.add(doc)
        await self.db.commit()
        await self.db.refresh(doc)
        return doc

    async def list_documents(self, user_id: str, kb_id: str) -> list[Document]:
        """获取知识库下的所有文档。"""
        kb = await self.get_knowledge_base(user_id, kb_id)
        if not kb:
            raise ValueError("知识库不存在")

        result = await self.db.execute(
            select(Document).where(Document.knowledge_base_id == kb_id)
        )
        return list(result.scalars().all())

    async def get_document(
        self, user_id: str, kb_id: str, doc_id: str
    ) -> Document | None:
        """获取单个文档。"""
        kb = await self.get_knowledge_base(user_id, kb_id)
        if not kb:
            return None

        result = await self.db.execute(
            select(Document).where(
                Document.id == doc_id,
                Document.knowledge_base_id == kb_id,
            )
        )
        return result.scalar_one_or_none()

    async def delete_document(self, user_id: str, kb_id: str, doc_id: str) -> bool:
        """删除文档。"""
        doc = await self.get_document(user_id, kb_id, doc_id)
        if not doc:
            return False
        await self.db.delete(doc)
        await self.db.commit()
        return True

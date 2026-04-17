"""内容创作用例。"""

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.application.services.ai_service import AIService
from soloforge_api.application.use_cases.knowledge import KnowledgeUseCase
from soloforge_api.domain.models.content import ContentCreation


class ContentUseCase:
    """处理内容创作的应用层用例。"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.ai = AIService()

    async def generate(
        self,
        user_id: str,
        title: str,
        knowledge_base_id: str | None = None,
        prompt: str | None = None,
    ) -> ContentCreation:
        """基于 AI 生成文章并保存为草稿。"""
        context = ""
        if knowledge_base_id:
            kb_use_case = KnowledgeUseCase(self.db)
            docs = await kb_use_case.list_documents(user_id, knowledge_base_id)
            if docs:
                context = "\n\n".join(
                    [f"【{doc.title}】\n{doc.content}" for doc in docs]
                )

        generated = await self.ai.generate_article(title, context, prompt)

        creation = ContentCreation(
            user_id=user_id,
            knowledge_base_id=knowledge_base_id,
            title=title,
            content=generated,
            prompt=prompt,
            status="draft",
        )
        self.db.add(creation)
        await self.db.commit()
        await self.db.refresh(creation)
        return creation

    async def list_creations(self, user_id: str) -> list[ContentCreation]:
        """获取用户的创作列表。"""
        result = await self.db.execute(
            select(ContentCreation).where(ContentCreation.user_id == user_id)
        )
        return list(result.scalars().all())

    async def get_creation(self, user_id: str, creation_id: str) -> ContentCreation | None:
        """获取单个创作。"""
        result = await self.db.execute(
            select(ContentCreation).where(
                ContentCreation.id == creation_id,
                ContentCreation.user_id == user_id,
            )
        )
        return result.scalar_one_or_none()

    async def update_creation(
        self,
        user_id: str,
        creation_id: str,
        title: str | None = None,
        content: str | None = None,
        status: str | None = None,
    ) -> ContentCreation | None:
        """更新创作。"""
        creation = await self.get_creation(user_id, creation_id)
        if not creation:
            return None
        if title is not None:
            creation.title = title
        if content is not None:
            creation.content = content
        if status is not None:
            creation.status = status
        await self.db.commit()
        await self.db.refresh(creation)
        return creation

    async def delete_creation(self, user_id: str, creation_id: str) -> bool:
        """删除创作。"""
        creation = await self.get_creation(user_id, creation_id)
        if not creation:
            return False
        await self.db.delete(creation)
        await self.db.commit()
        return True

"""Database port definitions for the application layer."""

from typing import AsyncGenerator, Protocol

from sqlalchemy.ext.asyncio import AsyncSession


class DatabaseSession(Protocol):
    """Protocol describing a minimal database session interface."""

    async def commit(self) -> None: ...
    async def rollback(self) -> None: ...
    async def close(self) -> None: ...


AsyncSessionGenerator = AsyncGenerator[AsyncSession, None]

"""认证用例：注册与登录。"""

from datetime import datetime, timedelta, timezone

import bcrypt
import jwt
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.config import settings
from soloforge_api.domain.models.user import User


class AuthUseCase:
    """处理用户注册与登录的应用层用例。"""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    def _hash_password(self, password: str) -> str:
        return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def _verify_password(self, plain: str, hashed: str) -> bool:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

    def _create_token(self, user_id: str, email: str) -> str:
        payload = {
            "sub": user_id,
            "email": email,
            "exp": datetime.now(timezone.utc) + timedelta(days=7),
        }
        return jwt.encode(payload, settings.api_secret_key, algorithm="HS256")

    async def register(
        self,
        email: str,
        password: str,
        name: str | None = None,
    ) -> User:
        """注册新用户。"""
        result = await self.db.execute(select(User).where(User.email == email))
        existing = result.scalar_one_or_none()
        if existing:
            raise ValueError("该邮箱已被注册")

        user = User(email=email, name=name, password_hash=self._hash_password(password))
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def login(self, email: str, password: str) -> str:
        """用户登录并返回 JWT Token。"""
        result = await self.db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        if not user or not user.password_hash:
            raise ValueError("邮箱或密码错误")

        if not self._verify_password(password, user.password_hash):
            raise ValueError("邮箱或密码错误")

        return self._create_token(user.id, user.email)

    @staticmethod
    def decode_token(token: str) -> dict:
        """解码 JWT Token。"""
        return jwt.decode(token, settings.api_secret_key, algorithms=["HS256"])

    async def get_user_by_id(self, user_id: str) -> User | None:
        """根据 ID 获取用户。"""
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

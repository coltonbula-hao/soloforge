"""认证相关 Pydantic 模式。"""

from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    """用户注册请求。"""

    email: EmailStr = Field(..., description="邮箱")
    password: str = Field(..., min_length=6, description="密码")
    name: str | None = Field(None, description="昵称")


class LoginRequest(BaseModel):
    """用户登录请求。"""

    email: EmailStr = Field(..., description="邮箱")
    password: str = Field(..., min_length=6, description="密码")


class TokenResponse(BaseModel):
    """登录成功后返回的 Token。"""

    access_token: str = Field(..., description="访问令牌")
    token_type: str = Field(default="bearer", description="令牌类型")


class UserResponse(BaseModel):
    """用户信息响应。"""

    id: str = Field(..., description="用户 ID")
    email: str = Field(..., description="邮箱")
    name: str | None = Field(None, description="昵称")

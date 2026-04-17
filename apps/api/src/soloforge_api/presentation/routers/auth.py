"""认证路由。"""

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from soloforge_api.application.use_cases.auth import AuthUseCase
from soloforge_api.infrastructure.db import get_db
from soloforge_api.presentation.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserResponse,
)

router = APIRouter()
security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """从请求头中的 Bearer Token 解析当前用户。"""
    if not credentials:
        raise HTTPException(status_code=401, detail="缺少认证信息")

    token = credentials.credentials
    use_case = AuthUseCase(db)
    try:
        payload = use_case.decode_token(token)
    except Exception as exc:
        raise HTTPException(status_code=401, detail="无效的认证令牌") from exc

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(status_code=401, detail="无效的认证令牌")

    user = await use_case.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=401, detail="用户不存在")

    return UserResponse(id=user.id, email=user.email, name=user.name)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    payload: RegisterRequest,
    db: AsyncSession = Depends(get_db),
) -> UserResponse:
    """用户注册。"""
    use_case = AuthUseCase(db)
    try:
        user = await use_case.register(
            email=str(payload.email),
            password=payload.password,
            name=payload.name,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc))
    return UserResponse(id=user.id, email=user.email, name=user.name)


@router.post("/login", response_model=TokenResponse)
async def login(
    payload: LoginRequest,
    db: AsyncSession = Depends(get_db),
) -> TokenResponse:
    """用户登录。"""
    use_case = AuthUseCase(db)
    try:
        token = await use_case.login(
            email=str(payload.email),
            password=payload.password,
        )
    except ValueError as exc:
        raise HTTPException(status_code=401, detail=str(exc))
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
async def get_me(
    current_user: UserResponse = Depends(get_current_user),
) -> UserResponse:
    """获取当前登录用户信息。"""
    return current_user

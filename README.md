# SoloForge

> 超级个体的知识资产化 + 内容自动化 + 变现闭环一体化中台。

## 项目结构

```
/soloforge
├── apps
│   ├── web        # Next.js 14 (App Router) + TypeScript + Tailwind + shadcn/ui
│   ├── api        # FastAPI + SQLAlchemy + Alembic (Clean Architecture)
│   └── worker     # Celery + Redis 异步任务
├── packages
│   ├── shared     # 共享 TypeScript 类型定义
│   └── ai-core    # AI 能力封装 (LangChain + Claude/DeepSeek)
└── infra
    ├── docker     # Docker Compose 开发环境
    └── k8s        # Kubernetes 生产部署清单 (预留)
```

## 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui
- **后端**: Python 3.11 + FastAPI + SQLAlchemy 2.0 (async) + Alembic
- **数据库**: PostgreSQL 16 + PGVector + Redis
- **AI**: LangChain + Claude API (主) + DeepSeek API (备)
- **任务队列**: Celery + Redis
- **部署**: Docker + Docker Compose (开发)

## 快速开始

### 1. 环境准备

确保已安装：
- Node.js >= 18
- Python >= 3.11
- Docker & Docker Compose

### 2. 初始化环境变量

```bash
cp .env.example .env
# 根据本地环境修改 .env 中的配置
```

### 3. 安装前端依赖

```bash
npm install
```

### 4. 一键启动全部服务 (Docker Compose)

```bash
docker compose -f infra/docker/docker-compose.yml up --build
```

服务启动后访问：
- 前端: http://localhost:3004
- API 文档: http://localhost:8000/docs
- 健康检查: http://localhost:8000/api/v1/health

### 5. 单独开发模式

**前端单独开发**

```bash
npm run dev:web
```

**后端单独开发 (需先启动 PostgreSQL 与 Redis)**

```bash
cd apps/api
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn soloforge_api.main:app --reload
```

**Worker 单独开发**

```bash
cd apps/worker
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
celery -A soloforge_worker.main worker --loglevel=info
```

## 数据库迁移

```bash
cd apps/api
alembic revision --autogenerate -m "describe changes"
alembic upgrade head
```

## 设计规范

- **强类型**: 所有 Python 与 TypeScript 代码均包含完整类型注解。
- **Clean Architecture**: API 按 Domain / Application / Infrastructure / Presentation 分层。
- **RESTful + OpenAPI**: FastAPI 自动生成 OpenAPI 文档 (`/docs`)。
- **可观测性**: 内置结构化 JSON 日志、全局异常处理、SlowAPI 限流中间件。

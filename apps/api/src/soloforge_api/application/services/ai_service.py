"""AI 内容生成服务。"""

import asyncio
import json
import os
from collections.abc import AsyncIterator


class AIService:
    """基于 LLM 的内容生成服务。当前为占位实现，替换 API Key 后可切换为真实调用。"""

    @staticmethod
    def _build_prompt(title: str, context: str | None = None, extra_prompt: str | None = None) -> str:
        system = (
            "你是一位资深的内容创作专家，擅长将专业知识转化为"
            "结构清晰、观点鲜明、适合发布的中文文章。"
        )
        user = f"请根据以下主题撰写一篇高质量文章：\n\n主题：{title}\n"
        if context:
            user += f"\n参考素材：\n{context[:3000]}\n"
        if extra_prompt:
            user += f"\n补充要求：\n{extra_prompt}\n"
        user += "\n请直接输出文章正文，不需要包含标题。"
        return f"{system}\n\n{user}"

    @staticmethod
    def _build_rewrite_prompt(text: str, action: str) -> str:
        action_desc = {
            "polish": "润色优化，使语言更流畅、更专业，保持原意不变",
            "expand": "扩写，增加细节、案例和论述，使内容更丰富充实",
            "condense": "缩写精简，保留核心观点和关键信息，去除冗余表述",
            "continue": "续写，基于上文风格和主题继续延伸写作",
        }.get(action, "润色优化")
        system = "你是一位资深的内容编辑，擅长中文写作优化。"
        user = (
            f"请对以下文本进行【{action_desc}】。\n\n"
            f"原文：\n{text}\n\n"
            f"请只输出处理后的文本，不要添加任何解释、前言或后语。"
        )
        return f"{system}\n\n{user}"

    async def generate_article(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ) -> str:
        """生成文章。若配置了真实 API Key 则调用 Claude，否则返回占位内容。"""
        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if api_key and not api_key.startswith("sk-ant-xxxxx"):
            return await self._call_claude(title, context, extra_prompt)
        return self._mock_generate(title, context, extra_prompt)

    async def stream_article(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ) -> AsyncIterator[str]:
        """流式生成文章。"""
        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if api_key and not api_key.startswith("sk-ant-xxxxx"):
            async for chunk in self._call_claude_stream(title, context, extra_prompt):
                yield chunk
        else:
            for chunk in self._mock_stream_generate(title, context, extra_prompt):
                yield chunk
                await asyncio.sleep(0.03)

    async def rewrite(self, text: str, action: str) -> str:
        """AI 改写/润色/扩写/缩写/续写。"""
        api_key = os.getenv("ANTHROPIC_API_KEY", "")
        if api_key and not api_key.startswith("sk-ant-xxxxx"):
            return await self._call_claude_rewrite(text, action)
        return self._mock_rewrite(text, action)

    def _mock_generate(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ) -> str:
        """占位生成逻辑，用于本地无 API Key 时快速体验。"""
        lines = [
            f"这是基于主题「{title}」生成的占位文章。",
            "",
            "（当前未配置真实 AI API Key，系统返回了模拟内容以方便你体验完整流程。）",
            "",
            "如果你希望获得真实的 AI 生成效果，请在 .env 文件中配置有效的 ANTHROPIC_API_KEY，",
            "然后重启 API 容器即可自动切换到 Claude 调用。",
            "",
            "---",
            "",
        ]
        if context:
            lines.append("参考了以下知识库素材：")
            lines.append(context[:500] + "..." if len(context) > 500 else context)
            lines.append("")
        if extra_prompt:
            lines.append("补充要求：" + extra_prompt)
            lines.append("")
        lines.append("在实际接入 AI 后，这里将返回一篇结构完整、语言流畅的专业文章。")
        return "\n".join(lines)

    def _mock_stream_generate(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ):
        """占位流式生成，将文本拆分为小块。"""
        text = self._mock_generate(title, context, extra_prompt)
        for i in range(0, len(text), 3):
            yield text[i : i + 3]

    def _mock_rewrite(self, text: str, action: str) -> str:
        """占位改写逻辑。"""
        action_labels = {
            "polish": "【润色后】",
            "expand": "【扩写后】",
            "condense": "【精简后】",
            "continue": "【续写】",
        }
        label = action_labels.get(action, "【润色后】")
        return f"{label}\n\n{text}\n\n（当前为占位改写结果。配置 ANTHROPIC_API_KEY 后可获得真实的 AI 改写效果。）"

    async def _call_claude(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ) -> str:
        """真实调用 Claude API（非流式）。"""
        try:
            import httpx
        except ImportError:
            raise RuntimeError("缺少 httpx，请安装以使用真实 AI 调用")

        prompt = self._build_prompt(title, context, extra_prompt)
        async with httpx.AsyncClient(timeout=120) as client:
            res = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": os.getenv("ANTHROPIC_API_KEY", ""),
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "claude-3-5-sonnet-20240620",
                    "max_tokens": 2048,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            res.raise_for_status()
            data = res.json()
            return data["content"][0]["text"]

    async def _call_claude_stream(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ) -> AsyncIterator[str]:
        """流式调用 Claude API。"""
        try:
            import httpx
        except ImportError:
            raise RuntimeError("缺少 httpx，请安装以使用真实 AI 调用")

        prompt = self._build_prompt(title, context, extra_prompt)
        async with httpx.AsyncClient(timeout=120) as client:
            async with client.stream(
                "POST",
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": os.getenv("ANTHROPIC_API_KEY", ""),
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "claude-3-5-sonnet-20240620",
                    "max_tokens": 2048,
                    "messages": [{"role": "user", "content": prompt}],
                    "stream": True,
                },
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line.startswith("data: "):
                        data_str = line[6:]
                        if data_str == "[DONE]":
                            break
                        try:
                            event = json.loads(data_str)
                            if event.get("type") == "content_block_delta":
                                delta = event.get("delta", {})
                                if "text" in delta:
                                    yield delta["text"]
                        except json.JSONDecodeError:
                            continue

    async def _call_claude_rewrite(self, text: str, action: str) -> str:
        """调用 Claude API 进行改写。"""
        try:
            import httpx
        except ImportError:
            raise RuntimeError("缺少 httpx，请安装以使用真实 AI 调用")

        prompt = self._build_rewrite_prompt(text, action)
        async with httpx.AsyncClient(timeout=120) as client:
            res = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": os.getenv("ANTHROPIC_API_KEY", ""),
                    "anthropic-version": "2023-06-01",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "claude-3-5-sonnet-20240620",
                    "max_tokens": 2048,
                    "messages": [{"role": "user", "content": prompt}],
                },
            )
            res.raise_for_status()
            data = res.json()
            return data["content"][0]["text"]

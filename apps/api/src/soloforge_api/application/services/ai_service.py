"""AI 内容生成服务。"""

import os


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

    async def _call_claude(
        self,
        title: str,
        context: str | None = None,
        extra_prompt: str | None = None,
    ) -> str:
        """真实调用 Claude API（预留）。"""
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

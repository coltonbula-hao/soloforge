"""Anthropic Claude LLM 提供商。"""

from collections.abc import AsyncIterator

from langchain_anthropic import ChatAnthropic
from langchain_core.messages import BaseMessage


class ClaudeProvider:
    """基于 LangChain 的 Anthropic Claude API 封装。"""

    def __init__(self, api_key: str, model: str = "claude-3-5-sonnet-20240620") -> None:
        self.client = ChatAnthropic(api_key=api_key, model=model)

    async def chat(self, messages: list[dict[str, str]]) -> str:
        """发送对话请求并返回文本响应。"""
        response: BaseMessage = await self.client.ainvoke(messages)
        return str(response.content)

    async def stream_chat(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        """以流式方式逐块返回对话响应。"""
        async for chunk in self.client.astream(messages):
            yield str(chunk.content)

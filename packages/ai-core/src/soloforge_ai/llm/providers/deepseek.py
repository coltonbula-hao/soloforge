"""DeepSeek LLM 提供商。"""

from collections.abc import AsyncIterator

from langchain_core.messages import BaseMessage
from langchain_openai import ChatOpenAI


class DeepSeekProvider:
    """基于 LangChain OpenAI 兼容客户端的 DeepSeek API 封装。"""

    def __init__(
        self,
        api_key: str,
        model: str = "deepseek-chat",
        base_url: str = "https://api.deepseek.com/v1",
    ) -> None:
        self.client = ChatOpenAI(
            api_key=api_key,
            model=model,
            base_url=base_url,
        )

    async def chat(self, messages: list[dict[str, str]]) -> str:
        """发送对话请求并返回文本响应。"""
        response: BaseMessage = await self.client.ainvoke(messages)
        return str(response.content)

    async def stream_chat(self, messages: list[dict[str, str]]) -> AsyncIterator[str]:
        """以流式方式逐块返回对话响应。"""
        async for chunk in self.client.astream(messages):
            yield str(chunk.content)

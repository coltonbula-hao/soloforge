"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { api, KnowledgeBase } from "@/lib/api";

export default function NewContentPage() {
  const router = useRouter();
  const [kbs, setKbs] = useState<KnowledgeBase[]>([]);
  const [kbId, setKbId] = useState("");
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [streamedContent, setStreamedContent] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("sf_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    api.listKnowledgeBases().then(setKbs).catch(() => setKbs([]));
  }, [router]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [streamedContent]);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setGenerating(true);
    setError("");
    setStreamedContent("");
    setShowPreview(true);

    try {
      const res = await api.streamGenerateContent({
        title,
        knowledge_base_id: kbId || undefined,
        prompt: prompt || undefined,
      });

      if (!res.ok || !res.body) {
        throw new Error("流式生成请求失败");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            try {
              const data = JSON.parse(dataStr);
              if (data.done) {
                setGenerating(false);
                return;
              }
              if (data.text) {
                setStreamedContent((prev) => prev + data.text);
              }
            } catch {
              // ignore malformed JSON
            }
          }
        }
      }
      setGenerating(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "生成失败");
      setGenerating(false);
    }
  }

  function handleReset() {
    setShowPreview(false);
    setStreamedContent("");
    setGenerating(false);
    setError("");
  }

  async function handleSave() {
    try {
      setGenerating(true);
      const creation = await api.createContent({
        title,
        content: streamedContent,
        knowledge_base_id: kbId || undefined,
        prompt: prompt || undefined,
      });
      router.push(`/content/${creation.id}`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "保存失败");
      setGenerating(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className="text-xl font-bold tracking-tight cursor-pointer"
              onClick={() => router.push("/dashboard")}
            >
              SoloForge
            </span>
            <span className="text-xs text-muted-foreground">新建创作</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/content")}>
              返回创作列表
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {!showPreview ? (
          <Card>
            <CardHeader>
              <CardTitle>AI 写作助手</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleGenerate} className="space-y-5">
                <div className="space-y-1">
                  <label className="text-sm font-medium">文章主题 / 标题</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="例如：35岁后如何开启一人公司"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">参考知识库（可选）</label>
                  <select
                    value={kbId}
                    onChange={(e) => setKbId(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">不使用知识库</option>
                    {kbs.map((kb) => (
                      <option key={kb.id} value={kb.id}>
                        {kb.name}（{kb.document_count} 篇文档）
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">补充要求（可选）</label>
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="例如：语气要轻松、面向初学者、字数控制在 1500 字左右"
                    rows={3}
                  />
                </div>

                {error && <p className="text-sm text-destructive">{error}</p>}

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={generating}>
                    {generating ? "准备中..." : "开始生成"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/content")}
                    disabled={generating}
                  >
                    取消
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">AI 写作预览</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {generating ? "AI 正在写作中..." : "生成完成"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  disabled={generating}
                >
                  重新生成
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={generating || !streamedContent}
                >
                  保存草稿
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-1 mb-4">
                  <label className="text-sm font-medium">标题</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">正文</label>
                  <Textarea
                    ref={textareaRef}
                    value={streamedContent}
                    onChange={(e) => setStreamedContent(e.target.value)}
                    rows={24}
                    className="font-mono text-sm leading-relaxed"
                    placeholder={generating ? "AI 正在写作中，请稍候..." : ""}
                  />
                </div>
              </CardContent>
            </Card>

            {generating && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
                <div className="w-2 h-2 rounded-full bg-primary" />
                AI 正在写作...
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}
      </main>
    </div>
  );
}

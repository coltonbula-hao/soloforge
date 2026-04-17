"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { api, ContentCreation } from "@/lib/api";

export default function ContentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<ContentCreation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("");
  const [selection, setSelection] = useState<{
    start: number;
    end: number;
    text: string;
  } | null>(null);
  const [rewriting, setRewriting] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getCreation(id);
      setItem(data);
      setTitle(data.title);
      setContent(data.content);
      setStatus(data.status);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const token = localStorage.getItem("sf_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadData();
  }, [router, id, loadData]);

  function handleTextSelect() {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start !== end && start >= 0 && end <= ta.value.length) {
      const text = ta.value.substring(start, end);
      if (text.trim().length > 0) {
        setSelection({ start, end, text });
        return;
      }
    }
    setSelection(null);
  }

  async function handleRewrite(action: string) {
    if (!selection) return;
    try {
      setRewriting(true);
      setError("");
      const res = await api.rewriteContent({
        text: selection.text,
        action,
      });
      const newContent =
        content.substring(0, selection.start) +
        res.text +
        content.substring(selection.end);
      setContent(newContent);
      setSelection(null);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "改写失败");
    } finally {
      setRewriting(false);
    }
  }

  async function handleSave() {
    try {
      setSaving(true);
      await api.updateContent(id, { title, content, status });
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "保存失败");
    } finally {
      setSaving(false);
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
            <span className="text-xs text-muted-foreground">创作详情</span>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/content")}
            >
              返回创作列表
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {loading ? (
          <p className="text-muted-foreground">加载中...</p>
        ) : error && !item ? (
          <p className="text-destructive">{error}</p>
        ) : item ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">编辑创作</h1>
                <Badge
                  variant={status === "published" ? "default" : "secondary"}
                >
                  {status === "published" ? "已发布" : "草稿"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setStatus((prev) =>
                      prev === "published" ? "draft" : "published"
                    )
                  }
                >
                  {status === "published" ? "设为草稿" : "发布"}
                </Button>
                <Button size="sm" onClick={handleSave} disabled={saving}>
                  {saving ? "保存中..." : "保存"}
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium">标题</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* AI 辅助编辑工具栏 */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-muted-foreground mr-1">
                    AI 辅助编辑：
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRewrite("polish")}
                    disabled={!selection || rewriting}
                  >
                    润色
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRewrite("expand")}
                    disabled={!selection || rewriting}
                  >
                    扩写
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRewrite("condense")}
                    disabled={!selection || rewriting}
                  >
                    缩写
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRewrite("continue")}
                    disabled={!selection || rewriting}
                  >
                    续写
                  </Button>
                  {selection && (
                    <span className="text-xs text-primary ml-1">
                      已选中 {selection.text.length} 字
                    </span>
                  )}
                  {rewriting && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      AI 处理中...
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium">正文</label>
                  <Textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onMouseUp={handleTextSelect}
                    onKeyUp={handleTextSelect}
                    rows={20}
                    className="font-mono text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {item.prompt && (
              <Card className="bg-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    生成时的补充要求
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.prompt}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        ) : null}
      </main>
    </div>
  );
}

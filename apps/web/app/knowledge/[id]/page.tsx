"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api, KnowledgeBase, Document } from "@/lib/api";

export default function KnowledgeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const kbId = params.id as string;

  const [kb, setKb] = useState<KnowledgeBase | null>(null);
  const [docs, setDocs] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [kbRes, docsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/v1/knowledge/${kbId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("sf_token")}` },
        }).then((r) => r.json()),
        api.listDocuments(kbId),
      ]);
      if (kbRes.id) {
        setKb(kbRes);
      } else {
        setError("知识库不存在");
      }
      setDocs(docsRes);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }, [kbId]);

  useEffect(() => {
    const token = localStorage.getItem("sf_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadData();
  }, [router, kbId, loadData]);

  async function handleAddDocument(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      await api.createDocument(kbId, { title, content });
      setTitle("");
      setContent("");
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "添加失败");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteDoc(docId: string) {
    if (!confirm("确定删除这篇文档吗？")) return;
    try {
      await api.deleteDocument(kbId, docId);
      await loadData();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "删除失败");
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
            <span className="text-xs text-muted-foreground">知识库详情</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/knowledge")}>
              返回知识库
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {loading ? (
          <p className="text-muted-foreground">加载中...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : kb ? (
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold">{kb.name}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {kb.description || "暂无描述"} · {kb.document_count} 篇文档
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">添加新文档</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddDocument} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">标题</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="文档标题"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">内容</label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="在此输入或粘贴文档内容（支持 Markdown）"
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "保存中..." : "保存文档"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <div>
              <h2 className="text-lg font-semibold mb-4">文档列表</h2>
              {docs.length === 0 ? (
                <p className="text-muted-foreground">暂无文档，快去添加一篇吧</p>
              ) : (
                <div className="rounded-lg border border-border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>标题</TableHead>
                        <TableHead>内容预览</TableHead>
                        <TableHead className="w-32">创建时间</TableHead>
                        <TableHead className="w-20 text-right">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {docs.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell className="font-medium">{doc.title}</TableCell>
                          <TableCell className="max-w-md truncate text-muted-foreground">
                            {doc.content.slice(0, 80)}...
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteDoc(doc.id)}
                            >
                              删除
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

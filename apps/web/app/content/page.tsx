"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { api, ContentCreation } from "@/lib/api";

export default function ContentPage() {
  const router = useRouter();
  const [items, setItems] = useState<ContentCreation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sf_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadItems();
  }, [router]);

  async function loadItems() {
    try {
      setLoading(true);
      setError("");
      const data = await api.listCreations();
      setItems(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("确定删除这篇创作吗？")) return;
    try {
      setError("");
      await api.deleteCreation(id);
      await loadItems();
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
            <span className="text-xs text-muted-foreground">内容创作</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              返回工作台
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">我的创作</h1>
            <p className="text-sm text-muted-foreground mt-1">
              基于知识库，让 AI 辅助你快速产出专业内容
            </p>
          </div>
          <Button onClick={() => router.push("/content/new")}>新建创作</Button>
        </div>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

        {loading ? (
          <p className="text-muted-foreground">加载中...</p>
        ) : items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">还没有创作记录</p>
            <Button className="mt-4" onClick={() => router.push("/content/new")}>
              开始第一篇创作
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:shadow-sm transition-shadow"
                onClick={() => router.push(`/content/${item.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                    <Badge variant={item.status === "published" ? "default" : "secondary"}>
                      {item.status === "published" ? "已发布" : "草稿"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {item.content.slice(0, 120)}...
                  </p>
                  <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

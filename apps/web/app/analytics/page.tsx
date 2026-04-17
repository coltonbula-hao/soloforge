"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AnalyticsData {
  knowledge_bases: number;
  documents: number;
  creations: number;
  published_creations: number;
  draft_creations: number;
  recent_creations: { id: string; title: string; created_at: string }[];
  recent_documents: { id: string; title: string; created_at: string }[];
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sf_token");
    if (!token) {
      router.replace("/login");
      return;
    }
    loadData();
  }, [router]);

  async function loadData() {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:8000/api/v1/analytics/overview", {
        headers: { Authorization: `Bearer ${localStorage.getItem("sf_token")}` },
      });
      if (!res.ok) throw new Error("加载数据失败");
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "加载失败");
    } finally {
      setLoading(false);
    }
  }

  const StatCard = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number;
    icon: string;
  }) => (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl">{icon}</div>
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <span className="text-xs text-muted-foreground">数据看板</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard")}>
              返回工作台
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">数据看板</h1>
          <p className="text-sm text-muted-foreground mt-1">
            追踪你的知识资产和内容产出进度
          </p>
        </div>

        {error && <p className="text-sm text-destructive mb-6">{error}</p>}

        {loading || !data ? (
          <p className="text-muted-foreground">加载中...</p>
        ) : (
          <div className="space-y-8">
            {/* 核心指标 */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard label="知识库" value={data.knowledge_bases} icon="📚" />
              <StatCard label="文档总数" value={data.documents} icon="📝" />
              <StatCard label="创作总数" value={data.creations} icon="✍️" />
              <StatCard label="已发布" value={data.published_creations} icon="🚀" />
            </div>

            {/* 内容分布 + 最近活动 */}
            <div className="grid gap-6 lg:grid-cols-3">
              {/* 创作状态分布 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">创作状态分布</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.creations === 0 ? (
                    <p className="text-sm text-muted-foreground">暂无创作数据</p>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>已发布</span>
                          <span className="font-medium">{data.published_creations}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${data.creations ? (data.published_creations / data.creations) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>草稿</span>
                          <span className="font-medium">{data.draft_creations}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-secondary rounded-full"
                            style={{
                              width: `${data.creations ? (data.draft_creations / data.creations) * 100 : 0}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 最近创作 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">最近创作</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recent_creations.length === 0 ? (
                    <p className="text-sm text-muted-foreground">暂无创作</p>
                  ) : (
                    <ul className="space-y-3">
                      {data.recent_creations.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between text-sm cursor-pointer hover:underline"
                          onClick={() => router.push(`/content/${item.id}`)}
                        >
                          <span className="line-clamp-1">{item.title}</span>
                          <span className="text-muted-foreground whitespace-nowrap ml-3">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>

              {/* 最近文档 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">最近文档</CardTitle>
                </CardHeader>
                <CardContent>
                  {data.recent_documents.length === 0 ? (
                    <p className="text-sm text-muted-foreground">暂无文档</p>
                  ) : (
                    <ul className="space-y-3">
                      {data.recent_documents.map((item) => (
                        <li
                          key={item.id}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="line-clamp-1">{item.title}</span>
                          <span className="text-muted-foreground whitespace-nowrap ml-3">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

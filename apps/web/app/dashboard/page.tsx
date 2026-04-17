"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("sf_token");
    if (!token) {
      router.replace("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("sf_token");
    router.push("/login");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SoloForge</span>
            <span className="text-xs text-muted-foreground">工作台</span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            退出登录
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-4">欢迎回到工作台</h1>
        <p className="text-muted-foreground mb-8">
          这里是你的一人公司数字中台。你可以管理知识库、创作内容、追踪变现进度。
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            className="rounded-xl border border-border bg-card p-6 hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => router.push("/knowledge")}
          >
            <div className="text-2xl mb-3">📚</div>
            <h3 className="text-lg font-semibold mb-1">知识库</h3>
            <p className="text-sm text-muted-foreground">整理碎片知识，构建可复利的资产。</p>
          </div>
          <div
            className="rounded-xl border border-border bg-card p-6 hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => router.push("/content")}
          >
            <div className="text-2xl mb-3">✍️</div>
            <h3 className="text-lg font-semibold mb-1">内容创作</h3>
            <p className="text-sm text-muted-foreground">AI 辅助选题与写作，高效输出。</p>
          </div>
          <div
            className="rounded-xl border border-border bg-card p-6 hover:shadow-sm transition-shadow cursor-pointer"
            onClick={() => router.push("/analytics")}
          >
            <div className="text-2xl mb-3">📊</div>
            <h3 className="text-lg font-semibold mb-1">数据看板</h3>
            <p className="text-sm text-muted-foreground">追踪流量、转化与收入核心指标。</p>
          </div>
        </div>
      </main>
    </div>
  );
}

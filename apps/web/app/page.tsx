import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">SoloForge</span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              超级个体的数字中台
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login">
              <Button variant="ghost" size="sm">登录</Button>
            </a>
            <a href="/login">
              <Button size="sm">开始使用</Button>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-32">
          <div className="flex flex-col items-center text-center gap-6">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
              知识资产化 · 内容自动化 · 变现闭环
            </h1>
            <p className="max-w-2xl text-lg text-muted-foreground leading-relaxed">
              SoloForge 为 35-55 岁知识型从业者打造的一体化中台。
              让你的专业知识转化为可持续的商业资产，实现一人公司的完整闭环。
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Button size="lg">立即体验</Button>
              <Button variant="outline" size="lg">
                查看文档
              </Button>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 text-2xl">🧠</div>
              <h3 className="text-lg font-semibold mb-2">知识资产化</h3>
              <p className="text-sm text-muted-foreground">
                碎片知识结构化，打造属于你的可复利知识库。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 text-2xl">✍️</div>
              <h3 className="text-lg font-semibold mb-2">内容自动化</h3>
              <p className="text-sm text-muted-foreground">
                AI 辅助选题、写作与分发，让内容生产事半功倍。
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-3 text-2xl">💰</div>
              <h3 className="text-lg font-semibold mb-2">变现闭环</h3>
              <p className="text-sm text-muted-foreground">
                从内容到产品、从流量到交付，打通商业变现全链路。
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between text-sm text-muted-foreground">
          <span>© 2026 SoloForge. 保留所有权利。</span>
          <span>系统运行正常</span>
        </div>
      </footer>
    </div>
  );
}

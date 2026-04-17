import { motion } from "framer-motion";

export default function Tasks() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-10"
    >
      {/* Header Section */}
      <section className="mb-8">
        <h2 className="font-headline font-extrabold text-4xl tracking-tighter text-white mb-2 uppercase">
          指挥中心
        </h2>
        <p className="text-on-surface-variant font-medium tracking-wide text-sm opacity-80">
          船只吞吐量与活跃任务编排
        </p>
      </section>

      {/* Task Distribution Overview (Bento Style) */}
      <div className="grid grid-cols-1 gap-4 mb-10">
        {/* Metrics Card 1 */}
        <div className="bg-surface-container-low rounded-2xl p-6 relative overflow-hidden group border border-white/5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/20 transition-all"></div>
          <div className="relative z-10">
            <span className="text-[11px] text-on-surface-variant uppercase tracking-[0.15em] font-black">
              当前装载
            </span>
            <div className="font-headline text-5xl font-extrabold text-primary mt-2">14</div>
            <div className="mt-4 flex items-center gap-2 text-tertiary">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-[10px] font-bold uppercase tracking-widest">速率正常</span>
            </div>
          </div>
        </div>

        {/* Grid for smaller stats */}
        <div className="grid grid-cols-2 gap-4">
          {/* Metrics Card 2 */}
          <div className="bg-surface-container rounded-2xl p-5 border border-white/5 border-t-primary/20">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">
              待清关
            </span>
            <div className="font-headline text-3xl font-extrabold text-white mt-1">08</div>
            <div className="mt-3 flex items-center gap-1.5 text-error">
              <span className="material-symbols-outlined text-xs">warning</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter">2个紧急</span>
            </div>
          </div>

          {/* Metrics Card 3 */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-white/5">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-widest font-black">
              今日完成
            </span>
            <div className="font-headline text-3xl font-extrabold text-tertiary mt-1">126</div>
            <div className="mt-3 flex items-center gap-1.5 text-on-surface-variant">
              <span className="material-symbols-outlined text-xs">schedule</span>
              <span className="text-[9px] font-bold uppercase tracking-tighter">2h 后换班</span>
            </div>
          </div>
        </div>
      </div>

      {/* Task Columns */}
      <div className="space-y-10">
        {/* Column: In Progress */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
              <h3 className="font-headline text-lg font-bold tracking-tight uppercase text-white">
                进行中
              </h3>
            </div>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-primary/10">
              03 任务
            </span>
          </div>

          {/* Task Card 1 */}
          <div className="bg-surface-container rounded-2xl p-5 shadow-2xl border-l-4 border-primary border-y border-r border-white/5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-on-surface-variant/60 tracking-widest uppercase">
                  #WH-2901
                </span>
                <h4 className="font-headline font-bold text-white text-lg mt-0.5">船只加油</h4>
              </div>
              <span className="bg-error/20 text-error px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                紧急
              </span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  location_on
                </span>
                <span className="text-xs font-medium text-on-surface-variant tracking-wide">
                  B-42 码头
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant text-base">
                  group
                </span>
                <span className="text-xs font-medium text-on-surface-variant tracking-wide">
                  Sentinel Beta 团队
                </span>
              </div>
            </div>
            <button className="w-full bg-tertiary-container/40 text-on-tertiary-container py-4 rounded-xl font-headline font-bold text-xs uppercase tracking-[0.15em] hover:bg-tertiary-container active:scale-[0.98] transition-all border border-tertiary-container/30">
              标记完成
            </button>
          </div>
        </div>

        {/* Column: Pending */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
              <h3 className="font-headline text-lg font-bold tracking-tight uppercase text-white/50">
                待处理
              </h3>
            </div>
            <span className="bg-surface-variant/40 text-on-surface-variant px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase border border-white/5">
              02 任务
            </span>
          </div>

          {/* Task Card 3 */}
          <div className="bg-surface-container-low rounded-2xl p-5 border border-white/5 opacity-80 hover:opacity-100 active:scale-[0.99] transition-all">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-[10px] font-black text-on-surface-variant/40 tracking-widest uppercase">
                  #WH-2908
                </span>
                <h4 className="font-headline font-bold text-white/80 text-lg mt-0.5">安全检查</h4>
              </div>
              <span className="bg-error/10 text-error/60 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                紧急
              </span>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant/60 text-base">
                  location_on
                </span>
                <span className="text-xs font-medium text-on-surface-variant/60 tracking-wide">
                  南门斜坡
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-on-surface-variant/60 text-base">
                  group
                </span>
                <span className="text-xs font-medium text-on-surface-variant/60 tracking-wide">
                  合规部
                </span>
              </div>
            </div>
            <button className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed py-4 rounded-xl font-headline font-bold text-xs uppercase tracking-[0.15em] hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-primary/10">
              开始任务
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

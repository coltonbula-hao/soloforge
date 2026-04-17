import { motion } from "framer-motion";

export default function Dashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Hero Metrics */}
      <section className="grid grid-cols-1 gap-4">
        {/* Main Ship Traffic Metric */}
        <div className="p-6 rounded-2xl bg-surface-container relative overflow-hidden glass-shine border border-white/5 border-l-4 border-l-primary shadow-lg">
          <div className="relative z-10">
            <p className="font-headline text-on-surface-variant font-bold tracking-widest uppercase text-[10px] mb-2 opacity-80">
              船舶流量监控
            </p>
            <div className="flex items-end gap-3 mb-6">
              <span className="font-headline text-5xl font-black text-primary tracking-tighter glow-primary">
                142
              </span>
              <span className="mb-2 text-tertiary font-bold flex items-center gap-1 text-[11px] bg-tertiary/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-xs">trending_up</span>
                +12%
              </span>
            </div>
            <div className="flex gap-10">
              <div>
                <p className="text-[9px] text-on-surface-variant uppercase font-black tracking-widest mb-1 opacity-60">
                  日均流量
                </p>
                <p className="text-xl font-headline font-bold text-on-surface">24.5</p>
              </div>
              <div>
                <p className="text-[9px] text-on-surface-variant uppercase font-black tracking-widest mb-1 opacity-60">
                  本周峰值
                </p>
                <p className="text-xl font-headline font-bold text-on-surface">38</p>
              </div>
            </div>
          </div>
          <div className="absolute right-[-10px] bottom-[-10px] opacity-[0.03]">
            <span className="material-symbols-outlined text-[120px]">analytics</span>
          </div>
        </div>

        {/* Active Docking Ship Count */}
        <div className="p-6 rounded-2xl bg-primary-container text-on-primary-container flex items-center justify-between border border-white/10 shadow-lg">
          <div>
            <span className="material-symbols-outlined mb-2 block text-primary text-3xl">
              directions_boat
            </span>
            <p className="font-headline font-black text-[10px] uppercase tracking-widest text-primary/80">
              当前在泊
            </p>
            <p className="text-xs font-medium mt-1 text-primary-fixed">尚有 3 个泊位可用</p>
          </div>
          <span className="font-headline text-6xl font-black tracking-tighter text-white">09</span>
        </div>
      </section>

      {/* Operational State & Quick Actions */}
      <section className="grid grid-cols-1 gap-4">
        {/* Task Completion */}
        <div className="p-6 rounded-2xl bg-surface-container-low border border-white/5 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <p className="font-headline text-on-surface-variant font-bold text-[10px] uppercase tracking-widest">
              运营状态
            </p>
            <span className="text-3xl font-headline font-black text-tertiary glow-tertiary">94%</span>
          </div>
          <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden mb-3">
            <div className="bg-tertiary h-full w-[94%] shadow-[0_0_10px_rgba(74,225,118,0.5)]"></div>
          </div>
          <p className="text-[10px] text-on-surface-variant/70 italic flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">check_circle</span>
            高峰时段完成率已优化
          </p>
        </div>

        {/* Quick Action Command Center */}
        <div className="p-5 rounded-2xl bg-surface-container-high border border-white/5 shadow-md">
          <p className="font-headline text-on-surface-variant font-bold text-[10px] uppercase tracking-widest mb-5">
            常用操作
          </p>
          <div className="grid grid-cols-3 gap-3">
            <button className="tap-target group flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container-highest active:bg-primary-container transition-all border border-transparent active:border-primary/20">
              <span className="material-symbols-outlined text-primary mb-2 transition-colors">
                app_registration
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                船舶登记
              </span>
            </button>
            <button className="tap-target group flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container-highest active:bg-primary-container transition-all border border-transparent active:border-primary/20">
              <span className="material-symbols-outlined text-primary mb-2 transition-colors">
                ac_unit
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                冷库管理
              </span>
            </button>
            <button className="tap-target group flex flex-col items-center justify-center p-3 rounded-2xl bg-surface-container-highest active:bg-primary-container transition-all border border-transparent active:border-primary/20">
              <span className="material-symbols-outlined text-primary mb-2 transition-colors">
                edit_calendar
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">
                任务更新
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Activity Feed Section */}
      <section className="bg-surface-container-low rounded-2xl p-5 border border-white/5 shadow-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-headline font-extrabold text-base text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            实时动态
          </h2>
          <button className="tap-target px-3 text-[10px] font-black uppercase tracking-widest text-on-surface-variant active:text-primary transition-colors">
            查看日志
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container active:bg-surface-container-high transition-colors border border-transparent">
            <div className="w-12 h-12 rounded-xl bg-tertiary/10 flex items-center justify-center shrink-0 border border-tertiary/20 shadow-inner">
              <span className="material-symbols-outlined text-tertiary">anchor</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="font-headline font-bold text-[13px] tracking-tight text-on-surface truncate pr-2">
                  SS Orion Explorer 号到港
                </h3>
                <span className="text-[9px] font-semibold text-on-surface-variant whitespace-nowrap opacity-60">
                  09:42 AM
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-1">
                04号泊位已固定。检查小组已出发。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container active:bg-surface-container-high transition-colors border border-transparent">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-inner">
              <span className="material-symbols-outlined text-primary">assignment_turned_in</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="font-headline font-bold text-[13px] tracking-tight text-on-surface truncate pr-2">
                  加油作业完成
                </h3>
                <span className="text-[9px] font-semibold text-on-surface-variant whitespace-nowrap opacity-60">
                  08:15 AM
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-1">
                RM-882号轮船已准备离港。
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-surface-container active:bg-surface-container-high transition-colors border border-transparent">
            <div className="w-12 h-12 rounded-xl bg-on-tertiary-container/10 flex items-center justify-center shrink-0 border border-on-tertiary-container/20 shadow-inner">
              <span className="material-symbols-outlined text-on-tertiary-container">kitchen</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="font-headline font-bold text-[13px] tracking-tight text-on-surface truncate pr-2">
                  冷库温度预警
                </h3>
                <span className="text-[9px] font-semibold text-on-surface-variant whitespace-nowrap opacity-60">
                  07:50 AM
                </span>
              </div>
              <p className="text-[11px] text-on-surface-variant leading-relaxed line-clamp-1">
                C区已优化至 -18°C。覆盖模式已解除。
              </p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

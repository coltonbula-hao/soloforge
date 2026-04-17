import { motion } from "framer-motion";

export default function Storage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Dashboard Header & Critical Alert */}
      <section className="space-y-4">
        <div className="space-y-1">
          <p className="text-on-surface-variant font-label text-[10px] tracking-widest uppercase opacity-70">
            监控终端
          </p>
          <h2 className="text-3xl font-headline font-extrabold tracking-tight text-on-surface leading-tight">
            B区冷库管理
          </h2>
        </div>

        {/* Temperature Deviation Alert */}
        <div className="bg-error-container/15 border border-error/40 p-4 rounded-2xl flex items-start gap-3 shadow-[0_0_20px_rgba(147,0,10,0.15)] active:bg-error-container/20 transition-colors">
          <span
            className="material-symbols-outlined text-error text-2xl shrink-0"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            warning
          </span>
          <div>
            <p className="font-headline font-bold text-error text-sm uppercase tracking-wide">
              严重警告
            </p>
            <p className="text-xs text-on-error-container/90 mt-0.5 leading-relaxed">
              单元 CS-402: 检测到温度上升 (+4.2°C)。建议立即检查制冷机组状态。
            </p>
          </div>
        </div>
      </section>

      {/* Main Capacity & Status Grid */}
      <section className="grid grid-cols-1 gap-4">
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-headline text-base font-bold text-on-surface">仓库库容</h3>
                <p className="text-on-surface-variant text-[11px]">12个区域的实时利用率</p>
              </div>
              <span className="text-2xl font-headline font-black text-primary drop-shadow-[0_0_10px_rgba(173,198,255,0.3)]">
                84.2%
              </span>
            </div>

            {/* Warehouse Map Visual */}
            <div className="grid grid-cols-6 gap-2 h-32">
              <div className="bg-primary/10 rounded-lg flex items-end p-0.5 border border-primary/5">
                <div className="w-full bg-primary rounded h-[90%] opacity-90"></div>
              </div>
              <div className="bg-primary/10 rounded-lg flex items-end p-0.5 border border-primary/5">
                <div className="w-full bg-primary rounded h-[75%] opacity-90"></div>
              </div>
              <div className="bg-error/10 rounded-lg flex items-end p-0.5 border border-error/5">
                <div className="w-full bg-error rounded h-[95%] opacity-90"></div>
              </div>
              <div className="bg-primary/10 rounded-lg flex items-end p-0.5 border border-primary/5">
                <div className="w-full bg-primary rounded h-[60%] opacity-90"></div>
              </div>
              <div className="bg-primary/10 rounded-lg flex items-end p-0.5 border border-primary/5">
                <div className="w-full bg-primary rounded h-[82%] opacity-90"></div>
              </div>
              <div className="bg-tertiary/10 rounded-lg flex items-end p-0.5 border border-tertiary/5">
                <div className="w-full bg-tertiary rounded h-[40%] opacity-90"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
          <div className="flex-none w-32 bg-surface-container rounded-2xl p-4 border border-white/5 border-l-4 border-tertiary/80">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
              平均温度
            </p>
            <p className="text-xl font-headline font-bold text-tertiary">-22.4°C</p>
          </div>
          <div className="flex-none w-32 bg-surface-container rounded-2xl p-4 border border-white/5 border-l-4 border-primary/80">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
              运行机组
            </p>
            <p className="text-xl font-headline font-bold text-primary">42/48</p>
          </div>
          <div className="flex-none w-32 bg-surface-container rounded-2xl p-4 border border-white/5 border-l-4 border-on-secondary-container/80">
            <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant mb-1">
              环境湿度
            </p>
            <p className="text-xl font-headline font-bold text-on-secondary-container">14%</p>
          </div>
        </div>
      </section>

      {/* Storage Units Detailed Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-headline text-xl font-bold">储藏单元</h3>
          <div className="flex gap-2">
            <button className="tap-target bg-surface-container-highest/50 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-white/5 active:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-sm">filter_list</span> 筛选
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Unit Card 1 (Alert State) */}
          <div className="bg-surface-container rounded-2xl overflow-hidden border border-error/30 ring-1 ring-error/10 bg-gradient-to-br from-surface-container to-surface-container-lowest active:scale-[0.98] transition-transform">
            <div className="p-4 flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-error text-on-error rounded text-[9px] font-bold uppercase tracking-wider">
                  异常状态
                </span>
                <h4 className="text-lg font-headline font-bold mt-1">CS-402</h4>
              </div>
              <div className="text-right">
                <p className="text-error font-headline font-black text-xl">-18.2°C</p>
                <p className="text-[9px] text-on-surface-variant uppercase font-medium">
                  目标: -24.0°C
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-label font-medium uppercase tracking-wider">
                  <span className="text-on-surface-variant">库容利用率</span>
                  <span className="text-on-surface">95%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-error w-[95%] shadow-[0_0_8px_rgba(255,180,171,0.5)]"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/10">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  ac_unit
                </span>
                <div className="text-sm">
                  <p className="text-on-surface-variant leading-none text-[9px] uppercase tracking-wider">
                    存储内容
                  </p>
                  <p className="font-bold text-on-surface text-xs mt-0.5">冷冻海鲜 (A级品质)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Unit Card 2 (Healthy State) */}
          <div className="bg-surface-container rounded-2xl overflow-hidden border border-white/5 bg-gradient-to-br from-surface-container to-surface-container-lowest active:scale-[0.98] transition-transform">
            <div className="p-4 flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-tertiary-container text-on-tertiary-container rounded text-[9px] font-bold uppercase tracking-wider">
                  运行稳定
                </span>
                <h4 className="text-lg font-headline font-bold mt-1">CS-403</h4>
              </div>
              <div className="text-right">
                <p className="text-tertiary font-headline font-black text-xl">-24.1°C</p>
                <p className="text-[9px] text-on-surface-variant uppercase font-medium">
                  目标: -24.0°C
                </p>
              </div>
            </div>
            <div className="px-4 pb-4 space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-label font-medium uppercase tracking-wider">
                  <span className="text-on-surface-variant">库容利用率</span>
                  <span className="text-on-surface">62%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-[62%] shadow-[0_0_8px_rgba(74,225,118,0.5)]"></div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-3 border-t border-outline-variant/10">
                <span
                  className="material-symbols-outlined text-on-surface-variant text-lg"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  restaurant
                </span>
                <div className="text-sm">
                  <p className="text-on-surface-variant leading-none text-[9px] uppercase tracking-wider">
                    存储内容
                  </p>
                  <p className="font-bold text-on-surface text-xs mt-0.5">进口优质禽类</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

import { motion } from "framer-motion";

export default function More() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Asset Overview Card */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#002855] to-[#0b101a] p-6 shadow-2xl border border-white/10">
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/20 rounded-full blur-3xl opacity-30"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="font-label text-[11px] font-semibold uppercase tracking-[0.15em] text-on-primary-container/80 mb-1">
                可用余额 (CNY)
              </p>
              <h2 className="font-headline text-3xl font-black tracking-tight text-white">
                8,429,500.00
              </h2>
            </div>
            <span className="material-symbols-outlined text-primary text-3xl">
              account_balance_wallet
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
            <div>
              <p className="font-label text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
                待结算运费
              </p>
              <p className="font-headline text-base font-bold text-primary-fixed mt-0.5">
                1,240,000.00
              </p>
            </div>
            <div>
              <p className="font-label text-[11px] font-medium uppercase tracking-wide text-on-surface-variant">
                授信额度
              </p>
              <p className="font-headline text-base font-bold text-tertiary mt-0.5">
                50,000,000.00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Level Card */}
      <section className="bg-surface-container-low rounded-3xl p-5 flex items-center justify-between border border-white/[0.05] shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-tertiary/15 flex items-center justify-center border border-tertiary/20">
            <span
              className="material-symbols-outlined text-tertiary text-2xl"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified_user
            </span>
          </div>
          <div>
            <h3 className="font-headline text-base font-bold text-on-surface">港口信用等级</h3>
            <p className="font-label text-xs text-on-surface-variant/80">评估日期: 2023-11-15</p>
          </div>
        </div>
        <div className="text-right">
          <span className="font-headline text-3xl font-black text-tertiary tracking-tighter drop-shadow-[0_0_12px_rgba(74,225,118,0.4)]">
            AAA
          </span>
          <p className="font-label text-[10px] text-tertiary/90 font-bold uppercase tracking-widest mt-0.5">
            极高信用
          </p>
        </div>
      </section>

      {/* Financing Products Bento */}
      <section>
        <div className="flex justify-between items-center mb-4 px-1">
          <h3 className="font-headline text-xl font-extrabold tracking-tight text-on-surface">
            融资申请
          </h3>
          <button className="tap-target font-label text-sm text-primary font-bold active:opacity-70">
            查看全部
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {/* Product 1 */}
          <div className="tap-target bg-surface-container rounded-3xl p-5 border border-white/[0.08] border-l-4 border-l-primary active:scale-[0.98] transition-all duration-200">
            <div className="w-12 h-12 bg-primary/15 rounded-2xl flex items-center justify-center mb-4 border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl">speed</span>
            </div>
            <h4 className="font-headline font-bold text-on-surface text-base mb-1">港口快贷</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">
              纯信用、秒到账，最高额度500万
            </p>
          </div>
          {/* Product 2 */}
          <div className="tap-target bg-surface-container rounded-3xl p-5 border border-white/[0.08] border-l-4 border-l-secondary active:scale-[0.98] transition-all duration-200">
            <div className="w-12 h-12 bg-secondary/15 rounded-2xl flex items-center justify-center mb-4 border border-secondary/20">
              <span className="material-symbols-outlined text-secondary text-2xl">
                request_quote
              </span>
            </div>
            <h4 className="font-headline font-bold text-on-surface text-base mb-1">运费垫付</h4>
            <p className="text-xs text-on-surface-variant leading-relaxed opacity-80">
              缓解运费周转，账期最长90天
            </p>
          </div>
        </div>
      </section>

      {/* Settlement Records */}
      <section className="bg-surface-container rounded-3xl p-6 border border-white/[0.05] shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-headline text-xl font-extrabold text-on-surface">结算记录</h3>
          <button className="tap-target w-10 h-10 flex items-center justify-center text-on-surface-variant active:bg-surface-variant/50 rounded-full transition-colors">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        <div className="space-y-6">
          {/* Record Item */}
          <div className="tap-target flex items-center justify-between active:bg-surface-variant/20 -mx-2 px-2 py-2 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/[0.08]">
                <span className="material-symbols-outlined text-primary text-xl">
                  directions_boat
                </span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">运费结算 - 远洋盛世号</p>
                <p className="text-[12px] text-on-surface-variant/70 mt-0.5">
                  今天 14:20 · 支付宝商户
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-white">-45,200.00</p>
              <p className="text-[11px] text-tertiary font-bold mt-0.5">支付成功</p>
            </div>
          </div>
          {/* Record Item */}
          <div className="tap-target flex items-center justify-between active:bg-surface-variant/20 -mx-2 px-2 py-2 rounded-2xl transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center border border-white/[0.08]">
                <span className="material-symbols-outlined text-primary text-xl">dock</span>
              </div>
              <div>
                <p className="text-sm font-bold text-on-surface">港务费缴纳 - 3号泊位</p>
                <p className="text-[12px] text-on-surface-variant/70 mt-0.5">
                  昨天 09:45 · 银行卡支付
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-black text-white">-12,800.00</p>
              <p className="text-[11px] text-tertiary font-bold mt-0.5">支付成功</p>
            </div>
          </div>
        </div>
        <button className="tap-target w-full mt-6 py-4 rounded-2xl bg-surface-container-highest border border-white/[0.1] text-primary font-bold text-xs uppercase tracking-[0.2em] active:scale-[0.97] transition-all">
          加载更多记录
        </button>
      </section>
    </motion.div>
  );
}

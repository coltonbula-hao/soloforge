import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { format } from "date-fns";
import { cn } from "../lib/utils";

export default function Arrivals() {
  const [vessels, setVessels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "vessels"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVessels(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Header Section with Search */}
      <div className="mb-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary mb-1">
              物流枢纽
            </p>
            <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface">
              礁山码头
            </h2>
            <p className="font-body text-sm text-on-surface-variant mt-1.5 max-w-md">
              实时海运流量监控及进港船位分配系统。
            </p>
          </div>
          <div className="relative group w-full">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-outline text-lg">search</span>
            </div>
            <input
              className="w-full bg-surface-container-highest/40 border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-highest transition-all outline-none"
              placeholder="搜索船名或 IMO 编号..."
              type="text"
            />
          </div>
        </div>
      </div>

      {/* Metrics Bento Row */}
      <div className="grid grid-cols-1 gap-4 mb-8">
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5 relative overflow-hidden group active:bg-surface-container-high transition-colors">
          <div className="relative z-10">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              到港总量
            </p>
            <div className="flex items-baseline gap-2">
              <span className="font-headline text-3xl font-bold text-primary">
                {vessels.length || 12}
              </span>
              <span className="text-tertiary text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> +3
              </span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
            <span className="material-symbols-outlined text-7xl">directions_boat</span>
          </div>
        </div>
        <div className="bg-surface-container-low border border-white/5 rounded-2xl p-5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
            泊位占用率
          </p>
          <div className="flex items-baseline gap-2">
            <span className="font-headline text-3xl font-bold text-primary">84%</span>
          </div>
          <div className="mt-4 h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary shadow-[0_0_10px_rgba(173,198,255,0.4)]" style={{ width: "84%" }}></div>
          </div>
        </div>
      </div>

      {/* Arrival List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center text-on-surface-variant py-10">加载中...</div>
        ) : vessels.length === 0 ? (
          <div className="text-center text-on-surface-variant py-10">暂无船舶记录</div>
        ) : (
          vessels.map((vessel) => (
            <div
              key={vessel.id}
              className="bg-surface-container/60 border border-white/5 rounded-2xl overflow-hidden group active:bg-surface-container-high transition-colors"
            >
              <div className="p-5">
                <div className="flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary-container/30 flex items-center justify-center border border-primary/20 shrink-0">
                      <span className="material-symbols-outlined text-primary text-2xl">
                        directions_boat
                      </span>
                    </div>
                    <div className="overflow-hidden flex-1">
                      <h3 className="font-headline text-lg font-bold text-on-surface truncate">
                        {vessel.vesselName}
                      </h3>
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">
                        IMO {vessel.imoNumber}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-white/5 pt-4">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      预计到港
                    </p>
                    <div className="text-right">
                      <p className="font-bold text-on-surface">
                        {vessel.createdAt ? format(vessel.createdAt.toDate(), "HH:mm") : "--:--"}
                      </p>
                      <p className="text-[10px] text-on-surface-variant">
                        {vessel.createdAt ? format(vessel.createdAt.toDate(), "yyyy年MM月dd日") : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      泊位分配
                    </p>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-primary-container/20 text-primary border border-primary/20">
                      {vessel.berth || "未分配"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                      状态
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full animate-pulse",
                          vessel.status === "航行中" ? "bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]" :
                          vessel.status === "已靠泊" ? "bg-tertiary shadow-[0_0_8px_rgba(74,225,118,0.6)]" :
                          "bg-primary shadow-[0_0_8px_rgba(173,198,255,0.6)]"
                        )}
                      ></span>
                      <span
                        className={cn(
                          "text-sm font-bold",
                          vessel.status === "航行中" ? "text-blue-400" :
                          vessel.status === "已靠泊" ? "text-tertiary" :
                          "text-primary"
                        )}
                      >
                        {vessel.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}

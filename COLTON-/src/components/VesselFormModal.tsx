import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";
import { motion, AnimatePresence } from "framer-motion";

interface VesselFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VesselFormModal({ isOpen, onClose }: VesselFormModalProps) {
  const [vesselName, setVesselName] = useState("");
  const [imoNumber, setImoNumber] = useState("");
  const [status, setStatus] = useState("航行中");
  const [berth, setBerth] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!auth.currentUser) {
      setErrorMsg("请先登录");
      return;
    }
    setLoading(true);
    try {
      await addDoc(collection(db, "vessels"), {
        vesselName,
        imoNumber,
        status,
        berth,
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid,
      });
      setVesselName("");
      setImoNumber("");
      setStatus("航行中");
      setBerth("");
      onClose();
    } catch (error: any) {
      console.error("Error adding document: ", error);
      setErrorMsg("添加失败: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md bg-surface-container rounded-3xl p-6 border border-white/10 shadow-2xl"
          >
            <h2 className="text-xl font-headline font-bold text-white mb-6">新增船舶记录</h2>
            {errorMsg && (
              <div className="mb-4 p-3 bg-error-container/20 border border-error/30 rounded-xl text-error text-xs">
                {errorMsg}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider">
                  船舶名称
                </label>
                <input
                  required
                  type="text"
                  value={vesselName}
                  onChange={(e) => setVesselName(e.target.value)}
                  className="w-full bg-surface-container-highest/40 border border-white/5 rounded-xl py-3 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-highest transition-all outline-none"
                  placeholder="例如: MV Oceanic Venture"
                />
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider">
                  IMO 编号
                </label>
                <input
                  required
                  type="text"
                  value={imoNumber}
                  onChange={(e) => setImoNumber(e.target.value)}
                  className="w-full bg-surface-container-highest/40 border border-white/5 rounded-xl py-3 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-highest transition-all outline-none"
                  placeholder="例如: 9821456"
                />
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider">
                  当前状态
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full bg-surface-container-highest/40 border border-white/5 rounded-xl py-3 px-4 text-on-surface focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-highest transition-all outline-none appearance-none"
                >
                  <option value="航行中">航行中</option>
                  <option value="已靠泊">已靠泊</option>
                  <option value="卸货中">卸货中</option>
                  <option value="离港">离港</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-label text-on-surface-variant mb-1 uppercase tracking-wider">
                  泊位分配
                </label>
                <input
                  type="text"
                  value={berth}
                  onChange={(e) => setBerth(e.target.value)}
                  className="w-full bg-surface-container-highest/40 border border-white/5 rounded-xl py-3 px-4 text-on-surface placeholder:text-outline/60 focus:ring-2 focus:ring-primary/40 focus:bg-surface-container-highest transition-all outline-none"
                  placeholder="例如: 04-A 泊位"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-surface-container-highest text-on-surface-variant font-bold text-sm hover:bg-white/5 transition-colors"
                >
                  取消
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? "保存中..." : "保存记录"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

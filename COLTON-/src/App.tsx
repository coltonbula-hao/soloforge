import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { onAuthStateChanged } from "firebase/auth";
import { auth, signIn } from "./firebase";

import TopBar from "./components/TopBar";
import BottomNav from "./components/BottomNav";
import Fab from "./components/Fab";
import VesselFormModal from "./components/VesselFormModal";

import Dashboard from "./pages/Dashboard";
import Arrivals from "./pages/Arrivals";
import Tasks from "./pages/Tasks";
import Storage from "./pages/Storage";
import More from "./pages/More";

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} className="h-full">
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/arrivals" element={<Arrivals />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/storage" element={<Storage />} />
          <Route path="/more" element={<More />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setLoginError(null);
    setIsLoggingIn(true);
    try {
      await signIn();
    } catch (error: any) {
      console.error("Error signing in", error);
      if (error.code === 'auth/popup-blocked') {
        setLoginError("登录弹窗被浏览器拦截。请允许弹出窗口，或点击右上角「在新标签页中打开」本应用后再试。");
      } else if (error.code === 'auth/cancelled-popup-request') {
        setLoginError("登录已取消，请重试。");
      } else {
        setLoginError("登录失败: " + error.message);
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-4xl">anchor</span>
        </div>
        <h1 className="text-2xl font-headline font-bold text-white mb-2">礁山码头</h1>
        <p className="text-on-surface-variant text-sm mb-8 text-center max-w-xs">
          实时海运流量监控及进港船位分配系统
        </p>
        
        {loginError && (
          <div className="w-full max-w-sm mb-6 p-4 bg-error-container/20 border border-error/30 rounded-2xl flex items-start gap-3">
            <span className="material-symbols-outlined text-error text-xl shrink-0">error</span>
            <p className="text-error text-xs leading-relaxed">{loginError}</p>
          </div>
        )}

        <button
          onClick={handleSignIn}
          disabled={isLoggingIn}
          className="w-full max-w-sm py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {isLoggingIn ? (
            <>
              <span className="material-symbols-outlined animate-spin text-lg">sync</span>
              登录中...
            </>
          ) : (
            "使用 Google 账号登录"
          )}
        </button>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary/30 pb-32">
        <TopBar />
        <main className="pt-20 px-4 max-w-lg mx-auto">
          <AnimatedRoutes />
        </main>
        <BottomNav />
        <Fab onClick={() => setIsModalOpen(true)} />
        <VesselFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </BrowserRouter>
  );
}

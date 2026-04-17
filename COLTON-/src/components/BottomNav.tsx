import { Link, useLocation } from "react-router-dom";
import { cn } from "../lib/utils";

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: "/", icon: "dashboard", label: "首页" },
    { path: "/arrivals", icon: "directions_boat", label: "到港" },
    { path: "/tasks", icon: "assignment", label: "任务" },
    { path: "/storage", icon: "ac_unit", label: "仓储" },
    { path: "/more", icon: "menu", label: "更多" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-end px-2 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-4 bg-[#02040a]/90 backdrop-blur-2xl border-t border-white/10 shadow-[0_-15px_40px_rgba(0,0,0,0.8)] rounded-t-[2.5rem]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "tap-target flex flex-col items-center justify-center transition-all w-16 group",
              isActive ? "text-primary" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <div
              className={cn(
                "rounded-full p-2 mb-1 group-active:scale-90 transition-transform",
                isActive ? "bg-primary/10" : ""
              )}
            >
              <span
                className="material-symbols-outlined text-[28px]"
                style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {item.icon}
              </span>
            </div>
            <span className="font-body text-[10px] font-bold uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

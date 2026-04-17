import { cn } from "../lib/utils";

interface TopBarProps {
  title?: string;
  showSearch?: boolean;
}

export default function TopBar({ title = "礁山码头", showSearch = false }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-[#03060d]/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center px-4 h-16 pt-safe">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-white/10">
          <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            anchor
          </span>
        </div>
        <h1 className="font-headline font-extrabold text-lg text-[#adc6ff] tracking-tight uppercase">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-1">
        {showSearch && (
          <button className="tap-target rounded-full hover:bg-white/10 transition-colors text-slate-400 active:bg-white/20 p-2.5">
            <span className="material-symbols-outlined">search</span>
          </button>
        )}
        <button className="tap-target text-[#adc6ff] hover:bg-surface-variant/50 p-2.5 rounded-full active:scale-90 transition-all duration-200">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </div>
    </header>
  );
}

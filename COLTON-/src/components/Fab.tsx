interface FabProps {
  onClick: () => void;
}

export default function Fab({ onClick }: FabProps) {
  return (
    <div className="fixed right-6 bottom-32 z-40">
      <button
        onClick={onClick}
        className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed rounded-2xl flex items-center justify-center shadow-[0_8px_30px_rgb(173,198,255,0.3)] active:scale-[0.85] transition-all border border-white/20"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
}

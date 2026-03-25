export default function Arcade() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-zinc-500">
      <div className="w-20 h-20 border-2 border-dashed border-zinc-800 rounded-full flex items-center justify-center animate-spin-slow mb-4">
        <span className="text-2xl">🕹️</span>
      </div>
      <p className="text-[10px] uppercase tracking-widest font-bold">Module under construction</p>
      <span className="text-[9px] mt-2 italic text-zinc-700">Waiting for stellar update...</span>
    </div>
  );
}
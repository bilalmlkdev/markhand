import { Grid3X3 } from 'lucide-react';

export function GuideControls() {
  return (
    <div className="p-3 border-b border-stone-100">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <Grid3X3 className="w-3 h-3" />
        Guides
      </p>
      <p className="text-xs text-stone-400 italic">Coming soon</p>
    </div>
  );
}

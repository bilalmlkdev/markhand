import type { GuideType } from '../../types';
import { Grid3X3, LayoutGrid, Rows3, EyeOff } from 'lucide-react';

interface GuideOverlayProps {
  activeGuide: GuideType;
  onChange: (guide: GuideType) => void;
}

const guides: { type: GuideType; label: string; icon: React.ReactNode }[] = [
  { type: 'none', label: 'None', icon: <EyeOff className="w-3.5 h-3.5" /> },
  { type: 'dots', label: 'Dots', icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { type: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { type: 'lines', label: 'Lines', icon: <Rows3 className="w-3.5 h-3.5" /> },
];

export function GuideOverlay({ activeGuide, onChange }: GuideOverlayProps) {
  return (
    <div className="space-y-2">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
        <Grid3X3 className="w-3 h-3" />
        Guide Type
      </p>
      <div className="space-y-0.5">
        {guides.map(guide => (
          <button
            key={guide.type}
            onClick={() => onChange(guide.type)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
              activeGuide === guide.type
                ? 'bg-stone-100 text-stone-900 font-medium'
                : 'text-stone-500 hover:bg-stone-50'
            }`}
          >
            {guide.icon}
            {guide.label}
          </button>
        ))}
      </div>
    </div>
  );
}

import { Grid3X3, LayoutGrid, Rows3, EyeOff } from 'lucide-react';
import type { GuideType } from '../../types';

interface GuidePillsProps {
  activeGuide: GuideType;
  onChange: (guide: GuideType) => void;
}

const guides: { type: GuideType; label: string; icon: React.ReactNode }[] = [
  { type: 'none', label: 'None', icon: <EyeOff className="w-3 h-3" /> },
  { type: 'dots', label: 'Dots', icon: <Grid3X3 className="w-3 h-3" /> },
  { type: 'grid', label: 'Grid', icon: <LayoutGrid className="w-3 h-3" /> },
  { type: 'lines', label: 'Lines', icon: <Rows3 className="w-3 h-3" /> },
];

export function GuidePills({ activeGuide, onChange }: GuidePillsProps) {
  return (
    <div className="absolute top-3 right-3 z-30 flex gap-1 bg-white/90 backdrop-blur-sm rounded-full px-1 py-1 border border-stone-200 shadow-sm">
      {guides.map(guide => (
        <button
          key={guide.type}
          onClick={() => onChange(guide.type)}
          title={guide.label}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all cursor-pointer ${
            activeGuide === guide.type
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-500 hover:text-stone-700 hover:bg-stone-100'
          }`}
        >
          {guide.icon}
          <span className="hidden sm:inline">{guide.label}</span>
        </button>
      ))}
    </div>
  );
}

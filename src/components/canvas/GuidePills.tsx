import { Grid3X3, LayoutGrid, Rows3, EyeOff } from 'lucide-react';
import type { GuideType } from '../../types';

interface GuidePillsProps {
  activeGuide: GuideType;
  onChange: (guide: GuideType) => void;
}

const guides: { type: GuideType; label: string; icon: React.ReactNode }[] = [
  { type: 'none', label: 'No guide', icon: <EyeOff className="w-3.5 h-3.5" /> },
  { type: 'dots', label: 'Dot grid', icon: <Grid3X3 className="w-3.5 h-3.5" /> },
  { type: 'grid', label: 'Line grid', icon: <LayoutGrid className="w-3.5 h-3.5" /> },
  { type: 'lines', label: 'Lines', icon: <Rows3 className="w-3.5 h-3.5" /> },
];

export function GuidePills({ activeGuide, onChange }: GuidePillsProps) {
  return (
    <div className="absolute top-3 right-3 z-30 flex flex-col gap-0.5 bg-white/90 backdrop-blur-md rounded-2xl p-1 border border-stone-200/60 shadow-lg">
      {guides.map(guide => (
        <button
          key={guide.type}
          onClick={() => onChange(guide.type)}
          title={guide.label}
          className={`w-8 h-8 flex items-center justify-center rounded-4xl transition-all duration-150 cursor-pointer ${
            activeGuide === guide.type
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
          }`}
        >
          {guide.icon}
        </button>
      ))}
    </div>
  );
}

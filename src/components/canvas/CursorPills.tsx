import { MousePointer2, Pencil, Circle, Brush, Pen } from 'lucide-react';
import type { CursorStyle } from '../../types';

interface CursorPillsProps {
  activeCursor: CursorStyle;
  onChange: (cursor: CursorStyle) => void;
}

const cursorOptions: { type: CursorStyle; label: string; icon: React.ReactNode }[] = [
  { type: 'crosshair', label: 'Crosshair', icon: <MousePointer2 className="w-3.5 h-3.5" /> },
  { type: 'pencil', label: 'Pencil', icon: <Pencil className="w-3.5 h-3.5" /> },
  { type: 'dot', label: 'Dot', icon: <Circle className="w-3.5 h-3.5" /> },
  { type: 'brush', label: 'Brush', icon: <Brush className="w-3.5 h-3.5" /> },
  { type: 'pen', label: 'Pen', icon: <Pen className="w-3.5 h-3.5" /> },
];

export function CursorPills({ activeCursor, onChange }: CursorPillsProps) {
  return (
    <div className="absolute top-40 left-3 z-30 flex flex-col gap-0.5 bg-white/90 backdrop-blur-md rounded-2xl p-1 border border-stone-200/60 shadow-lg">
      {cursorOptions.map(cursor => (
        <button
          key={cursor.type}
          onClick={() => onChange(cursor.type)}
          title={cursor.label}
          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer ${activeCursor === cursor.type ? 'bg-stone-900 text-white shadow-sm' : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'}`}
        >
          {cursor.icon}
        </button>
      ))}
    </div>
  );
}

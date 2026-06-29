import { Check } from 'lucide-react';
import type { CanvasTheme } from '../../types';
import { themes } from '../../lib/canvas';

interface ThemeControlsProps {
  activeTheme: CanvasTheme;
  onChange: (theme: CanvasTheme) => void;
}

export function ThemeControls({ activeTheme, onChange }: ThemeControlsProps) {
  const themeEntries = Object.entries(themes) as [CanvasTheme, typeof themes.default][];

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-medium text-stone-400 mb-2">Canvas Background</p>
      {themeEntries.map(([key, theme]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 cursor-pointer ${
            activeTheme === key ? 'bg-stone-100' : 'hover:bg-stone-50'
          }`}
        >
          {/* Color swatch */}
          <div
            className="w-7 h-7 rounded-lg border border-stone-200 flex-shrink-0 flex items-center justify-center"
            style={{ backgroundColor: theme.bg }}
          >
            {activeTheme === key && <Check className="w-3.5 h-3.5 text-stone-700" />}
          </div>
          <span
            className={`text-xs ${
              activeTheme === key ? 'text-stone-900 font-medium' : 'text-stone-500'
            }`}
          >
            {theme.name}
          </span>
        </button>
      ))}
    </div>
  );
}

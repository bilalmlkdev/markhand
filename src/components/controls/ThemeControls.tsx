import { Check } from 'lucide-react';
import type { CanvasTheme } from '../../types';
import { themes } from '../../lib/canvas';
import { isLightColor } from '../../lib/palette';

interface ThemeControlsProps {
  activeTheme: CanvasTheme;
  onChange: (theme: CanvasTheme) => void;
}

export function ThemeControls({ activeTheme, onChange }: ThemeControlsProps) {
  const themeEntries = Object.entries(themes) as [CanvasTheme, typeof themes.default][];

  return (
    <div className="grid grid-cols-2 gap-2">
      {themeEntries.map(([key, theme]) => {
        const isActive = activeTheme === key;
        const light = isLightColor(theme.bg);
        const inkColor = light ? '#1c1917' : '#ffffff';

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            title={theme.name}
            className={`group relative flex flex-col rounded-xl overflow-hidden transition-all duration-150 cursor-pointer ${
              isActive
                ? 'ring-2 ring-stone-900 ring-offset-1'
                : 'ring-1 ring-stone-200 hover:ring-stone-300 hover:-translate-y-0.5'
            }`}
          >
            <div
              className="relative h-12 w-full flex items-center justify-center"
              style={{ backgroundColor: theme.bg }}
            >
              <svg viewBox="0 0 64 32" className="w-3/4 h-auto opacity-70">
                <path
                  d="M6 22 C 14 8, 22 8, 28 16 S 42 26, 50 12"
                  fill="none"
                  stroke={inkColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle cx="50" cy="12" r="2.2" fill={inkColor} opacity="0.55" />
              </svg>

              {isActive && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-stone-900 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                </div>
              )}
            </div>

            <div
              className={`px-2 py-1.5 text-[11px] font-medium text-center transition-colors duration-150 ${
                isActive
                  ? 'bg-stone-900 text-white'
                  : 'bg-white text-stone-500 group-hover:text-stone-800'
              }`}
            >
              {theme.name}
            </div>
          </button>
        );
      })}
    </div>
  );
}

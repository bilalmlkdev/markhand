import { useState, useRef, useEffect } from 'react';
import { Palette, Check } from 'lucide-react';
import type { CanvasTheme } from '../../types';
import { themes } from '../../lib/canvas';

interface ThemeSwitcherProps {
  activeTheme: CanvasTheme;
  onChange: (theme: CanvasTheme) => void;
}

export function ThemeSwitcher({ activeTheme, onChange }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  const themeEntries = Object.entries(themes) as [CanvasTheme, typeof themes.default][];

  return (
    <div ref={containerRef} className="absolute top-3 right-3 z-30">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-9 h-9 flex items-center justify-center rounded-2xl border border-stone-200/60 shadow-lg transition-all duration-200 cursor-pointer ${
          open
            ? 'bg-stone-900 text-white'
            : 'bg-white/90 backdrop-blur-md text-stone-500 hover:text-stone-700 hover:shadow-xl'
        }`}
        title="Canvas theme"
      >
        <Palette className="w-4 h-4" />
      </button>

      {/* Popup — opens below */}
      {open && (
        <div className="absolute -top-2 right-[110%] mt-2 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/60 shadow-xl p-2 animate-in slide-in-from-top-2 fade-in duration-200">
          <div className="flex flex-col gap-0.5">
            {themeEntries.map(([key, theme]) => (
              <button
                key={key}
                onClick={() => {
                  onChange(key);
                  setOpen(false);
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  activeTheme === key
                    ? 'bg-stone-100 text-stone-900 font-medium'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-stone-200 flex-shrink-0"
                  style={{ backgroundColor: theme.bg }}
                />
                <span>{theme.name}</span>
                {activeTheme === key && <Check className="w-3.5 h-3.5 text-stone-600 ml-auto" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

import { Pen, Droplet } from 'lucide-react';
import { ColorPicker } from '../ui/ColorPicker';

interface PenControlsProps {
  activeColor: string;
  activeWidth: number;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
}

const colors = [
  '#1c1917',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#9c36b5',
  '#0c8599',
  '#c92a2a',
];

export function PenControls({
  activeColor,
  activeWidth,
  onColorChange,
  onWidthChange,
}: PenControlsProps) {
  const minWidth = 1;
  const maxWidth = 12;
  const percent = Math.min(
    100,
    Math.max(0, ((activeWidth - minWidth) / (maxWidth - minWidth)) * 100),
  );

  return (
    <div className="w-full max-w-sm  p-2 select-none">
      {/*  SLIDER */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-0.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
            <Pen className="w-3 h-3 text-stone-500" />
            Line Weight
          </p>
        </div>

        {/* Precision Tapered Slider Track */}
        <div className="relative h-8 flex items-center group/slider">
          {/* Tapered Track Visual */}
          <div className="absolute inset-x-0 h-3 bg-stone-50 border border-stone-100 rounded-lg overflow-hidden pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 10">
              <path d="M 2 5 L 98 1 L 98 9 Z" fill="#e7e5e4" />
              <path
                d={`M 2 5 L ${percent} ${5 - (4 * percent) / 100} L ${percent} ${5 + (4 * percent) / 100} Z`}
                fill={activeColor}
                className="transition-colors duration-200 opacity-80"
              />
            </svg>
          </div>

          {/* Invisible Native Range Input */}
          <input
            type="range"
            min={minWidth}
            max={maxWidth}
            step="1"
            value={activeWidth}
            onChange={e => onWidthChange(Number(e.target.value))}
            className="absolute inset-x-0 w-full h-full opacity-0 cursor-ew-resize z-20"
          />

          {/* Floating Handle Indicator */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none z-10 will-change-transform"
            style={{ left: `${percent}%` }}
          >
            <div className="relative w-6 h-6 bg-white rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.12)] border border-stone-200 flex items-center justify-center group-hover/slider:scale-110 group-active/slider:scale-95 transition-transform duration-150">
              <div
                className="rounded-full transition-all duration-150"
                style={{
                  width: `${Math.max(3, Math.min(activeWidth * 1.2, 14))}px`,
                  height: `${Math.max(3, Math.min(activeWidth * 1.2, 14))}px`,
                  backgroundColor: activeColor,
                  boxShadow: `0 0 8px ${activeColor}40`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <hr className="border-stone-100" />

      {/* COLOR SELECTION */}
      <div className="space-y-2.5">
        <p className="flex items-center gap-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider px-0.5">
          <Droplet className="w-3 h-3 text-stone-500" />
          Palette
        </p>
        <div className="grid grid-cols-5 gap-2">
          {colors.map(value => {
            const isActive = activeColor === value;
            return (
              <button
                key={value}
                onClick={() => onColorChange(value)}
                title={value}
                className={`relative w-full aspect-square rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 active:scale-95 ${
                  isActive ? 'shadow-[0_4px_12px_rgba(0,0,0,0.15)] scale-105' : 'hover:shadow-sm'
                }`}
                style={{
                  backgroundColor: value,
                  outline: isActive ? '2px solid white' : 'none',
                  outlineOffset: isActive ? '-2.5px' : '0',
                  boxShadow: isActive ? `0 0 0 2px ${value}` : 'inset 0 0 0 1px rgba(0,0,0,0.04)',
                }}
              >
                {isActive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                  </div>
                )}
              </button>
            );
          })}

          {/* Custom Color Picker Container */}
          <div className="w-full aspect-square rounded-xl border border-dashed border-stone-200 bg-stone-50/30 overflow-hidden hover:border-stone-400 transition-colors [&>*]:w-full [&>*]:h-full">
            <ColorPicker color={activeColor} onChange={onColorChange} />
          </div>
        </div>
      </div>
    </div>
  );
}

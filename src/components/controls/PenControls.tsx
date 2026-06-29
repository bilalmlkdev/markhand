import { Palette } from 'lucide-react';
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
  '#000000',
];

const strokeWidths = [1, 2, 3, 5, 8, 12];

export function PenControls({
  activeColor,
  activeWidth,
  onColorChange,
  onWidthChange,
}: PenControlsProps) {
  return (
    <div className="space-y-4">
      {/* Active preview */}
      <div className="flex items-center justify-center py-2">
        <div
          className="rounded-full transition-all duration-150"
          style={{
            width: Math.min(activeWidth * 4, 32),
            height: Math.min(activeWidth * 4, 32),
            backgroundColor: activeColor,
            boxShadow: `0 0 0 2px white, 0 0 0 3px ${activeColor}20`,
          }}
        />
      </div>

      {/* Colors */}
      <div>
        <p className="text-[10px] font-medium text-stone-400 mb-2 flex items-center gap-1.5">
          <Palette className="w-3 h-3" />
          Color
        </p>
        <div className="flex items-center gap-1 flex-wrap">
          {colors.map(color => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className="relative w-7 h-7 rounded-lg transition-all duration-150 hover:scale-110 cursor-pointer"
              style={{ backgroundColor: color }}
            >
              {activeColor === color && (
                <div className="absolute inset-0 rounded-lg ring-2 ring-stone-800 ring-offset-1" />
              )}
            </button>
          ))}
          <ColorPicker color={activeColor} onChange={onColorChange} />
        </div>
      </div>

      {/* Stroke width */}
      <div>
        <p className="text-[10px] font-medium text-stone-400 mb-2">Width</p>
        <div className="space-y-0.5">
          {strokeWidths.map(width => {
            const isActive = activeWidth === width;
            return (
              <button
                key={width}
                onClick={() => onWidthChange(width)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-all duration-150 cursor-pointer ${
                  isActive ? 'bg-stone-100' : 'hover:bg-stone-50'
                }`}
              >
                <span
                  className={`text-xs font-medium w-5 text-right tabular-nums transition-colors ${
                    isActive ? 'text-stone-800' : 'text-stone-400'
                  }`}
                >
                  {width}
                </span>
                <div className="flex-1 flex items-center">
                  <div
                    className="w-full rounded-full transition-all duration-150"
                    style={{
                      height: Math.max(width * 1.2, 2),
                      backgroundColor: isActive ? activeColor : '#d6d3d1',
                    }}
                  />
                </div>
                <div
                  className={`w-2 h-2 rounded-full transition-all duration-150 ${
                    isActive ? 'scale-100 opacity-100' : 'scale-75 opacity-0'
                  }`}
                  style={{ backgroundColor: activeColor }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

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
    <div className="p-3 border-b border-stone-100">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
        <Palette className="w-3 h-3" />
        Pen
      </p>

      {/* Color swatches */}
      <div className="grid grid-cols-5 gap-1.5 mb-4">
        {colors.map(color => (
          <button
            key={color}
            onClick={() => onColorChange(color)}
            className="w-6 h-6 rounded-md border-2 transition-all hover:scale-110 cursor-pointer"
            style={{
              backgroundColor: color,
              borderColor: activeColor === color ? '#1c1917' : 'transparent',
              boxShadow: activeColor === color ? '0 0 0 1px white inset' : 'none',
            }}
          />
        ))}
        <ColorPicker color={activeColor} onChange={onColorChange} />
      </div>

      {/* Stroke widths */}
      <div className="space-y-1">
        {strokeWidths.map(width => (
          <button
            key={width}
            onClick={() => onWidthChange(width)}
            className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors cursor-pointer ${
              activeWidth === width ? 'bg-stone-100' : 'hover:bg-stone-50'
            }`}
          >
            <div
              className="rounded-full bg-current"
              style={{
                width: Math.min(width * 3, 24),
                height: Math.min(width * 3, 24),
              }}
            />
            <span className="text-xs text-stone-500">{width}px</span>
          </button>
        ))}
      </div>
    </div>
  );
}

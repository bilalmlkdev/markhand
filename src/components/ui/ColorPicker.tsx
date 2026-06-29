import { useRef } from 'react';
import { Plus } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ color, onChange }: ColorPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <button
        onClick={() => inputRef.current?.click()}
        className="w-7 h-7 rounded-lg border-2 border-dashed border-stone-300 flex items-center justify-center hover:border-stone-400 transition-colors cursor-pointer"
      >
        <Plus className="w-3 h-3 text-stone-400" />
      </button>
      <input
        ref={inputRef}
        type="color"
        value={color}
        onChange={e => onChange(e.target.value)}
        className="sr-only"
      />
    </>
  );
}

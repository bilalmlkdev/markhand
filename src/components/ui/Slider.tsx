interface SliderProps {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
}

export function Slider({ min, max, step, value, onChange, label }: SliderProps) {
  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between text-xs text-stone-500">
          <span>{label}</span>
          <span>{value}</span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-stone-800"
      />
    </div>
  );
}

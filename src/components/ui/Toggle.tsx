interface ToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  label: string;
  icon?: React.ReactNode;
}

export function Toggle({ pressed, onPressedChange, label, icon }: ToggleProps) {
  return (
    <button
      onClick={() => onPressedChange(!pressed)}
      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors cursor-pointer ${
        pressed ? 'bg-stone-100 text-stone-900 font-medium' : 'text-stone-500 hover:bg-stone-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

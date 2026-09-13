import { useEffect } from "react";
import {
  X,
  MousePointer2,
  Pencil,
  Circle,
  Paintbrush,
  PenTool,
  Eraser,
  Grid3X3,
  Undo2,
  Redo2,
  Trash2,
} from "lucide-react";

interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
}

const tools = [
  { icon: MousePointer2, label: "Select", key: "1" },
  { icon: Pencil, label: "Pencil", key: "2" },
  { icon: Circle, label: "Dot", key: "3" },
  { icon: Paintbrush, label: "Brush", key: "4" },
  { icon: PenTool, label: "Pen", key: "5" },
  { icon: Eraser, label: "Eraser", key: "E" },
];

const actions = [
  { icon: Grid3X3, label: "Guide", key: "G" },
  { icon: Undo2, label: "Undo", key: "⌘ Z" },
  { icon: Redo2, label: "Redo", key: "⌘ ⇧ Z" },
  { icon: Trash2, label: "Clear", key: "Del" },
];

function Key({ children }: { children: string }) {
  return (
    <kbd className="inline-flex h-5 min-w-[20px] items-center justify-center rounded bg-stone-100 px-1.5 font-mono text-[10px] font-medium text-stone-600">
      {children}
    </kbd>
  );
}

export function InstructionsModal({ open, onClose }: InstructionsModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Flat overlay */}
      <button
        type="button"
        aria-label="Close instructions"
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/20"
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
        className="relative w-full max-w-[420px] rounded-xl border border-stone-200 bg-white p-6"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <h2
            id="instructions-title"
            className="text-base font-medium tracking-tight text-stone-900"
          >
            Markhand Instructions
          </h2>
          <button
            onClick={onClose}
            className="-mr-1.5 -mt-1.5 p-1.5 text-stone-400 transition-colors hover:text-stone-900"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Intro Wording */}
        <p className="mb-6 text-[13px] leading-relaxed text-stone-600">
          Markhand is designed to keep you focused on the canvas. Instead of navigating menus, control your workflow instantly using the keyboard shortcuts below.
        </p>

        {/* Content Grid */}
        <div className="mb-6 grid grid-cols-2 gap-x-8">
          {/* Tools List */}
          <div>
            <h3 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-stone-400">
              Tools
            </h3>
            <ul className="flex flex-col gap-2.5">
              {tools.map(({ icon: Icon, label, key }) => (
                <li key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-stone-700">
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    <span className="text-[13px]">{label}</span>
                  </div>
                  <Key>{key}</Key>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions List */}
          <div>
            <h3 className="mb-3 text-[10px] font-medium uppercase tracking-widest text-stone-400">
              Actions
            </h3>
            <ul className="flex flex-col gap-2.5">
              {actions.map(({ icon: Icon, label, key }) => (
                <li key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 text-stone-700">
                    <Icon className="size-3.5" strokeWidth={1.5} />
                    <span className="text-[13px]">{label}</span>
                  </div>
                  <Key>{key}</Key>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Wording */}
        <div className="border-t border-stone-100 pt-4">
          <p className="text-[12px] leading-relaxed text-stone-500">
            Future updates will introduce shapes, typography, and highlighters. Press <span className="font-mono text-[10px] bg-stone-100 px-1 py-0.5 rounded">ESC</span> to close.
          </p>
        </div>
      </section>
    </div>
  );
}

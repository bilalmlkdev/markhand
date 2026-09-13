import {
  X,
  Sparkles,
  MousePointer2,
  Grid3X3,
  History,
  Palette,
} from "lucide-react";

interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ShortcutRow {
  label: string;
  keys: string[];
}

const sections: {
  title: string;
  icon: React.ReactNode;
  rows: ShortcutRow[];
}[] = [
  {
    title: "Tools",
    icon: <MousePointer2 className="w-3.5 h-3.5 shrink-0" />,
    rows: [
      { label: "Crosshair", keys: ["1"] },
      { label: "Pencil", keys: ["2"] },
      { label: "Dot", keys: ["3"] },
      { label: "Brush", keys: ["4"] },
      { label: "Pen", keys: ["5"] },
      { label: "Toggle eraser", keys: ["E"] },
    ],
  },
  {
    title: "Guides",
    icon: <Grid3X3 className="w-3.5 h-3.5 shrink-0" />,
    rows: [{ label: "Cycle guide pattern", keys: ["G"] }],
  },
  {
    title: "History",
    icon: <History className="w-3.5 h-3.5 shrink-0" />,
    rows: [
      { label: "Undo", keys: ["Ctrl", "Z"] },
      { label: "Redo", keys: ["Ctrl", "Shift", "Z"] },
      { label: "Clear canvas", keys: ["Delete"] },
    ],
  },
];

function KeyCap({ children }: { children: string }) {
  return (
    <kbd className="min-w-[22px] px-1.5 h-6 flex items-center justify-center rounded-md bg-stone-100 border border-stone-200/80 shadow-[0_1px_0_rgba(0,0,0,0.04)] text-[11px] font-semibold text-stone-600">
      {children}
    </kbd>
  );
}

export function InstructionsModal({ open, onClose }: InstructionsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200/70 w-full sm:w-[420px] max-w-[95vw] max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-stone-100 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-[15px] font-semibold text-stone-900">
            How to use Markhand
          </h2>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Draw with your mouse, trackpad, or stylus. Everything below lives in
            the dock at the bottom of the screen, hover any icon there for a
            quick label.
          </p>
        </div>

        <div className="p-5 space-y-5 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-1.5 mb-2.5 leading-none">
                <span className="text-stone-300 w-4 h-4 inline-flex items-center justify-center shrink-0 leading-none">{section.icon}</span>
                <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                  {section.title}
                </h3>
              </div>
              <div className="space-y-2">
                {section.rows.map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-stone-700">{row.label}</span>
                    <div className="flex items-center gap-1">
                      {row.keys.map((k, i) => (
                        <span key={k} className="flex items-center gap-1">
                          <KeyCap>{k}</KeyCap>
                          {i < row.keys.length - 1 && (
                            <span className="text-stone-300 text-xs">+</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div>
            <div className="flex items-center gap-1.5 mb-2.5 leading-none">
              <span className="text-stone-300">
                <Palette className="w-3.5 h-3.5 shrink-0" />
              </span>
              <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                Style, theme &amp; sharing
              </h3>
            </div>
            <p className="text-sm text-stone-600 leading-relaxed">
              The color swatch and theme swatch in the dock open pickers for pen
              color, line weight, and canvas background. Share and Export live
              in the dock too, next to the Gallery and GitHub links.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

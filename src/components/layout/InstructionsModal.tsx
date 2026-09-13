import {
  X,
  Sparkles,
  Crosshair,
  Pencil,
  Circle,
  Paintbrush,
  PenTool,
  Eraser,
  Grid3X3,
  Undo2,
  Redo2,
  Trash2,
  Palette,
  MousePointerClick,
  Square,
  Type,
  Highlighter,
} from "lucide-react";

interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
}

interface ToolItem {
  label: string;
  keys: string[];
  icon: React.ReactNode;
}

const tools: ToolItem[] = [
  { label: "Crosshair", keys: ["1"], icon: <Crosshair className="size-4" /> },
  { label: "Pencil", keys: ["2"], icon: <Pencil className="size-4" /> },
  { label: "Dot", keys: ["3"], icon: <Circle className="size-4" /> },
  { label: "Brush", keys: ["4"], icon: <Paintbrush className="size-4" /> },
  { label: "Pen", keys: ["5"], icon: <PenTool className="size-4" /> },
  { label: "Eraser", keys: ["E"], icon: <Eraser className="size-4" /> },
];

interface ShortcutRow {
  label: string;
  keys: string[];
  icon: React.ReactNode;
}

const otherShortcuts: ShortcutRow[] = [
  { label: "Cycle guide pattern", keys: ["G"], icon: <Grid3X3 className="size-4" /> },
  { label: "Undo", keys: ["Ctrl", "Z"], icon: <Undo2 className="size-4" /> },
  { label: "Redo", keys: ["Ctrl", "Shift", "Z"], icon: <Redo2 className="size-4" /> },
  { label: "Clear canvas", keys: ["Delete"], icon: <Trash2 className="size-4" /> },
];

const comingSoonFeatures = [
  {
    label: "Select",
    description: "Move and transform strokes",
    icon: <MousePointerClick className="size-4" />,
  },
  {
    label: "Shapes",
    description: "Draw circles, boxes, and arrows",
    icon: <Square className="size-4" />,
  },
  {
    label: "Text",
    description: "Add editable text to the canvas",
    icon: <Type className="size-4" />,
  },
  {
    label: "Highlighter",
    description: "Mark up ideas with soft ink",
    icon: <Highlighter className="size-4" />,
  },
];

function KeyCap({ children }: { children: string }) {
  return (
    <kbd className="inline-flex min-w-[22px] h-6 items-center justify-center rounded-md border border-stone-200 bg-stone-50 px-1.5 text-[11px] font-semibold text-stone-600 shadow-[inset_0_-1px_0_rgba(0,0,0,0.03)]">
      {children}
    </kbd>
  );
}

function KeyChip({ keys }: { keys: string[] }) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      {keys.map((key, index) => (
        <span key={`${key}-${index}`} className="flex items-center gap-1">
          <KeyCap>{key}</KeyCap>
          {index < keys.length - 1 && (
            <span className="text-[10px] text-stone-300">+</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function InstructionsModal({ open, onClose }: InstructionsModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-stone-950/20 backdrop-blur-[3px]"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="instructions-title"
        className="relative flex max-h-[88vh] w-full max-w-[500px] flex-col overflow-hidden rounded-[24px] border border-stone-200/80 bg-white shadow-[0_24px_80px_rgba(0,0,0,0.12)]"
      >
        <header className="relative shrink-0 px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close instructions"
            className="absolute right-5 top-5 inline-flex size-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 sm:right-6 sm:top-6"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-2 text-stone-400">
            <Sparkles className="size-3.5" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
              Markhand guide
            </span>
          </div>

          <h2
            id="instructions-title"
            className="mt-3 pr-10 text-[20px] font-semibold tracking-[-0.02em] text-stone-950 sm:text-[22px]"
          >
            How to use Markhand
          </h2>
          <p className="mt-2 max-w-[430px] text-[12px] leading-[1.65] text-stone-400 sm:text-[13px]">
            Draw with your mouse, trackpad, or stylus. Most controls live in the
            dock at the bottom of the canvas.
          </p>
        </header>

        <div className="overflow-y-auto px-6 pb-7 sm:px-7">
          <div className="h-px bg-stone-100" />

          {/* Tools — icon grid, matches the dock's own visual language */}
          <div className="py-6">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
              Tools
            </h3>
            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
              {tools.map((tool) => (
                <div
                  key={tool.label}
                  className="flex items-center gap-2.5 rounded-xl bg-stone-50 px-2.5 py-2.5"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-stone-500 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {tool.icon}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-stone-700">
                    {tool.label}
                  </span>
                  <KeyChip keys={tool.keys} />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          {/* Everything-else shortcuts */}
          <div className="py-5">
            <h3 className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-400">
              Shortcuts
            </h3>
            <div className="space-y-1">
              {otherShortcuts.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center gap-3 rounded-xl px-1 py-1.5"
                >
                  <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg bg-stone-50 text-stone-400">
                    {row.icon}
                  </span>
                  <span className="min-w-0 flex-1 text-[13px] text-stone-700 sm:text-sm">
                    {row.label}
                  </span>
                  <KeyChip keys={row.keys} />
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-stone-100" />

          <div className="py-5">
            <div className="mb-3 flex items-center gap-2 text-stone-400">
              <span className="inline-flex size-4 items-center justify-center leading-none">
                <Palette className="size-3.5" />
              </span>
              <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                Style, theme &amp; sharing
              </h3>
            </div>
            <p className="max-w-[430px] text-[13px] leading-[1.7] text-stone-500 sm:text-sm">
              Use the color, line weight, and theme controls in the dock to
              adjust the drawing. Share and Export sit alongside Gallery and
              GitHub.
            </p>
          </div>

          <div className="h-px bg-stone-100" />

          <div className="py-5">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-stone-400">
                <span className="inline-flex size-4 items-center justify-center leading-none">
                  <Sparkles className="size-3.5" />
                </span>
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.15em]">
                  Coming soon
                </h3>
              </div>
              <span className="text-[9px] font-semibold uppercase tracking-[0.13em] text-stone-300">
                In development
              </span>
            </div>

            <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {comingSoonFeatures.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-3 rounded-xl bg-stone-50 px-2.5 py-2.5"
                >
                  <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-stone-400 shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                    {feature.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-[12.5px] font-medium text-stone-700">
                        {feature.label}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[10.5px] leading-relaxed text-stone-400">
                      {feature.description}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full border border-stone-200 bg-white px-1.5 py-0.5 text-[8.5px] font-semibold uppercase tracking-wide text-stone-400">
                    Soon
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

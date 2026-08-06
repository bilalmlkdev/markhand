import { useEffect, useState } from "react";
import {
  X,
  PenLine,
  Palette,
  Grid3X3,
  Download,
  Undo2,
  MousePointer2,
  RefreshCw,
} from "lucide-react";
import { Button } from "../ui/Button";

interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
  showOnFirstVisit?: boolean;
}

const STORAGE_KEY = "markhand_instructions_seen";

export function hasSeenInstructions(): boolean {
  return localStorage.getItem(STORAGE_KEY) === "true";
}

export function markInstructionsSeen(): void {
  localStorage.setItem(STORAGE_KEY, "true");
}

const steps = [
  {
    icon: <PenLine className="w-5 h-5" />,
    title: "Draw freely",
    description:
      "Use your mouse, trackpad, or touch to draw directly on the canvas. Your strokes appear instantly.",
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: "Customize your pen",
    description:
      "Open the floating panel (bottom-right) to change pen color and stroke width. Switch to the Theme tab to change canvas background.",
  },
  {
    icon: <MousePointer2 className="w-5 h-5" />,
    title: "Pick a cursor",
    description:
      "Use the left-side pills to choose from 5 cursor styles — Crosshair, Pencil, Dot, Brush, or Pen.",
  },
  {
    icon: <Grid3X3 className="w-5 h-5" />,
    title: "Toggle guides",
    description:
      "Use the top-center pills to switch between Dot Grid, Line Grid, Ruled Lines, or No Guide.",
  },
  {
    icon: <Undo2 className="w-5 h-5" />,
    title: "Undo & Redo",
    description:
      "Made a mistake? Use the Undo button in the header. You can also clear the entire canvas.",
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: "Export your work",
    description:
      "Click Export to open the export modal. Choose PNG or SVG format, pick a background, and download, copy, or print your signature.",
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: "Reset anytime",
    description:
      "Want a fresh start? Use the Reset button in the header to clear all saved data and reload the app.",
  },
];

export function InstructionsModal({
  open,
  onClose,
  showOnFirstVisit = false,
}: InstructionsModalProps) {
  const [step, setStep] = useState(0);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === "Enter") {
        e.preventDefault();
        if (step < steps.length - 1) {
          setStep((s) => s + 1);
        } else {
          onClose();
        }
        return;
      }

      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setStep((s) => Math.min(s + 1, steps.length - 1));
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setStep((s) => Math.max(s - 1, 0));
        return;
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKey);
    }
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose, step]);

  // Reset step when opened
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  if (!open) return null;

  const current = steps[step]!;

  return (
    <div className="fixed inset-0 z-99999 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200 w-full sm:w-[400px] max-w-[95vw] mx-2 p-6 pt-10">
        {/* Close button (top-right) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 transition-colors cursor-pointer text-stone-400"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
            Step {step + 1} of {steps.length}
          </span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === step ? "bg-stone-900" : "bg-stone-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-700">
            {current.icon}
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-stone-800">
              {current.title}
            </h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">
              {current.description}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-stone-100">
          <Button
            variant="ghost"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep((s) => s - 1)}
          >
            Back
          </Button>
          {step < steps.length - 1 ? (
            <Button
              variant="default"
              size="sm"
              onClick={() => setStep((s) => s + 1)}
            >
              Next
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={onClose}>
              {showOnFirstVisit ? "Get Started" : "Done"}
            </Button>
          )}
        </div>

        {/* Keyboard hints (very subtle) */}
        <div className="mt-4 flex justify-center gap-4 text-[10px] text-stone-400">
          <span>← →</span>
          <span>Enter</span>
          <span>Esc</span>
        </div>
      </div>
    </div>
  );
}

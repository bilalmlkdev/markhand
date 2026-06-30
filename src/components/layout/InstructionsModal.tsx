import { useEffect, useState } from 'react';
import {
  X,
  PenLine,
  Palette,
  Grid3X3,
  Download,
  Undo2,
  MousePointer2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface InstructionsModalProps {
  open: boolean;
  onClose: () => void;
  showOnFirstVisit?: boolean;
}

const SESSION_KEY = 'markhand_instructions_seen';

export function hasSeenInstructions(): boolean {
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}

export function markInstructionsSeen(): void {
  sessionStorage.setItem(SESSION_KEY, 'true');
}

const steps = [
  {
    icon: <PenLine className="w-5 h-5" />,
    title: 'Draw freely',
    description:
      'Use your mouse, trackpad, or touch to draw directly on the canvas. Your strokes appear instantly.',
  },
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Customize your pen',
    description:
      'Open the floating panel (bottom-right) to change pen color and stroke width. Switch to the Theme tab to change canvas background.',
  },
  {
    icon: <MousePointer2 className="w-5 h-5" />,
    title: 'Pick a cursor',
    description:
      'Use the left-side pills to choose from 5 cursor styles — Crosshair, Pencil, Dot, Brush, or Pen.',
  },
  {
    icon: <Grid3X3 className="w-5 h-5" />,
    title: 'Toggle guides',
    description:
      'Use the top-center pills to switch between Dot Grid, Line Grid, Ruled Lines, or No Guide.',
  },
  {
    icon: <Undo2 className="w-5 h-5" />,
    title: 'Undo & Redo',
    description:
      'Made a mistake? Use the Undo button in the header. You can also clear the entire canvas.',
  },
  {
    icon: <Download className="w-5 h-5" />,
    title: 'Export your work',
    description:
      'Click Export to open the export modal. Choose PNG or SVG format, pick a background, and download, copy, or print your signature.',
  },
  {
    icon: <RefreshCw className="w-5 h-5" />,
    title: 'Reset anytime',
    description:
      'Want a fresh start? Use the Reset button in the header to clear all saved data and reload the app.',
  },
];

export function InstructionsModal({
  open,
  onClose,
  showOnFirstVisit = false,
}: InstructionsModalProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') setStep(s => Math.min(s + 1, steps.length - 1));
      if (e.key === 'ArrowLeft') setStep(s => Math.max(s - 1, 0));
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  // Reset step when opened
  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  if (!open) return null;

  const current = steps[step]!;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-[400px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-800">
            {showOnFirstVisit ? 'Welcome to Markhand' : 'How to use Markhand'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="px-4 pt-4 flex items-center justify-between">
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
            {step + 1} of {steps.length}
          </span>
          <div className="flex gap-1">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === step ? 'bg-stone-900' : 'bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-center min-h-[176px] flex flex-col items-center justify-center">
          <div className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto text-stone-700">
            {current.icon}
          </div>

          <div className="space-y-2">
            <h3 className="text-base font-semibold text-stone-800">{current.title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed">{current.description}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 pb-4 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={step === 0}
            onClick={() => setStep(s => s - 1)}
          >
            Back
          </Button>
          <div className="flex-1" />
          {step < steps.length - 1 ? (
            <Button variant="default" size="sm" onClick={() => setStep(s => s + 1)}>
              Next
            </Button>
          ) : (
            <Button variant="default" size="sm" onClick={onClose}>
              {showOnFirstVisit ? 'Get Started' : 'Done'}
            </Button>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex justify-center gap-4 text-[10px] text-stone-400">
          <span>← → arrow keys</span>
          <span>Esc to close</span>
        </div>
      </div>
    </div>
  );
}

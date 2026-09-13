import { LogOut, ShieldCheck, X } from "lucide-react";
import { Button } from "../ui/Button";

interface ExitConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ExitConfirmModal({
  open,
  onClose,
  onConfirm,
}: ExitConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-full sm:w-[400px] max-w-[95vw] overflow-hidden pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <LogOut className="w-4 h-4 text-stone-500" />
            <h2 className="text-sm font-semibold text-stone-800">
              Exit Markhand
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Keep drawing"
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>
        <div className="p-4 sm:p-5">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-50">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-800">
                Your drawing is safely saved.
              </p>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                Everything you've drawn has been saved to the gallery in this
                browser. Closing now won't lose anything.
              </p>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-5 pb-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Keep drawing
          </Button>
          <Button variant="default" className="flex-1" onClick={onConfirm}>
            <LogOut className="w-4 h-4" />
            Close window
          </Button>
        </div>
      </div>
    </div>
  );
}
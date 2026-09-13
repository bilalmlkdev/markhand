import { AlertTriangle, RefreshCw, X } from "lucide-react";
import { Button } from "../ui/Button";

interface ResetConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ResetConfirmModal({
  open,
  onClose,
  onConfirm,
}: ResetConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-full sm:w-[360px] max-w-[95vw] overflow-hidden pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-stone-800">
              Reset All Data
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <p className="text-sm text-stone-600 leading-relaxed">
            This will reset your settings and clear the current drawing. Your
            other saved drawings will remain.
          </p>
          <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700">
            Your current drawing will be cleared and a new drawing ID will be
            created.
          </div>
        </div>
        <div className="px-4 pb-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1 text-white bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            <RefreshCw className="w-4 h-4" />
            Reset All
          </Button>
        </div>
      </div>
    </div>
  );
}

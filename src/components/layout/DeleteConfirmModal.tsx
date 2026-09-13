import { Trash2, X } from "lucide-react";
import { Button } from "../ui/Button";

interface DeleteConfirmModalProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-full sm:w-[380px] max-w-[95vw] overflow-hidden pointer-events-auto">
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-500" />
            <h2 className="text-sm font-semibold text-stone-800">{title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Cancel"
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>
        <div className="p-4 sm:p-5">
          <p className="text-sm leading-relaxed text-stone-600">{description}</p>
        </div>
        <div className="px-4 sm:px-5 pb-4 flex gap-2">
          <Button variant="ghost" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1 bg-red-600 hover:bg-red-700"
            onClick={onConfirm}
          >
            <Trash2 className="w-4 h-4" />
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
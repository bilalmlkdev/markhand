import { Undo2, Redo2, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface CanvasControlsProps {
  canUndo: boolean;
  canRedo: boolean;
  isEmpty: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
}

export function CanvasControls({
  canUndo,
  canRedo,
  isEmpty,
  onUndo,
  onRedo,
  onClear,
}: CanvasControlsProps) {
  return (
    <div className="p-3 border-b border-stone-100">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
        Canvas
      </p>
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          disabled={!canUndo}
          onClick={onUndo}
        >
          <Undo2 className="w-3.5 h-3.5" />
          <span className="text-xs">Undo</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          disabled={!canRedo}
          onClick={onRedo}
        >
          <Redo2 className="w-3.5 h-3.5" />
          <span className="text-xs">Redo</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-500 hover:text-red-600"
          disabled={isEmpty}
          onClick={onClear}
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="text-xs">Clear</span>
        </Button>
      </div>
    </div>
  );
}

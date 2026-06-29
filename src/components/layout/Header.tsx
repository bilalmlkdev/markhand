import { useState } from 'react';
import { PenLine, Undo2, Redo2, Trash2, Download, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { ExportModal } from '../exports/ExportModal';
import type { UseDrawReturn } from '../../hooks/useDraw';

interface HeaderProps {
  drawHook: UseDrawReturn;
}

export function Header({ drawHook }: HeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { strokes, isEmpty, undo, redo, clear, getCanvas } = drawHook;

  const canUndo = strokes.length > 0;
  const canRedo = false;

  const canvas = getCanvas();
  const canvasWidth = canvas?.getBoundingClientRect().width ?? 800;
  const canvasHeight = canvas?.getBoundingClientRect().height ?? 500;

  const handleCopy = async () => {
    if (isEmpty) return;
    const c = getCanvas();
    if (!c) return;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = c.width;
    tempCanvas.height = c.height;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    strokes.forEach(s => {
      if (s.points.length < 2) return;
      tempCtx.beginPath();
      tempCtx.moveTo(s.points[0]!.x, s.points[0]!.y);
      for (let i = 1; i < s.points.length; i++) {
        tempCtx.lineTo(s.points[i]!.x, s.points[i]!.y);
      }
      tempCtx.strokeStyle = s.color;
      tempCtx.lineWidth = s.width;
      tempCtx.lineCap = 'round';
      tempCtx.lineJoin = 'round';
      tempCtx.stroke();
    });

    tempCanvas.toBlob(async blob => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    }, 'image/png');
  };

  return (
    <>
      <header className="h-12 min-h-[48px] border-b border-stone-200 px-4 flex items-center justify-between bg-white">
        {/* Left: Brand */}
        <div className="flex items-center gap-2">
          <PenLine className="w-5 h-5 text-stone-700" />
          <h1 className="text-lg font-semibold tracking-tight">Markhand</h1>
        </div>

        {/* Center: Actions */}
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            disabled={!canUndo}
            onClick={undo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canRedo}
            onClick={redo}
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-stone-200 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            disabled={isEmpty}
            onClick={clear}
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </Button>

          <div className="w-px h-5 bg-stone-200 mx-1" />

          <Button
            variant="ghost"
            size="icon"
            disabled={isEmpty}
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            disabled={isEmpty}
            onClick={() => setExportOpen(true)}
            title="Export signature"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Version */}
        <span className="text-xs text-stone-400 w-[60px] text-right">v1.0.0</span>
      </header>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        strokes={strokes}
        width={canvasWidth}
        height={canvasHeight}
      />
    </>
  );
}

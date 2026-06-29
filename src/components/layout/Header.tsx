import { useState } from 'react';
import {
  PenLine,
  Undo2,
  Redo2,
  Trash2,
  Download,
  Copy,
  Check,
  Info,
  Coffee,
  Heart,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ExportModal } from '../exports/ExportModal';
import { ProjectModal } from './ProjectModal';
import type { UseDrawReturn } from '../../hooks/useDraw';
import type { CanvasTheme } from '../../types';
import { FiGithub } from 'react-icons/fi';

interface HeaderProps {
  drawHook: UseDrawReturn;
  theme: CanvasTheme;
  guideType: GuideType;
}

export function Header({ drawHook, theme, guideType }: HeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
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
          <Button variant="ghost" size="icon" disabled={!canUndo} onClick={undo} title="Undo">
            <Undo2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled={!canRedo} onClick={redo} title="Redo">
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
            title="Export"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {/* Right: Support + Info */}
        <div className="flex items-center gap-0.5">
          <a
            href="https://www.buymeacoffee.com/bilalmlkdev"
            target="_blank"
            rel="noopener noreferrer"
            title="Buy me a coffee"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-amber-50 text-stone-400 hover:text-amber-600 transition-colors"
          >
            <Coffee className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/sponsors/byllzz"
            target="_blank"
            rel="noopener noreferrer"
            title="Sponsor on GitHub"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-pink-50 text-stone-400 hover:text-pink-500 transition-colors"
          >
            <Heart className="w-4 h-4" />
          </a>
          <a
            href="https://github.com/byllzz/markhand"
            target="_blank"
            rel="noopener noreferrer"
            title="View on GitHub"
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
          >
            <FiGithub className="w-4 h-4" />
          </a>
          <div className="w-px h-5 bg-stone-200 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setProjectOpen(true)}
            title="About Markhand"
          >
            <Info className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        strokes={strokes}
        width={canvasWidth}
        height={canvasHeight}
        theme={theme}
        guideType={guideType}
      />

      <ProjectModal open={projectOpen} onClose={() => setProjectOpen(false)} />
    </>
  );
}

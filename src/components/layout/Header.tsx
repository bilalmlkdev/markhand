import { useState } from 'react';
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  Copy,
  Check,
  Info,
  Coffee,
  Heart,
  RefreshCw,
  AlertTriangle,
  X,
  Share2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ExportModal } from '../exports/ExportModal';
import { InstructionsModal } from './InstructionsModal';
import { ShareModal } from './ShareModal';
import type { UseDrawReturn } from '../../hooks/useDraw';
import type { CanvasTheme, GuideType } from '../../types';
import { FiGithub } from 'react-icons/fi';
import logo from '/logo.svg';

interface HeaderProps {
  drawHook: UseDrawReturn;
  theme: CanvasTheme;
  guideType: GuideType;
  onToggleInstructions: () => void;
  instructionsOpen: boolean;
}

type ConfirmType = 'reset' | 'clear' | null;

export function Header({
  drawHook,
  theme,
  guideType,
  onToggleInstructions,
  instructionsOpen,
}: HeaderProps) {
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);

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

  const handleReset = () => {
    localStorage.removeItem('markhand_strokes');
    localStorage.removeItem('markhand_color');
    localStorage.removeItem('markhand_width');
    localStorage.removeItem('markhand_has_drawn');
    localStorage.removeItem('markhand_theme');
    localStorage.removeItem('markhand_guide');
    localStorage.removeItem('markhand_cursor');
    localStorage.removeItem('markhand_panel_collapsed');
    localStorage.removeItem('markhand_panel_x');
    localStorage.removeItem('markhand_panel_y');
    window.location.reload();
  };

  const handleClear = () => {
    clear();
    setConfirmType(null);
  };

  const closeConfirm = () => setConfirmType(null);

  return (
    <>
      <header className="h-12 min-h-[48px] border-b border-stone-200 px-4 flex items-center justify-between bg-white">
        {/* Left: Brand */}
        <div className="flex items-center">
          <img src={logo} className="w-6 h-6" alt="markhand header logo" />
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
            onClick={() => setConfirmType('clear')}
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <div className="w-px h-5 bg-stone-200 mx-1" />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setConfirmType('reset')}
            title="Reset all data"
          >
            <RefreshCw className="w-4 h-4" />
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
            onClick={() => setShareOpen(true)}
            title="Share drawing"
          >
            <Share2 className="w-4 h-4" />
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
            onClick={onToggleInstructions}
            title="How to use Markhand"
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

      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        strokes={strokes}
        isEmpty={isEmpty}
      />

      <InstructionsModal open={instructionsOpen} onClose={onToggleInstructions} />

      {/* Confirmation Modal */}
      {confirmType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={closeConfirm} />
          <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-[360px] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-semibold text-stone-800">
                  {confirmType === 'clear' ? 'Clear Canvas' : 'Reset All Data'}
                </h2>
              </div>
              <button
                onClick={closeConfirm}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {confirmType === 'clear' ? (
                <p className="text-sm text-stone-600 leading-relaxed">
                  This will remove all strokes from the canvas.
                </p>
              ) : (
                <>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    This will permanently delete all your saved drawings, settings, and preferences.
                    This action cannot be undone.
                  </p>
                  <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700">
                    All localStorage data for Markhand will be cleared. The page will reload
                    afterward.
                  </div>
                </>
              )}
            </div>

            <div className="px-4 pb-4 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={closeConfirm}>
                Cancel
              </Button>
              <Button
                variant="default"
                className={`flex-1 text-white ${
                  confirmType === 'clear'
                    ? 'bg-stone-900 hover:bg-stone-800'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                onClick={confirmType === 'clear' ? handleClear : handleReset}
              >
                {confirmType === 'clear' ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear Canvas
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Reset All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

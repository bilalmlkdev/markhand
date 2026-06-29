import { PenControls } from '../controls/PenControls';
import { CanvasControls } from '../controls/CanvasControls';
import { GuideOverlay } from '../canvas/GuideOverlay';
import { ExportPanel } from '../exports/ExportPanel';
import type { useDraw } from '../../hooks/useDraw';
import type { GuideType } from '../../types';
import { generateSVG } from '../../lib/export';

interface SidebarProps {
  drawHook: ReturnType<typeof useDraw>;
  guideType: GuideType;
  onGuideChange: (guide: GuideType) => void;
}

export function Sidebar({ drawHook, guideType, onGuideChange }: SidebarProps) {
  const {
    currentColor,
    currentWidth,
    setCurrentColor,
    setCurrentWidth,
    strokes,
    isEmpty,
    undo,
    redo,
    clear,
    getCanvas,
  } = drawHook;

  const canUndo = strokes.length > 0;
  const canRedo = false;

  const handleExportPNG = () => {
    const canvas = getCanvas();
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = 'markhand-signature.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleExportSVG = () => {
    const canvas = getCanvas();
    if (!canvas || strokes.length === 0) return;
    const { width, height } = canvas.getBoundingClientRect();
    const svg = generateSVG(strokes, width, height);
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'markhand-signature.svg';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <aside className="w-[180px] min-w-[180px] border-r border-stone-200 bg-white flex flex-col overflow-y-auto">
      <PenControls
        activeColor={currentColor}
        activeWidth={currentWidth}
        onColorChange={setCurrentColor}
        onWidthChange={setCurrentWidth}
      />
      <CanvasControls
        canUndo={canUndo}
        canRedo={canRedo}
        isEmpty={isEmpty}
        onUndo={undo}
        onRedo={redo}
        onClear={clear}
      />
      <GuideOverlay activeGuide={guideType} onChange={onGuideChange} />
      <ExportPanel isEmpty={isEmpty} onExportPNG={handleExportPNG} onExportSVG={handleExportSVG} />
    </aside>
  );
}

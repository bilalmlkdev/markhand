import { PenControls } from '../controls/PenControls';
import { CanvasControls } from '../controls/CanvasControls';
import { GuideControls } from '../controls/GuideControls';
import { ExportPanel } from '../exports/ExportPanel';
import { useDraw } from '../../hooks/useDraw';
import type { GuideType } from '../../types';

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
    isEmpty,
    undo,
    redo,
    clear,
    strokes,
  } = drawHook;

  const canUndo = strokes.length > 0;
  const canRedo = false; // redo stack managed internally in useDraw for now

  const handleExportPNG = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'signature.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleExportSVG = () => {
    // SVG export will be wired later
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
      <GuideControls />
      <ExportPanel isEmpty={isEmpty} onExportPNG={handleExportPNG} onExportSVG={handleExportSVG} />
    </aside>
  );
}

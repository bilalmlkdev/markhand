import { useState } from 'react';
import { PenControls } from '../controls/PenControls';
import { CanvasControls } from '../controls/CanvasControls';
import { GuideOverlay } from '../canvas/GuideOverlay';
import { ExportPanel } from '../exports/ExportPanel';
import { ExportModal } from '../exports/ExportModal';
import type { useDraw } from '../../hooks/useDraw';
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
    strokes,
    isEmpty,
    undo,
    redo,
    clear,
    getCanvas,
  } = drawHook;

  const [modalOpen, setModalOpen] = useState(false);
  const canvas = getCanvas();
  const canvasWidth = canvas?.getBoundingClientRect().width ?? 800;
  const canvasHeight = canvas?.getBoundingClientRect().height ?? 500;

  const canUndo = strokes.length > 0;
  const canRedo = false;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  return (
    <>
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
        <ExportPanel isEmpty={isEmpty} onOpenModal={handleOpenModal} />
      </aside>

      <ExportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        strokes={strokes}
        width={canvasWidth}
        height={canvasHeight}
      />
    </>
  );
}

import { useState } from 'react';
import { X, GripHorizontal, Palette } from 'lucide-react';
import { PenControls } from '../controls/PenControls';
import type { UseDrawReturn } from '../../hooks/useDraw';

interface FloatingPanelProps {
  drawHook: UseDrawReturn;
}

export function FloatingPanel({ drawHook }: FloatingPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [position, setPosition] = useState({ x: 16, y: 60 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const { currentColor, currentWidth, setCurrentColor, setCurrentWidth } = drawHook;

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleDragEnd = () => {
    setDragging(false);
  };

  if (collapsed) {
    return (
      <div className="absolute z-40" style={{ left: position.x, top: position.y }}>
        <button
          onClick={() => setCollapsed(false)}
          className="w-9 h-9 bg-white rounded-full shadow-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors cursor-pointer"
          title="Open pen settings"
        >
          <Palette className="w-4 h-4 text-stone-600" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute z-40 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden w-[190px] select-none"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Drag handle */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-stone-50 border-b border-stone-100 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-1.5">
          <GripHorizontal className="w-3.5 h-3.5 text-stone-400" />
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
            Pen
          </span>
        </div>
        <button
          onClick={e => {
            e.stopPropagation();
            setCollapsed(true);
          }}
          className="w-5 h-5 flex items-center justify-center rounded hover:bg-stone-200 transition-colors cursor-pointer"
        >
          <X className="w-3 h-3 text-stone-400" />
        </button>
      </div>

      {/* Content */}
      <div className="p-3">
        <PenControls
          activeColor={currentColor}
          activeWidth={currentWidth}
          onColorChange={setCurrentColor}
          onWidthChange={setCurrentWidth}
        />
      </div>
    </div>
  );
}

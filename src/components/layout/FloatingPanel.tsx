import { useState } from 'react';
import { X, GripHorizontal, Palette, Grid3X3 } from 'lucide-react';
import { PenControls } from '../controls/PenControls';
import { GuideOverlay } from '../canvas/GuideOverlay';
import type { UseDrawReturn } from '../../hooks/useDraw';
import type { GuideType } from '../../types';

interface FloatingPanelProps {
  drawHook: UseDrawReturn;
  guideType: GuideType;
  onGuideChange: (guide: GuideType) => void;
}

export function FloatingPanel({ drawHook, guideType, onGuideChange }: FloatingPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'pen' | 'guides'>('pen');
  const [position, setPosition] = useState({ x: 16, y: 16 });
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
          title="Open tools"
        >
          <Palette className="w-4 h-4 text-stone-600" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute z-40 bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden w-[200px] select-none"
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
            Tools
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

      {/* Tabs */}
      <div className="flex border-b border-stone-100">
        {(
          [
            { id: 'pen', label: 'Pen', icon: <Palette className="w-3 h-3" /> },
            { id: 'guides', label: 'Guides', icon: <Grid3X3 className="w-3 h-3" /> },
          ] as const
        ).map(tab => (
          <button
            key={tab.id}
            onClick={e => {
              e.stopPropagation();
              setActiveTab(tab.id);
            }}
            className={`flex-1 flex items-center justify-center gap-1 py-2 text-[10px] font-medium transition-colors cursor-pointer ${
              activeTab === tab.id
                ? 'bg-white text-stone-900 border-b-2 border-stone-900'
                : 'text-stone-400 hover:text-stone-600 hover:bg-stone-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-h-[240px] overflow-y-auto">
        {activeTab === 'pen' && (
          <div className="p-3">
            <PenControls
              activeColor={currentColor}
              activeWidth={currentWidth}
              onColorChange={setCurrentColor}
              onWidthChange={setCurrentWidth}
            />
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="p-3">
            <GuideOverlay activeGuide={guideType} onChange={onGuideChange} />
          </div>
        )}
      </div>
    </div>
  );
}

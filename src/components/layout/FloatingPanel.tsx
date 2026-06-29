import { useState } from 'react';
import { X, GripHorizontal, Palette, SwatchBook } from 'lucide-react';
import { PenControls } from '../controls/PenControls';
import { ThemeControls } from '../controls/ThemeControls';
import type { UseDrawReturn } from '../../hooks/useDraw';
import type { CanvasTheme } from '../../types';

interface FloatingPanelProps {
  drawHook: UseDrawReturn;
  activeTheme: CanvasTheme;
  onThemeChange: (theme: CanvasTheme) => void;
}

export function FloatingPanel({ drawHook, activeTheme, onThemeChange }: FloatingPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'pen' | 'theme'>('pen');
  const [position, setPosition] = useState({ x: 16, y: 60 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [savedPosition, setSavedPosition] = useState({ x: 16, y: 60 });

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
    setSavedPosition({ ...position });
  };

  const handleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedPosition({ ...position });
    setCollapsed(true);
  };

  const handleExpand = () => {
    setCollapsed(false);
    setPosition({ ...savedPosition });
  };

  if (collapsed) {
    return (
      <div className="absolute z-40 bottom-4 right-4">
        <button
          onClick={handleExpand}
          className="w-10 h-10 bg-white rounded-2xl shadow-lg border border-stone-200/60 flex items-center justify-center hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
          title="Open settings"
        >
          <Palette className="w-4 h-4 text-stone-500" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="absolute z-40 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-stone-200/60 overflow-hidden w-[190px] select-none transition-shadow duration-200 hover:shadow-2xl"
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Handle */}
      <div
        className="flex items-center justify-between px-3 py-2.5 cursor-grab active:cursor-grabbing"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-2">
          <GripHorizontal className="w-3 h-3 text-stone-300" />
          <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">
            Settings
          </span>
        </div>
        <button
          onClick={handleCollapse}
          className="w-5 h-5 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-3 h-3 text-stone-400" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-100">
        <button
          onClick={() => setActiveTab('pen')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'pen'
              ? 'text-stone-900 border-b-2 border-stone-900'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <Palette className="w-3 h-3" />
          Pen
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[10px] font-medium transition-colors cursor-pointer ${
            activeTab === 'theme'
              ? 'text-stone-900 border-b-2 border-stone-900'
              : 'text-stone-400 hover:text-stone-600'
          }`}
        >
          <SwatchBook className="w-3 h-3" />
          Theme
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[280px] overflow-y-auto">
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
        {activeTab === 'theme' && (
          <div className="p-3">
            <ThemeControls activeTheme={activeTheme} onChange={onThemeChange} />
          </div>
        )}
      </div>
    </div>
  );
}

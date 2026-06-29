import { useState, useRef, useEffect } from 'react';
import { X, GripVertical, PenLine, SwatchBook, Settings2 } from 'lucide-react';
import { PenControls } from '../controls/PenControls';
import { ThemeControls } from '../controls/ThemeControls';
import { themes } from '../../lib/canvas';
import type { UseDrawReturn } from '../../hooks/useDraw';
import type { CanvasTheme } from '../../types';

interface FloatingPanelProps {
  drawHook: UseDrawReturn;
  activeTheme: CanvasTheme;
  onThemeChange: (theme: CanvasTheme) => void;
}

function isLight(hex: string): boolean {
  const c = hex.replace('#', '');
  if (c.length < 6) return true;
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

const darkInkColors = [
  '#1c1917',
  '#e03131',
  '#2f9e44',
  '#1971c2',
  '#f08c00',
  '#9c36b5',
  '#0c8599',
  '#c92a2a',
];
const lightInkColors = [
  '#ffffff',
  '#ff6b6b',
  '#69db7c',
  '#74c0fc',
  '#ffd43b',
  '#da77f2',
  '#66d9e8',
  '#ff8787',
];

export function FloatingPanel({ drawHook, activeTheme, onThemeChange }: FloatingPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<'pen' | 'theme'>('pen');
  const [position, setPosition] = useState({ x: 16, y: 60 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [savedPosition, setSavedPosition] = useState({ x: 16, y: 60 });
  const [mounted, setMounted] = useState(false);
  const [prevTheme, setPrevTheme] = useState(activeTheme);
  const panelRef = useRef<HTMLDivElement>(null);

  const { currentColor, currentWidth, setCurrentColor, setCurrentWidth } = drawHook;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-switch pen color when theme changes
  useEffect(() => {
    if (activeTheme === prevTheme) return;
    setPrevTheme(activeTheme);

    const themeConfig = themes[activeTheme];
    if (!themeConfig) return;

    const light = isLight(themeConfig.bg);

    if (light) {
      // Light theme — switch to dark ink if currently using a light-ink color
      if (lightInkColors.includes(currentColor)) {
        setCurrentColor('#1c1917');
      }
    } else {
      // Dark theme — switch to light ink if currently using a dark-ink color
      if (darkInkColors.includes(currentColor)) {
        setCurrentColor('#ffffff');
      }
    }
  }, [activeTheme]);

  const clamp = (x: number, y: number) => {
    const w = panelRef.current?.offsetWidth ?? 208;
    const h = panelRef.current?.offsetHeight ?? 360;
    const maxX = window.innerWidth - w - 8;
    const maxY = window.innerHeight - h - 8;
    return {
      x: Math.min(Math.max(x, 8), Math.max(maxX, 8)),
      y: Math.min(Math.max(y, 8), Math.max(maxY, 8)),
    };
  };

  const handleDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!dragging) return;
    setPosition(clamp(e.clientX - dragStart.x, e.clientY - dragStart.y));
  };

  const handleDragEnd = () => {
    if (!dragging) return;
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
      <div className="absolute z-40 bottom-8 right-5">
        <button
          onClick={handleExpand}
          className="group relative w-8 h-8 bg-white rounded-2xl shadow-[0_2px_8px_rgba(28,25,23,0.08),0_8px_24px_rgba(28,25,23,0.10)] border border-stone-200/70 flex items-center justify-center hover:shadow-[0_4px_12px_rgba(28,25,23,0.10),0_12px_32px_rgba(28,25,23,0.14)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 ease-out cursor-pointer animate-in fade-in zoom-in-95"
          title="Open settings"
        >
          <Settings2 className="w-[18px] h-[18px] text-stone-500 group-hover:text-stone-800 group-hover:rotate-45 transition-all duration-300" />
          <span
            className="absolute inset-0 rounded-2xl ring-2 ring-offset-2 ring-stone-900/0 group-hover:ring-stone-900/10 transition-all duration-200"
            aria-hidden
          />
          <span
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-gradient-to-br shadow-sm"
            style={{ background: currentColor }}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`absolute z-40 bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden w-[208px] select-none ${
        dragging
          ? 'shadow-[0_8px_16px_rgba(28,25,23,0.10),0_20px_48px_rgba(28,25,23,0.18)] scale-[1.01] cursor-grabbing'
          : 'shadow-[0_2px_6px_rgba(28,25,23,0.06),0_12px_32px_rgba(28,25,23,0.10)]'
      } ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'} transition-[box-shadow,transform,opacity] duration-200 ease-out`}
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      {/* Handle */}
      <div
        className="flex items-center justify-between pl-2.5 pr-2 py-2.5 cursor-grab active:cursor-grabbing bg-gradient-to-b from-stone-50/80 to-transparent"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-[12px] text-stone-600 font-semibold capitalize">Settings</span>
        </div>
        <button
          onClick={handleCollapse}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-90 transition-all duration-150 cursor-pointer"
          title="Collapse"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="relative flex px-2 gap-1 border-b border-stone-100">
        {[
          { key: 'pen' as const, label: 'Pen', icon: PenLine },
          { key: 'theme' as const, label: 'Theme', icon: SwatchBook },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-medium transition-colors duration-150 cursor-pointer rounded-t-lg ${
                isActive ? 'text-stone-900' : 'text-stone-400 hover:text-stone-600'
              }`}
            >
              <Icon
                className={`w-3.5 h-3.5 transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}
              />
              {label}
              {isActive && (
                <span className="absolute left-2 right-2 -bottom-px h-[2px] rounded-full bg-stone-900" />
              )}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="max-h-[300px] overflow-y-auto overscroll-contain [scrollbar-width:thin]">
        <div key={activeTab} className="p-3 animate-in fade-in slide-in-from-bottom-1 duration-150">
          {activeTab === 'pen' && (
            <PenControls
              activeColor={currentColor}
              activeWidth={currentWidth}
              onColorChange={setCurrentColor}
              onWidthChange={setCurrentWidth}
            />
          )}
          {activeTab === 'theme' && (
            <ThemeControls activeTheme={activeTheme} onChange={onThemeChange} />
          )}
        </div>
      </div>
    </div>
  );
}

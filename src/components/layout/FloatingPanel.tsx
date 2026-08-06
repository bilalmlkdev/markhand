import { useState, useRef, useEffect } from "react";
import { X, GripVertical, PenLine, SwatchBook, Settings2 } from "lucide-react";
import { PenControls } from "../controls/PenControls";
import { ThemeControls } from "../controls/ThemeControls";
import { themes } from "../../lib/canvas";
import type { UseDrawReturn } from "../../hooks/useDraw";
import type { CanvasTheme } from "../../types";

interface FloatingPanelProps {
  drawHook: UseDrawReturn;
  activeTheme: CanvasTheme;
  onThemeChange: (theme: CanvasTheme) => void;
}

const PANEL_COLLAPSED_KEY = "markhand_panel_collapsed";
const PANEL_X_KEY = "markhand_panel_x";
const PANEL_Y_KEY = "markhand_panel_y";

function loadCollapsed(): boolean {
  return localStorage.getItem(PANEL_COLLAPSED_KEY) === "true";
}
function saveCollapsed(collapsed: boolean) {
  localStorage.setItem(PANEL_COLLAPSED_KEY, String(collapsed));
}
function loadPosition(): { x: number; y: number } {
  const x = Number(localStorage.getItem(PANEL_X_KEY)) || 16;
  const y = Number(localStorage.getItem(PANEL_Y_KEY)) || 60;
  return { x, y };
}
function savePosition(x: number, y: number) {
  localStorage.setItem(PANEL_X_KEY, String(Math.round(x)));
  localStorage.setItem(PANEL_Y_KEY, String(Math.round(y)));
}

// Robust isLight that handles #rgb and #rrggbbaa
function isLight(hex: string): boolean {
  let r = 0,
    g = 0,
    b = 0;
  const c = hex.replace("#", "");
  if (c.length === 3) {
    r = parseInt(c[0] + c[0], 16);
    g = parseInt(c[1] + c[1], 16);
    b = parseInt(c[2] + c[2], 16);
  } else if (c.length >= 6) {
    r = parseInt(c.slice(0, 2), 16);
    g = parseInt(c.slice(2, 4), 16);
    b = parseInt(c.slice(4, 6), 16);
  }
  return (r * 299 + g * 587 + b * 114) / 1000 > 150;
}

const darkInkColors = [
  "#1c1917",
  "#e03131",
  "#2f9e44",
  "#1971c2",
  "#f08c00",
  "#9c36b5",
  "#0c8599",
  "#c92a2a",
];
const lightInkColors = [
  "#ffffff",
  "#ff6b6b",
  "#69db7c",
  "#74c0fc",
  "#ffd43b",
  "#da77f2",
  "#66d9e8",
  "#ff8787",
];

export function FloatingPanel({
  drawHook,
  activeTheme,
  onThemeChange,
}: FloatingPanelProps) {
  const savedPos = loadPosition();
  const [collapsed, setCollapsed] = useState(loadCollapsed);
  const [activeTab, setActiveTab] = useState<"pen" | "theme">("pen");
  const [position, setPosition] = useState(savedPos);
  const [savedPosition, setSavedPosition] = useState(savedPos);
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [prevTheme, setPrevTheme] = useState(activeTheme);
  const panelRef = useRef<HTMLDivElement>(null);
  const { currentColor, currentWidth, setCurrentColor, setCurrentWidth } =
    drawHook;

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    saveCollapsed(collapsed);
  }, [collapsed]);
  useEffect(() => {
    savePosition(savedPosition.x, savedPosition.y);
  }, [savedPosition]);

  useEffect(() => {
    if (activeTheme === prevTheme) return;
    setPrevTheme(activeTheme);
    const themeConfig = themes[activeTheme];
    if (!themeConfig) return;
    const light = isLight(themeConfig.bg);
    if (light) {
      if (lightInkColors.includes(currentColor)) setCurrentColor("#1c1917");
    } else {
      if (darkInkColors.includes(currentColor)) setCurrentColor("#ffffff");
    }
  }, [activeTheme, currentColor, setCurrentColor, prevTheme]);

  const clamp = (x: number, y: number) => {
    const w = panelRef.current?.offsetWidth ?? 190;
    const h = panelRef.current?.offsetHeight ?? 340;
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
    const c = clamp(position.x, position.y);
    setPosition(c);
    setSavedPosition(c);
    savePosition(c.x, c.y);
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
      <div className="absolute z-40 bottom-4 left-2 sm:bottom-8 sm:left-2.5">
        <button
          onClick={handleExpand}
          title="Open settings"
          className="group relative w-11 h-11 sm:w-10 sm:h-10 bg-white rounded-2xl shadow-lg border border-stone-200/60 flex items-center justify-center hover:shadow-xl active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Settings2 className="w-5 h-5 sm:w-[18px] sm:h-[18px] text-stone-500 group-hover:text-stone-800 group-hover:rotate-45 transition-all duration-300" />
          <span
            className="absolute -top-1 -right-1 w-3 h-3 sm:w-2.5 sm:h-2.5 rounded-full shadow-sm"
            style={{ background: currentColor }}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      className={`absolute z-40 bg-white/90 backdrop-blur-xl rounded-xl overflow-hidden w-[180px] sm:w-[208px] select-none ${dragging ? "shadow-2xl scale-[1.01] cursor-grabbing" : "shadow-lg"} ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"} transition-[box-shadow,transform,opacity] duration-200 ease-out`}
      style={{ left: position.x, top: position.y }}
      onMouseMove={handleDrag}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
    >
      <div
        className="flex items-center justify-between pl-2.5 pr-2 py-2.5 cursor-grab active:cursor-grabbing bg-gradient-to-b from-stone-50/80 to-transparent"
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-stone-300" />
          <span className="text-[11px] sm:text-[12px] text-stone-600 font-semibold">
            Settings
          </span>
        </div>
        <button
          onClick={handleCollapse}
          className="w-6 h-6 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 active:scale-90 transition-all duration-150 cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="relative flex px-2 gap-1 border-b border-stone-100">
        {[
          { key: "pen" as const, label: "Pen", icon: PenLine },
          { key: "theme" as const, label: "Theme", icon: SwatchBook },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] sm:text-[11px] font-medium transition-colors duration-150 cursor-pointer rounded-t-lg ${activeTab === key ? "text-stone-900" : "text-stone-400 hover:text-stone-600"}`}
          >
            <Icon
              className={`w-3.5 h-3.5 transition-transform duration-150 ${activeTab === key ? "scale-110" : ""}`}
            />
            {label}
            {activeTab === key && (
              <span className="absolute left-2 right-2 -bottom-px h-[2px] rounded-full bg-stone-900" />
            )}
          </button>
        ))}
      </div>
      <div className="max-h-[280px] sm:max-h-[300px] overflow-y-auto overscroll-contain">
        <div
          key={activeTab}
          className="p-2 sm:p-3 animate-in fade-in slide-in-from-bottom-1 duration-150"
        >
          {activeTab === "pen" && (
            <PenControls
              activeColor={currentColor}
              activeWidth={currentWidth}
              onColorChange={setCurrentColor}
              onWidthChange={setCurrentWidth}
            />
          )}
          {activeTab === "theme" && (
            <ThemeControls activeTheme={activeTheme} onChange={onThemeChange} />
          )}
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { PenLine, SwatchBook, Settings2, X } from "lucide-react";
import { PenControls } from "../controls/PenControls";
import { ThemeControls } from "../controls/ThemeControls";
import { themes } from "../../lib/canvas";
import { isLightColor } from "../../lib/palette";
import type { UseDrawReturn } from "../../hooks/useDraw";
import type { CanvasTheme } from "../../types";

interface StylePanelProps {
  drawHook: UseDrawReturn;
  activeTheme: CanvasTheme;
  onThemeChange: (theme: CanvasTheme) => void;
}

const PANEL_OPEN_KEY = "markhand_style_panel_open";

function loadOpen(): boolean {
  const v = localStorage.getItem(PANEL_OPEN_KEY);
  return v === null ? true : v === "true";
}
function saveOpen(open: boolean) {
  localStorage.setItem(PANEL_OPEN_KEY, String(open));
}

export function StylePanel({
  drawHook,
  activeTheme,
  onThemeChange,
}: StylePanelProps) {
  const [open, setOpen] = useState(loadOpen);
  const [activeTab, setActiveTab] = useState<"pen" | "theme">("pen");
  const [prevTheme, setPrevTheme] = useState(activeTheme);
  const { currentColor, currentWidth, setCurrentColor, setCurrentWidth, recolorForBackground } =
    drawHook;

  useEffect(() => {
    saveOpen(open);
  }, [open]);

  useEffect(() => {
    if (activeTheme === prevTheme) return;
    setPrevTheme(activeTheme);
    const themeConfig = themes[activeTheme];
    if (!themeConfig) return;
    recolorForBackground(isLightColor(themeConfig.bg));
  }, [activeTheme, prevTheme, recolorForBackground]);

  if (!open) {
    return (
      <div
        data-tour="style-panel-collapsed"
        className="absolute z-40 top-16 right-3 sm:top-20 sm:right-5"
      >
        <button
          onClick={() => setOpen(true)}
          title="Open style panel"
          className="group relative w-10 h-10 bg-white rounded-2xl shadow-[0_4px_20px_rgba(28,25,23,0.08)] border border-stone-200/70 flex items-center justify-center hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <Settings2 className="w-[18px] h-[18px] text-stone-500 group-hover:text-stone-800 group-hover:rotate-45 transition-all duration-300" />
          <span
            className="absolute -top-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white shadow-sm"
            style={{ background: currentColor }}
          />
        </button>
      </div>
    );
  }

  return (
    <div
      data-tour="style-panel"
      className="absolute z-40 top-16 right-3 sm:top-20 sm:right-5 w-[200px] sm:w-[216px] bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/70 shadow-[0_4px_20px_rgba(28,25,23,0.08)] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150"
    >
      <div className="flex items-center justify-between pl-3 pr-2 py-2.5 border-b border-stone-100">
        <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
          Style
        </span>
        <button
          onClick={() => setOpen(false)}
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
            className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer rounded-t-lg ${
              activeTab === key
                ? "text-stone-900"
                : "text-stone-400 hover:text-stone-600"
            }`}
          >
            <Icon
              className={`w-3 h-3 transition-transform duration-150 ${
                activeTab === key ? "scale-110" : ""
              }`}
            />
            {label}
            {activeTab === key && (
              <span className="absolute left-2 right-2 -bottom-px h-[2px] rounded-full bg-stone-900" />
            )}
          </button>
        ))}
      </div>

      <div className="max-h-[calc(100vh-220px)] overflow-y-auto overscroll-contain">
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
              bgIsLight={isLightColor(themes[activeTheme]?.bg ?? themes.default.bg)}
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

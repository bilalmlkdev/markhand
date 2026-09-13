import { useState, useRef } from "react";
import {
  MousePointer2,
  Pencil,
  Circle,
  Brush,
  Pen,
  Eraser,
  Grid3X3,
  LayoutGrid,
  Rows3,
  EyeOff,
  Undo2,
  Redo2,
  Trash2,
  ZoomIn,
  Layers,
  Pipette,
  FlipHorizontal2,
  PenLine,
  SwatchBook,
  ImagePlus,
  Share2,
  Info,
  RefreshCw,
} from "lucide-react";
import { ComingSoonButton } from "../ui/ComingSoonButton";
import { DockPopover } from "../ui/DockPopover";
import { Tooltip } from "../ui/ToolTip";
import { PenControls } from "../controls/PenControls";
import { ThemeControls } from "../controls/ThemeControls";
import { themes } from "../../lib/canvas";
import { isLightColor } from "../../lib/palette";
import { FiGithub } from "react-icons/fi";
import { MdSimCardDownload } from "react-icons/md";
import { Link } from "react-router-dom";
import type { CursorStyle, GuideType, CanvasTheme } from "../../types";

interface DashboardToolbarProps {
  activeCursor: CursorStyle;
  onCursorChange: (cursor: CursorStyle) => void;
  isErasing: boolean;
  onToggleEraser: () => void;
  activeGuide: GuideType;
  onGuideChange: (guide: GuideType) => void;
  canUndo: boolean;
  canRedo: boolean;
  isEmpty: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  activeColor: string;
  activeWidth: number;
  onColorChange: (color: string) => void;
  onWidthChange: (width: number) => void;
  activeTheme: CanvasTheme;
  onThemeChange: (theme: CanvasTheme) => void;
  onShare: () => void;
  onExport: () => void;
  onReset: () => void;
  onToggleInstructions: () => void;
}

const cursorOptions: {
  type: CursorStyle;
  label: string;
  key: string;
  icon: React.ReactNode;
}[] = [
  { type: "crosshair", label: "Crosshair", key: "1", icon: <MousePointer2 className="w-4 h-4" /> },
  { type: "pencil", label: "Pencil", key: "2", icon: <Pencil className="w-4 h-4" /> },
  { type: "dot", label: "Dot", key: "3", icon: <Circle className="w-4 h-4" /> },
  { type: "brush", label: "Brush", key: "4", icon: <Brush className="w-4 h-4" /> },
  { type: "pen", label: "Pen", key: "5", icon: <Pen className="w-4 h-4" /> },
];

const guideOptions: {
  type: GuideType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { type: "none", label: "No guide", icon: <EyeOff className="w-4 h-4" /> },
  { type: "dots", label: "Dot grid", icon: <Grid3X3 className="w-4 h-4" /> },
  { type: "grid", label: "Line grid", icon: <LayoutGrid className="w-4 h-4" /> },
  { type: "lines", label: "Lines", icon: <Rows3 className="w-4 h-4" /> },
];

function Divider() {
  return <div className="w-px h-6 bg-stone-200 mx-1 shrink-0" />;
}

type PopoverKey = "style" | "theme" | null;

export function DashboardToolbar({
  activeCursor,
  onCursorChange,
  isErasing,
  onToggleEraser,
  activeGuide,
  onGuideChange,
  canUndo,
  canRedo,
  isEmpty,
  onUndo,
  onRedo,
  onClear,
  activeColor,
  activeWidth,
  onColorChange,
  onWidthChange,
  activeTheme,
  onThemeChange,
  onShare,
  onExport,
  onReset,
  onToggleInstructions,
}: DashboardToolbarProps) {
  const [openPopover, setOpenPopover] = useState<PopoverKey>(null);
  const styleButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const themeBg = themes[activeTheme]?.bg ?? themes.default.bg;

  return (
    <div
      data-tour="toolbar"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 px-2 py-2 bg-white/70 backdrop-blur-2xl backdrop-saturate-150 rounded-[28px] border border-black/[0.06] ring-1 ring-inset ring-white/70 shadow-[0_1px_1px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.08)] pointer-events-auto max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar"
    >
      {/* Brand mark */}
      <div className="flex items-center gap-1.5 shrink-0 pr-1">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="text-blue-500">
          <path d="M12 2v6M12 16v6M2 12h6M16 12h6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <span className="text-sm relative top-[1px] font-medium tracking-tight text-stone-800 hidden sm:inline">
          Markhand
        </span>
      </div>

      <Divider />

      {/* Cursor styles */}
      <div className="flex items-center gap-0.5 shrink-0">
        {cursorOptions.map((cursor) => (
          <Tooltip key={cursor.type} label={cursor.label} shortcut={cursor.key}>
            <button
              onClick={() => onCursorChange(cursor.type)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
                !isErasing && activeCursor === cursor.type
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              }`}
            >
              {cursor.icon}
            </button>
          </Tooltip>
        ))}
        <Tooltip label="Eraser" shortcut="E">
          <button
            onClick={onToggleEraser}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
              isErasing
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            }`}
          >
            <Eraser className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <Divider />

      {/* Style + Theme */}
      <div className="flex items-center gap-0.5 shrink-0">
        <div>
          <Tooltip label="Pen style">
            <button
              ref={styleButtonRef}
              onClick={() => setOpenPopover((p) => (p === "style" ? null : "style"))}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
                openPopover === "style"
                  ? "bg-stone-100 ring-1 ring-stone-300"
                  : "hover:bg-stone-100"
              }`}
            >
              <span
                className="relative w-4 h-4 rounded-full ring-1 ring-black/10 flex items-center justify-center"
                style={{ backgroundColor: activeColor }}
              >
                <PenLine className="w-2 h-2 text-white mix-blend-difference" />
              </span>
            </button>
          </Tooltip>
          <DockPopover
            open={openPopover === "style"}
            onClose={() => setOpenPopover(null)}
            anchorRef={styleButtonRef}
          >
            <div className="flex items-center justify-between pl-3 pr-2 py-2.5 border-b border-stone-100">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Style
              </span>
            </div>
            <div className="p-2 sm:p-3 max-h-[calc(100vh-220px)] overflow-y-auto overscroll-contain">
              <PenControls
                activeColor={activeColor}
                activeWidth={activeWidth}
                onColorChange={onColorChange}
                onWidthChange={onWidthChange}
                bgIsLight={isLightColor(themeBg)}
              />
            </div>
          </DockPopover>
        </div>

        <div>
          <Tooltip label="Canvas theme">
            <button
              ref={themeButtonRef}
              onClick={() => setOpenPopover((p) => (p === "theme" ? null : "theme"))}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
                openPopover === "theme"
                  ? "bg-stone-100 ring-1 ring-stone-300"
                  : "hover:bg-stone-100"
              }`}
            >
              <span
                className="w-4 h-4 rounded-full ring-1 ring-black/10 flex items-center justify-center"
                style={{ backgroundColor: themeBg }}
              >
                <SwatchBook className="w-2 h-2 text-stone-500 mix-blend-difference" />
              </span>
            </button>
          </Tooltip>
          <DockPopover
            open={openPopover === "theme"}
            onClose={() => setOpenPopover(null)}
            anchorRef={themeButtonRef}
            width="240px"
          >
            <div className="flex items-center justify-between pl-3 pr-2 py-2.5 border-b border-stone-100">
              <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                Theme
              </span>
            </div>
            <div className="p-2 sm:p-3">
              <ThemeControls activeTheme={activeTheme} onChange={onThemeChange} />
            </div>
          </DockPopover>
        </div>
      </div>

      <Divider />

      {/* Guides */}
      <div className="flex items-center gap-0.5 shrink-0">
        {guideOptions.map((guide) => (
          <Tooltip key={guide.type} label={guide.label} shortcut="G">
            <button
              onClick={() => onGuideChange(guide.type)}
              className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
                activeGuide === guide.type
                  ? "bg-stone-900 text-white shadow-sm"
                  : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              }`}
            >
              {guide.icon}
            </button>
          </Tooltip>
        ))}
      </div>

      <Divider />

      {/* History */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Tooltip label="Undo" shortcut="Ctrl+Z">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
          >
            <Undo2 className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip label="Redo" shortcut="Ctrl+Shift+Z">
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="hidden sm:flex w-8 h-8 items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip label="Clear canvas" shortcut="Del">
          <button
            onClick={onClear}
            disabled={isEmpty}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <Divider />

      {/* Upcoming tools */}
      <div className="flex items-center gap-0.5 shrink-0">
        <ComingSoonButton icon={<ZoomIn className="w-4 h-4" />} label="Zoom" />
        <ComingSoonButton icon={<Layers className="w-4 h-4" />} label="Onion skin" />
        <ComingSoonButton icon={<Pipette className="w-4 h-4" />} label="Eyedropper" />
        <ComingSoonButton icon={<FlipHorizontal2 className="w-4 h-4" />} label="Symmetry mode" />
      </div>

      <Divider />

      {/* File actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        <ComingSoonButton icon={<ImagePlus className="w-4 h-4" />} label="Import reference image" />
        <Tooltip label="Share drawing">
          <button
            onClick={onShare}
            disabled={isEmpty}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip label="Export">
          <button
            onClick={onExport}
            disabled={isEmpty}
            className="w-8 h-8 flex items-center justify-center rounded-xl bg-stone-900 text-white hover:bg-black disabled:opacity-30 disabled:hover:bg-stone-900 disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
          >
            <MdSimCardDownload className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <Divider />

      {/* Navigation + info */}
      <div className="flex items-center gap-0.5 shrink-0">
        <Tooltip label="My Drawings">
          <Link
            to="/drawings"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-150 shrink-0"
          >
            <LayoutGrid className="w-4 h-4" />
          </Link>
        </Tooltip>
        <Tooltip label="View on GitHub">
          <a
            href="https://github.com/bilalmlkdev/markhand.git"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-150 shrink-0"
          >
            <FiGithub className="w-4 h-4" />
          </a>
        </Tooltip>
        <Tooltip label="How to use">
          <button
            onClick={onToggleInstructions}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-150 cursor-pointer shrink-0"
          >
            <Info className="w-4 h-4" />
          </button>
        </Tooltip>
        <Tooltip label="Reset all data">
          <button
            onClick={onReset}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all duration-150 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}

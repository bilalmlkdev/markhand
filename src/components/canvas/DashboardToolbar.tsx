import { useRef, useState } from "react";
import {
  MousePointer2,
  Pencil,
  Circle,
  Brush,
  Pen,
  Eraser,
  Grid3X3,
  LayoutGrid,
  EyeOff,
  Undo2,
  Redo2,
  Trash2,
  PenLine,
  SwatchBook,
  Share2,
  FolderOpen,
  MousePointerClick,
  Square,
  Type,
  Highlighter,
} from "lucide-react";
import { DockPopover } from "../ui/DockPopover";
import { Tooltip } from "../ui/ToolTip";
import { Slider } from "../ui/Slider";
import { PenControls } from "../controls/PenControls";
import { ThemeControls } from "../controls/ThemeControls";
import { themes } from "../../lib/canvas";
import { isLightColor } from "../../lib/palette";
import { getAssignedAvatar } from "../../lib/avatar";
import { Link } from "react-router-dom";
import { ERASER_RADIUS_RANGE } from "../../hooks/useDraw";
import type { CursorStyle, GuideType, CanvasTheme } from "../../types";
import { LuGithub } from "react-icons/lu";

interface DashboardToolbarProps {
  activeCursor: CursorStyle;
  onCursorChange: (cursor: CursorStyle) => void;
  isErasing: boolean;
  onToggleEraser: () => void;
  eraserRadius: number;
  onEraserRadiusChange: (radius: number) => void;
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
  onExit: () => void;
  onCancelEraser: () => void;
}

const cursorOptions: {
  type: CursorStyle;
  label: string;
  key: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "pencil",
    label: "Pencil cursor",
    key: "2",
    icon: <Pencil className="w-[17px] h-[17px]" />,
  },
  {
    type: "pen",
    label: "Pen cursor",
    key: "5",
    icon: <Pen className="w-[17px] h-[17px]" />,
  },
  {
    type: "brush",
    label: "Brush cursor",
    key: "4",
    icon: <Brush className="w-[17px] h-[17px]" />,
  },
  {
    type: "dot",
    label: "Dot cursor",
    key: "3",
    icon: <Circle className="w-[17px] h-[17px]" />,
  },
  {
    type: "crosshair",
    label: "Crosshair cursor",
    key: "1",
    icon: <MousePointer2 className="w-[17px] h-[17px]" />,
  },
];

const guideOptions: {
  type: GuideType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    type: "none",
    label: "No guide",
    icon: <EyeOff className="w-[17px] h-[17px]" />,
  },
  {
    type: "dots",
    label: "Dot grid",
    icon: <Grid3X3 className="w-[17px] h-[17px]" />,
  },
  {
    type: "grid",
    label: "Grid",
    icon: <LayoutGrid className="w-[17px] h-[17px]" />,
  },
];

type PopoverKey = "style" | "theme" | "more" | "eraser" | null;

function Divider() {
  return <div className="w-px h-7 bg-stone-200/80 mx-1 shrink-0" />;
}

function ToolButton({
  active,
  disabled,
  label,
  shortcut,
  onClick,
  children,
  size = "md",
}: {
  active?: boolean;
  disabled?: boolean;
  label: string;
  shortcut?: string;
  onClick: () => void;
  children: React.ReactNode;
  size?: "md" | "sm";
}) {
  return (
    <Tooltip label={label} shortcut={shortcut}>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={label}
        className={[
          size === "sm" ? "w-8 h-8" : "w-9 h-9",
          "flex items-center justify-center rounded-[13px] transition-all duration-150 shrink-0",
          active
            ? "bg-stone-900 text-white shadow-[0_2px_6px_rgba(28,25,23,0.16)]"
            : "text-stone-500 hover:text-stone-900 hover:bg-stone-100",
          disabled
            ? "opacity-30 cursor-not-allowed hover:bg-transparent"
            : "cursor-pointer",
        ].join(" ")}
      >
        {children}
      </button>
    </Tooltip>
  );
}

export function DashboardToolbar({
  activeCursor,
  onCursorChange,
  isErasing,
  onToggleEraser,
  eraserRadius,
  onEraserRadiusChange,
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
  onExit,
  onCancelEraser,
}: DashboardToolbarProps) {
  const [openPopover, setOpenPopover] = useState<PopoverKey>(null);
  const styleButtonRef = useRef<HTMLButtonElement>(null);
  const themeButtonRef = useRef<HTMLButtonElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const eraserButtonRef = useRef<HTMLButtonElement>(null);
  const themeBg = themes[activeTheme]?.bg ?? themes.default.bg;
  const [avatar] = useState(getAssignedAvatar);

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100vw-1rem)]">
      <div className="flex items-center gap-1 max-w-[calc(100vw-1rem)] overflow-x-auto overscroll-x-contain no-scrollbar rounded-[20px] border border-black/[0.07] bg-white/88 backdrop-blur-2xl backdrop-saturate-150 px-1.5 py-1.5 shadow-[0_2px_6px_rgba(28,25,23,0.05),0_14px_34px_rgba(28,25,23,0.12)] ring-1 ring-inset ring-white/80">
        <div className="flex items-center gap-0.5 shrink-0">
          {cursorOptions.map((cursor) => (
            <ToolButton
              key={cursor.type}
              label={cursor.label}
              shortcut={cursor.key}
              active={!isErasing && activeCursor === cursor.type}
              onClick={() => onCursorChange(cursor.type)}
            >
              {cursor.icon}
            </ToolButton>
          ))}
          <div className="relative">
            <Tooltip label="Eraser" shortcut="E">
              <button
                type="button"
                ref={eraserButtonRef}
                onClick={() => {
                  onToggleEraser();
                  setOpenPopover(isErasing ? null : "eraser");
                }}
                aria-label="Eraser"
                aria-expanded={openPopover === "eraser"}
                className={`w-9 h-9 flex items-center justify-center rounded-[13px] transition-all duration-150 shrink-0 ${
                  isErasing
                    ? "bg-stone-900 text-white shadow-[0_2px_6px_rgba(28,25,23,0.16)]"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                }`}
              >
                <Eraser className="w-[17px] h-[17px]" />
              </button>
            </Tooltip>

            <DockPopover
              open={openPopover === "eraser"}
              onClose={() => setOpenPopover(null)}
              anchorRef={eraserButtonRef}
              width="200px"
            >
              <div className="p-3.5">
                <Slider
                  label="Eraser size"
                  min={ERASER_RADIUS_RANGE.min}
                  max={ERASER_RADIUS_RANGE.max}
                  step={1}
                  value={eraserRadius}
                  onChange={onEraserRadiusChange}
                />
              </div>
            </DockPopover>
          </div>
        </div>

        {/* Coming-soon tools: kept visually and spatially separate from
            real, working tools above so they don't read as broken buttons
            sitting among functional ones. Hidden below lg since the dock
            is already tight on narrower viewports and these are previews,
            not features anyone depends on. */}
        <div className="hidden lg:flex items-center gap-0.5 shrink-0 mx-0.5 pl-1.5 border-l border-dashed border-stone-200">
          <ToolButton
            label="Select (coming soon)"
            disabled
            size="sm"
            onClick={() => {}}
          >
            <MousePointerClick className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            label="Shapes (coming soon)"
            disabled
            size="sm"
            onClick={() => {}}
          >
            <Square className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            label="Text (coming soon)"
            disabled
            size="sm"
            onClick={() => {}}
          >
            <Type className="w-4 h-4" />
          </ToolButton>
          <ToolButton
            label="Highlighter (coming soon)"
            disabled
            size="sm"
            onClick={() => {}}
          >
            <Highlighter className="w-4 h-4" />
          </ToolButton>
        </div>

        <Divider />

        <div className="flex items-center gap-0.5 shrink-0">
          <div className="relative">
            <Tooltip label="Ink style">
              <button
                ref={styleButtonRef}
                type="button"
                onClick={() => {
                  onCancelEraser();
                  setOpenPopover((p) => (p === "style" ? null : "style"));
                }}
                aria-label="Ink style"
                aria-expanded={openPopover === "style"}
                className={`w-9 h-9 flex items-center justify-center rounded-[13px] transition-all duration-150 ${
                  openPopover === "style"
                    ? "bg-stone-100 ring-1 ring-stone-300"
                    : "hover:bg-stone-100"
                }`}
              >
                <span
                  className="w-[28px] h-[28px] rounded-full ring-1 ring-black/10  flex items-center justify-center"
                  // style={{ backgroundColor: activeColor }}
                >
                  <PenLine className="w-4 h-4 text-stone-400" />
                </span>
              </button>
            </Tooltip>
            <DockPopover
              open={openPopover === "style"}
              onClose={() => setOpenPopover(null)}
              anchorRef={styleButtonRef}
              width="248px"
            >
              <div className="px-3.5 py-3 border-b border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-800">
                      Ink style
                    </p>
                    <p className="text-[10px] text-stone-400 mt-0.5">
                      Weight and color
                    </p>
                  </div>
                  <span
                    className="w-7 h-7 rounded-[10px] ring-1 ring-black/10 shadow-inner"
                    style={{ backgroundColor: activeColor }}
                  />
                </div>
              </div>
              <div className="p-2 sm:p-3 max-h-[min(520px,calc(100vh-170px))] overflow-y-auto overscroll-contain">
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

          <div className="relative">
            <Tooltip label="Canvas theme">
              <button
                ref={themeButtonRef}
                type="button"
                onClick={() => {
                  onCancelEraser();
                  setOpenPopover((p) => (p === "theme" ? null : "theme"));
                }}
                aria-label="Canvas theme"
                aria-expanded={openPopover === "theme"}
                className={`w-9 h-9 flex items-center justify-center rounded-[13px] transition-all duration-150 ${
                  openPopover === "theme"
                    ? "bg-stone-100 ring-1 ring-stone-300"
                    : "hover:bg-stone-100"
                }`}
              >
                <span
                  className="w-[28px] h-[28px] rounded-full ring-1 ring-black/10 flex items-center justify-center"
                  // style={{ backgroundColor: themeBg }}
                >
                  <SwatchBook className="w-5 h-5 text-stone-400 mix-blend-difference shrink-0" />
                </span>
              </button>
            </Tooltip>
            <DockPopover
              open={openPopover === "theme"}
              onClose={() => setOpenPopover(null)}
              anchorRef={themeButtonRef}
              width="244px"
            >
              <div className="px-3.5 py-3 border-b border-stone-100">
                <p className="text-xs font-semibold text-stone-800">
                  Canvas theme
                </p>
                <p className="text-[10px] text-stone-400 mt-0.5">
                  Background and contrast
                </p>
              </div>
              <div className="p-2.5 sm:p-3">
                <ThemeControls
                  activeTheme={activeTheme}
                  onChange={onThemeChange}
                />
              </div>
            </DockPopover>
          </div>
        </div>

        <Divider />

        <div className="hidden sm:flex items-center gap-0.5 shrink-0">
          {guideOptions.map((guide) => (
            <ToolButton
              key={guide.type}
              label={guide.label}
              shortcut={guide.type === "none" ? "G" : undefined}
              active={activeGuide === guide.type}
              onClick={() => onGuideChange(guide.type)}
            >
              {guide.icon}
            </ToolButton>
          ))}
        </div>

        <div className="flex sm:hidden items-center gap-0.5 shrink-0">
          <Tooltip
            label={
              guideOptions.find((g) => g.type === activeGuide)?.label ?? "Guide"
            }
            shortcut="G"
          >
            <button
              type="button"
              onClick={() => {
                const index = guideOptions.findIndex(
                  (g) => g.type === activeGuide,
                );
                onGuideChange(
                  guideOptions[(index + 1) % guideOptions.length]!.type,
                );
              }}
              aria-label="Cycle guide"
              className="w-9 h-9 flex items-center justify-center rounded-[13px] text-stone-500 hover:text-stone-900 hover:bg-stone-100"
            >
              {guideOptions.find((g) => g.type === activeGuide)?.icon}
            </button>
          </Tooltip>
        </div>

        <Divider />

        <div className="flex items-center gap-0.5 shrink-0">
          <ToolButton
            label="Undo"
            shortcut="Ctrl+Z"
            disabled={!canUndo}
            onClick={onUndo}
          >
            <Undo2 className="w-[17px] h-[17px]" />
          </ToolButton>
          <ToolButton
            label="Redo"
            shortcut="Ctrl+Shift+Z"
            disabled={!canRedo}
            onClick={onRedo}
          >
            <Redo2 className="w-[17px] h-[17px]" />
          </ToolButton>
          <ToolButton
            label="Clear canvas"
            shortcut="Del"
            disabled={isEmpty}
            onClick={onClear}
          >
            <Trash2 className="w-[17px] h-[17px]" />
          </ToolButton>
        </div>

        <Divider />

        <div className="flex items-center gap-1.5 shrink-0">
          <Tooltip label="Share drawing">
            <button
              type="button"
              onClick={onShare}
              disabled={isEmpty}
              aria-label="Share drawing"
              className="w-9 h-9 flex items-center justify-center rounded-[13px] text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <Share2 className="w-[17px] h-[17px]" />
            </button>
          </Tooltip>
          <Tooltip label="Export drawing">
            <button
              type="button"
              aria-label="Export drawing"
              onClick={onExport}
              disabled={isEmpty}
              className="h-8 px-4 rounded-lg bg-stone-900 text-white text-[13px] font-semibold hover:bg-black disabled:opacity-30 disabled:hover:bg-stone-900 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">Export</span>
              <span className="sm:hidden">↓</span>
            </button>
          </Tooltip>

          <Tooltip label="My drawings">
            <Link
              to="/drawings"
              aria-label="My drawings"
              className="w-9 h-9 flex items-center justify-center rounded-[13px] text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all duration-150 shrink-0"
            >
              <FolderOpen className="w-[17px] h-[17px]" />
            </Link>
          </Tooltip>

          <Tooltip label="View source">
            <a
              href="https://github.com/bilalmlkdev/markhand"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View source on GitHub"
              className="w-9 h-9 flex items-center justify-center rounded-[13px] text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-all duration-150 shrink-0"
            >
              <LuGithub className="w-[17px] h-[17px]" />
            </a>
          </Tooltip>

          <div className="relative">
            <Tooltip label="More options">
              <button
                type="button"
                ref={moreButtonRef}
                onClick={() => {
                  onCancelEraser();
                  setOpenPopover((p) => (p === "more" ? null : "more"));
                }}
                aria-label="More options"
                aria-expanded={openPopover === "more"}
                className={`w-9 h-9 flex items-center justify-center rounded-[13px] transition-all duration-150 ${
                  openPopover === "more"
                    ? "ring-2 ring-stone-300 bg-stone-100"
                    : "hover:bg-stone-100"
                }`}
              >
                <span className="relative flex h-7 w-7 items-center justify-center rounded-[10px] bg-stone-100 text-[15px] leading-none select-none ring-1 ring-inset ring-white/50">
                  <span className="absolute inset-0 flex items-center justify-center">
                    {avatar.fallbackEmoji}
                  </span>
                  <img
                    src={avatar.url}
                    alt="Your avatar"
                    width={28}
                    height={28}
                    className="absolute inset-0 h-full w-full rounded-[10px] object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </span>
              </button>
            </Tooltip>

            <DockPopover
              open={openPopover === "more"}
              onClose={() => setOpenPopover(null)}
              anchorRef={moreButtonRef}
              width="214px"
            >
              <div className="p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setOpenPopover(null);
                    onToggleInstructions();
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  How to use
                </button>
                <div className="my-1 border-t border-stone-100" />
                <button
                  type="button"
                  onClick={() => {
                    setOpenPopover(null);
                    onExit();
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium text-stone-700 hover:bg-stone-100"
                >
                  Close Markhand
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOpenPopover(null);
                    onReset();
                  }}
                  className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  Reset canvas
                </button>
              </div>
            </DockPopover>
          </div>
        </div>
      </div>
    </div>
  );
}

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
} from "lucide-react";
import type { CursorStyle, GuideType } from "../../types";

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
  { type: "none", label: "No guide (G to cycle)", icon: <EyeOff className="w-4 h-4" /> },
  { type: "dots", label: "Dot grid (G to cycle)", icon: <Grid3X3 className="w-4 h-4" /> },
  { type: "grid", label: "Line grid (G to cycle)", icon: <LayoutGrid className="w-4 h-4" /> },
  { type: "lines", label: "Lines (G to cycle)", icon: <Rows3 className="w-4 h-4" /> },
];

function Divider() {
  return <div className="w-px h-6 bg-stone-200 mx-1 shrink-0" />;
}

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
}: DashboardToolbarProps) {
  return (
    <div
      data-tour="toolbar"
      className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-0.5 px-1.5 py-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/70 shadow-xl pointer-events-auto max-w-[calc(100vw-1.5rem)] overflow-x-auto no-scrollbar"
    >
      {/* Cursor styles */}
      <div className="flex items-center gap-0.5 shrink-0">
        {cursorOptions.map((cursor) => (
          <button
            key={cursor.type}
            onClick={() => onCursorChange(cursor.type)}
            title={`${cursor.label} (${cursor.key})`}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
              !isErasing && activeCursor === cursor.type
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            }`}
          >
            {cursor.icon}
          </button>
        ))}
        <button
          onClick={onToggleEraser}
          title="Eraser (E)"
          className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
            isErasing
              ? "bg-stone-900 text-white shadow-sm"
              : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          }`}
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      <Divider />

      {/* Guides */}
      <div className="flex items-center gap-0.5 shrink-0">
        {guideOptions.map((guide) => (
          <button
            key={guide.type}
            onClick={() => onGuideChange(guide.type)}
            title={guide.label}
            className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 cursor-pointer shrink-0 ${
              activeGuide === guide.type
                ? "bg-stone-900 text-white shadow-sm"
                : "text-stone-400 hover:text-stone-700 hover:bg-stone-100"
            }`}
          >
            {guide.icon}
          </button>
        ))}
      </div>

      <Divider />

      {/* History */}
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
          className="hidden sm:flex w-8 h-8 items-center justify-center rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onClear}
          disabled={isEmpty}
          title="Clear canvas (Del)"
          className="w-8 h-8 flex items-center justify-center rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 disabled:opacity-30 disabled:hover:bg-transparent disabled:cursor-not-allowed transition-all duration-150 cursor-pointer shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

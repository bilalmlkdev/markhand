import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DrawingCanvas } from "../components/canvas/DrawingCanvas";
import { DashboardToolbar } from "../components/canvas/DashboardToolbar";
import { ExportModal } from "../components/exports/ExportModal";
import { ShareModal } from "../components/layout/ShareModal";
import { ResetConfirmModal } from "../components/layout/ResetconfirmModal";
import { ExitConfirmModal } from "../components/layout/ExitConfirmModal";
import { InstructionsModal } from "../components/layout/InstructionsModal";
import { useDraw, CURSOR_DEFAULT_WIDTH } from "../hooks/useDraw";
import { generateId } from "../lib/id";
import {
  useKeyboardShortcuts,
  GUIDE_ORDER,
} from "../hooks/useKeyboardShortcuts";
import { DashboardLoader } from "../components/layout/DashboardLoader";
import { getStrokesFromUrl, cleanUrl } from "../lib/share";
import { themes } from "../lib/canvas";
import { isLightColor } from "../lib/palette";
import {
  loadTheme,
  loadGuide,
  loadCursor,
  saveTheme,
  saveGuide,
  saveCursor,
  upsertDrawingMeta,
  removeDrawingMeta,
  removeDrawingData,
} from "../lib/storage";
import { useExitGuard } from "../hooks/useExitGuard";
import type { GuideType, CanvasTheme, CursorStyle } from "../types";

export function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromLanding = Boolean(
    (location.state as { fromLanding?: boolean } | null)?.fromLanding,
  );
  const [sharedStrokes] = useState(() => getStrokesFromUrl());
  const drawHook = useDraw(id || generateId(), sharedStrokes);

  // history.state survives hard reloads, so gate the loader via sessionStorage.
  const [loading, setLoading] = useState(() => {
    if (!cameFromLanding) return false;
    const consumeKey = `markhand_loader_shown_${id}`;
    if (sessionStorage.getItem(consumeKey)) return false;
    sessionStorage.setItem(consumeKey, "true");
    return true;
  });

  useEffect(() => {
    if (sharedStrokes) cleanUrl();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [guideType, setGuideType] = useState<GuideType>(() => {
    const g = loadGuide();
    return g && (GUIDE_ORDER as string[]).includes(g)
      ? (g as GuideType)
      : "dots";
  });
  const [theme, setTheme] = useState<CanvasTheme>(() => {
    const t = loadTheme();
    return t && t in themes ? (t as CanvasTheme) : "white";
  });
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(() => {
    const c = loadCursor();
    return c && c in CURSOR_DEFAULT_WIDTH ? (c as CursorStyle) : "pencil";
  });
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exitConfirmOpen, setExitConfirmOpen] = useState(false);

  // Native close guard whenever the canvas has content.
  useExitGuard(!drawHook.isEmpty);

  useEffect(() => {
    drawHook.setCurrentWidth(CURSOR_DEFAULT_WIDTH[cursorStyle]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (drawHook.isEmpty) {
      if (drawHook.hasDrawn) {
        removeDrawingMeta(drawHook.drawingId);
        removeDrawingData(drawHook.drawingId);
      }
      return;
    }
    upsertDrawingMeta(drawHook.drawingId, {
      strokeCount: drawHook.strokes.length,
      theme,
    });
  }, [
    drawHook.strokes,
    drawHook.hasDrawn,
    drawHook.isEmpty,
    drawHook.drawingId,
    theme,
  ]);

  const handleGuideChange = (guide: GuideType) => {
    setGuideType(guide);
    saveGuide(guide);
  };

  const handleThemeChange = (t: CanvasTheme) => {
    setTheme(t);
    saveTheme(t);
    const themeConfig = themes[t];
    if (themeConfig)
      drawHook.recolorForBackground(isLightColor(themeConfig.bg));
  };

  const handleCursorChange = (cursor: CursorStyle) => {
    setIsErasing(false);
    setCursorStyle(cursor);
    saveCursor(cursor);
    drawHook.setCurrentWidth(CURSOR_DEFAULT_WIDTH[cursor]);
  };

  const handleToggleEraser = () => {
    setIsErasing((prev) => !prev);
  };

  const handleCycleGuide = () => {
    const currentIndex = GUIDE_ORDER.indexOf(guideType);
    const next = GUIDE_ORDER[(currentIndex + 1) % GUIDE_ORDER.length]!;
    handleGuideChange(next);
  };

  useKeyboardShortcuts({
    onUndo: drawHook.undo,
    onRedo: drawHook.redo,
    onClear: drawHook.clear,
    onCursorChange: handleCursorChange,
    onToggleEraser: handleToggleEraser,
    onCycleGuide: handleCycleGuide,
    isEmpty: drawHook.isEmpty,
    enabled:
      !instructionsOpen &&
      !loading &&
      !exportOpen &&
      !shareOpen &&
      !resetConfirmOpen &&
      !exitConfirmOpen,
  });

  const handleToggleInstructions = () => {
    setInstructionsOpen((prev) => !prev);
  };

  const handleReset = () => {
    if (!drawHook.isEmpty) {
      removeDrawingMeta(drawHook.drawingId);
      removeDrawingData(drawHook.drawingId);
    }
    drawHook.clear();
    const newId = generateId();
    navigate(`/dashboard/${newId}`);
    setResetConfirmOpen(false);
  };

  const handleCloseWindow = () => {
    // window.close() works in PWA windows; fall back to the landing page.
    window.close();
    setTimeout(() => {
      if (!window.closed) navigate("/");
    }, 200);
  };

  const canvas = drawHook.getCanvas();
  const canvasWidth = canvas?.width ?? 800;
  const canvasHeight = canvas?.height ?? 500;

  return (
    <div className="h-screen flex flex-col text-stone-900 overflow-hidden relative font-body">
      <div className="flex-1 relative overflow-hidden">
        <DrawingCanvas
          drawHook={drawHook}
          guideType={guideType}
          theme={theme}
          cursorStyle={cursorStyle}
          isErasing={isErasing}
        />
        <DashboardToolbar
          activeCursor={cursorStyle}
          onCursorChange={handleCursorChange}
          isErasing={isErasing}
          onToggleEraser={handleToggleEraser}
          eraserRadius={drawHook.eraserRadius}
          onEraserRadiusChange={drawHook.setEraserRadius}
          activeGuide={guideType}
          onGuideChange={handleGuideChange}
          canUndo={drawHook.canUndo}
          canRedo={drawHook.canRedo}
          isEmpty={drawHook.isEmpty}
          onUndo={drawHook.undo}
          onRedo={drawHook.redo}
          onClear={drawHook.clear}
          activeColor={drawHook.currentColor}
          activeWidth={drawHook.currentWidth}
          onColorChange={drawHook.setCurrentColor}
          onWidthChange={drawHook.setCurrentWidth}
          activeTheme={theme}
          onThemeChange={handleThemeChange}
          onShare={() => setShareOpen(true)}
          onExport={() => setExportOpen(true)}
          onReset={() => setResetConfirmOpen(true)}
          onToggleInstructions={handleToggleInstructions}
          onExit={() => setExitConfirmOpen(true)}
          onCancelEraser={() => setIsErasing(false)}
        />
      </div>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        strokes={drawHook.strokes}
        width={canvasWidth}
        height={canvasHeight}
        theme={theme}
        guideType={guideType}
      />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        strokes={drawHook.strokes}
        isEmpty={drawHook.isEmpty}
        drawingId={drawHook.drawingId}
        theme={theme}
      />
      <ResetConfirmModal
        open={resetConfirmOpen}
        onClose={() => setResetConfirmOpen(false)}
        onConfirm={handleReset}
      />
      <InstructionsModal
        open={instructionsOpen}
        onClose={() => setInstructionsOpen(false)}
      />
      <ExitConfirmModal
        open={exitConfirmOpen}
        onClose={() => setExitConfirmOpen(false)}
        onConfirm={handleCloseWindow}
      />

      {drawHook.storageWarning && (
        <div className="absolute bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-xl border border-red-200 bg-red-50/95 px-4 py-2 text-xs font-medium text-red-700 shadow-lg backdrop-blur-sm">
          {drawHook.storageWarning}
        </div>
      )}
      {loading && <DashboardLoader onDone={() => setLoading(false)} />}
    </div>
  );
}

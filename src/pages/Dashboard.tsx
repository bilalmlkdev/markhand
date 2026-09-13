import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { DrawingCanvas } from "../components/canvas/DrawingCanvas";
import { DashboardToolbar } from "../components/canvas/DashboardToolbar";
import { ExportModal } from "../components/exports/ExportModal";
import { ShareModal } from "../components/layout/ShareModal";
import { ResetConfirmModal } from "../components/layout/ResetconfirmModal";
import { InstructionsModal } from "../components/layout/InstructionsModal";
import { useDraw, CURSOR_DEFAULT_WIDTH } from "../hooks/useDraw";
import {
  useKeyboardShortcuts,
  GUIDE_ORDER,
} from "../hooks/useKeyboardShortcuts";
import { ProductTour } from "../components/layout/ProductTour";
import { DashboardLoader } from "../components/layout/DashboardLoader";
import { hasSeenTour } from "../lib/tour";
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
} from "../lib/storage";
import type { GuideType, CanvasTheme, CursorStyle } from "../types";

// Generate a random ID (8 characters)
function generateId(): string {
  return crypto.randomUUID();
}

export function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const cameFromLanding = Boolean(
    (location.state as { fromLanding?: boolean } | null)?.fromLanding,
  );
  const [sharedStrokes] = useState(() => getStrokesFromUrl());
  const drawHook = useDraw(id || generateId(), sharedStrokes);

  // history.state (and therefore useLocation().state) survives a hard
  // reload in most browsers, so relying on it alone would replay the
  // loader every time the page is refreshed. Consume the flag once per
  // navigation via sessionStorage so a reload of the same entry doesn't
  // re-trigger it.
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

  const [guideType, setGuideType] = useState<GuideType>(
    (loadGuide() as GuideType) ?? "dots",
  );
  const [theme, setTheme] = useState<CanvasTheme>(
    (loadTheme() as CanvasTheme) ?? "white",
  );
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(
    (loadCursor() as CursorStyle) ?? "pencil",
  );
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [tourRun, setTourRun] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  // Actions that used to live in the top-right header pill. Moved here
  // since the trigger buttons now live in the bottom dock, and Header is
  // just the brand mark.
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!hasSeenTour()) {
      // Let the canvas and floating UI mount before spotlighting them.
      const t = setTimeout(() => setTourRun(true), 400);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useEffect(() => {
    drawHook.setCurrentWidth(CURSOR_DEFAULT_WIDTH[cursorStyle]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (drawHook.isEmpty) {
      if (drawHook.hasDrawn) removeDrawingMeta(drawHook.drawingId);
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
    // Previously handled inside StylePanel's own effect; moved here now
    // that the theme picker lives in the unified toolbar instead.
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
    enabled: !instructionsOpen && !tourRun && !loading,
  });

  const handleToggleInstructions = () => {
    setInstructionsOpen((prev) => !prev);
  };

  const handleReset = () => {
    drawHook.clear();
    const newId = generateId();
    navigate(`/dashboard/${newId}`);
    setResetConfirmOpen(false);
  };

  const canvas = drawHook.getCanvas();
  const canvasWidth = canvas?.width ?? 800;
  const canvasHeight = canvas?.height ?? 500;

  return (
    <div className="h-screen flex flex-col text-stone-900 overflow-hidden relative font-body">
      <div data-tour="canvas" className="flex-1 relative overflow-hidden">
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

      <ProductTour run={tourRun} onFinish={() => setTourRun(false)} />
      {loading && <DashboardLoader onDone={() => setLoading(false)} />}
    </div>
  );
}

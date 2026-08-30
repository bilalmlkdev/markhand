import { useState, useEffect } from "react";
import { Routes, Route, useParams, useLocation } from "react-router-dom";
import { LandingPage } from "./components/landing/LandingPage";
import { DrawingsGallery } from "./components/gallery/DrawingsGallery";
import { Header } from "./components/layout/Header";
import { DrawingCanvas } from "./components/canvas/DrawingCanvas";
import { StylePanel } from "./components/layout/StylePanel";
import { DashboardToolbar } from "./components/canvas/DashboardToolbar";
import { useDraw, CURSOR_DEFAULT_WIDTH } from "./hooks/useDraw";
import {
  useKeyboardShortcuts,
  GUIDE_ORDER,
} from "./hooks/useKeyboardShortcuts";
import { ProductTour } from "./components/layout/ProductTour";
import { DashboardLoader } from "./components/layout/DashboardLoader";
import { hasSeenTour } from "./lib/tour";
import { getStrokesFromUrl, cleanUrl } from "./lib/share";
import {
  loadTheme,
  loadGuide,
  loadCursor,
  saveTheme,
  saveGuide,
  saveCursor,
  upsertDrawingMeta,
  removeDrawingMeta,
} from "./lib/storage";
import type { GuideType, CanvasTheme, CursorStyle } from "./types";

// Generate a random ID (8 characters)
function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
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
  }, [drawHook.strokes, drawHook.hasDrawn, drawHook.isEmpty, drawHook.drawingId, theme]);

  const handleGuideChange = (guide: GuideType) => {
    setGuideType(guide);
    saveGuide(guide);
  };

  const handleThemeChange = (t: CanvasTheme) => {
    setTheme(t);
    saveTheme(t);
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

  return (
    <div className="h-screen flex flex-col text-stone-900 overflow-hidden relative font-body">
      <Header
        drawHook={drawHook}
        theme={theme}
        guideType={guideType}
        onToggleInstructions={handleToggleInstructions}
      />
      <div data-tour="canvas" className="flex-1 relative overflow-hidden">
        <DrawingCanvas
          drawHook={drawHook}
          guideType={guideType}
          theme={theme}
          cursorStyle={cursorStyle}
          isErasing={isErasing}
        />
        <StylePanel
          drawHook={drawHook}
          activeTheme={theme}
          onThemeChange={handleThemeChange}
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
        />
      </div>
      <ProductTour run={tourRun} onFinish={() => setTourRun(false)} />
      {loading && <DashboardLoader onDone={() => setLoading(false)} />}
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/drawings" element={<DrawingsGallery />} />
      <Route path="/dashboard/:id" element={<Dashboard />} />
    </Routes>
  );
}

export default App;

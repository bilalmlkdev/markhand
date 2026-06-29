import { useState } from 'react';
import { Header } from './components/layout/Header';
import { DrawingCanvas } from './components/canvas/DrawingCanvas';
import { FloatingPanel } from './components/layout/FloatingPanel';
import { GuidePills } from './components/canvas/GuidePills';
import { CursorPills } from './components/canvas/CursorPills';
import { useDraw } from './hooks/useDraw';
import { loadTheme, loadGuide, loadCursor, saveTheme, saveGuide, saveCursor } from './lib/storage';
import type { GuideType, CanvasTheme, CursorStyle } from './types';

function App() {
  const drawHook = useDraw();

  const [guideType, setGuideType] = useState<GuideType>((loadGuide() as GuideType) ?? 'dots');
  const [theme, setTheme] = useState<CanvasTheme>((loadTheme() as CanvasTheme) ?? 'default');
  const [cursorStyle, setCursorStyle] = useState<CursorStyle>(
    (loadCursor() as CursorStyle) ?? 'crosshair',
  );

  const handleGuideChange = (guide: GuideType) => {
    setGuideType(guide);
    saveGuide(guide);
  };

  const handleThemeChange = (t: CanvasTheme) => {
    setTheme(t);
    saveTheme(t);
  };

  const handleCursorChange = (cursor: CursorStyle) => {
    setCursorStyle(cursor);
    saveCursor(cursor);
  };

  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-900 overflow-hidden">
      <Header drawHook={drawHook} theme={theme} guideType={guideType} />
      <div className="flex-1 relative overflow-hidden">
        <DrawingCanvas
          drawHook={drawHook}
          guideType={guideType}
          theme={theme}
          cursorStyle={cursorStyle}
        />
        <CursorPills activeCursor={cursorStyle} onChange={handleCursorChange} />
        <GuidePills activeGuide={guideType} onChange={handleGuideChange} />
        <FloatingPanel drawHook={drawHook} activeTheme={theme} onThemeChange={handleThemeChange} />
      </div>
    </div>
  );
}

export default App;

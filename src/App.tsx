import { useState } from 'react';
import { Header } from './components/layout/Header';
import { DrawingCanvas } from './components/canvas/DrawingCanvas';
import { FloatingPanel } from './components/layout/FloatingPanel';
import { GuidePills } from './components/canvas/GuidePills';
import { useDraw } from './hooks/useDraw';
import type { GuideType, CanvasTheme } from './types';

function App() {
  const drawHook = useDraw();
  const [guideType, setGuideType] = useState<GuideType>('dots');
  const [theme, setTheme] = useState<CanvasTheme>('default');

  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-900 overflow-hidden">
      <Header drawHook={drawHook} theme={theme} guideType={guideType} />
      <div className="flex-1 relative overflow-hidden">
        <DrawingCanvas drawHook={drawHook} guideType={guideType} theme={theme} />
        <GuidePills activeGuide={guideType} onChange={setGuideType} />
        <FloatingPanel drawHook={drawHook} activeTheme={theme} onThemeChange={setTheme} />
      </div>
    </div>
  );
}

export default App;

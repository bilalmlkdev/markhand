import { useState } from 'react';
import { Header } from './components/layout/Header';
import { DrawingCanvas } from './components/canvas/DrawingCanvas';
import { FloatingPanel } from './components/layout/FloatingPanel';
import { Footer } from './components/layout/Footer';
import { useDraw } from './hooks/useDraw';
import type { GuideType } from './types';

function App() {
  const drawHook = useDraw();
  const [guideType, setGuideType] = useState<GuideType>('dots');

  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-900 overflow-hidden">
      <Header drawHook={drawHook} />
      <div className="flex-1 relative overflow-hidden">
        <DrawingCanvas drawHook={drawHook} guideType={guideType} />
        <FloatingPanel drawHook={drawHook} guideType={guideType} onGuideChange={setGuideType} />
      </div>
      <Footer />
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DrawingCanvas } from './components/canvas/DrawingCanvas';
import { Footer } from './components/layout/Footer';
import { useDraw } from './hooks/useDraw';
import type { GuideType } from './types';

function App() {
  const drawHook = useDraw();
  const [guideType, setGuideType] = useState<GuideType>('dots');

  return (
    <div className="h-screen flex flex-col bg-stone-50 text-stone-900 overflow-hidden">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar drawHook={drawHook} guideType={guideType} onGuideChange={setGuideType} />
        <DrawingCanvas drawHook={drawHook} guideType={guideType} />
      </div>
      <Footer />
    </div>
  );
}

export default App;

import { useRef, useEffect, useCallback } from 'react';
import { drawDotGrid, drawLineGrid } from '../../lib/canvas';
import type { GuideType } from '../../types';
import type { useDraw } from '../../hooks/useDraw';

interface DrawingCanvasProps {
  drawHook: ReturnType<typeof useDraw>;
  guideType: GuideType;
}

export function DrawingCanvas({ drawHook, guideType }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { strokes, isEmpty, setCanvas, startDrawing, draw, stopDrawing, redrawAll, resizeCanvas } =
    drawHook;

  // Register canvas with hook on mount
  useEffect(() => {
    setCanvas(canvasRef.current);
  }, [setCanvas]);

  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    if (guideType === 'dots') {
      drawDotGrid(ctx, width, height);
    } else if (guideType === 'grid' || guideType === 'lines') {
      drawLineGrid(ctx, width, height);
    }

    redrawAll(ctx);
  }, [guideType, redrawAll]);

  // Resize on mount
  useEffect(() => {
    resizeCanvas();
    renderFrame();
    const handleResize = () => {
      resizeCanvas();
      renderFrame();
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas, renderFrame]);

  // Redraw on stroke change
  useEffect(() => {
    renderFrame();
  }, [strokes, renderFrame]);

  return (
    <div className="flex-1 overflow-hidden bg-stone-100 relative">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 cursor-crosshair touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {isEmpty && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-stone-300 text-sm select-none">Start drawing your mark</p>
        </div>
      )}
      {!isEmpty && (
        <div className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-stone-400 border border-stone-200">
          {strokes.length} stroke{strokes.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

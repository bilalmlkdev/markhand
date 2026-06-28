import { useRef, useEffect, useCallback } from 'react';
import { useDraw } from '../../hooks/useDraw';
import { drawDotGrid, drawLineGrid } from '../../lib/canvas';
import type { GuideType } from '../../types';

interface DrawingCanvasProps {
  guideType?: GuideType;
}

export function DrawingCanvas({ guideType = 'dots' }: DrawingCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { strokes, isEmpty, startDrawing, draw, stopDrawing, redraw, resizeCanvas } =
    useDraw(canvasRef);

  const fullRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);

    if (guideType === 'dots') {
      drawDotGrid(ctx, width, height);
    } else if (guideType === 'grid') {
      drawLineGrid(ctx, width, height);
    }

    redraw(ctx);
  }, [redraw, guideType]);

  useEffect(() => {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [resizeCanvas]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    fullRedraw();
    ctx.restore();
  }, [strokes, fullRedraw]);

  return (
    <div ref={containerRef} className="flex-1 overflow-hidden bg-stone-100 relative">
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

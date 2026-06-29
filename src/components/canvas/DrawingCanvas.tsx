import { useRef, useEffect, useCallback } from 'react';
import { drawDotGrid, drawLineGrid } from '../../lib/canvas';
import type { GuideType } from '../../types';
import type { UseDrawReturn } from '../../hooks/useDraw';

interface DrawingCanvasProps {
  drawHook: UseDrawReturn;
  guideType: GuideType;
}

export function DrawingCanvas({ drawHook, guideType }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  const {
    strokes,
    isEmpty,
    isDrawing,
    setCanvas,
    startDrawing,
    draw,
    stopDrawing,
    redrawAll,
    resizeCanvas,
  } = drawHook;

  // Register canvas with hook
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

    // Draw guides
    if (guideType === 'dots') {
      drawDotGrid(ctx, width, height);
    } else if (guideType === 'grid' || guideType === 'lines') {
      drawLineGrid(ctx, width, height);
    }

    // Draw strokes (includes current in-progress stroke)
    redrawAll(ctx);
  }, [guideType, redrawAll]);

  // Animation loop while drawing
  useEffect(() => {
    const loop = () => {
      renderFrame();
      rafRef.current = requestAnimationFrame(loop);
    };

    if (isDrawing) {
      rafRef.current = requestAnimationFrame(loop);
    } else {
      renderFrame();
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isDrawing, strokes, renderFrame]);

  // Initial resize
  useEffect(() => {
    resizeCanvas();
    renderFrame();

    const handleResize = () => {
      resizeCanvas();
      setTimeout(renderFrame, 0);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas, renderFrame]);

  return (
    <div className="w-full h-full overflow-hidden bg-stone-100 relative">
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
      {isEmpty && !isDrawing && (
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

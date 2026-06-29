import { useRef, useEffect, useCallback, useState } from 'react';
import { drawDotGrid, drawLineGrid, themes } from '../../lib/canvas';
import { cursors } from '../../lib/cursors';
import { getRandomDoodle } from '../../lib/doodles';
import type { GuideType, CanvasTheme, CursorStyle } from '../../types';
import type { UseDrawReturn } from '../../hooks/useDraw';

interface DrawingCanvasProps {
  drawHook: UseDrawReturn;
  guideType: GuideType;
  theme: CanvasTheme;
  cursorStyle: CursorStyle;
}

export function DrawingCanvas({ drawHook, guideType, theme, cursorStyle }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Clean Fix: Select a random relative doodle immediately on component initialization
  const [initialDoodle] = useState(() => getRandomDoodle());

  const { strokes, setCanvas, startDrawing, draw, stopDrawing, resizeCanvas, hasDrawn } = drawHook;

  const themeConfig = themes[theme];
  const cursorCss = cursors[cursorStyle]?.css ?? 'crosshair';

  useEffect(() => {
    setCanvas(canvasRef.current);
  }, [setCanvas]);

  const renderWithGuides = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use the actual high-DPI physical dimensions from the canvas element
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, width, height);

    if (guideType === 'dots') {
      drawDotGrid(ctx, width, height, themeConfig.dot);
    } else if (guideType === 'grid' || guideType === 'lines') {
      drawLineGrid(ctx, width, height, 32, themeConfig.dot);
    }

    if (hasDrawn) {
      // Draw user strokes (stored as absolute physical pixels)
      strokes.forEach(s => {
        if (s.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(s.points[0]!.x, s.points[0]!.y);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineTo(s.points[i]!.x, s.points[i]!.y);
        }
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });
    } else {
      // Draw initial doodle (map relative coordinates on-the-fly to current dimensions)
      initialDoodle.forEach(s => {
        if (s.points.length < 2) return;
        ctx.beginPath();
        ctx.moveTo(s.points[0]!.x * width, s.points[0]!.y * height);
        for (let i = 1; i < s.points.length; i++) {
          ctx.lineTo(s.points[i]!.x * width, s.points[i]!.y * height);
        }
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      });
    }
  }, [strokes, hasDrawn, guideType, themeConfig, initialDoodle]);

  // Redraw whenever render dependencies update
  useEffect(() => {
    renderWithGuides();
  }, [renderWithGuides]);

  // Handle window resizing safely without flaky timeouts
  useEffect(() => {
    resizeCanvas();
    renderWithGuides();

    const handleResize = () => {
      resizeCanvas();
      renderWithGuides();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [resizeCanvas, renderWithGuides]);

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{ backgroundColor: themeConfig.bg }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none"
        style={{ cursor: cursorCss }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
      />
      {!hasDrawn && (
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-stone-400 border border-stone-200 pointer-events-none">
          Start drawing — this doodle is yours to trace
        </div>
      )}
      {hasDrawn && (
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-stone-400 border border-stone-200 pointer-events-none">
          {strokes.length} stroke{strokes.length !== 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

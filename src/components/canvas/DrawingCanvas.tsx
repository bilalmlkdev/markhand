import { useRef, useEffect, useCallback, useState } from 'react';
import { drawDotGrid, drawLineGrid, themes } from '../../lib/canvas';
import { cursors } from '../../lib/cursors';
import { getRandomDoodle } from '../../lib/doodles';
import type { GuideType, CanvasTheme, CursorStyle } from '../../types';
import type { UseDrawReturn } from '../../hooks/useDraw';
import type { DoodleSet } from '../../lib/doodles';

interface DrawingCanvasProps {
  drawHook: UseDrawReturn;
  guideType: GuideType;
  theme: CanvasTheme;
  cursorStyle: CursorStyle;
}

export function DrawingCanvas({ drawHook, guideType, theme, cursorStyle }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [doodleName] = useState(() => getRandomDoodle().name);

  const {
    strokes,
    setCanvas,
    startDrawing,
    draw,
    stopDrawing,
    resizeCanvas,
    hasDrawn,
    seedStrokes,
  } = drawHook;

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

    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, width, height);

    if (guideType === 'dots') {
      drawDotGrid(ctx, width, height, themeConfig.dot);
    } else if (guideType === 'grid' || guideType === 'lines') {
      drawLineGrid(ctx, width, height, 32, themeConfig.dot);
    }

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
  }, [strokes, guideType, themeConfig]);

  useEffect(() => {
    renderWithGuides();
  }, [renderWithGuides]);

  const seededRef = useRef(false);
  useEffect(() => {
    if (seededRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (hasDrawn || strokes.length > 0) {
      seededRef.current = true;
      return;
    }

    resizeCanvas();
    const { width, height } = canvas;
    if (width === 0 || height === 0) return;

    const doodleSet: DoodleSet = getRandomDoodle();
    const absoluteDoodle = doodleSet.strokes.map(s => ({
      id: s.id,
      color: s.color,
      width: s.width,
      points: s.points.map(p => ({ x: p.x * width, y: p.y * height })),
    }));
    seedStrokes(absoluteDoodle);
    seededRef.current = true;
  });

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

      {/* Doodle name — only when doodle is present and user hasn't drawn */}
      {!hasDrawn && strokes.length > 0 && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-stone-500 border border-stone-200 shadow-sm pointer-events-none">
          {doodleName}
        </div>
      )}

      {/* Hint — only when doodle is present and user hasn't drawn */}
      {!hasDrawn && strokes.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-stone-400 border border-stone-200 pointer-events-none">
          Start drawing — this doodle is yours to trace
        </div>
      )}

      {/* Empty state — nothing on canvas */}
      {!hasDrawn && strokes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-stone-300 text-sm select-none">Start drawing your mark</p>
        </div>
      )}

      {/* Stroke count — user has drawn */}
      {hasDrawn && strokes.length > 0 && (
        <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-xs text-stone-400 border border-stone-200 pointer-events-none">
          {strokes.length} stroke{strokes.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Empty state after clear */}
      {hasDrawn && strokes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="text-stone-300 text-sm select-none">Start drawing your mark</p>
        </div>
      )}
    </div>
  );
}

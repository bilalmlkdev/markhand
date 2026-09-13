import { useRef, useEffect, useCallback, useState } from "react";
import { drawDotGrid, drawLineGrid, themes } from "../../lib/canvas";
import { getCursorCss } from "../../lib/cursors";
import type { GuideType, CanvasTheme, CursorStyle } from "../../types";
import type { UseDrawReturn } from "../../hooks/useDraw";

interface DrawingCanvasProps {
  drawHook: UseDrawReturn;
  guideType: GuideType;
  theme: CanvasTheme;
  cursorStyle: CursorStyle;
  isErasing: boolean;
}

export function DrawingCanvas({
  drawHook,
  guideType,
  theme,
  cursorStyle,
  isErasing,
}: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    strokes,
    setCanvas,
    startDrawing,
    draw,
    stopDrawing,
    startErasing,
    erase,
    stopErasing,
    eraserRadius,
    resizeCanvas,
  } = drawHook;
  const themeConfig = themes[theme];
  const isDark = theme === "dark" || theme === "graphite";
  const cursorColor = isDark ? "#ffffff" : "#1c1917";
  const cursorCss = getCursorCss(cursorStyle, cursorColor);
  const placeholderColor = isDark ? "text-stone-600" : "text-stone-300";
  const [eraserPos, setEraserPos] = useState<{ x: number; y: number } | null>(
    null,
  );
  const [displayScale, setDisplayScale] = useState(1);

  useEffect(() => {
    setCanvas(canvasRef.current);
  }, [setCanvas]);

  const renderWithGuides = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { width, height } = canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, width, height);
    if (guideType === "dots") drawDotGrid(ctx, width, height, themeConfig.dot);
    else if (guideType === "grid" || guideType === "lines")
      drawLineGrid(ctx, width, height, 32, themeConfig.dot);
    strokes.forEach((s) => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s.points[0]!.x, s.points[0]!.y);
      for (let i = 1; i < s.points.length; i++)
        ctx.lineTo(s.points[i]!.x, s.points[i]!.y);
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    });
  }, [strokes, guideType, themeConfig]);

  useEffect(() => {
    renderWithGuides();
  }, [renderWithGuides]);

  useEffect(() => {
    const updateScale = () => {
      const canvas = canvasRef.current;
      if (canvas && canvas.width > 0) {
        setDisplayScale(canvas.clientWidth / canvas.width);
      }
    };
    resizeCanvas();
    renderWithGuides();
    updateScale();
    const handleResize = () => {
      resizeCanvas();
      renderWithGuides();
      updateScale();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [resizeCanvas, renderWithGuides]);

  const updateEraserPos = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      setEraserPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [],
  );

  const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isErasing) {
      updateEraserPos(e);
      startErasing(e);
    } else {
      startDrawing(e);
    }
  };
  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isErasing) {
      updateEraserPos(e);
      erase(e);
    } else {
      draw(e);
    }
  };
  const handleEnd = () => {
    if (isErasing) stopErasing();
    else stopDrawing();
  };

  // devicePixelRatio-scaled radius, converted back to CSS px for the
  // on-screen ring so it visually matches the actual erased area.
  const eraserRingRadius = eraserRadius * displayScale;

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      style={{ backgroundColor: themeConfig.bg }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 touch-none select-none"
        style={{ cursor: isErasing ? "none" : cursorCss }}
        onPointerDown={(e) => {
          if (!e.isPrimary) return;
          e.currentTarget.setPointerCapture(e.pointerId);
          handleStart(e);
        }}
        onPointerMove={(e) => {
          if (!e.isPrimary) return;
          handleMove(e);
        }}
        onPointerUp={(e) => {
          if (!e.isPrimary) return;
          handleEnd();
          setEraserPos(null);
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={(e) => {
          if (!e.isPrimary) return;
          handleEnd();
          setEraserPos(null);
        }}
        onPointerEnter={updateEraserPos}
        onPointerLeave={() => {
          if (!isErasing) return;
          setEraserPos(null);
        }}
      />

      {isErasing && eraserPos && (
        <div
          className="absolute rounded-full border-2 border-stone-500 bg-stone-500/10 pointer-events-none"
          style={{
            left: eraserPos.x - eraserRingRadius,
            top: eraserPos.y - eraserRingRadius,
            width: eraserRingRadius * 2,
            height: eraserRingRadius * 2,
          }}
        />
      )}

      {strokes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className={`text-sm select-none ${placeholderColor}`}>
            Start drawing your mark
          </p>
        </div>
      )}

      {strokes.length > 0 && (
        <div className="absolute bottom-3 right-2 sm:right-3 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] sm:text-xs text-stone-400 border border-stone-200 pointer-events-none">
          {strokes.length} stroke{strokes.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

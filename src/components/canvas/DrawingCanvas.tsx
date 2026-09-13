import { useRef, useEffect, useCallback, useState } from "react";
import { drawDotGrid, drawGrid, themes } from "../../lib/canvas";
import { paintStroke } from "../../lib/render";
import { getCursorCss } from "../../lib/cursors";
import type { GuideType, CanvasTheme, CursorStyle, Stroke } from "../../types";
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
  // Buffer with background + guides + strokes, blitted per move (cheap draw).
  const bufferRef = useRef<HTMLCanvasElement | null>(null);
  const {
    strokes,
    isDrawing,
    setCanvas,
    setRedrawBase,
    startDrawing,
    draw,
    stopDrawing,
    startErasing,
    erase,
    stopErasing,
    setEraseRepaint,
    eraserRadius,
    resizeCanvas,
  } = drawHook;
  const themeConfig = themes[theme] ?? themes.default;
  const cursorColor = "#1c1917";
  const cursorCss = getCursorCss(cursorStyle, cursorColor);
  const placeholderColor = "text-stone-300";
  const eraserRingRef = useRef<HTMLDivElement>(null);
  const [displayScale, setDisplayScale] = useState(1);

  useEffect(() => {
    setCanvas(canvasRef.current);
  }, [setCanvas]);

  // Base layer → offscreen buffer; strokes passed in so erase can repaint
  // from a working copy without a React render.
  const renderBuffer = useCallback(
    (strokesToPaint: Stroke[]) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      if (!bufferRef.current) bufferRef.current = document.createElement("canvas");
      const buffer = bufferRef.current;
      if (buffer.width !== canvas.width || buffer.height !== canvas.height) {
        buffer.width = canvas.width;
        buffer.height = canvas.height;
      }
      const ctx = buffer.getContext("2d");
      if (!ctx) return;
      const { width, height } = buffer;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = themeConfig.bg;
      ctx.fillRect(0, 0, width, height);
      const dpr = window.devicePixelRatio || 1;
      if (guideType === "dots") drawDotGrid(ctx, width, height, themeConfig.dot, dpr);
      else if (guideType === "grid") drawGrid(ctx, width, height, themeConfig.dot, dpr);
      strokesToPaint.forEach((s) => {
        paintStroke(ctx, s);
      });
    },
    [guideType, themeConfig],
  );

  // Single drawImage blit of the buffer onto the visible canvas.
  const paintFromBuffer = useCallback(() => {
    const canvas = canvasRef.current;
    const buffer = bufferRef.current;
    if (!canvas || !buffer) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(buffer, 0, 0);
  }, []);

  const renderWithGuides = useCallback(() => {
    renderBuffer(strokes);
    paintFromBuffer();
  }, [renderBuffer, paintFromBuffer, strokes]);

  useEffect(() => {
    renderWithGuides();
  }, [renderWithGuides]);

  // Lets useDraw reset to the buffer before painting the live preview.
  useEffect(() => {
    setRedrawBase(paintFromBuffer);
    return () => setRedrawBase(null);
  }, [setRedrawBase, paintFromBuffer]);

  // Erase fast path: bypasses React entirely, removing per-move lag.
  useEffect(() => {
    setEraseRepaint((strokesToPaint: Stroke[]) => {
      renderBuffer(strokesToPaint);
      paintFromBuffer();
    });
    return () => setEraseRepaint(null);
  }, [setEraseRepaint, renderBuffer, paintFromBuffer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const updateScale = () => {
      if (canvas.width > 0) {
        setDisplayScale(canvas.clientWidth / canvas.width);
      }
    };

    const applySize = () => {
      resizeCanvas();
      renderWithGuides();
      updateScale();
    };

    // ResizeObserver handles the lazy-route canvas sizing race; the window
    // resize fallback covers DPR changes when moving across displays.
    const observer = new ResizeObserver(() => applySize());
    observer.observe(parent);
    window.addEventListener("resize", applySize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applySize);
    };
  }, [resizeCanvas, renderWithGuides]);

  // Radius scaled by DPR, back to CSS px for a ring matching the erased area.
  const eraserRingRadius = eraserRadius * displayScale;

  const hideEraserRing = useCallback(() => {
    const ring = eraserRingRef.current;
    if (ring) ring.style.visibility = "hidden";
  }, []);

  const updateEraserPos = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ring = eraserRingRef.current;
      if (ring) {
        ring.style.visibility = "visible";
        ring.style.left = `${x - eraserRingRadius}px`;
        ring.style.top = `${y - eraserRingRadius}px`;
      }
    },
    [eraserRingRadius],
  );

  const handleStart = (e: React.PointerEvent<HTMLCanvasElement>) => {
    // Only the primary (left) button drives drawing/erasing.
    if (e.button !== 0) return;
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

  // Keep ring size in sync when radius changes mid-gesture.
  useEffect(() => {
    const ring = eraserRingRef.current;
    if (!ring) return;
    ring.style.width = `${eraserRingRadius * 2}px`;
    ring.style.height = `${eraserRingRadius * 2}px`;
  }, [eraserRingRadius]);

  // Ring disappears the moment eraser mode is switched off.
  useEffect(() => {
    if (!isErasing) hideEraserRing();
  }, [isErasing, hideEraserRing]);

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
          hideEraserRing();
          if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
          }
        }}
        onPointerCancel={(e) => {
          if (!e.isPrimary) return;
          handleEnd();
          hideEraserRing();
        }}
        onContextMenu={(e) => e.preventDefault()}
      />

      <div
        ref={eraserRingRef}
        className="absolute rounded-full border-2 border-stone-500 bg-stone-500/10 pointer-events-none"
        style={{
          width: eraserRingRadius * 2,
          height: eraserRingRadius * 2,
          visibility: "hidden",
        }}
      />

      {strokes.length === 0 && !isDrawing && !isErasing && (
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

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
  // Offscreen buffer holding just the base layer (background + guides +
  // committed strokes). Redrawn only when strokes/guides/theme actually
  // change, then blitted onto the visible canvas with a single drawImage
  // per pointer move - far cheaper than replaying every stroke's path on
  // every move, which is what made the live preview a good candidate for
  // the same kind of lag the eraser had.
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

  // Renders the base layer into the offscreen buffer, sized to match the
  // visible canvas. Takes the strokes explicitly so the erase fast path
  // can repaint the buffer from a working copy without a React render.
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

  // Blits the current buffer onto the visible canvas. Cheap - a single
  // drawImage - so this is safe to call on every pointer move.
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

  // Registered with useDraw so the live drawing preview can cheaply reset
  // to the base layer (via the buffer, not a full stroke replay) before
  // drawing the smoothed in-progress stroke on top of it, each pointer
  // move.
  useEffect(() => {
    setRedrawBase(paintFromBuffer);
    return () => setRedrawBase(null);
  }, [setRedrawBase, paintFromBuffer]);

  // Registered with useDraw so the eraser can repaint the committed
  // strokes directly on each erase frame, bypassing React entirely - that
  // bypass (vs. one re-render + full rebuild per pointer move) is what
  // removes the erase lag on canvases with many strokes.
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

    // A one-time resizeCanvas() call on mount reads the parent's layout
    // via getBoundingClientRect at the exact moment this effect runs. On
    // a fresh client-side navigation into a lazy-loaded route, that can
    // fire before the browser has finished settling layout for the
    // newly-mounted tree (the Suspense fallback swap doesn't guarantee a
    // completed layout pass the way a full page load does), so the
    // canvas could get sized against a stale or zero rect - it only
    // "worked after refresh" because a fresh load has no such race.
    //
    // ResizeObserver sidesteps the whole problem: it reports the actual
    // box size whenever it's ready, including the very first callback,
    // and fires again automatically if the container settles into a
    // different size a moment later. No guessing about timing needed.
    const observer = new ResizeObserver(() => applySize());
    observer.observe(parent);

    // Still handle real window resizes (ResizeObserver already covers
    // most of these via the parent's box changing, but this remains a
    // harmless belt-and-suspenders for edge cases like devicePixelRatio
    // changes from moving across displays).
    window.addEventListener("resize", applySize);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applySize);
    };
  }, [resizeCanvas, renderWithGuides]);

  // devicePixelRatio-scaled radius, converted back to CSS px for the
  // on-screen ring so it visually matches the actual erased area.
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
    // Only the primary (left) button drives drawing/erasing; right or
    // middle clicks must not start or alter a stroke.
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

  // Keep the ring size in sync when the radius is changed from the toolbar
  // popover mid-gesture.
  useEffect(() => {
    const ring = eraserRingRef.current;
    if (!ring) return;
    ring.style.width = `${eraserRingRadius * 2}px`;
    ring.style.height = `${eraserRingRadius * 2}px`;
  }, [eraserRingRadius]);

  // Guarantee the ring disappears the moment eraser mode is switched off
  // (e.g. picking another tool from the toolbar), no matter where the
  // pointer currently is.
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

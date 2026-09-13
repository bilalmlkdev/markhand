import { useState, useCallback, useRef, useEffect } from "react";
import type { CursorStyle, Point, Stroke } from "../types";
import { smoothPoints } from "../lib/ink";
import { remapInkColorForBackground } from "../lib/palette";

// Real-tool-like default line weight per cursor, applied when the user
// switches tools — mirrors how Procreate/Photoshop brush presets work.
export const CURSOR_DEFAULT_WIDTH: Record<CursorStyle, number> = {
  crosshair: 2,
  pencil: 3,
  dot: 2,
  brush: 8,
  pen: 4,
};

export const ERASER_RADIUS_RANGE = { min: 6, max: 60 } as const;

export interface UseDrawReturn {
  strokes: Stroke[];
  isEmpty: boolean;
  currentColor: string;
  currentWidth: number;
  setCurrentColor: (color: string) => void;
  setCurrentWidth: (width: number) => void;
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  setRedrawBase: (fn: (() => void) | null) => void;
  startDrawing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  draw: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  stopDrawing: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  resizeCanvas: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  hasDrawn: boolean;
  canUndo: boolean;
  canRedo: boolean;
  drawingId: string;
  recolorForBackground: (bgIsLight: boolean) => void;
  eraserRadius: number;
  setEraserRadius: (radius: number) => void;
  startErasing: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  erase: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  stopErasing: () => void;
}

function getStorageKey(drawingId: string): string {
  return `markhand_drawing_${drawingId}`;
}

function loadStrokes(drawingId: string): Stroke[] {
  try {
    const raw = localStorage.getItem(getStorageKey(drawingId));
    return raw ? (JSON.parse(raw) as Stroke[]) : [];
  } catch {
    return [];
  }
}

function saveStrokes(drawingId: string, strokes: Stroke[]) {
  try {
    localStorage.setItem(getStorageKey(drawingId), JSON.stringify(strokes));
  } catch {}
}

// Per‑drawing hasDrawn flag
function getHasDrawnKey(drawingId: string): string {
  return `markhand_hasDrawn_${drawingId}`;
}

function loadHasDrawn(drawingId: string): boolean {
  try {
    return localStorage.getItem(getHasDrawnKey(drawingId)) === "true";
  } catch {
    return false;
  }
}

function saveHasDrawn(drawingId: string, val: boolean) {
  try {
    localStorage.setItem(getHasDrawnKey(drawingId), String(val));
  } catch {}
}

// Global per‑user settings (not per drawing)
const COLOR_KEY = "markhand_color";
const WIDTH_KEY = "markhand_width";

function loadColor(): string {
  try {
    return localStorage.getItem(COLOR_KEY) ?? "#1c1917";
  } catch {
    return "#1c1917";
  }
}
function saveColor(color: string) {
  try {
    localStorage.setItem(COLOR_KEY, color);
  } catch {}
}
function loadWidth(): number {
  try {
    const w = localStorage.getItem(WIDTH_KEY);
    const parsed = w ? Number(w) : 3;
    return Number.isFinite(parsed) ? Math.min(12, Math.max(1, parsed)) : 3;
  } catch {
    return 3;
  }
}
function saveWidth(width: number) {
  try {
    localStorage.setItem(WIDTH_KEY, String(width));
  } catch {}
}

const ERASER_RADIUS_KEY = "markhand_eraser_radius";
const ERASER_RADIUS_MIN = 6;
const ERASER_RADIUS_MAX = 60;
const ERASER_RADIUS_DEFAULT = 14;

function loadEraserRadius(): number {
  try {
    const r = localStorage.getItem(ERASER_RADIUS_KEY);
    const parsed = r ? Number(r) : ERASER_RADIUS_DEFAULT;
    return Number.isFinite(parsed)
      ? Math.min(ERASER_RADIUS_MAX, Math.max(ERASER_RADIUS_MIN, parsed))
      : ERASER_RADIUS_DEFAULT;
  } catch {
    return ERASER_RADIUS_DEFAULT;
  }
}
function saveEraserRadius(radius: number) {
  try {
    localStorage.setItem(ERASER_RADIUS_KEY, String(radius));
  } catch {}
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function distanceToSegment(point: Point, start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  if (dx === 0 && dy === 0) return distance(point, start);

  const t = Math.max(
    0,
    Math.min(
      1,
      ((point.x - start.x) * dx + (point.y - start.y) * dy) /
        (dx * dx + dy * dy),
    ),
  );

  return distance(point, {
    x: start.x + t * dx,
    y: start.y + t * dy,
  });
}

// Remove points touched by the eraser and also detect long segments that
// cross the eraser circle between sampled points. Dense pointer sampling
// handles normal strokes well, while the segment test prevents obvious
// "eraser passed through the line but nothing happened" gaps.
function eraseFromStroke(
  stroke: Stroke,
  eraserPoint: Point,
  radius: number,
): Stroke[] {
  if (stroke.points.length < 2) return [stroke];

  const segments: Point[][] = [];
  let current: Point[] = [];
  let changed = false;

  for (let i = 0; i < stroke.points.length; i++) {
    const point = stroke.points[i]!;
    const previous = stroke.points[i - 1];
    const touched =
      distance(point, eraserPoint) <= radius ||
      (previous !== undefined &&
        distanceToSegment(eraserPoint, previous, point) <= radius);

    if (touched) {
      changed = true;
      if (current.length >= 2) segments.push(current);
      current = [];
    } else {
      current.push(point);
    }
  }

  if (current.length >= 2) segments.push(current);

  if (!changed) return [stroke];

  return segments.map((points) => ({
    id: crypto.randomUUID(),
    points,
    color: stroke.color,
    width: stroke.width,
  }));
}

export function useDraw(
  drawingId: string,
  initialStrokes?: Stroke[] | null,
): UseDrawReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const redrawBaseRef = useRef<(() => void) | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>(
    () => initialStrokes ?? loadStrokes(drawingId),
  );
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColorState] = useState(loadColor);
  const [currentWidth, setCurrentWidthState] = useState(loadWidth);
  const [hasDrawn, setHasDrawn] = useState(
    () => Boolean(initialStrokes?.length) || loadHasDrawn(drawingId),
  );

  const currentPointsRef = useRef<Point[]>([]);
  const isEmpty = strokes.length === 0;
  const [isErasing, setIsErasing] = useState(false);
  const eraseStrokeSnapshotRef = useRef<Stroke[] | null>(null);
  const eraseChangedRef = useRef(false);
  // Eraser size is independently adjustable (not tied to pen width) and
  // persisted across sessions like color/width.
  const [eraserRadius, setEraserRadiusState] = useState(loadEraserRadius);
  const setEraserRadius = useCallback((radius: number) => {
    const clamped = Math.min(
      ERASER_RADIUS_MAX,
      Math.max(ERASER_RADIUS_MIN, radius),
    );
    setEraserRadiusState(clamped);
    saveEraserRadius(clamped);
  }, []);
  // Pending erase point + rAF handle, so a burst of pointermove events
  // during a fast drag collapses into at most one erase + one React
  // commit per animation frame instead of one per pointer sample (which
  // is what caused the visible lag when moving the eraser quickly).
  const pendingErasePointRef = useRef<Point | null>(null);
  const eraseRafRef = useRef<number | null>(null);

  // Save strokes and hasDrawn whenever they change
  useEffect(() => {
    if (hasDrawn) {
      saveStrokes(drawingId, strokes);
      saveHasDrawn(drawingId, true);
    }
  }, [strokes, hasDrawn, drawingId]);

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  const setRedrawBase = useCallback((fn: (() => void) | null) => {
    redrawBaseRef.current = fn;
  }, []);

  const getCanvas = useCallback(() => canvasRef.current, []);

  const setCurrentColor = useCallback((color: string) => {
    setCurrentColorState(color);
    saveColor(color);
  }, []);

  const setCurrentWidth = useCallback((width: number) => {
    setCurrentWidthState(width);
    saveWidth(width);
  }, []);

  const getPoint = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    }
  }, []);

  const startDrawing = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      const point = getPoint(e);
      setIsDrawing(true);
      currentPointsRef.current = [point];
    },
    [getPoint],
  );

  const draw = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const point = getPoint(e);
      const prev = currentPointsRef.current;
      prev.push(point);

      if (prev.length < 2) return;

      // Live preview now uses the same Catmull-Rom smoothing as the
      // committed stroke (see stopDrawing below), so the line doesn't
      // visibly "snap" into a different shape the instant the pointer
      // lifts. Redraw the base layer (background/guides/committed
      // strokes) first, then paint the smoothed in-progress stroke on
      // top - repainting only the current stroke's own pixels would
      // leave a seam between the smoothed tail and the raw segments
      // drawn on previous frames underneath it.
      redrawBaseRef.current?.();
      const previewPoints = prev.length >= 4 ? smoothPoints(prev, 0.3) : prev;
      ctx.beginPath();
      ctx.moveTo(previewPoints[0]!.x, previewPoints[0]!.y);
      for (let i = 1; i < previewPoints.length; i++) {
        ctx.lineTo(previewPoints[i]!.x, previewPoints[i]!.y);
      }
      ctx.strokeStyle = currentColor;
      ctx.lineWidth = currentWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    },
    [isDrawing, getPoint, currentColor, currentWidth],
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const points = currentPointsRef.current;
    if (points.length > 1) {
      setUndoStack((prev) => [...prev, strokes]);
      setRedoStack([]);
      // Smooth the committed stroke (Catmull-Rom curve) so it reads as
      // natural ink rather than a raw jagged polyline of mouse samples.
      // Very short strokes (dots/taps) are left untouched.
      const finalPoints =
        points.length >= 4 ? smoothPoints(points, 0.3) : [...points];
      const newStroke: Stroke = {
        id: crypto.randomUUID(),
        points: finalPoints,
        color: currentColor,
        width: currentWidth,
      };
      setStrokes((prev) => [...prev, newStroke]);
      if (!hasDrawn) setHasDrawn(true);
    }
    currentPointsRef.current = [];
  }, [isDrawing, currentColor, currentWidth, strokes, hasDrawn]);

  // Eraser: snapshot strokes once at gesture start (for undo), then
  // progressively remove touched points as the user drags, splitting
  // strokes around the gap. Erase work for pointermove is coalesced onto
  // a single requestAnimationFrame so fast drags don't queue up more
  // erase passes + re-renders than the screen can actually paint.
  const runErase = useCallback(
    (point: Point) => {
      setStrokes((prev) => {
        const next = prev.flatMap((s) =>
          eraseFromStroke(s, point, eraserRadius),
        );
        if (
          next.length !== prev.length ||
          next.some((s, i) => s !== prev[i])
        ) {
          eraseChangedRef.current = true;
        }
        return next;
      });
    },
    [eraserRadius],
  );

  const startErasing = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      eraseStrokeSnapshotRef.current = strokes;
      eraseChangedRef.current = false;
      setIsErasing(true);
      runErase(getPoint(e));
    },
    [strokes, getPoint, runErase],
  );

  const erase = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      if (!isErasing) return;
      pendingErasePointRef.current = getPoint(e);
      if (eraseRafRef.current !== null) return;
      eraseRafRef.current = requestAnimationFrame(() => {
        eraseRafRef.current = null;
        const point = pendingErasePointRef.current;
        pendingErasePointRef.current = null;
        if (point) runErase(point);
      });
    },
    [isErasing, getPoint, runErase],
  );

  const stopErasing = useCallback(() => {
    if (!isErasing) return;
    setIsErasing(false);

    // Flush any erase point still waiting on a queued animation frame so
    // the last point of a fast drag isn't dropped when the pointer lifts.
    if (eraseRafRef.current !== null) {
      cancelAnimationFrame(eraseRafRef.current);
      eraseRafRef.current = null;
    }
    if (pendingErasePointRef.current) {
      runErase(pendingErasePointRef.current);
      pendingErasePointRef.current = null;
    }

    const before = eraseStrokeSnapshotRef.current;
    const changed = eraseChangedRef.current;

    eraseStrokeSnapshotRef.current = null;
    eraseChangedRef.current = false;

    if (before !== null && changed) {
      setUndoStack((prev) => [...prev, before]);
      setRedoStack([]);
      if (!hasDrawn) setHasDrawn(true);
    }
  }, [isErasing, hasDrawn, runErase]);

  // Cancel any in-flight erase frame on unmount.
  useEffect(() => {
    return () => {
      if (eraseRafRef.current !== null) cancelAnimationFrame(eraseRafRef.current);
    };
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0 && strokes.length === 0) return;
    setUndoStack((prev) => {
      const updated = [...prev];
      const last = updated.pop();
      setRedoStack((redoPrev) => [...redoPrev, strokes]);
      if (last !== undefined) setStrokes(last);
      else setStrokes([]);
      return updated;
    });
  }, [strokes, undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setRedoStack((prev) => {
      const updated = [...prev];
      const next = updated.pop();
      if (next !== undefined) {
        setUndoStack((undoPrev) => [...undoPrev, strokes]);
        setStrokes(next);
      }
      return updated;
    });
  }, [strokes, redoStack]);

  const clear = useCallback(() => {
    if (strokes.length === 0) return;
    setUndoStack((prev) => [...prev, strokes]);
    setRedoStack([]);
    setStrokes([]);
    if (!hasDrawn) setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [strokes, hasDrawn]);

  // Remap stroke and pen colors when the canvas background changes from
  // light to dark or vice versa, so existing drawings stay visible instead
  // of blending into the new background. This is a display correction, not
  // a drawing action, so it intentionally does not push to the undo stack.
  const recolorForBackground = useCallback(
    (bgIsLight: boolean) => {
      setStrokes((prev) =>
        prev.map((s) => ({
          ...s,
          color: remapInkColorForBackground(s.color, bgIsLight),
        })),
      );
      setCurrentColorState((prev) => {
        const remapped = remapInkColorForBackground(prev, bgIsLight);
        if (remapped !== prev) saveColor(remapped);
        return remapped;
      });
    },
    [],
  );

  return {
    strokes,
    isEmpty,
    currentColor,
    currentWidth,
    setCurrentColor,
    setCurrentWidth,
    setCanvas,
    setRedrawBase,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clear,
    resizeCanvas,
    getCanvas,
    hasDrawn,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    drawingId,
    recolorForBackground,
    eraserRadius,
    setEraserRadius,
    startErasing,
    erase,
    stopErasing,
  };
}

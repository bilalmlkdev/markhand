import { useState, useCallback, useRef, useEffect } from "react";
import type { CursorStyle, Point, Stroke } from "../types";
import { smoothPoints } from "../lib/ink";
import { remapInkColorForBackground } from "../lib/palette";
import { generateId } from "../lib/id";

// Per-tool default line weight, applied when the cursor style changes.
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
  isDrawing: boolean;
  storageWarning: string | null;
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
  setEraseRepaint: (fn: ((strokes: Stroke[]) => void) | null) => void;
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

function saveStrokes(drawingId: string, strokes: Stroke[]): boolean {
  try {
    if (strokes.length === 0) return false;
    localStorage.setItem(getStorageKey(drawingId), JSON.stringify(strokes));
    return true;
  } catch {
    return false;
  }
}

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
  } catch {
    void 0;
  }
}

// Per-user settings (not per drawing).
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
  } catch {
    void 0;
  }
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
  } catch {
    void 0;
  }
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
  } catch {
    void 0;
  }
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

// Erases sampled points and segments crossing the eraser circle between them.
function eraseFromStroke(
  stroke: Stroke,
  eraserPoint: Point,
  radius: number,
): Stroke[] {
  // Single-point dots/taps when the eraser center is within radius.
  if (stroke.points.length < 2) {
    if (
      stroke.points.length === 1 &&
      distance(stroke.points[0]!, eraserPoint) <= radius
    ) {
      return [];
    }
    return [stroke];
  }

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
    id: generateId(),
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
  const [storageWarning, setStorageWarning] = useState<string | null>(null);
  const saveOkRef = useRef(true);

  const currentPointsRef = useRef<Point[]>([]);
  const isEmpty = strokes.length === 0;
  const [isErasing, setIsErasing] = useState(false);
  const eraseStrokeSnapshotRef = useRef<Stroke[] | null>(null);
  const eraseChangedRef = useRef(false);
  // Mutable copy avoids a React rerender per pointer move; committed on release.
  const eraseStrokesRef = useRef<Stroke[]>([]);
  const eraseRepaintRef = useRef<((strokes: Stroke[]) => void) | null>(null);
  const setEraseRepaint = useCallback(
    (fn: ((strokes: Stroke[]) => void) | null) => {
      eraseRepaintRef.current = fn;
    },
    [],
  );
  // Eraser size is independent of pen width and persisted.
  const [eraserRadius, setEraserRadiusState] = useState(loadEraserRadius);
  const setEraserRadius = useCallback((radius: number) => {
    const clamped = Math.min(
      ERASER_RADIUS_MAX,
      Math.max(ERASER_RADIUS_MIN, radius),
    );
    setEraserRadiusState(clamped);
    saveEraserRadius(clamped);
  }, []);
  // Pointermove bursts coalesce into one erase per animation frame (lag fix).
  const pendingErasePointRef = useRef<Point | null>(null);
  const eraseRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!hasDrawn) return;
    if (strokes.length === 0) return;
    const ok = saveStrokes(drawingId, strokes);
    saveHasDrawn(drawingId, true);
    if (ok !== saveOkRef.current) {
      saveOkRef.current = ok;
      queueMicrotask(() =>
        setStorageWarning(
          ok
            ? null
            : "Your browser is out of storage space, so this drawing can't be saved.",
        ),
      );
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

      // Redraw base layer first so the smoothed preview matches the committed stroke.
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
    if (points.length > 0) {
      setUndoStack((prev) => [...prev, strokes]);
      setRedoStack([]);
      // Catmull-Rom smoothing; dots/taps (short) stay unsmoothed.
      const finalPoints =
        points.length >= 4 ? smoothPoints(points, 0.3) : [...points];
      const newStroke: Stroke = {
        id: generateId(),
        points: finalPoints,
        color: currentColor,
        width: currentWidth,
      };
      setStrokes((prev) => [...prev, newStroke]);
      if (!hasDrawn) setHasDrawn(true);
    }
    currentPointsRef.current = [];
  }, [isDrawing, currentColor, currentWidth, strokes, hasDrawn]);

  // Erase gesture: snapshot for undo, split strokes around the eraser.
  const runErase = useCallback(
    (point: Point) => {
      const working = eraseStrokesRef.current;
      const next = working.flatMap((s) =>
        eraseFromStroke(s, point, eraserRadius),
      );
      const changed =
        next.length !== working.length ||
        next.some((s, i) => s !== working[i]);
      if (!changed) return;
      eraseChangedRef.current = true;
      eraseStrokesRef.current = next;
      // Paint directly to canvas, skipping a full rerender per move.
      eraseRepaintRef.current?.(next);
    },
    [eraserRadius],
  );

  const startErasing = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      e.preventDefault();
      eraseStrokeSnapshotRef.current = strokes;
      eraseStrokesRef.current = strokes;
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

    // Flush any erase point still queued on an animation frame.
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
    const final = eraseStrokesRef.current;

    eraseStrokeSnapshotRef.current = null;
    eraseStrokesRef.current = [];
    eraseChangedRef.current = false;

    if (changed && before) {
      // Commit gesture result so saves, undo and gallery meta stay in sync.
      setStrokes(final);
      eraseRepaintRef.current?.(final);
      setUndoStack((prev) => [...prev, before]);
      setRedoStack([]);
      if (!hasDrawn) setHasDrawn(true);
    }
  }, [isErasing, hasDrawn, runErase]);

  useEffect(() => {
    return () => {
      if (eraseRafRef.current !== null) cancelAnimationFrame(eraseRafRef.current);
    };
  }, []);

  const undo = useCallback(() => {
    if (undoStack.length === 0 && strokes.length === 0) return;

    if (undoStack.length === 0) {
      setStrokes([]);
      setRedoStack((prev) => [...prev, strokes]);
      return;
    }

    const last = undoStack[undoStack.length - 1]!;
    setUndoStack(undoStack.slice(0, -1));
    setRedoStack((prev) => [...prev, strokes]);
    setStrokes(last);
  }, [strokes, undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1]!;
    setRedoStack(redoStack.slice(0, -1));
    setUndoStack((prev) => [...prev, strokes]);
    setStrokes(next);
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

  // Remap ink on light/dark theme switch so strokes stay visible; not undoable.
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
    isDrawing,
    storageWarning,
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
    setEraseRepaint,
    startErasing,
    erase,
    stopErasing,
  };
}
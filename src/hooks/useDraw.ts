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

export interface UseDrawReturn {
  strokes: Stroke[];
  isEmpty: boolean;
  isDrawing: boolean;
  currentColor: string;
  currentWidth: number;
  setCurrentColor: (color: string) => void;
  setCurrentWidth: (width: number) => void;
  setCanvas: (canvas: HTMLCanvasElement | null) => void;
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  stopDrawing: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  fullRedraw: () => void;
  resizeCanvas: () => void;
  getCanvas: () => HTMLCanvasElement | null;
  hasDrawn: boolean;
  canUndo: boolean;
  canRedo: boolean;
  drawingId: string;
  recolorForBackground: (bgIsLight: boolean) => void;
  isErasing: boolean;
  eraserRadius: number;
  startErasing: (e: React.MouseEvent | React.TouchEvent) => void;
  erase: (e: React.MouseEvent | React.TouchEvent) => void;
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
  return localStorage.getItem(getHasDrawnKey(drawingId)) === "true";
}

function saveHasDrawn(drawingId: string, val: boolean) {
  localStorage.setItem(getHasDrawnKey(drawingId), String(val));
}

// Global per‑user settings (not per drawing)
const COLOR_KEY = "markhand_color";
const WIDTH_KEY = "markhand_width";

function loadColor(): string {
  return localStorage.getItem(COLOR_KEY) ?? "#1c1917";
}
function saveColor(color: string) {
  localStorage.setItem(COLOR_KEY, color);
}
function loadWidth(): number {
  const w = localStorage.getItem(WIDTH_KEY);
  return w ? Number(w) : 3;
}
function saveWidth(width: number) {
  localStorage.setItem(WIDTH_KEY, String(width));
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// Remove any points of `stroke` within `radius` of `eraserPoint`, splitting
// the stroke into separate surviving pieces around the erased gap(s).
// Pieces with fewer than 2 points are dropped (nothing left to draw).
function eraseFromStroke(
  stroke: Stroke,
  eraserPoint: Point,
  radius: number,
): Stroke[] {
  const segments: Point[][] = [];
  let current: Point[] = [];

  for (const p of stroke.points) {
    if (distance(p, eraserPoint) <= radius) {
      if (current.length >= 2) segments.push(current);
      current = [];
    } else {
      current.push(p);
    }
  }
  if (current.length >= 2) segments.push(current);

  // Nothing was actually touched — return the stroke unchanged.
  if (segments.length === 1 && segments[0]!.length === stroke.points.length) {
    return [stroke];
  }

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
  // Eraser radius scales with pen width but has a comfortable floor so it
  // stays usable even at the thinnest pen settings.
  const eraserRadius = Math.max(10, currentWidth * 3);

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
    (e: React.MouseEvent | React.TouchEvent): Point => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
      };
    },
    [],
  );

  const drawStrokeOnContext = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      points: Point[],
      color: string,
      width: number,
    ) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0]!.x, points[0]!.y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i]!.x, points[i]!.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    },
    [],
  );

  const fullRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach((s) =>
      drawStrokeOnContext(ctx, s.points, s.color, s.width),
    );
  }, [strokes, drawStrokeOnContext]);

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
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const point = getPoint(e);
      setIsDrawing(true);
      currentPointsRef.current = [point];
    },
    [getPoint],
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const point = getPoint(e);
      const prev = currentPointsRef.current;
      prev.push(point);

      if (prev.length >= 2) {
        const secondLast = prev[prev.length - 2]!;
        ctx.beginPath();
        ctx.moveTo(secondLast.x, secondLast.y);
        ctx.lineTo(point.x, point.y);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentWidth;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
      }
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

  // Eraser: snapshot strokes once at gesture start (for undo + to avoid
  // erasing already-erased gaps mid-drag), then progressively remove
  // touched points as the user drags, splitting strokes around the gap.
  const startErasing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      eraseStrokeSnapshotRef.current = strokes;
      setIsErasing(true);
      const point = getPoint(e);
      setStrokes((prev) =>
        prev.flatMap((s) => eraseFromStroke(s, point, eraserRadius)),
      );
    },
    [strokes, getPoint, eraserRadius],
  );

  const erase = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isErasing) return;
      const point = getPoint(e);
      setStrokes((prev) =>
        prev.flatMap((s) => eraseFromStroke(s, point, eraserRadius)),
      );
    },
    [isErasing, getPoint, eraserRadius],
  );

  const stopErasing = useCallback(() => {
    if (!isErasing) return;
    setIsErasing(false);
    const before = eraseStrokeSnapshotRef.current;
    eraseStrokeSnapshotRef.current = null;
    if (before !== null) {
      // Only record undo history if the erase gesture actually changed
      // anything (e.g. a click-drag that never touched a stroke).
      setStrokes((current) => {
        if (current !== before) {
          setUndoStack((prev) => [...prev, before]);
          setRedoStack([]);
          if (!hasDrawn) setHasDrawn(true);
        }
        return current;
      });
    }
  }, [isErasing, hasDrawn]);

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
    isDrawing,
    currentColor,
    currentWidth,
    setCurrentColor,
    setCurrentWidth,
    setCanvas,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clear,
    fullRedraw,
    resizeCanvas,
    getCanvas,
    hasDrawn,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    drawingId,
    recolorForBackground,
    isErasing,
    eraserRadius,
    startErasing,
    erase,
    stopErasing,
  };
}

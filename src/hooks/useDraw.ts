import { useState, useCallback, useRef, useEffect } from 'react';
import type { Point, Stroke } from '../types';

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
  seedStrokes: (seed: Stroke[]) => void;
}

const STORAGE_KEY = 'markhand_strokes';
const COLOR_KEY = 'markhand_color';
const WIDTH_KEY = 'markhand_width';
const HAS_DRAWN_KEY = 'markhand_has_drawn';

function loadStrokes(): Stroke[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Stroke[]) : [];
  } catch {
    return [];
  }
}

function saveStrokes(strokes: Stroke[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(strokes));
  } catch {}
}

function loadColor(): string {
  return localStorage.getItem(COLOR_KEY) ?? '#1c1917';
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

function loadHasDrawn(): boolean {
  return localStorage.getItem(HAS_DRAWN_KEY) === 'true';
}

function saveHasDrawn(val: boolean) {
  localStorage.setItem(HAS_DRAWN_KEY, String(val));
}

export function useDraw(): UseDrawReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>(loadStrokes);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColorState] = useState(loadColor);
  const [currentWidth, setCurrentWidthState] = useState(loadWidth);
  const [hasDrawn, setHasDrawn] = useState(loadHasDrawn);

  const currentPointsRef = useRef<Point[]>([]);
  const isEmpty = strokes.length === 0;

  useEffect(() => {
    if (hasDrawn) saveStrokes(strokes);
  }, [strokes, hasDrawn]);

  useEffect(() => {
    saveHasDrawn(hasDrawn);
  }, [hasDrawn]);

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

  const getPoint = useCallback((e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  const drawStrokeOnContext = useCallback(
    (ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0]!.x, points[0]!.y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i]!.x, points[i]!.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    },
    [],
  );

  const fullRedraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    strokes.forEach(s => drawStrokeOnContext(ctx, s.points, s.color, s.width));
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
      const ctx = canvas.getContext('2d');
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
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
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
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]);
      const newStroke: Stroke = {
        id: crypto.randomUUID(),
        points: [...points],
        color: currentColor,
        width: currentWidth,
      };
      setStrokes(prev => [...prev, newStroke]);
      if (!hasDrawn) setHasDrawn(true);
    }
    currentPointsRef.current = [];
  }, [isDrawing, currentColor, currentWidth, strokes, hasDrawn]);

  const undo = useCallback(() => {
    if (undoStack.length === 0 && strokes.length === 0) return;
    setUndoStack(prev => {
      const updated = [...prev];
      const last = updated.pop();
      setRedoStack(redoPrev => [...redoPrev, strokes]);
      if (last !== undefined) setStrokes(last);
      else setStrokes([]);
      return updated;
    });
  }, [strokes, undoStack]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    setRedoStack(prev => {
      const updated = [...prev];
      const next = updated.pop();
      if (next !== undefined) {
        setUndoStack(undoPrev => [...undoPrev, strokes]);
        setStrokes(next);
      }
      return updated;
    });
  }, [strokes, redoStack]);

  const clear = useCallback(() => {
    if (strokes.length === 0) return;
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setStrokes([]);
    if (!hasDrawn) setHasDrawn(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [strokes, hasDrawn]);

  const seedStrokes = useCallback((seed: Stroke[]) => {
    setStrokes(prev => (prev.length === 0 ? seed : prev));
  }, []);

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
    seedStrokes,
  };
}

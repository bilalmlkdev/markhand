import { useState, useCallback, useRef } from 'react';
import type { Point, Stroke } from '../types';

interface UseDrawReturn {
  strokes: Stroke[];
  isEmpty: boolean;
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
  redrawAll: (ctx: CanvasRenderingContext2D) => void;
  resizeCanvas: () => void;
  getCanvas: () => HTMLCanvasElement | null;
}

export function useDraw(): UseDrawReturn {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [currentColor, setCurrentColor] = useState('#1c1917');
  const [currentWidth, setCurrentWidth] = useState(3);

  const isEmpty = strokes.length === 0;

  const setCanvas = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
  }, []);

  const getCanvas = useCallback(() => canvasRef.current, []);

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
      const first = points[0];
      if (!first) return;
      ctx.beginPath();
      ctx.moveTo(first.x, first.y);
      for (let i = 1; i < points.length; i++) {
        const p = points[i];
        if (!p) continue;
        ctx.lineTo(p.x, p.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    },
    [],
  );

  const redrawAll = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      strokes.forEach(s => drawStrokeOnContext(ctx, s.points, s.color, s.width));
    },
    [strokes, drawStrokeOnContext],
  );

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const { width, height } = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
  }, []);

  const startDrawing = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const point = getPoint(e);
      setIsDrawing(true);
      setCurrentPoints([point]);
    },
    [getPoint],
  );

  const draw = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const point = getPoint(e);
      setCurrentPoints(prev => {
        const updated = [...prev, point];
        // Draw the latest segment directly for responsiveness
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            drawStrokeOnContext(ctx, updated, currentColor, currentWidth);
          }
        }
        return updated;
      });
    },
    [isDrawing, getPoint, currentColor, currentWidth, drawStrokeOnContext],
  );

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (currentPoints.length > 0) {
      setUndoStack(prev => [...prev, strokes]);
      setRedoStack([]);
      const newStroke: Stroke = {
        id: crypto.randomUUID(),
        points: currentPoints,
        color: currentColor,
        width: currentWidth,
      };
      setStrokes(prev => [...prev, newStroke]);
      setCurrentPoints([]);
    }
  }, [isDrawing, currentPoints, currentColor, currentWidth, strokes]);

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    setUndoStack(prev => {
      const updated = [...prev];
      const last = updated.pop();
      setRedoStack(redoPrev => [...redoPrev, strokes]);
      if (last !== undefined) setStrokes(last);
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
  }, [strokes]);

  return {
    strokes,
    isEmpty,
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
    redrawAll,
    resizeCanvas,
    getCanvas,
  };
}

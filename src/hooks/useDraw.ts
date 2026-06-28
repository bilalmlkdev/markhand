import { useState, useCallback, RefObject } from 'react';
import type { Point, Stroke } from '../types';

interface UseDrawReturn {
  strokes: Stroke[];
  isDrawing: boolean;
  isEmpty: boolean;
  currentColor: string;
  currentWidth: number;
  setCurrentColor: (color: string) => void;
  setCurrentWidth: (width: number) => void;
  startDrawing: (e: React.MouseEvent | React.TouchEvent) => void;
  draw: (e: React.MouseEvent | React.TouchEvent) => void;
  stopDrawing: () => void;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  redraw: (ctx: CanvasRenderingContext2D) => void;
  resizeCanvas: () => void;
}

export function useDraw(canvasRef: RefObject<HTMLCanvasElement | null>): UseDrawReturn {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  const [currentColor, setCurrentColor] = useState('#1c1917');
  const [currentWidth, setCurrentWidth] = useState(3);
  const [isEmpty, setIsEmpty] = useState(true);

  const getPoint = useCallback(
    (e: React.MouseEvent | React.TouchEvent): Point => {
      const canvas = canvasRef.current!;
      const rect = canvas.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      return { x: clientX - rect.left, y: clientY - rect.top };
    },
    [canvasRef],
  );

  const drawStroke = useCallback(
    (ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number) => {
      if (points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    },
    [],
  );

  const redraw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      strokes.forEach(s => drawStroke(ctx, s.points, s.color, s.width));
    },
    [strokes, drawStroke],
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
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.scale(dpr, dpr);
  }, [canvasRef]);

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
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext('2d')!;
        drawStroke(ctx, updated, currentColor, currentWidth);
        return updated;
      });
    },
    [isDrawing, getPoint, drawStroke, currentColor, currentWidth, canvasRef],
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
      setIsEmpty(false);
    }
  }, [isDrawing, currentPoints, currentColor, currentWidth, strokes]);

  const undo = useCallback(() => {
    if (strokes.length === 0) return;
    setUndoStack(prev => {
      const updated = [...prev];
      const last = updated.pop();
      setRedoStack(redoPrev => [...redoPrev, strokes]);
      if (last !== undefined) {
        setStrokes(last);
      } else {
        setStrokes([]);
      }
      if (last && last.length === 0) setIsEmpty(true);
      return updated;
    });
  }, [strokes]);

  const redo = useCallback(() => {
    setRedoStack(prev => {
      const updated = [...prev];
      const next = updated.pop();
      if (next !== undefined) {
        setUndoStack(undoPrev => [...undoPrev, strokes]);
        setStrokes(next);
        setIsEmpty(next.length === 0);
      }
      return updated;
    });
  }, [strokes]);

  const clear = useCallback(() => {
    if (strokes.length === 0) return;
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
    setStrokes([]);
    setIsEmpty(true);
  }, [strokes]);

  return {
    strokes,
    isDrawing,
    isEmpty,
    currentColor,
    currentWidth,
    setCurrentColor,
    setCurrentWidth,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clear,
    redraw,
    resizeCanvas,
  };
}

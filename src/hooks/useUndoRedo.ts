import { useState, useCallback } from 'react';
import type { Stroke } from '../types';

export function useUndoRedo() {
  const [undoStack, setUndoStack] = useState<Stroke[][]>([]);
  const [redoStack, setRedoStack] = useState<Stroke[][]>([]);

  const pushUndo = useCallback((strokes: Stroke[]) => {
    setUndoStack(prev => [...prev, strokes]);
    setRedoStack([]);
  }, []);

  const undo = useCallback(
    (currentStrokes: Stroke[]): Stroke[] | null => {
      if (undoStack.length === 0) return null;
      const prev = [...undoStack];
      const last = prev.pop();
      setUndoStack(prev);
      setRedoStack(r => [...r, currentStrokes]);
      return last ?? [];
    },
    [undoStack],
  );

  const redo = useCallback(
    (currentStrokes: Stroke[]): Stroke[] | null => {
      if (redoStack.length === 0) return null;
      const prev = [...redoStack];
      const next = prev.pop();
      setRedoStack(prev);
      setUndoStack(u => [...u, currentStrokes]);
      return next ?? [];
    },
    [redoStack],
  );

  const clearHistory = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0,
    pushUndo,
    undo,
    redo,
    clearHistory,
  };
}

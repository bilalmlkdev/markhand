import { useEffect } from "react";
import type { CursorStyle, GuideType } from "../types";

interface ShortcutHandlers {
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onCursorChange: (cursor: CursorStyle) => void;
  onToggleEraser: () => void;
  onCycleGuide: () => void;
  isEmpty: boolean;
  enabled: boolean;
}

const CURSOR_KEYS: Record<string, CursorStyle> = {
  "1": "crosshair",
  "2": "pencil",
  "3": "dot",
  "4": "brush",
  "5": "pen",
};

function isTypingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable
  );
}

export function useKeyboardShortcuts({
  onUndo,
  onRedo,
  onClear,
  onCursorChange,
  onToggleEraser,
  onCycleGuide,
  isEmpty,
  enabled,
}: ShortcutHandlers) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      const mod = e.metaKey || e.ctrlKey;

      // Undo / Redo
      if (mod && e.key.toLowerCase() === "z") {
        e.preventDefault();
        if (e.shiftKey) onRedo();
        else onUndo();
        return;
      }
      if (mod && e.key.toLowerCase() === "y") {
        e.preventDefault();
        onRedo();
        return;
      }

      // Clear canvas
      if ((e.key === "Delete" || e.key === "Backspace") && !mod) {
        if (isEmpty) return;
        e.preventDefault();
        onClear();
        return;
      }

      // Eraser toggle
      if (e.key.toLowerCase() === "e" && !mod) {
        e.preventDefault();
        onToggleEraser();
        return;
      }

      // Cursor tool shortcuts (1-5)
      const cursor = CURSOR_KEYS[e.key];
      if (cursor && !mod) {
        e.preventDefault();
        onCursorChange(cursor);
        return;
      }

      // Cycle guide type
      if (e.key.toLowerCase() === "g" && !mod) {
        e.preventDefault();
        onCycleGuide();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    onUndo,
    onRedo,
    onClear,
    onCursorChange,
    onToggleEraser,
    onCycleGuide,
    isEmpty,
    enabled,
  ]);
}

export const GUIDE_ORDER: GuideType[] = ["none", "dots", "grid", "lines"];

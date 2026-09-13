import type { DrawingMeta, CanvasTheme, Stroke } from '../types';

const REGISTRY_KEY = 'markhand_drawings';
const THEME_KEY = 'markhand_theme';
const GUIDE_KEY = 'markhand_guide';
const CURSOR_KEY = 'markhand_cursor';

function getDrawingStorageKey(id: string): string {
  return `markhand_drawing_${id}`;
}

// Read-only access to a drawing's strokes, for gallery thumbnails.
// The canonical read/write path used while actively drawing is useDraw.ts.
export function loadDrawingStrokes(id: string): Stroke[] {
  try {
    const raw = localStorage.getItem(getDrawingStorageKey(id));
    return raw ? (JSON.parse(raw) as Stroke[]) : [];
  } catch {
    return [];
  }
}

// --- Drawing registry (My Drawings gallery) -------------------------------
// Strokes for a drawing are stored separately under `markhand_drawing_{id}`
// (see useDraw.ts). This registry only tracks lightweight metadata so the
// gallery can list drawings without loading every stroke into memory.

export function getDrawingRegistry(): DrawingMeta[] {
  try {
    const raw = localStorage.getItem(REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DrawingMeta[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveDrawingRegistry(entries: DrawingMeta[]): void {
  try {
    localStorage.setItem(REGISTRY_KEY, JSON.stringify(entries));
  } catch {
    /* ignore */
  }
}

// Create or update this drawing's registry entry. Called whenever a
// drawing's strokes or theme change and it has at least one stroke.
export function upsertDrawingMeta(
  id: string,
  patch: { strokeCount: number; theme: CanvasTheme; name?: string },
): void {
  const entries = getDrawingRegistry();
  const now = Date.now();
  const existingIndex = entries.findIndex((e) => e.id === id);

  if (existingIndex === -1) {
    entries.push({
      id,
      name: patch.name ?? 'Untitled',
      createdAt: now,
      updatedAt: now,
      strokeCount: patch.strokeCount,
      theme: patch.theme,
    });
  } else {
    const existing = entries[existingIndex]!;
    entries[existingIndex] = {
      ...existing,
      name: patch.name ?? existing.name,
      updatedAt: now,
      strokeCount: patch.strokeCount,
      theme: patch.theme,
    };
  }
  saveDrawingRegistry(entries);
}

export function renameDrawing(id: string, name: string): void {
  const entries = getDrawingRegistry();
  const index = entries.findIndex((e) => e.id === id);
  if (index === -1) return;
  entries[index] = { ...entries[index]!, name, updatedAt: Date.now() };
  saveDrawingRegistry(entries);
}

export function removeDrawingMeta(id: string): void {
  const entries = getDrawingRegistry().filter((e) => e.id !== id);
  saveDrawingRegistry(entries);
}

export function deleteDrawing(id: string): void {
  const entries = getDrawingRegistry().filter((e) => e.id !== id);
  saveDrawingRegistry(entries);
  removeDrawingData(id);
}

// Purge a drawing's strokes and hasDrawn flag from localStorage. Used by
// reset/delete/empty flows so cleared drawings stop leaving orphaned keys
// behind.
export function removeDrawingData(id: string): void {
  try {
    localStorage.removeItem(getDrawingStorageKey(id));
    localStorage.removeItem(`markhand_hasDrawn_${id}`);
  } catch {
    /* ignore */
  }
}

// --- Global preferences ----------------------------------------------------

export function saveTheme(theme: string): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* ignore */
  }
}

export function loadTheme(): string | null {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

export function saveGuide(guide: string): void {
  try {
    localStorage.setItem(GUIDE_KEY, guide);
  } catch {
    /* ignore */
  }
}

export function loadGuide(): string | null {
  try {
    return localStorage.getItem(GUIDE_KEY);
  } catch {
    return null;
  }
}

export function saveCursor(cursor: string): void {
  try {
    localStorage.setItem(CURSOR_KEY, cursor);
  } catch {
    /* ignore */
  }
}

export function loadCursor(): string | null {
  try {
    return localStorage.getItem(CURSOR_KEY);
  } catch {
    return null;
  }
}

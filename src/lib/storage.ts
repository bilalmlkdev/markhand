import type { Signature } from '../types';

const SIGNATURES_KEY = 'markhand_signatures';
const THEME_KEY = 'markhand_theme';
const GUIDE_KEY = 'markhand_guide';
const CURSOR_KEY = 'markhand_cursor';

export function saveSignature(signature: Signature): void {
  const existing = getSignatures();
  existing.push(signature);
  localStorage.setItem(SIGNATURES_KEY, JSON.stringify(existing));
}

export function getSignatures(): Signature[] {
  const raw = localStorage.getItem(SIGNATURES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as Signature[];
  } catch {
    return [];
  }
}

export function deleteSignature(id: string): void {
  const existing = getSignatures();
  const filtered = existing.filter(s => s.id !== id);
  localStorage.setItem(SIGNATURES_KEY, JSON.stringify(filtered));
}

export function clearAllSignatures(): void {
  localStorage.removeItem(SIGNATURES_KEY);
}

export function saveTheme(theme: string): void {
  localStorage.setItem(THEME_KEY, theme);
}

export function loadTheme(): string | null {
  return localStorage.getItem(THEME_KEY);
}

export function saveGuide(guide: string): void {
  localStorage.setItem(GUIDE_KEY, guide);
}

export function loadGuide(): string | null {
  return localStorage.getItem(GUIDE_KEY);
}

export function saveCursor(cursor: string): void {
  localStorage.setItem(CURSOR_KEY, cursor);
}

export function loadCursor(): string | null {
  return localStorage.getItem(CURSOR_KEY);
}

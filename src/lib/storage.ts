import type { Signature } from '../types';

const SIGNATURES_KEY = 'markhand_signatures';

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

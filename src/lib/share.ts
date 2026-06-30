import type { Stroke } from '../types';

// Compress strokes to a URL-safe string
export function encodeStrokes(strokes: Stroke[]): string {
  try {
    const json = JSON.stringify(strokes);
    // Use btoa with URL-safe characters
    const base64 = btoa(unescape(encodeURIComponent(json)));
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch {
    return '';
  }
}

// Decode URL string back to strokes
export function decodeStrokes(encoded: string): Stroke[] | null {
  try {
    // Restore base64 padding
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) base64 += '=';
    const json = decodeURIComponent(escape(atob(base64)));
    const data = JSON.parse(json);
    if (Array.isArray(data) && data.length > 0 && data[0]?.points) {
      return data as Stroke[];
    }
    return null;
  } catch {
    return null;
  }
}

// Get share URL from current strokes
export function getShareUrl(strokes: Stroke[]): string {
  const encoded = encodeStrokes(strokes);
  const url = new URL(window.location.href);
  url.searchParams.set('draw', encoded);
  // Remove any other params
  url.searchParams.forEach((_, key) => {
    if (key !== 'draw') url.searchParams.delete(key);
  });
  return url.toString();
}

// Parse strokes from URL if present
export function getStrokesFromUrl(): Stroke[] | null {
  const params = new URLSearchParams(window.location.search);
  const encoded = params.get('draw');
  if (!encoded) return null;
  return decodeStrokes(encoded);
}

// Clean URL after loading shared drawing
export function cleanUrl(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete('draw');
  window.history.replaceState({}, '', url.toString());
}

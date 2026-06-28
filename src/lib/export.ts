import type { Stroke } from '../types';

export function generateSVG(strokes: Stroke[], width: number, height: number): string {
  let paths = '';

  strokes.forEach(stroke => {
    if (stroke.points.length < 2) return;
    let d = `M ${stroke.points[0]!.x} ${stroke.points[0]!.y}`;
    for (let i = 1; i < stroke.points.length; i++) {
      d += ` L ${stroke.points[i]!.x} ${stroke.points[i]!.y}`;
    }
    paths += `<path d="${d}" stroke="${stroke.color}" stroke-width="${stroke.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="white"/>
  ${paths}
</svg>`;
}

import type { Point } from '../types';

// Smooth a stroke using cubic Bézier curves
export function smoothPoints(points: Point[], tension: number = 0.3): Point[] {
  if (points.length < 3) return points;

  const smoothed: Point[] = [points[0]];

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[0];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    if (!p1 || !p2) continue;

    const cp1x = p1.x + (p2.x - p0.x!) * tension;
    const cp1y = p1.y + (p2.y - p0.y!) * tension;
    const cp2x = p2.x - (p3.x! - p1.x) * tension;
    const cp2y = p2.y - (p3.y! - p1.y) * tension;

    // Sample points along the curve
    const steps = 8;
    for (let t = 0; t < steps; t++) {
      const tNorm = t / steps;
      const mt = 1 - tNorm;
      const x =
        mt * mt * mt * p1.x +
        3 * mt * mt * tNorm * cp1x +
        3 * mt * tNorm * tNorm * cp2x +
        tNorm * tNorm * tNorm * p2.x;
      const y =
        mt * mt * mt * p1.y +
        3 * mt * mt * tNorm * cp1y +
        3 * mt * tNorm * tNorm * cp2y +
        tNorm * tNorm * tNorm * p2.y;
      smoothed.push({ x, y });
    }
  }

  smoothed.push(points[points.length - 1]!);
  return smoothed;
}

// Simulate pressure based on velocity
export function calculatePressure(prevPoint: Point, currentPoint: Point): number {
  const dx = currentPoint.x - prevPoint.x;
  const dy = currentPoint.y - prevPoint.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  // Faster movement = thinner line (lower pressure)
  return Math.max(0.2, Math.min(1, 1 - distance / 50));
}

import type { Stroke } from "../types";

// Dots render as circles; strokes as smoothed polylines.
export function paintStroke(
  ctx: CanvasRenderingContext2D,
  stroke: Stroke,
  minWidth?: number,
): void {
  const points = stroke.points;
  if (points.length === 0) return;

  const width =
    minWidth !== undefined ? Math.max(minWidth, stroke.width) : stroke.width;

  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (points.length === 1) {
    const p = points[0]!;
    ctx.beginPath();
    ctx.arc(p.x, p.y, width / 2, 0, Math.PI * 2);
    ctx.fill();
    return;
  }

  ctx.beginPath();
  ctx.moveTo(points[0]!.x, points[0]!.y);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(points[i]!.x, points[i]!.y);
  }
  ctx.lineWidth = width;
  ctx.stroke();
}

// Dot → circle, stroke → path.
export function strokeSvgGeometry(stroke: Stroke): string {
  const points = stroke.points;
  if (points.length === 0) return "";

  if (points.length === 1) {
    const p = points[0]!;
    const r = stroke.width / 2;
    return `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${stroke.color}"/>`;
  }

  let d = `M ${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length; i++) {
    d += ` L ${points[i]!.x} ${points[i]!.y}`;
  }
  return `<path d="${d}" stroke="${stroke.color}" stroke-width="${stroke.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
}
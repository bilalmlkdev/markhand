import { useEffect, useRef } from "react";
import type { Stroke, CanvasTheme } from "../../types";
import { themes } from "../../lib/canvas";

interface DrawingThumbnailProps {
  strokes: Stroke[];
  theme: CanvasTheme;
  className?: string;
}

export function DrawingThumbnail({
  strokes,
  theme,
  className,
}: DrawingThumbnailProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const themeConfig = themes[theme] ?? themes.default;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayW = canvas.clientWidth || 200;
    const displayH = canvas.clientHeight || 120;
    canvas.width = displayW * dpr;
    canvas.height = displayH * dpr;
    ctx.scale(dpr, dpr);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = themeConfig.bg;
    ctx.fillRect(0, 0, displayW, displayH);

    if (strokes.length === 0) return;

    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    strokes.forEach((s) =>
      s.points.forEach((point) => {
        const x = point.x;
        const y = point.y;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }),
    );
    if (!isFinite(minX)) return;

    const padding = 12;
    const boundsW = Math.max(1, maxX - minX + padding * 2);
    const boundsH = Math.max(1, maxY - minY + padding * 2);
    const scale = Math.min(displayW / boundsW, displayH / boundsH);
    const offsetX = (displayW - boundsW * scale) / 2;
    const offsetY = (displayH - boundsH * scale) / 2;

    ctx.save();
    ctx.translate(offsetX - (minX - padding) * scale, offsetY - (minY - padding) * scale);
    ctx.scale(scale, scale);

    strokes.forEach((s) => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s.points[0]!.x, s.points[0]!.y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i]!.x, s.points[i]!.y);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1 / scale, s.width);
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    });
    ctx.restore();
  }, [strokes, theme, themeConfig]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ backgroundColor: themeConfig.bg }}
    />
  );
}

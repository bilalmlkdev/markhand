import type { CanvasTheme, ThemeConfig } from '../types';

const DOT_SPACING = 24;
const DOT_RADIUS = 1;

export const themes: Record<CanvasTheme, ThemeConfig> = {
  default: {
    name: 'Default',
    bg: '#f5f4f0',
    dot: '#d6d3d1',
    surface: '#ffffff',
  },
  warm: {
    name: 'Warm',
    bg: '#fef7ed',
    dot: '#e8d5b7',
    surface: '#fffcf5',
  },
  cool: {
    name: 'Cool',
    bg: '#f0f4f8',
    dot: '#c5d5e8',
    surface: '#f8fafc',
  },
  dark: {
    name: 'Dark',
    bg: '#1c1917',
    dot: '#44403c',
    surface: '#292524',
  },
};

export function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string = '#d6d3d1',
) {
  ctx.fillStyle = color;
  for (let x = DOT_SPACING; x < width; x += DOT_SPACING) {
    for (let y = DOT_SPACING; y < height; y += DOT_SPACING) {
      ctx.beginPath();
      ctx.arc(x, y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawLineGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  spacing: number = 32,
  color: string = '#e7e5e4',
) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.5;
  for (let x = spacing; x < width; x += spacing) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = spacing; y < height; y += spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

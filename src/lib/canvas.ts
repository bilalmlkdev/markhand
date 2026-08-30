import type { CanvasTheme, ThemeConfig } from '../types';

const DOT_SPACING = 24;
const DOT_RADIUS = 1.6;

export const themes: Record<CanvasTheme, ThemeConfig> = {
  white: {
    name: 'Pure White',
    bg: '#ffffff',
    dot: '#dedad4',
    surface: '#fafafa',
  },
  default: {
    name: 'Default',
    bg: '#f5f4f0',
    dot: '#c7c3bd',
    surface: '#ffffff',
  },
  warm: {
    name: 'Warm',
    bg: '#fef7ed',
    dot: '#dcc298',
    surface: '#fffcf5',
  },
  cool: {
    name: 'Cool',
    bg: '#f0f4f8',
    dot: '#aec3dc',
    surface: '#f8fafc',
  },
  paper: {
    name: 'Paper',
    bg: '#f7f3ea',
    dot: '#c9bb9e',
    surface: '#fdfbf5',
  },
  graphite: {
    name: 'Graphite',
    bg: '#2a2a2c',
    dot: '#5c5c61',
    surface: '#343436',
  },
  dark: {
    name: 'Dark',
    bg: '#1c1917',
    dot: '#57524c',
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

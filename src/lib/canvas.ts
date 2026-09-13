import type { CanvasTheme, ThemeConfig } from "../types";

const DOT_SPACING = 16;
const DOT_RADIUS = 0.85;
const GRID_SPACING = 32;

export const themes: Record<CanvasTheme, ThemeConfig> = {
  white: {
    name: "Pure White",
    bg: "#ffffff",
    dot: "#e3dfd9",
    surface: "#fafafa",
  },
  default: {
    name: "Default",
    bg: "#f5f4f0",
    dot: "#d0ccc5",
    surface: "#ffffff",
  },
  warm: {
    name: "Warm",
    bg: "#fef7ed",
    dot: "#decfb7",
    surface: "#fffcf5",
  },
  cool: {
    name: "Cool",
    bg: "#f0f4f8",
    dot: "#c0ccda",
    surface: "#f8fafc",
  },
  paper: {
    name: "Paper",
    bg: "#f7f3ea",
    dot: "#d0c4ab",
    surface: "#fdfbf5",
  },
  graphite: {
    name: "Graphite",
    bg: "#2a2a2c",
    dot: "#55575d",
    surface: "#343436",
  },
  dark: {
    name: "Dark",
    bg: "#1c1917",
    dot: "#55504a",
    surface: "#292524",
  },
};

/** Draws a subtle, evenly spaced dot guide in the canvas coordinate space. */
export function drawDotGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  scale = 1,
) {
  const spacing = DOT_SPACING * scale;
  const radius = DOT_RADIUS * scale;
  ctx.fillStyle = color;

  for (let x = spacing; x < width; x += spacing) {
    for (let y = spacing; y < height; y += spacing) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/** Draws a crisp alignment grid using a one-device-pixel stroke. */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string,
  scale = 1,
) {
  const spacing = GRID_SPACING * scale;
  const lineWidth = Math.max(1, Math.round(scale));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;

  for (let x = spacing; x < width; x += spacing) {
    const crispX = Math.round(x) + 0.5;
    ctx.beginPath();
    ctx.moveTo(crispX, 0);
    ctx.lineTo(crispX, height);
    ctx.stroke();
  }

  for (let y = spacing; y < height; y += spacing) {
    const crispY = Math.round(y) + 0.5;
    ctx.beginPath();
    ctx.moveTo(0, crispY);
    ctx.lineTo(width, crispY);
    ctx.stroke();
  }

  ctx.restore();
}

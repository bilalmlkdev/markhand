const DOT_SPACING = 24;
const DOT_RADIUS = 1;

export function drawDotGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = '#d6d3d1';
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
) {
  ctx.strokeStyle = '#e7e5e4';
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

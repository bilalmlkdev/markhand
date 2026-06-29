import type { Stroke } from '../types';

export function generateSVG(
  strokes: Stroke[],
  width: number,
  height: number,
  options: { background?: string } = {},
): string {
  const bg = options.background ?? 'transparent';

  let paths = '';
  strokes.forEach(stroke => {
    if (stroke.points.length < 2) return;
    let d = `M ${stroke.points[0]!.x} ${stroke.points[0]!.y}`;
    for (let i = 1; i < stroke.points.length; i++) {
      d += ` L ${stroke.points[i]!.x} ${stroke.points[i]!.y}`;
    }
    paths += `<path d="${d}" stroke="${stroke.color}" stroke-width="${stroke.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bg}"/>
  ${paths}
</svg>`;
}

export function exportPNG(
  canvas: HTMLCanvasElement,
  filename: string = 'markhand-signature',
  background: string = 'transparent',
): void {
  // If transparent, just export directly
  if (background === 'transparent') {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    return;
  }

  // Otherwise draw background first
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Create temp canvas with background
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return;

  tempCtx.fillStyle = background;
  tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
  tempCtx.putImageData(imageData, 0, 0);

  const link = document.createElement('a');
  link.download = `${filename}.png`;
  link.href = tempCanvas.toDataURL('image/png');
  link.click();
}

export function exportSVG(
  strokes: Stroke[],
  width: number,
  height: number,
  filename: string = 'markhand-signature',
  background: string = 'transparent',
): void {
  const svg = generateSVG(strokes, width, height, { background });
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${filename}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function copyToClipboard(canvas: HTMLCanvasElement): Promise<void> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('Failed to create blob'));
        return;
      }
      navigator.clipboard
        .write([new ClipboardItem({ 'image/png': blob })])
        .then(resolve)
        .catch(reject);
    }, 'image/png');
  });
}

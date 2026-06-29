import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, Copy, Check, Printer } from 'lucide-react';
import { Button } from '../ui/Button';
import { themes } from '../../lib/canvas';
import type { Stroke, CanvasTheme } from '../../types';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  strokes: Stroke[];
  width: number;
  height: number;
  theme: CanvasTheme;
}

type Format = 'png' | 'svg';
type Background = 'theme' | 'transparent' | 'white';

const backgrounds: { label: string; value: Background; hex?: string }[] = [
  { label: 'Theme', value: 'theme' },
  { label: 'Transparent', value: 'transparent' },
  { label: 'White', value: 'white', hex: '#ffffff' },
];

export function ExportModal({ open, onClose, strokes, width, height, theme }: ExportModalProps) {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<Format>('png');
  const [background, setBackground] = useState<Background>('theme');
  const [copied, setCopied] = useState(false);

  // Fallback to default theme if undefined
  const themeConfig = themes[theme] ?? themes.default;

  const getBgHex = useCallback(() => {
    if (background === 'transparent') return 'transparent';
    if (background === 'white') return '#ffffff';
    return themeConfig.bg;
  }, [background, themeConfig.bg]);

  const bgHex = getBgHex();

  const getStrokeBounds = useCallback(() => {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;

    strokes.forEach(s => {
      s.points.forEach(p => {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
      });
    });

    if (!isFinite(minX)) {
      return { x: 0, y: 0, w: width, h: height };
    }

    const padding = 20;
    return {
      x: Math.max(0, minX - padding),
      y: Math.max(0, minY - padding),
      w: Math.min(width, maxX - minX + padding * 2),
      h: Math.min(height, maxY - minY + padding * 2),
    };
  }, [strokes, width, height]);

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;

    const bounds = getStrokeBounds();
    const maxPreviewWidth = 320;
    const maxPreviewHeight = 200;

    const scaleX = maxPreviewWidth / bounds.w;
    const scaleY = maxPreviewHeight / bounds.h;
    const scale = Math.min(scaleX, scaleY, 1);

    const previewW = Math.round(bounds.w * scale);
    const previewH = Math.round(bounds.h * scale);

    const dpr = 2;
    canvas.width = previewW * dpr;
    canvas.height = previewH * dpr;
    canvas.style.width = `${previewW}px`;
    canvas.style.height = `${previewH}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    // Background
    if (background !== 'transparent') {
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, previewW, previewH);
    }

    // Draw strokes
    ctx.save();
    ctx.translate(-bounds.x * scale, -bounds.y * scale);

    strokes.forEach(s => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s.points[0]!.x * scale, s.points[0]!.y * scale);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i]!.x * scale, s.points[i]!.y * scale);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = Math.max(1, s.width * scale);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    ctx.restore();
  }, [strokes, width, height, background, bgHex, getStrokeBounds]);

  useEffect(() => {
    if (open) drawPreview();
  }, [open, drawPreview]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const generateExportCanvas = useCallback((): HTMLCanvasElement => {
    const dpr = 2;
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width * dpr;
    exportCanvas.height = height * dpr;

    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return exportCanvas;

    ctx.scale(dpr, dpr);

    if (background !== 'transparent') {
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, width, height);
    }

    strokes.forEach(s => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s.points[0]!.x, s.points[0]!.y);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i]!.x, s.points[i]!.y);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });

    return exportCanvas;
  }, [strokes, width, height, background, bgHex]);

  const handleDownload = () => {
    if (format === 'png') {
      const exportCanvas = generateExportCanvas();
      const link = document.createElement('a');
      link.download = `markhand.${format}`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    } else {
      let paths = '';
      strokes.forEach(s => {
        if (s.points.length < 2) return;
        let d = `M ${s.points[0]!.x} ${s.points[0]!.y}`;
        for (let i = 1; i < s.points.length; i++) {
          d += ` L ${s.points[i]!.x} ${s.points[i]!.y}`;
        }
        paths += `<path d="${d}" stroke="${s.color}" stroke-width="${s.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n`;
      });

      const svgBg = background === 'transparent' ? 'transparent' : bgHex;
      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <rect width="${width}" height="${height}" fill="${svgBg}"/>\n  ${paths}</svg>`;

      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = `markhand.${format}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleCopy = async () => {
    const exportCanvas = generateExportCanvas();
    exportCanvas.toBlob(async blob => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Fallback
      }
    }, 'image/png');
  };

  const handlePrint = () => {
    const exportCanvas = generateExportCanvas();
    const dataUrl = exportCanvas.toDataURL('image/png');

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Markhand - Print</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              max-height: 100vh;
              object-fit: contain;
            }
            @media print {
              body { margin: 0; }
              img { max-width: 100%; max-height: 100vh; }
            }
          </style>
        </head>
        <body>
          <img src="${dataUrl}" alt="Signature" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => printWindow.print();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-[400px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-800">Export Signature</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Preview */}
        <div className="p-4 flex justify-center bg-stone-50 border-b border-stone-100 min-h-[180px] items-center">
          <div
            className="rounded-lg overflow-hidden border border-stone-200 flex items-center justify-center"
            style={{
              backgroundImage:
                background === 'transparent'
                  ? 'repeating-conic-gradient(#e7e5e4 0% 25%, transparent 0% 50%) 50% / 16px 16px'
                  : undefined,
              backgroundColor:
                background === 'theme'
                  ? themeConfig.bg
                  : background === 'white'
                    ? '#ffffff'
                    : undefined,
            }}
          >
            <canvas ref={previewRef} className="block" />
          </div>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
              Format
            </p>
            <div className="flex gap-2">
              {(['png', 'svg'] as Format[]).map(f => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-1.5 text-xs rounded-md border transition-colors cursor-pointer font-medium uppercase ${
                    format === f
                      ? 'border-stone-400 bg-stone-100 text-stone-900'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
              Background
            </p>
            <div className="flex gap-2">
              {backgrounds.map(bg => (
                <button
                  key={bg.value}
                  onClick={() => setBackground(bg.value)}
                  className={`flex-1 py-1.5 text-xs rounded-md border transition-colors cursor-pointer ${
                    background === bg.value
                      ? 'border-stone-400 bg-stone-100 text-stone-900'
                      : 'border-stone-200 text-stone-500 hover:border-stone-300'
                  }`}
                >
                  {bg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 pb-4 flex gap-2">
          <Button variant="default" className="flex-1" onClick={handleDownload}>
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button variant="ghost" onClick={handlePrint}>
            <Printer className="w-4 h-4" />
          </Button>
          <Button variant="ghost" onClick={handleCopy} disabled={copied}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

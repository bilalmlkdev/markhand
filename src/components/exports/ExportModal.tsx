import { useState, useRef, useEffect, useCallback } from 'react';
import { X, Download, Copy, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import type { Stroke } from '../../types';

interface ExportModalProps {
  open: boolean;
  onClose: () => void;
  strokes: Stroke[];
  width: number;
  height: number;
}

type Format = 'png' | 'svg';
type Background = 'transparent' | 'white' | 'warm';

const backgrounds: { label: string; value: Background; hex: string }[] = [
  { label: 'Transparent', value: 'transparent', hex: 'transparent' },
  { label: 'White', value: 'white', hex: '#ffffff' },
  { label: 'Warm', value: 'warm', hex: '#faf7f2' },
];

export function ExportModal({ open, onClose, strokes, width, height }: ExportModalProps) {
  const previewRef = useRef<HTMLCanvasElement>(null);
  const [format, setFormat] = useState<Format>('png');
  const [background, setBackground] = useState<Background>('transparent');
  const [copied, setCopied] = useState(false);

  const bgHex = backgrounds.find(b => b.value === background)?.hex ?? 'transparent';

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    if (!canvas) return;

    const scale = Math.min(280 / width, 180 / height);
    const previewWidth = width * scale;
    const previewHeight = height * scale;

    canvas.width = previewWidth * 2;
    canvas.height = previewHeight * 2;
    canvas.style.width = `${previewWidth}px`;
    canvas.style.height = `${previewHeight}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    ctx.clearRect(0, 0, previewWidth, previewHeight);

    // Background
    if (background !== 'transparent') {
      ctx.fillStyle = bgHex;
      ctx.fillRect(0, 0, previewWidth, previewHeight);
    }

    // Draw strokes scaled
    strokes.forEach(s => {
      if (s.points.length < 2) return;
      ctx.beginPath();
      ctx.moveTo(s.points[0]!.x * scale, s.points[0]!.y * scale);
      for (let i = 1; i < s.points.length; i++) {
        ctx.lineTo(s.points[i]!.x * scale, s.points[i]!.y * scale);
      }
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.width * scale;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [strokes, width, height, background, bgHex]);

  useEffect(() => {
    if (open) drawPreview();
  }, [open, drawPreview]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  const handleDownload = () => {
    if (format === 'png') {
      const canvas = previewRef.current;
      if (!canvas) return;
      // Generate full-res export
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = width * 2;
      exportCanvas.height = height * 2;
      const ctx = exportCanvas.getContext('2d');
      if (!ctx) return;

      ctx.scale(2, 2);

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

      const link = document.createElement('a');
      link.download = `markhand.${format}`;
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    } else {
      // SVG
      let paths = '';
      strokes.forEach(s => {
        if (s.points.length < 2) return;
        let d = `M ${s.points[0]!.x} ${s.points[0]!.y}`;
        for (let i = 1; i < s.points.length; i++) {
          d += ` L ${s.points[i]!.x} ${s.points[i]!.y}`;
        }
        paths += `<path d="${d}" stroke="${s.color}" stroke-width="${s.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>\n`;
      });

      const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">\n  <rect width="${width}" height="${height}" fill="${bgHex}"/>\n  ${paths}</svg>`;

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
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = width * 2;
    exportCanvas.height = height * 2;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);

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

    exportCanvas.toBlob(async blob => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Clipboard might not be supported
      }
    }, 'image/png');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
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
        <div className="p-4 flex justify-center bg-stone-50 border-b border-stone-100">
          <div
            className="rounded-lg overflow-hidden border border-stone-200 bg-white"
            style={{
              backgroundImage:
                background === 'transparent'
                  ? 'repeating-conic-gradient(#e7e5e4 0% 25%, transparent 0% 50%) 50% / 16px 16px'
                  : undefined,
            }}
          >
            <canvas ref={previewRef} className="block" />
          </div>
        </div>

        {/* Options */}
        <div className="p-4 space-y-3">
          {/* Format */}
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

          {/* Background */}
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
          <Button variant="ghost" onClick={handleCopy} disabled={copied}>
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </div>
  );
}

import { useCallback } from 'react';

export function useExport() {
  const exportAsPNG = useCallback((canvas: HTMLCanvasElement, filename: string = 'signature') => {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, []);

  const exportAsSVG = useCallback((svgContent: string, filename: string = 'signature') => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${filename}.svg`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  return { exportAsPNG, exportAsSVG };
}

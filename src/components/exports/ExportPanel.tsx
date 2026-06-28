import { Download } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportPanelProps {
  isEmpty: boolean;
  onExportPNG: () => void;
  onExportSVG: () => void;
}

export function ExportPanel({ isEmpty, onExportPNG, onExportSVG }: ExportPanelProps) {
  return (
    <div className="p-3">
      <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
        <Download className="w-3 h-3" />
        Export
      </p>
      <div className="space-y-1">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          disabled={isEmpty}
          onClick={onExportPNG}
        >
          <span className="text-xs">PNG</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          disabled={isEmpty}
          onClick={onExportSVG}
        >
          <span className="text-xs">SVG</span>
        </Button>
      </div>
    </div>
  );
}

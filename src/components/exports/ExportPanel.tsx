import { Download, Copy } from 'lucide-react';
import { Button } from '../ui/Button';

interface ExportPanelProps {
  isEmpty: boolean;
  onOpenModal: (action: 'download' | 'copy') => void;
}

export function ExportPanel({ isEmpty, onOpenModal }: ExportPanelProps) {
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
          onClick={() => onOpenModal('download')}
        >
          <Download className="w-3.5 h-3.5" />
          <span className="text-xs">Export</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          disabled={isEmpty}
          onClick={() => onOpenModal('copy')}
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="text-xs">Copy</span>
        </Button>
      </div>
    </div>
  );
}

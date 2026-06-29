import { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import GithubIcon from '/github.svg';

interface ProjectModalProps {
  open: boolean;
  onClose: () => void;
}

export function ProjectModal({ open, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-[360px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-800">About Markhand</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-center">
          {/* Logo */}
          <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">M</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-stone-800">Markhand</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              A beautiful, minimal signature practice and creation tool. Draw your mark with
              customizable pens and guides, then export it as PNG or SVG — ready for documents,
              branding, or wherever your signature needs to go.
            </p>
          </div>

          {/* Features */}
          <div className="bg-stone-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">
              Features
            </p>
            <ul className="text-xs text-stone-600 space-y-1.5">
              <li>• Freehand drawing with customizable pen color & width</li>
              <li>• Dot, grid, and line guides for practice</li>
              <li>• Undo/redo and clear canvas</li>
              <li>• Export as PNG or SVG with background options</li>
              <li>• Copy to clipboard for quick pasting</li>
              <li>• Print-ready output</li>
            </ul>
          </div>

          {/* Footer */}
          <a href="https://github.com/byllzz/markhand" target="_blank" rel="noopener noreferrer">
            <Button variant="default" className="w-full">
              <img src={GithubIcon} className="w-4 h-4" />
              View on GitHub
            </Button>
          </a>

          <p className="text-[10px] text-stone-400">Open source · MIT License · Made with care</p>
        </div>
      </div>
    </div>
  );
}

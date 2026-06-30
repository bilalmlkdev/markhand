import { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { FaXTwitter } from 'react-icons/fa6';
import { getShareUrl } from '../../lib/share';
import type { Stroke } from '../../types';

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  strokes: Stroke[];
  isEmpty: boolean;
}

export function ShareModal({ open, onClose, strokes, isEmpty }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = isEmpty ? '' : getShareUrl(strokes);

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent('Check out my drawing on Markhand ✍️');
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-full sm:w-[400px] max-w-[95vw] mx-2">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-stone-600" />
            <h2 className="text-sm font-semibold text-stone-800">Share Drawing</h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 text-stone-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {isEmpty ? (
            <div className="text-center py-6">
              <Share2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
              <p className="text-sm text-stone-400">Nothing to share yet.</p>
              <p className="text-xs text-stone-300">Draw something first!</p>
            </div>
          ) : (
            <>
              {/* URL */}
              <div>
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  Share Link
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-600 truncate focus:outline-none"
                    onClick={e => (e.target as HTMLInputElement).select()}
                  />
                  <Button variant="default" size="icon" onClick={handleCopyLink} title="Copy link">
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Quick share */}
              <div>
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  Quick Share
                </p>
                <button
                  onClick={handleTwitterShare}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[#1DA1F2]/10 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] transition-colors cursor-pointer"
                >
                  <FaXTwitter className="w-4 h-4" />
                  <span className="text-xs font-medium">Share on Twitter</span>
                </button>
              </div>

              {/* Info */}
              <div className="bg-stone-50 rounded-lg p-3">
                <p className="text-[10px] text-stone-400 leading-relaxed">
                  Anyone with this link can see your drawing. The drawing data is encoded in the URL
                  - no servers, no accounts, just pure sharing.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

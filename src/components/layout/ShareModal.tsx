import { useMemo, useState } from "react";
import { X, Copy, Check, Share2, AlertTriangle, Link2 } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { DrawingThumbnail } from "../gallery/DrawingThumbnail";
import type { Stroke, CanvasTheme } from "../../types";
import { getShareUrl } from "../../lib/share";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  strokes: Stroke[];
  isEmpty: boolean;
  drawingId: string;
  theme: CanvasTheme;
}

// A very long URL can be silently truncated by some platforms/browsers.
const LONG_URL_WARNING_THRESHOLD = 8000;

export function ShareModal({
  open,
  onClose,
  strokes,
  isEmpty,
  theme,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = useMemo(() => getShareUrl(strokes), [strokes]);
  const isLong = shareUrl.length > LONG_URL_WARNING_THRESHOLD;
  const couldNotShare = shareUrl === "";

  const handleCopyLink = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleTwitterShare = () => {
    const text = encodeURIComponent("Check out my drawing on Markhand");
    const url = encodeURIComponent(shareUrl);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank",
    );
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/25 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-stone-200/70 w-full sm:w-[380px] max-w-[95vw] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-stone-100 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5 text-stone-500" />
        </button>

        {isEmpty ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center mx-auto mb-3">
              <Share2 className="w-5 h-5 text-stone-300" />
            </div>
            <p className="text-sm font-medium text-stone-600">
              Nothing to share yet
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Draw something first, then come back here.
            </p>
          </div>
        ) : couldNotShare ? (
          <div className="py-12 px-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-sm font-medium text-stone-600">
              Couldn't create a share link
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Something went wrong while encoding this drawing. Try exporting
              it as an image instead.
            </p>
          </div>
        ) : (
          <>
            {/* Drawing preview */}
            <div className="aspect-[16/9] w-full border-b border-stone-100">
              <DrawingThumbnail
                strokes={strokes}
                theme={theme}
                className="w-full h-full"
              />
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h2 className="text-[15px] font-semibold text-stone-900">
                  Share this drawing
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Anyone with the link sees exactly what you see, no account
                  needed.
                </p>
              </div>

              {/* Link row */}
              <div className="flex items-center gap-2 p-1 pl-3 rounded-xl bg-stone-50 border border-stone-200/80">
                <Link2 className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 min-w-0 text-xs bg-transparent text-stone-500 truncate focus:outline-none"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={handleCopyLink}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    copied
                      ? "bg-green-50 text-green-600"
                      : "bg-stone-900 text-white hover:bg-black"
                  }`}
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {/* Quick share */}
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-stone-900 hover:bg-black text-white transition-colors cursor-pointer"
              >
                <FaXTwitter className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">Share on X</span>
              </button>

              {isLong && (
                <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10.5px] text-amber-700 leading-relaxed">
                    This drawing is complex, so the link is quite long. Some
                    platforms may truncate it - exporting as an image is more
                    reliable for very detailed drawings.
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

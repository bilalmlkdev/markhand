import { useState } from "react";
import {
  Undo2,
  Redo2,
  Trash2,
  Download,
  Copy,
  Check,
  Info,
  RefreshCw,
  AlertTriangle,
  X,
  Share2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "../ui/Button";
import { ExportModal } from "../exports/ExportModal";
import { InstructionsModal } from "./InstructionsModal";
import { ShareModal } from "./ShareModal";
import type { UseDrawReturn } from "../../hooks/useDraw";
import type { CanvasTheme, GuideType } from "../../types";
import { FiGithub } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { FaBrush } from "react-icons/fa6";
import { IoCopyOutline } from "react-icons/io5";
import { MdSimCardDownload } from "react-icons/md";

interface HeaderProps {
  drawHook: UseDrawReturn;
  theme: CanvasTheme;
  guideType: GuideType;
  onToggleInstructions: () => void;
  instructionsOpen: boolean;
}

type ConfirmType = "reset" | "clear" | null;

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function Header({
  drawHook,
  theme,
  guideType,
  onToggleInstructions,
  instructionsOpen,
}: HeaderProps) {
  const navigate = useNavigate();
  const [exportOpen, setExportOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirmType, setConfirmType] = useState<ConfirmType>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    strokes,
    isEmpty,
    undo,
    redo,
    clear,
    getCanvas,
    canUndo,
    canRedo,
    drawingId,
  } = drawHook;

  const canvas = getCanvas();
  const canvasWidth = canvas?.width ?? 800;
  const canvasHeight = canvas?.height ?? 500;

  const handleCopy = async () => {
    if (isEmpty) return;
    const c = getCanvas();
    if (!c) return;

    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = c.width;
    tempCanvas.height = c.height;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    strokes.forEach((s) => {
      if (s.points.length < 2) return;
      tempCtx.beginPath();
      tempCtx.moveTo(s.points[0]!.x, s.points[0]!.y);
      for (let i = 1; i < s.points.length; i++) {
        tempCtx.lineTo(s.points[i]!.x, s.points[i]!.y);
      }
      tempCtx.strokeStyle = s.color;
      tempCtx.lineWidth = s.width;
      tempCtx.lineCap = "round";
      tempCtx.lineJoin = "round";
      tempCtx.stroke();
    });

    tempCanvas.toBlob(async (blob) => {
      if (!blob) return;
      try {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // fallback
      }
    }, "image/png");
  };

  const handleReset = () => {
    clear();
    const newId = generateId();
    navigate(`/dashboard/${newId}`);
    setConfirmType(null);
    setMobileMenuOpen(false);
  };

  const handleClear = () => {
    clear();
    const newId = generateId();
    navigate(`/dashboard/${newId}`);
    setConfirmType(null);
    setMobileMenuOpen(false);
  };

  const closeConfirm = () => setConfirmType(null);
  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  // Action buttons that go into the mobile dropdown
  const mobileActions = (
    <div className="flex flex-col gap-1 p-2 bg-white rounded-xl shadow-xl border border-stone-200 min-w-[160px] pointer-events-auto">
      <Button
        variant="ghost"
        size="sm"
        disabled={isEmpty}
        onClick={() => {
          setConfirmType("clear");
          setMobileMenuOpen(false);
        }}
        className="justify-start"
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Clear
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          setConfirmType("reset");
          setMobileMenuOpen(false);
        }}
        className="justify-start"
      >
        <RefreshCw className="w-4 h-4 mr-2" />
        Reset
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isEmpty}
        onClick={() => {
          handleCopy();
          setMobileMenuOpen(false);
        }}
        className="justify-start"
      >
        {copied ? (
          <Check className="w-4 h-4 mr-2 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        {copied ? "Copied!" : "Copy"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isEmpty}
        onClick={() => {
          setShareOpen(true);
          setMobileMenuOpen(false);
        }}
        className="justify-start"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>
      <Button
        variant="ghost"
        size="sm"
        disabled={isEmpty}
        onClick={() => {
          setExportOpen(true);
          setMobileMenuOpen(false);
        }}
        className="justify-start"
      >
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
      <div className="h-px bg-stone-200 my-1" />
      <a
        href="https://github.com/byllzz/markhand"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-3 py-2 text-sm text-stone-600 hover:bg-stone-100 rounded-md transition-colors"
        onClick={() => setMobileMenuOpen(false)}
      >
        <FiGithub className="w-4 h-4" />
        GitHub
      </a>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          onToggleInstructions();
          setMobileMenuOpen(false);
        }}
        className="justify-start"
      >
        <Info className="w-4 h-4 mr-2" />
        How to use
      </Button>
    </div>
  );

  return (
    <>
      {/*
        Modified to use transparent floating UI layout.
        pointer-events-none wrapper allows clicking through the empty spaces to the canvas.
      */}
      <header className="w-full absolute top-1.5 px-3 sm:px-5 flex items-center justify-between bg-transparent safe-top z-999 pointer-events-none gap-2">
        {/* Right side: Actions / Mobile Menu Pill */}
        <div className="flex  justify-start relative">
          {/* Desktop Right Pill */}
          <div className="hidden md:flex items-center px-1.5 py-0.5 bg-white rounded-full border border-stone-200 shadow-sm pointer-events-auto shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={isEmpty}
              onClick={handleCopy}
              title="Copy to clipboard"
              className="flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              {copied ? (
                <Check className="w-3 h-3" />
              ) : (
                <IoCopyOutline className="w-3 h-3" />
              )}
              <span className="text-xs font-medium relative right-0.5 top-[1px]">
                {copied ? "Copied!" : "Copy"}
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isEmpty}
              onClick={() => setShareOpen(true)}
              title="Share drawing"
              className="flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              <Share2 className="w-3 h-3" />
              <span className="text-xs font-medium relative right-0.5 top-[1px]">
                Share
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={isEmpty}
              onClick={() => setExportOpen(true)}
              title="Export"
              className="flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              <MdSimCardDownload className="w-3 h-3" />
              <span className="text-xs font-medium relative right-0.5 top-[1px]">
                Export
              </span>
            </Button>

            <div className="w-px h-5 bg-stone-200 mx-0.5 sm:mx-1" />
            <a
              href="https://github.com/byllzz/markhand"
              target="_blank"
              rel="noopener noreferrer"
              title="View on GitHub"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors shrink-0"
            >
              <FiGithub className="w-4 h-4" />
            </a>
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleInstructions}
              title="How to use Markhand"
              className="shrink-0 rounded-full"
            >
              <Info className="w-4 h-4" />
            </Button>
          </div>

          {/* Mobile Right Pill (Toggle) */}
          <div className="flex md:hidden items-center gap-1 px-1.5 py-1.5 bg-white rounded-full border border-stone-200 shadow-sm pointer-events-auto shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMobileMenu}
              title="More options"
              className="relative rounded-full"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 mt-3 z-50 md:hidden">
              {mobileActions}
            </div>
          )}
        </div>

        {/* Center: Main Controls Pill */}
        <div className="flex justify-center">
          <div className="flex items-center px-1.5 py-1 bg-white rounded-full shadow-sm pointer-events-auto shrink-0">
            <Button
              variant="ghost"
              size="sm"
              disabled={!canUndo}
              onClick={undo}
              title="Undo"
              className="flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline text-xs font-medium relative right-0.5 top-[1px]">
                Undo
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={!canRedo}
              onClick={redo}
              title="Redo"
              className="hidden md:flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              <Redo2 className="w-3.5 h-3.5" />
              <span className="text-xs hidden md:inline font-medium relative right-0.5 top-[1px]">
                Redo
              </span>
            </Button>

            {/* Desktop-only extra tools embedded in center pill */}
            <div className="hidden md:block w-px h-5 bg-stone-200 mx-0.5 sm:mx-2" />
            <Button
              variant="ghost"
              size="sm"
              disabled={isEmpty}
              onClick={() => setConfirmType("clear")}
              title="Clear canvas"
              className="hidden md:flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              <FaBrush className="w-3 h-3 -rotate-15" />
              <span className="text-xs font-medium hidden md:inline">
                Clear Canvas
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setConfirmType("reset")}
              title="Reset all data"
              className="hidden md:flex items-center px-2 whitespace-nowrap shrink-0 rounded-full"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-xs font-medium hidden md:inline">
                Reset Canvas
              </span>
            </Button>
          </div>
        </div>

      </header>

      <ExportModal
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        strokes={strokes}
        width={canvasWidth}
        height={canvasHeight}
        theme={theme}
        guideType={guideType}
      />
      <ShareModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        strokes={strokes}
        isEmpty={isEmpty}
        drawingId={drawingId}
      />
      <InstructionsModal
        open={instructionsOpen}
        onClose={onToggleInstructions}
      />

      {/* Confirmation Modal */}
      {confirmType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm pointer-events-auto"
            onClick={closeConfirm}
          />
          <div className="relative bg-white rounded-xl shadow-2xl border border-stone-200 w-full sm:w-[360px] max-w-[95vw] overflow-hidden pointer-events-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <h2 className="text-sm font-semibold text-stone-800">
                  {confirmType === "clear" ? "Clear Canvas" : "Reset All Data"}
                </h2>
              </div>
              <button
                onClick={closeConfirm}
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>
            <div className="p-4 sm:p-5 space-y-4">
              {confirmType === "clear" ? (
                <p className="text-sm text-stone-600 leading-relaxed">
                  This will remove all strokes from the canvas and start a new
                  drawing.
                </p>
              ) : (
                <>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    This will reset your settings and clear the current drawing.
                    Your other saved drawings will remain.
                  </p>
                  <div className="bg-red-50 rounded-lg p-3 text-xs text-red-700">
                    Your current drawing will be cleared and a new drawing ID
                    will be created.
                  </div>
                </>
              )}
            </div>
            <div className="px-4 pb-4 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={closeConfirm}>
                Cancel
              </Button>
              <Button
                variant="default"
                className={`flex-1 text-white ${confirmType === "clear" ? "bg-stone-900 hover:bg-stone-800" : "bg-red-600 hover:bg-red-700"}`}
                onClick={confirmType === "clear" ? handleClear : handleReset}
              >
                {confirmType === "clear" ? (
                  <>
                    <Trash2 className="w-4 h-4" />
                    Clear
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    Reset All
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

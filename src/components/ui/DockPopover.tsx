import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";

interface DockPopoverProps {
  open: boolean;
  onClose: () => void;
  anchorRef: RefObject<HTMLElement | null>;
  children: ReactNode;
  width?: string;
}

// Portaled + fixed coords from the trigger box; overflow-x-auto clips normal children.
export function DockPopover({
  open,
  onClose,
  anchorRef,
  children,
  width = "216px",
}: DockPopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ left: number; bottom: number } | null>(
    null,
  );

  useEffect(() => {
    if (!open) return;

    function updatePosition() {
      const anchor = anchorRef.current;
      if (!anchor) return;
      const rect = anchor.getBoundingClientRect();
      const margin = 8;
      const popoverWidth = parseFloat(width) || 216;
      const anchorMid = rect.left + rect.width / 2;
      const left = Math.min(
        window.innerWidth - margin - popoverWidth / 2,
        Math.max(margin + popoverWidth / 2, anchorMid),
      );
      const bottom = Math.max(
        margin,
        window.innerHeight - rect.top + 12,
      );
      setCoords({ left, bottom });
    }

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        anchorRef.current &&
        !anchorRef.current.contains(target)
      ) {
        onClose();
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Enter") onClose();
    }
    document.addEventListener("pointerdown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open, onClose, anchorRef, width]);

  if (!open || !coords) return null;

  return createPortal(
    <div
      ref={popoverRef}
      style={{
        position: "fixed",
        left: coords.left,
        bottom: coords.bottom,
        width,
        transform: "translateX(-50%)",
      }}
      className="bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200/70 shadow-[0_10px_32px_rgba(28,25,23,0.14)] overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-150 z-[999]"
    >
      {children}
    </div>,
    document.body,
  );
}

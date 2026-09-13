import { useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface TooltipProps {
  label: string;
  children: ReactNode;
  shortcut?: string;
}

// Renders via a portal into document.body, positioned from the trigger's
// own bounding box. Needed for the same reason DockPopover is portaled:
// the dock uses overflow-x-auto (for horizontal scroll on narrow
// screens), and per the CSS spec that forces overflow-y to auto as well,
// which silently clipped this tooltip whenever it tried to float above
// the dock as a normal child.
export function Tooltip({ label, children, shortcut }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState<{ left: number; bottom: number } | null>(
    null,
  );
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timerRef.current = setTimeout(() => {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({
        left: rect.left + rect.width / 2,
        bottom: window.innerHeight - rect.top + 10,
      });
      setVisible(true);
    }, 80);
  };
  const hide = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);
  };

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center justify-center shrink-0"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible &&
        coords &&
        createPortal(
          <div
            role="tooltip"
            style={{
              position: "fixed",
              left: coords.left,
              bottom: coords.bottom,
              transform: "translateX(-50%)",
            }}
            className="z-[9999] pointer-events-none animate-in fade-in slide-in-from-bottom-1 duration-75"
          >
            <div className="flex items-center gap-1.5 whitespace-nowrap px-2 py-1 rounded-lg bg-stone-900 text-white text-[11px] font-medium shadow-lg">
              {label}
              {shortcut && (
                <span className="px-1 py-px rounded bg-white/15 text-[9px] font-semibold tracking-wide">
                  {shortcut}
                </span>
              )}
            </div>
            <div className="w-1.5 h-1.5 bg-stone-900 rotate-45 mx-auto -mt-[3px]" />
          </div>,
          document.body,
        )}
    </div>
  );
}

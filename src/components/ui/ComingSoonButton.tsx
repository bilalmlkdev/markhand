import type { ReactNode } from "react";
import { Tooltip } from "./ToolTip";

interface ComingSoonButtonProps {
  icon: ReactNode;
  label: string;
  className?: string;
}

// A disabled placeholder button for features that are planned but not
// built yet. Deliberately styled to look like a real toolbar button (so
// people discover what's coming) while being unmistakably non-interactive.
export function ComingSoonButton({
  icon,
  label,
  className = "",
}: ComingSoonButtonProps) {
  return (
    <Tooltip label={`${label} - coming soon`}>
      <div
        aria-disabled="true"
        className={`relative w-8 h-8 flex items-center justify-center rounded-xl text-stone-300 cursor-not-allowed shrink-0 ${className}`}
      >
        {icon}
        <span className="absolute -top-1.5 -right-1.5 px-[3px] py-px rounded-full bg-stone-200 text-stone-500 text-[7px] font-bold leading-none tracking-wide">
          SOON
        </span>
      </div>
    </Tooltip>
  );
}

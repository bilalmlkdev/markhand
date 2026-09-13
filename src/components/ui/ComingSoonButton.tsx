import type { ReactNode } from "react";

interface ComingSoonButtonProps {
  label: string;
  icon: ReactNode;
  description?: string;
}

export function ComingSoonButton({
  label,
  icon,
  description,
}: ComingSoonButtonProps) {
  return (
    <button
      type="button"
      disabled
      aria-label={`${label}, coming soon`}
      className="group w-full flex items-center gap-3 rounded-xl px-2.5 py-2.5 text-left cursor-not-allowed"
    >
      <span className="w-8 h-8 flex items-center justify-center shrink-0 rounded-[10px] bg-stone-100 text-stone-400 leading-none">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium text-stone-600 truncate">
          {label}
        </span>
        {description && (
          <span className="block text-[10px] text-stone-400 mt-0.5 truncate">
            {description}
          </span>
        )}
      </span>
      <span className="shrink-0 rounded-full border border-stone-200 bg-stone-50 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-stone-400">
        Soon
      </span>
    </button>
  );
}

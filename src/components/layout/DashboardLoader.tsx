import { useEffect, useState } from "react";

interface DashboardLoaderProps {
  onDone: () => void;
  minDuration?: number;
}

export function DashboardLoader({
  onDone,
  minDuration = 900,
}: DashboardLoaderProps) {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const leaveTimer = setTimeout(() => setLeaving(true), minDuration);
    const doneTimer = setTimeout(() => onDone(), minDuration + 400);
    return () => {
      clearTimeout(leaveTimer);
      clearTimeout(doneTimer);
    };
  }, [minDuration, onDone]);

  return (
    <div
      className={`fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-white transition-opacity duration-400 ease-out ${
        leaving ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-5">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          className="text-blue-500 animate-[spin_2.4s_linear_infinite]"
        >
          <path
            d="M12 2v6M12 16v6M2 12h6M16 12h6"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium tracking-wide text-stone-500">
            Preparing your canvas
          </span>
        </div>
        <div className="h-[2px] w-32 overflow-hidden rounded-full bg-stone-100">
          <div className="h-full w-1/3 rounded-full bg-blue-500 animate-[loader-sweep_1.1s_ease-in-out_infinite]" />
        </div>
      </div>

      <style>{`
        @keyframes loader-sweep {
          0% { transform: translateX(-120%); }
          50% { transform: translateX(60%); }
          100% { transform: translateX(220%); }
        }
      `}</style>
    </div>
  );
}

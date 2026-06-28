import { PenLine } from 'lucide-react';

export function Header() {
  return (
    <header className="h-12 min-h-[48px] border-b border-stone-200 px-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-2">
        <PenLine className="w-5 h-5 text-stone-700" />
        <h1 className="text-lg font-semibold tracking-tight">Markhand</h1>
      </div>
      <span className="text-xs text-stone-400">v1.0.0</span>
    </header>
  );
}

import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  ArrowLeft,
  PenLine,
} from "lucide-react";
import {
  getDrawingRegistry,
  deleteDrawing,
  renameDrawing,
  loadDrawingStrokes,
} from "../../lib/storage";
import { DrawingThumbnail } from "./DrawingThumbnail";
import type { DrawingMeta } from "../../types";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatDate(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  if (isToday) {
    return date.toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  });
}

function DrawingCard({
  meta,
  onDelete,
  onRename,
}: {
  meta: DrawingMeta;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(meta.name);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const strokes = useMemo(() => loadDrawingStrokes(meta.id), [meta.id]);

  const commitRename = () => {
    const trimmed = nameDraft.trim();
    onRename(meta.id, trimmed || "Untitled");
    setEditing(false);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-stone-200/80 bg-white overflow-hidden hover:shadow-[0_8px_24px_rgba(28,25,23,0.08)] hover:-translate-y-0.5 hover:border-stone-300 transition-all duration-200">
      <Link
        to={`/dashboard/${meta.id}`}
        className="relative block aspect-[4/3] w-full overflow-hidden border-b border-stone-100"
      >
        <DrawingThumbnail
          strokes={strokes}
          theme={meta.theme}
          className="w-full h-full"
        />
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          {meta.strokeCount} stroke{meta.strokeCount !== 1 ? "s" : ""}
        </span>
      </Link>

      <div className="p-3 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1">
              <input
                autoFocus
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitRename();
                  if (e.key === "Escape") {
                    setNameDraft(meta.name);
                    setEditing(false);
                  }
                }}
                className="min-w-0 flex-1 text-sm font-medium text-stone-800 bg-stone-50 border border-stone-200 rounded-md px-2 py-1 focus:outline-none focus:border-stone-400"
              />
              <button
                onClick={commitRename}
                className="w-6 h-6 flex items-center justify-center rounded-md text-green-600 hover:bg-green-50 shrink-0 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => {
                  setNameDraft(meta.name);
                  setEditing(false);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-md text-stone-400 hover:bg-stone-100 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium text-stone-800 truncate">
                {meta.name}
              </p>
              <p className="text-[11px] text-stone-400">
                {formatDate(meta.updatedAt)}
              </p>
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditing(true)}
              title="Rename"
              className="w-7 h-7 flex items-center justify-center rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {confirmingDelete ? (
              <button
                onClick={() => onDelete(meta.id)}
                title="Confirm delete"
                className="w-7 h-7 flex items-center justify-center rounded-md text-white bg-red-600 hover:bg-red-700 cursor-pointer"
                onBlur={() => setConfirmingDelete(false)}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setConfirmingDelete(true)}
                title="Delete"
                className="w-7 h-7 flex items-center justify-center rounded-md text-stone-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function DrawingsGallery() {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<DrawingMeta[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const entries = getDrawingRegistry().sort(
      (a, b) => b.updatedAt - a.updatedAt,
    );
    const t = setTimeout(() => {
      setDrawings(entries);
      setLoading(false);
    }, 250);
    return () => clearTimeout(t);
  }, []);

  const handleDelete = (id: string) => {
    deleteDrawing(id);
    setDrawings((prev) => prev.filter((d) => d.id !== id));
  };

  const handleRename = (id: string, name: string) => {
    renameDrawing(id, name);
    setDrawings((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  };

  const handleNew = () => {
    navigate(`/dashboard/${generateId()}`);
  };

  return (
    <div className="min-h-screen bg-stone-50 font-body">
      <header className="sticky top-0 z-10 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate(-1)}
              title="Back"
              className="w-8 h-8 flex items-center justify-center rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors shrink-0 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-500 shrink-0"
              >
                <path
                  d="M12 2v6M12 16v6M2 12h6M16 12h6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <h1 className="text-sm font-semibold text-stone-800 truncate">
                My Drawings
              </h1>
              {!loading && drawings.length > 0 && (
                <span className="text-[11px] text-stone-400 font-medium shrink-0">
                  {drawings.length}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-1.5 rounded-full bg-stone-900 text-white px-3.5 py-2 text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            New Drawing
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-stone-200 bg-white overflow-hidden animate-pulse"
              >
                <div className="aspect-[4/3] w-full bg-stone-100" />
                <div className="p-3 space-y-2">
                  <div className="h-3 w-2/3 rounded bg-stone-100" />
                  <div className="h-2.5 w-1/3 rounded bg-stone-100" />
                </div>
              </div>
            ))}
          </div>
        ) : drawings.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-white border border-stone-200 flex items-center justify-center mb-4">
              <PenLine className="w-6 h-6 text-stone-300" />
            </div>
            <p className="text-sm font-medium text-stone-600 mb-1">
              No drawings yet
            </p>
            <p className="text-xs text-stone-400 mb-5 max-w-xs">
              Drawings you create are saved automatically in this browser. Start
              one to see it here.
            </p>
            <button
              onClick={handleNew}
              className="flex items-center gap-1.5 rounded-full bg-stone-900 text-white px-4 py-2.5 text-xs font-medium hover:bg-stone-800 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Start Drawing
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {drawings.map((meta) => (
              <DrawingCard
                key={meta.id}
                meta={meta}
                onDelete={handleDelete}
                onRename={handleRename}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

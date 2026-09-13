import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Check, MoreHorizontal, Pencil, PenLine, Plus, Trash2, X } from "lucide-react";
import {
  deleteDrawing,
  getDrawingRegistry,
  loadDrawingStrokes,
  renameDrawing,
} from "../../lib/storage";
import { themes } from "../../lib/canvas";
import { useNearViewport } from "../../hooks/useNearViewport";
import { DrawingThumbnail } from "./DrawingThumbnail";
import type { DrawingMeta } from "../../types";

function generateId(): string {
  return crypto.randomUUID();
}

function formatDate(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [cardRef, isNear] = useNearViewport<HTMLElement>();
  const strokes = useMemo(
    () => (isNear ? loadDrawingStrokes(meta.id) : []),
    [isNear, meta.id],
  );
  const theme = themes[meta.theme] ?? themes.default;

  const commitRename = () => {
    const nextName = nameDraft.trim() || "Untitled";
    onRename(meta.id, nextName);
    setNameDraft(nextName);
    setEditing(false);
    setMenuOpen(false);
  };

  return (
    <article
      ref={cardRef}
      className="group overflow-hidden rounded-[22px] border border-stone-200/90 bg-white transition-colors duration-200 hover:border-stone-300"
    >
      <Link
        to={`/dashboard/${meta.id}`}
        className="relative block aspect-[16/11] overflow-hidden border-b border-stone-100 bg-stone-50 focus-visible:outline-none"
      >
        <DrawingThumbnail strokes={strokes} theme={meta.theme} className="h-full w-full" />

        <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between p-3">
          <span
            className="inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-[10px] font-semibold"
            style={{
              backgroundColor: `${theme.surface}ee`,
              borderColor: `${theme.dot}66`,
              color: "#57534e",
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: theme.dot }} />
            {theme.name}
          </span>
          <span className="rounded-full border border-white/70 bg-white/80 px-2.5 py-1 text-[10px] font-medium text-stone-500 backdrop-blur-sm">
            {meta.strokeCount} {meta.strokeCount === 1 ? "stroke" : "strokes"}
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-xl border border-white/70 bg-white/72 px-3 py-2 text-[10px] text-stone-500 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
          Open drawing
        </div>
      </Link>

      <div className="relative flex min-h-[76px] items-center gap-3 px-3.5 py-3">
        <div className="min-w-0 flex-1">
          {editing ? (
            <div className="flex items-center gap-1.5">
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
                className="min-w-0 flex-1 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-2 text-sm font-medium text-stone-800 outline-none focus:border-stone-400"
              />
              <button type="button" onClick={commitRename} aria-label="Save name" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-700 hover:bg-stone-100">
                <Check className="h-4 w-4" />
              </button>
              <button type="button" onClick={() => { setNameDraft(meta.name); setEditing(false); }} aria-label="Cancel rename" className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100">
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              <h2 className="truncate text-sm font-semibold text-stone-800">{meta.name}</h2>
              <p className="mt-1 text-[11px] text-stone-400">Updated {formatDate(meta.updatedAt)}</p>
            </>
          )}
        </div>

        {!editing && (
          <div className="relative shrink-0">
            <button
              type="button"
              aria-label="Drawing actions"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-10 z-20 w-36 rounded-xl border border-stone-200 bg-white p-1.5">
                <button
                  type="button"
                  onClick={() => { setEditing(true); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Rename
                </button>
                <button
                  type="button"
                  onClick={() => { setConfirmingDelete(true); setMenuOpen(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
        {confirmingDelete && (
          <div className="absolute inset-x-3 bottom-[68px] z-20 flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-white px-3 py-2 text-[11px] text-red-700">
            <span>Delete this drawing?</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setConfirmingDelete(false)}
                className="rounded-lg px-2 py-1.5 font-medium text-stone-500 hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => onDelete(meta.id)}
                className="rounded-lg bg-red-600 px-2.5 py-1.5 font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

export function DrawingsGallery() {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<DrawingMeta[]>(() =>
    getDrawingRegistry().sort((a, b) => b.updatedAt - a.updatedAt),
  );

  const handleDelete = (id: string) => {
    deleteDrawing(id);
    setDrawings((prev) => prev.filter((drawing) => drawing.id !== id));
  };

  const handleRename = (id: string, name: string) => {
    renameDrawing(id, name);
    setDrawings((prev) =>
      prev.map((drawing) => (drawing.id === id ? { ...drawing, name, updatedAt: Date.now() } : drawing)),
    );
  };

  const handleNew = () => {
    navigate(`/dashboard/${generateId()}`);
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] font-body text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200/80 bg-[#faf9f7]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-stone-200 bg-white">
                  <PenLine className="h-3.5 w-3.5 text-stone-600" />
                </span>
                <h1 className="truncate text-sm font-semibold text-stone-900">Drawings</h1>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-stone-500">
                  {drawings.length}
                </span>
              </div>
              <p className="mt-1 pl-9 text-[11px] text-stone-400">Saved locally in this browser</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNew}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-stone-900 px-3.5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-stone-800"
          >
            <Plus className="h-3.5 w-3.5" />
            New drawing
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {drawings.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] border border-stone-200 bg-white">
              <PenLine className="h-7 w-7 text-stone-300" />
            </div>
            <h2 className="text-base font-semibold text-stone-800">Nothing here yet</h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">Your drawings are saved automatically on this device. Start a canvas and it will appear here.</p>
            <button
              type="button"
              onClick={handleNew}
              className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Start drawing
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">Your workspace</p>
                <p className="mt-1 text-sm text-stone-500">Pick up where you left off.</p>
              </div>
              <span className="hidden text-[11px] text-stone-400 sm:inline">No cloud storage. No account.</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {drawings.map((meta) => (
                <DrawingCard key={meta.id} meta={meta} onDelete={handleDelete} onRename={handleRename} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  MoreHorizontal,
  PenLine,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  deleteAllDrawings,
  deleteDrawing,
  getDrawingRegistry,
  loadDrawingStrokes,
  renameDrawing,
} from "../../lib/storage";
import { themes } from "../../lib/canvas";
import { useNearViewport } from "../../hooks/useNearViewport";
import { DrawingThumbnail } from "./DrawingThumbnail";
import { DeleteConfirmModal } from "../layout/DeleteConfirmModal";
import type { DrawingMeta } from "../../types";
import { generateId } from "../../lib/id";

function formatDate(ts: number): string {
  const date = new Date(ts);
  const now = new Date();
  if (date.toDateString() === now.toDateString()) {
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

function DrawingRow({
  meta,
  onRequestDelete,
  onRename,
}: {
  meta: DrawingMeta;
  onRequestDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState(meta.name);
  const [menuOpen, setMenuOpen] = useState(false);
  const [rowRef, isNear] = useNearViewport<HTMLLIElement>();
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
    <li
      ref={rowRef}
      className="grid grid-cols-[1fr_2.25rem] sm:grid-cols-[1fr_6.5rem_4.5rem_6rem_2.25rem] items-center gap-x-4 border-b border-stone-100 px-4 py-2.5 transition-colors hover:bg-stone-50/80"
    >
      <div className="flex min-w-0 items-center gap-3">
        <Link
          to={`/dashboard/${meta.id}`}
          className="flex min-w-0 flex-1 items-center gap-3 focus-visible:outline-none"
          aria-label={`Open ${meta.name}`}
        >
          <DrawingThumbnail
            strokes={strokes}
            theme={meta.theme}
            className="h-12 w-12 shrink-0 rounded-md border border-stone-200/70"
          />
          <div className="min-w-0">
            {editing ? (
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
                className="w-full border-b border-stone-300 bg-transparent py-0.5 text-sm font-medium text-stone-900 outline-none focus:border-stone-500"
              />
            ) : (
              <h2 className="truncate text-sm font-medium text-stone-900">
                {meta.name}
              </h2>
            )}
            <p className="mt-0.5 truncate text-xs text-stone-400 sm:hidden">
              {formatDate(meta.updatedAt)} · {meta.strokeCount}{" "}
              {meta.strokeCount === 1 ? "stroke" : "strokes"}
            </p>
          </div>
        </Link>

        {editing && (
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={commitRename}
              aria-label="Save name"
              className="flex h-7 w-7 items-center justify-center rounded text-stone-600 hover:bg-stone-100"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setNameDraft(meta.name);
                setEditing(false);
              }}
              aria-label="Cancel rename"
              className="flex h-7 w-7 items-center justify-center rounded text-stone-400 hover:bg-stone-100"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      <span className="hidden text-xs tabular-nums text-stone-400 sm:block">
        {formatDate(meta.updatedAt)}
      </span>

      <span className="hidden text-right text-xs tabular-nums text-stone-500 sm:block">
        {meta.strokeCount}
      </span>

      <span className="hidden items-center gap-1.5 text-xs text-stone-500 md:flex">
        <span
          className="h-2 w-2 shrink-0 rounded-full ring-1 ring-black/5"
          style={{ backgroundColor: theme.dot }}
        />
        {theme.name}
      </span>

      <div className="relative flex justify-end">
        <div className="relative">
          <button
            type="button"
            aria-label={`Actions for ${meta.name}`}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-8 w-8 items-center justify-center rounded text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 w-36 rounded-md border border-stone-200 bg-white py-1 shadow-md">
              <button
                type="button"
                onClick={() => {
                  setEditing(true);
                  setMenuOpen(false);
                }}
                className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-stone-600 hover:bg-stone-50 hover:text-stone-900"
              >
                Rename
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onRequestDelete(meta.id);
                }}
                className="w-full px-2.5 py-1.5 text-left text-xs font-medium text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </li>
  );
}

export function DrawingsGallery() {
  const navigate = useNavigate();
  const [drawings, setDrawings] = useState<DrawingMeta[]>(() =>
    getDrawingRegistry().sort((a, b) => b.updatedAt - a.updatedAt),
  );
  const [deleteTarget, setDeleteTarget] = useState<string | "all" | null>(null);

  const handleDelete = (id: string) => {
    deleteDrawing(id);
    setDrawings((prev) => prev.filter((drawing) => drawing.id !== id));
    setDeleteTarget(null);
  };

  const handleDeleteAll = () => {
    deleteAllDrawings();
    setDrawings([]);
    setDeleteTarget(null);
  };

  const handleRename = (id: string, name: string) => {
    renameDrawing(id, name);
    setDrawings((prev) =>
      prev.map((drawing) =>
        drawing.id === id
          ? { ...drawing, name, updatedAt: Date.now() }
          : drawing,
      ),
    );
  };

  const handleNew = () => {
    navigate(`/dashboard/${generateId()}`);
  };

  const deleteTitle =
    deleteTarget === "all" ? "Delete all drawings?" : "Delete drawing?";
  const deleteDescription =
    deleteTarget === "all"
      ? `This permanently removes all ${drawings.length} drawings from this browser. This can't be undone.`
      : deleteTarget
        ? "This permanently removes the drawing and its strokes from this browser. This can't be undone."
        : "";

  return (
    <div className="min-h-screen bg-[#faf9f7] font-body text-stone-900">
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-[#faf9f7]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-stone-200 bg-white">
                  <PenLine className="h-3.5 w-3.5 text-stone-600" />
                </span>
                <h1 className="truncate text-sm font-semibold text-stone-900">
                  Drawings
                </h1>
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-stone-500">
                  {drawings.length}
                </span>
              </div>
              <p className="mt-1 pl-9 text-[11px] text-stone-400">
                Saved locally in this browser
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleNew}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-stone-900 px-3.5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-stone-800"
          >
            <Plus className="h-3.5 w-3.5" />
            New drawing
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        {drawings.length === 0 ? (
          <div className="mx-auto flex max-w-md flex-col items-center py-20 text-center">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-stone-200 bg-white">
              <PenLine className="h-6 w-6 text-stone-300" />
            </div>
            <h2 className="text-base font-semibold text-stone-800">
              Nothing here yet
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-400">
              Your drawings are saved automatically on this device. Start a
              canvas and it will appear here.
            </p>
            <button
              type="button"
              onClick={handleNew}
              className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white hover:bg-stone-800"
            >
              <Plus className="h-3.5 w-3.5" />
              Start drawing
            </button>
          </div>
        ) : (
          <>
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-stone-400">
                  Your workspace
                </p>
                <p className="mt-1 text-sm text-stone-500">
                  Pick up where you left off. No cloud. No account.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteTarget("all")}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Delete all</span>
                <span className="sm:hidden">All</span>
              </button>
            </div>

            <div className="hidden grid-cols-[1fr_6.5rem_4.5rem_6rem_2.25rem] gap-x-4 px-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-stone-400 sm:grid">
              <span>Name</span>
              <span>Updated</span>
              <span className="text-right">Strokes</span>
              <span>Theme</span>
              <span />
            </div>

            <ul>
              {drawings.map((meta) => (
                <DrawingRow
                  key={meta.id}
                  meta={meta}
                  onRequestDelete={(id) => setDeleteTarget(id)}
                  onRename={handleRename}
                />
              ))}
            </ul>
          </>
        )}
      </main>

      <DeleteConfirmModal
        open={deleteTarget !== null}
        title={deleteTitle}
        description={deleteDescription}
        confirmLabel={deleteTarget === "all" ? "Delete all" : "Delete"}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() =>
          deleteTarget === "all"
            ? handleDeleteAll()
            : deleteTarget
              ? handleDelete(deleteTarget)
              : undefined
        }
      />
    </div>
  );
}

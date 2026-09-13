import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import GrainyShader from "../background/GrainyShader";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { LuGithub } from "react-icons/lu";
import { getDrawingRegistry } from "../../lib/storage";

function generateId(): string {
  return crypto.randomUUID();
}

export function LandingPage() {
  const navigate = useNavigate();
  const [hasDrawings] = useState(() => getDrawingRegistry().length > 0);

  const openEditor = () =>
    navigate(`/dashboard/${generateId()}`, { state: { fromLanding: true } });

  return (
    <GrainyShader className="min-h-screen">
      <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
        <header className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-1 shrink-0">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="text-blue-500 relative bottom-[1px]"
            >
              <path
                d="M12 2v6M12 16v6M2 12h6M16 12h6"
                stroke="currentColor"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>{" "}
            <span className="bg-gradient-to-b from-black to-white/70 bg-clip-text text-transparent">
              Markhand
            </span>
          </div>
          <div className="flex items-center gap-2">
            {hasDrawings && (
              <Link
                to="/drawings"
                className="text-xs font-medium bg-white/90 hover:bg-white text-black rounded-lg px-2.5 py-[5px] active:scale-99"
              >
                My Drawings
              </Link>
            )}
            <button
              onClick={openEditor}
              className="text-xs font-medium bg-white/90 hover:bg-white text-black rounded-lg px-2.5 py-[5px] active:scale-99"
            >
              Open Canvas
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col justify-center px-6 py-16 sm:py-24">
          <div className="max-w-4xl space-y-6 sm:space-y-8">
            <span className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-black/5 px-1.5 text-[10px] font-medium text-black/80">
              Open Source{" "}
              <span className="hidden md:inline">| Free Forever</span>
            </span>

            <div className="space-y-1.5 relative right-2">
              <h1 className="font-instrument text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-b from-black to-white/70 bg-clip-text text-transparent">
                Draw a mark
              </h1>
              <h2 className="font-instrument text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-b from-black to-white/70 bg-clip-text text-transparent pb-2">
                Worth Keeping
              </h2>
            </div>

            <p className="lg:text-base text-sm text-black max-w-lg leading-relaxed">
              A distraction‑free studio to draw freely and keep the canvas distraction-free. Pick
              a pen that feels right, switch canvas themes to match your style,
              and export a clean PNG or SVG, all privately, right in your
              browser.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={openEditor}
                className="group inline-flex items-center justify-center gap-1.5 rounded-lg bg-black/95 px-3 py-1.5 text-xs font-medium text-white hover:bg-black active:scale-99"
              >
                Start Drawing
                <MdOutlineKeyboardArrowRight
                  size={18}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <a
                href="https://github.com/bilalmlkdev/markhand"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-black bg-zinc-200/50 active:scale-99"
              >
                <LuGithub
                  size={16}
                  className="transition-transform duration-200 group-hover:scale-110"
                />
                View on GitHub
              </a>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs text-black/70">
            <span>No sign-up. No watermarks. No catch.</span>
            <span className="hidden sm:inline text-white/20">·</span>
            <span>Your strokes stay on your device.</span>
          </div>
        </main>
      </div>
    </GrainyShader>
  );
}

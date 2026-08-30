import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { getDrawingRegistry } from "../../lib/storage";
import OceanWave from "../shaders/OceanWave"; // adjust path

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function LandingPage() {
  const navigate = useNavigate();
  const [hasDrawings, setHasDrawings] = useState(false);

  useEffect(() => {
    setHasDrawings(getDrawingRegistry().length > 0);
  }, []);

  const openEditor = () =>
    navigate(`/dashboard/${generateId()}`, { state: { fromLanding: true } });

  return (
    <>
      <OceanWave />
      <section>
        {/* Top hairline - increased z-index so it stays above the shader */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-stone-300 to-transparent z-30" />

        <div className="relative z-20 w-full max-w-[1200px] mx-auto flex min-h-screen flex-col">
          {/* Nav */}
          <nav className="flex items-center justify-between px-5 sm:px-10 py-4">
            <div className="flex items-center gap-1.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                className="text-blue-500"
              >
                <path
                  d="M12 2v6M12 16v6M2 12h6M16 12h6"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-base relative top-[1px] font-medium tracking-tight text-stone-900">
                Markhand
              </span>
            </div>
            <div className="flex items-center gap-2">
              {hasDrawings && (
                <Link
                  to="/drawings"
                  className="flex items-center gap-1.5 rounded-lg hover:bg-white/90 px-2.5 py-1 text-[13px] font-medium text-stone-700  bg-white"
                >
                  {/* <LayoutGrid className="h-3 w-3" /> */}
                  <span className="relative bottom-[1px]">My Drawings</span>
                </Link>
              )}
              <button
                onClick={openEditor}
                className="rounded-xl bg-stone-900 px-3 py-1.5 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-stone-800 cursor-pointer flex items-center justify-center"
              >
                <span className="relative bottom-[1px]">Open Canvas</span>
              </button>
            </div>
          </nav>

          {/* Hero */}
          <main className="flex flex-1 flex-col justify-center px-5 sm:px-10 pb-24 pt-20">
            <div className="max-w-2xl">
              <div className="mb-6 inline-flex w-fit items-center rounded-lg border border-stone-200 bg-white/70 px-2.5 py-1 text-[11px] font-medium tracking-wide text-stone-500 backdrop-blur-sm">
                Open Source&nbsp;|&nbsp;Free Forever
              </div>

              <div className="flex flex-col items-start">
                <h1
                  className="font-instrument text-5xl sm:text-6xl md:text-7xl lg:text-[100px]
                  bg-linear-to-b from-black via-black/88 to-transparent
                  bg-clip-text text-transparent
                  pb-4
                  drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)] leading-[.8]"
                >
                  Draw a mark
                </h1>
                <h1
                  className="font-instrument text-5xl sm:text-6xl md:text-7xl lg:text-[100px]
                  bg-linear-to-b from-black via-black/88 to-transparent
                  bg-clip-text text-transparent leading-[.8]
                  pb-4
                  drop-shadow-[0_30px_60px_rgba(0,0,0,0.2)]"
                >
                  worth keeping.
                </h1>
              </div>
              <p className="mt-6 max-w-md text-[15px] leading-relaxed text-stone-500">
                A minimalist tool for practicing your signature. Draw with a
                natural pen, style with beautiful themes, and export a clean
                signature image all in your browser.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <button
                  onClick={openEditor}
                  className="group inline-flex items-center gap-1 rounded-xl bg-stone-900 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-stone-800 cursor-pointer"
                >
                  Start Drawing
                  <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </button>
                <a
                  href="https://github.com/byllzz/markhand"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white/70 px-3 py-2 text-[13px] font-medium text-stone-700 backdrop-blur-sm transition-colors hover:bg-stone-50"
                >
                  <FiGithub className="h-3.5 w-3.5" />
                  View on GitHub
                </a>
              </div>
            </div>

            <div className="mt-25 flex flex-wrap items-center gap-x-6 gap-y-2 text-[12px] text-stone-400">
              <span>No sign-up. No watermarks. No catch.</span>
              <span className="hidden sm:inline text-stone-300">•</span>
              <span>Everything runs locally in your browser.</span>
            </div>
          </main>
        </div>
      </section>
    </>
  );
}

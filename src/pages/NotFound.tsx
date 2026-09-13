import { useNavigate, Link } from "react-router-dom";
import GrainyShader from "../components/background/GrainyShader";

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function NotFound() {
  const navigate = useNavigate();

  const openEditor = () =>
    navigate(`/dashboard/${generateId()}`, { state: { fromLanding: true } });

  return (
    <GrainyShader className="min-h-screen">
      <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
        <header className="flex items-center px-6 h-14">
          <Link to="/" className="flex items-center gap-1 shrink-0">
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
          </Link>
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
          <span className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-black/5 px-1.5 text-2xl font-medium text-black/80">
            404
          </span>

          <h1 className="mt-5 text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-black">
            Nothing drawn here yet
          </h1>
          <p className="mt-3 max-w-sm text-sm text-black/60">
            The page you're looking for doesn't exist, or the drawing behind it
            was cleared.
          </p>

          <div className="mt-8 flex items-center gap-2">
            <button
              onClick={openEditor}
              className="text-xs font-medium bg-black/90 hover:bg-black text-white rounded-lg px-3.5 py-2 active:scale-99"
            >
              Open Canvas
            </button>
            <Link
              to="/"
              className="text-xs font-medium border border-black/10 hover:bg-black/5 text-black/80 rounded-lg px-3.5 py-2 active:scale-99"
            >
              Back home
            </Link>
          </div>
        </main>
      </div>
    </GrainyShader>
  );
}

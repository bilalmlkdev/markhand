import { Component, type ErrorInfo, type ReactNode } from "react";
import GrainyShader from "../background/GrainyShader";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Class components are the only way to catch render errors in React.
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Markhand crashed:", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false });
    window.location.href = "/";
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <GrainyShader className="min-h-screen">
        <div className="min-h-screen max-w-5xl mx-auto flex flex-col">
          <header className="flex items-center px-6 h-14">
            <a href="/" className="flex items-center gap-1 shrink-0">
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
            </a>
          </header>

          <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="inline-flex items-center gap-1 rounded-md border border-black/10 bg-black/5 px-1.5 text-2xl font-medium text-black/80">
              Something went wrong
            </span>

            <h1 className="mt-5 text-3xl sm:text-4xl font-medium tracking-[-0.02em] text-black">
              The canvas hit a snag
            </h1>
            <p className="mt-3 max-w-sm text-sm text-black/60">
              Something broke while rendering this page. Your other drawings are
              safe - they're saved on this device.
            </p>

            <div className="mt-8 flex items-center gap-2">
              <button
                onClick={this.handleReset}
                className="text-xs font-medium bg-black/90 hover:bg-black text-white rounded-lg px-3.5 py-2 active:scale-99"
              >
                Back to home
              </button>
            </div>
          </main>
        </div>
      </GrainyShader>
    );
  }
}

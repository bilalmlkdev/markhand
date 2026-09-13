import { useEffect } from "react";

// Browsers only allow their own dialog when a tab/window is closed, so a
// custom modal can't block it. This opts in to that native confirmation
// whenever it's enabled; the branded "Exit" flow lives in ExitConfirmModal.
export function useExitGuard(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [enabled]);
}
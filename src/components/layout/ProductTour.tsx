import { useCallback, useEffect, useRef, useState } from "react";
import { Joyride, STATUS, ACTIONS, EVENTS } from "react-joyride";
import type { Step, EventData } from "react-joyride";
import { markTourSeen } from "../../lib/tour";

const steps: Step[] = [
  {
    target: '[data-tour="canvas"]',
    title: "A clean place to draw",
    content:
      "Welcome to Markhand - a distraction-free canvas for drawing, signing, and sketching. Draw with a mouse, trackpad, stylus, or touch.",
    placement: "center",
  },
  {
    target: '[data-tour="toolbar"]',
    title: "Everything in one bar",
    content:
      "Every tool lives in this single dock: pens, eraser, guides, undo/redo/clear, ink styling, export, the gallery, and more - nothing hides your work.",
    placement: "top",
  },
  {
    target: '[data-tour="style-button"]',
    title: "Tune the ink",
    content:
      "The ink panel lets you pick a color and a line weight, keeping the style controls compact so the canvas stays clear.",
    placement: "top",
  },
  {
    target: '[aria-label="Eraser"]',
    title: "Erase by dragging",
    content:
      "Tap the eraser to arm it, then hold the left button and drag over any line - it removes just what you cover, and its size matches the ring.",
    placement: "top",
  },
  {
    target: '[aria-label="Dot grid"]',
    title: "Guides for even strokes",
    content:
      "Switch to a dot grid or a full grid to keep lines and text aligned. Press G to cycle guides quickly, or turn them off.",
    placement: "top",
  },
  {
    target: '[aria-label="Undo"]',
    title: "Fix mistakes instantly",
    content:
      "Undo, redo, or clear the whole canvas with one click - or the keyboard shortcuts \u2318/Ctrl+Z, \u2318/Ctrl+Shift+Z, and Delete.",
    placement: "top",
  },
  {
    target: '[aria-label="Export drawing"]',
    title: "Save your work",
    content:
      "Export the canvas as a PNG or SVG image, or share it with a link that encodes the drawing - no upload needed.",
    placement: "top",
  },
  {
    target: '[aria-label="My drawings"]',
    title: "Everything stays saved",
    content:
      "Every stroke is stored locally in this browser. Open your gallery to revisit, rename, or delete any drawing anytime.",
    placement: "top",
  },
  {
    target: '[aria-label="More options"]',
    title: "Extras live in your avatar",
    content:
      "Your avatar is per browser - tap it for options like resetting the canvas or closing Markhand. That's it - get drawing!",
    placement: "top",
  },
];

interface ProductTourProps {
  run: boolean;
  onFinish: () => void;
}

// Forcibly cleans up side effects react-joyride leaves behind if it gets
// unmounted mid-teardown instead of finishing its own internal lifecycle.
// This is a known issue with the library (it locks body scroll and
// portals an overlay node outside React's tree); reloading the page
// "fixed" it before only because a reload wipes DOM state React never
// owned in the first place.
function forceCleanupJoyrideArtifacts() {
  document.body.style.overflow = "";
  document.body.style.removeProperty("overflow");
  document
    .querySelectorAll(
      ".react-joyride__overlay, .react-joyride__spotlight, #react-joyride-portal",
    )
    .forEach((node) => node.remove());
}

export function ProductTour({ run, onFinish }: ProductTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const cleanupTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEvent = useCallback(
    (data: EventData) => {
      const { status, action, index, type } = data;

      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        if (nextIndex >= 0 && nextIndex < steps.length) {
          setStepIndex(nextIndex);
        }
      }

      if (
        status === STATUS.FINISHED ||
        status === STATUS.SKIPPED ||
        action === ACTIONS.CLOSE
      ) {
        markTourSeen();
        onFinish();
        // Let Joyride's own callback finish running and attempt its own
        // teardown first, then sweep up anything it left behind. The
        // delay matters: cleaning up synchronously in this same tick is
        // exactly the race that caused the stuck overlay before.
        cleanupTimerRef.current = setTimeout(forceCleanupJoyrideArtifacts, 50);
      }
    },
    [onFinish],
  );

  // Belt-and-suspenders: also run the sweep whenever `run` flips to
  // false from the parent, and on unmount, regardless of how that
  // happened.
  useEffect(() => {
    if (!run) forceCleanupJoyrideArtifacts();
    return () => {
      if (cleanupTimerRef.current) clearTimeout(cleanupTimerRef.current);
      forceCleanupJoyrideArtifacts();
    };
  }, [run]);

  if (!run) return null;

  return (
    <Joyride
      run={run}
      steps={steps}
      stepIndex={stepIndex}
      onEvent={handleEvent}
      continuous
      options={{
        primaryColor: "#1c1917",
        textColor: "#1c1917",
        backgroundColor: "#ffffff",
        arrowColor: "#ffffff",
        overlayColor: "rgba(28, 25, 23, 0.46)",
        zIndex: 100000,
        spotlightPadding: 8,
        showProgress: true,
        buttons: ["back", "skip", "primary"],
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Done",
        next: "Next",
        skip: "Skip tour",
      }}
      styles={{
        tooltip: {
          borderRadius: 16,
          padding: 18,
          boxShadow: "0 14px 40px rgba(28,25,23,0.14)",
        },
        tooltipTitle: {
          fontSize: 15,
          fontWeight: 650,
          marginBottom: 4,
        },
        tooltipContent: {
          fontSize: 13,
          lineHeight: 1.55,
          color: "#78716c",
          padding: "7px 0",
        },
        buttonPrimary: {
          backgroundColor: "#1c1917",
          borderRadius: 10,
          fontSize: 12,
          fontWeight: 600,
          padding: "8px 13px",
        },
        buttonBack: {
          color: "#78716c",
          fontSize: 12,
          fontWeight: 500,
        },
        buttonSkip: {
          color: "#a8a29e",
          fontSize: 12,
        },
      }}
    />
  );
}

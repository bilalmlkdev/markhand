import { useEffect, useCallback, useState } from "react";
import { Joyride, STATUS, ACTIONS, EVENTS } from "react-joyride";
import type { Step, EventData } from "react-joyride";
import { markTourSeen } from "../../lib/tour";

const steps: Step[] = [
  {
    target: '[data-tour="canvas"]',
    title: "A clean place to draw",
    content:
      "Draw with a mouse, trackpad, stylus, or touch. Markhand keeps the canvas quiet so your work stays the focus.",
    placement: "center",
  },
  {
    target: '[data-tour="toolbar"]',
    title: "Your drawing dock",
    content:
      "Pick a cursor style, erase, switch guides, undo, redo, clear, change your ink, and change the canvas theme.",
    placement: "top",
  },
  {
    target: '[data-tour="style-button"]',
    title: "Tune the ink",
    content:
      "Change line weight and pick a color from the compact style panel without leaving the canvas.",
    placement: "top",
  },
  {
    target: '[data-tour="header-actions"]',
    title: "Finish and export",
    content:
      "Share the drawing with a link, export it as an image, or keep less-used actions inside More.",
    placement: "top",
  },
];

interface ProductTourProps {
  run: boolean;
  onFinish: () => void;
}

export function ProductTour({ run, onFinish }: ProductTourProps) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (run) setStepIndex(0);
  }, [run]);

  const restoreScroll = useCallback(() => {
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "auto" }));
  }, []);

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
        restoreScroll();
        onFinish();
      }
    },
    [onFinish, restoreScroll],
  );

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

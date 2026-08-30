import { useState, useEffect, useCallback } from "react";
import { Joyride, STATUS, ACTIONS, EVENTS } from "react-joyride";
import type { Step, EventData } from "react-joyride";
import { markTourSeen } from "../../lib/tour";

const PANEL_TARGET =
  '[data-tour="style-panel-collapsed"], [data-tour="style-panel"]';

const steps: Step[] = [
  {
    target: '[data-tour="canvas"]',
    title: "Draw freely",
    content:
      "Use your mouse, trackpad, or touch to draw right here. Your strokes appear instantly, just like pen on paper.",
    placement: "center",
  },
  {
    target: '[data-tour="toolbar"]',
    title: "Your toolbar",
    content:
      "Pick a cursor style, erase with the eraser tool, switch guides - Dot Grid, Line Grid, Ruled Lines, or none - and undo, redo, or clear the canvas, all from here.",
    placement: "top",
  },
  {
    target: PANEL_TARGET,
    title: "Customize your style",
    content:
      "Change pen color and stroke width, or switch to the Theme tab to change the canvas background.",
    placement: "left",
  },
  {
    target: '[data-tour="header-actions"]',
    title: "Export your work",
    content:
      "Copy your drawing, share a link, or open Export to save it as a PNG or SVG with a custom background.",
    placement: "bottom",
  },
];

interface ProductTourProps {
  run: boolean;
  onFinish: () => void;
}

export function ProductTour({ run, onFinish }: ProductTourProps) {
  const [stepIndex, setStepIndex] = useState(0);
  const [panelWasCollapsed, setPanelWasCollapsed] = useState(false);

  // Reset to the beginning whenever a fresh tour run is requested.
  useEffect(() => {
    if (run) setStepIndex(0);
  }, [run]);

  // Make sure the style panel is expanded before we spotlight it,
  // and restore its prior collapsed state afterwards.
  useEffect(() => {
    if (!run) return;
    const panelStep = steps.findIndex((s) => s.target === PANEL_TARGET);
    if (stepIndex === panelStep) {
      const wasCollapsed =
        localStorage.getItem("markhand_style_panel_open") === "false";
      setPanelWasCollapsed(wasCollapsed);
      if (wasCollapsed) {
        const collapsedBtn = document.querySelector<HTMLButtonElement>(
          '[data-tour="style-panel-collapsed"] button',
        );
        collapsedBtn?.click();
      }
    }
  }, [stepIndex, run]);

  const restorePanel = useCallback(() => {
    if (panelWasCollapsed) {
      const expandedPanel = document.querySelector<HTMLElement>(
        '[data-tour="style-panel"] button',
      );
      expandedPanel?.click();
    }
  }, [panelWasCollapsed]);

  // Let Enter advance the tour, same as clicking "Next" / "Done".
  useEffect(() => {
    if (!run) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const primaryButton = document.querySelector<HTMLButtonElement>(
        '[data-action="primary"]',
      );
      if (primaryButton) {
        e.preventDefault();
        primaryButton.click();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [run]);

  const handleEvent = useCallback(
    (data: EventData) => {
      const { status, action, index, type } = data;

      if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
        const nextIndex = index + (action === ACTIONS.PREV ? -1 : 1);
        setStepIndex(nextIndex);
      }

      if (
        status === STATUS.FINISHED ||
        status === STATUS.SKIPPED ||
        action === ACTIONS.CLOSE
      ) {
        markTourSeen();
        restorePanel();
        onFinish();
      }
    },
    [onFinish, restorePanel],
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
        overlayColor: "rgba(28, 25, 23, 0.5)",
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
          padding: 20,
        },
        tooltipTitle: {
          fontSize: 15,
          fontWeight: 600,
          marginBottom: 4,
        },
        tooltipContent: {
          fontSize: 13,
          lineHeight: 1.6,
          color: "#78716c",
          padding: "8px 0",
        },
        buttonPrimary: {
          backgroundColor: "#1c1917",
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 500,
          padding: "8px 14px",
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

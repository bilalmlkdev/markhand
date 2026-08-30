"use client";

import { useEffect, useState } from "react";
import { GrainGradient } from "@paper-design/shaders-react";
import { cn } from "../../lib/utils";

interface OceanWaveProps {
  children?: React.ReactNode;
  className?: string;
  speed?: number;
  intensity?: number;
}

export default function OceanWave({
  children,
  className,
  speed = 0.15,
  intensity = 0.2,
}: OceanWaveProps) {
  const [ready, setReady] = useState(false);
  const [rightOffset, setRightOffset] = useState("-500px");
  const [widthOffSet, setWidthOffSet] = useState("100%");
  const [topOffset, setTopOffset] = useState<string | undefined>("0px");
  const [bottomOffset, setBottomOffset] = useState<string | undefined>(
    undefined,
  );
  const [rotation, setRotation] = useState("-90deg");

  useEffect(() => {
    // First render & resize handler
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 780) {
        // small screens: anchor to bottom-right, gentler rotation
        setTopOffset(undefined);
        setBottomOffset("-150px");
        setRightOffset("-150px");
        setRotation("-10deg");
        setWidthOffSet("150%")
      } else if (width < 1024) {
        // medium screens: back to the default top-anchored position
        setTopOffset("0px");
        setBottomOffset(undefined);
        setRightOffset("-300px");
        setRotation("-90deg");
      } else {
        // large screens (original value)
        setTopOffset("0px");
        setBottomOffset(undefined);
        setRightOffset("-500px");
        setRotation("-90deg");
      }
    };

    handleResize(); // set initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ position: "relative" }}
    >
      {ready && (
        <GrainGradient
          colors={["#0066FF", "#00AAFF", "#004488"]}
          colorBack="#00000000"
          speed={speed}
          scale={0.6}
          rotation={-30}
          offsetX={0.1}
          offsetY={-0.15}
          softness={0.7}
          intensity={intensity}
          noise={0.2}
          shape="wave"
          style={{
            position: "fixed",
            top: topOffset,
            bottom: bottomOffset,
            right: rightOffset, // dynamically set
            width: widthOffSet,
            height: "100%",
            zIndex: 0,
            rotate: rotation, // dynamically set
          }}
        />
      )}
      <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
    </div>
  );
}

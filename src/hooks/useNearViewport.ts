import { useEffect, useRef, useState } from "react";

// Returns a ref to attach to an element and a boolean that flips to true
// once the element is within the given distance of the viewport. Used to
// defer expensive work (e.g. decoding a drawing's strokes) until the card
// is actually about to be seen, instead of doing it for every card at once.
export function useNearViewport<T extends HTMLElement>(
  rootMargin = "600px",
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [isNear, setIsNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      const id = requestAnimationFrame(() => setIsNear(true));
      return () => cancelAnimationFrame(id);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsNear(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return [ref, isNear];
}
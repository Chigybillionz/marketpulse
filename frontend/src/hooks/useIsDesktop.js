import { useEffect, useState } from "react";

/**
 * Returns true when the viewport is at/above the given breakpoint (default
 * 1024px — the app-shell desktop breakpoint). Used only where the layout
 * must differ structurally (e.g. sidebar vs. bottom nav), not for styling
 * that CSS media queries can handle on their own.
 */
export default function useIsDesktop(minWidth = 1024) {
  const query = `(min-width: ${minWidth}px)`;

  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const handler = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return isDesktop;
}

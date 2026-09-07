import { useEffect, useRef, useState } from 'react';

/**
 * Shared in-view hook for one-shot product-UI animations
 * (counting numbers, growing chart bars, appearing rows).
 *
 * - Runs once by default; elements never re-animate.
 * - Under `prefers-reduced-motion` it reports "in view" immediately
 *   so components render their final state right away.
 */
export default function useInView({
  threshold = 0.2,
  rootMargin = '0px',
  once = true,
} = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      // Fallback outside the effect body (next frame) so we never call
      // setState synchronously within the effect.
      const raf = requestAnimationFrame(() => setInView(true));
      return () => cancelAnimationFrame(raf);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

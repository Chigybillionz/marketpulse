import { useEffect, useRef } from 'react';
import useInView from './useInView';

/**
 * Count-up number that starts when it scrolls into view (runs once).
 *
 * - Screen readers get the final value immediately (`.sr-only` span);
 *   the animated text is aria-hidden.
 * - The animated value is written straight to the DOM node, so the
 *   count produces zero React re-renders.
 * - Under reduced motion the final value is simply left in place.
 */
export function AnimatedCounter({
  value,
  prefix = '',
  suffix = '',
  duration = 1400,
  className = '',
}) {
  const [viewRef, inView] = useInView({ threshold: 0.4 });
  const textRef = useRef(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || !inView) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const target = Number(value) || 0;
    let raf = 0;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = `${prefix}${Math.round(target * eased).toLocaleString()}${suffix}`;
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, duration, prefix, suffix]);

  return (
    <span ref={viewRef} className={className}>
      <span className="sr-only">
        {prefix}
        {Number(value).toLocaleString()}
        {suffix}
      </span>
      <span ref={textRef} aria-hidden="true" className="tabular-nums">
        {prefix}
        {Number(value).toLocaleString()}
        {suffix}
      </span>
    </span>
  );
}

/**
 * Voice waveform visual. Pure CSS animation (simulated amplitude —
 * deterministic per-bar seeds, no timers, no re-renders).
 * Inactive bars rest at a low height.
 */
export function VoiceWaveform({
  active = false,
  bars = 14,
  barClassName = 'bg-emerald-400',
  className = '',
}) {
  return (
    <div className={`flex items-center gap-[3px] ${className}`} aria-hidden="true">
      {Array.from({ length: bars }).map((_, i) => {
        const seed = (i * 137 + 29) % 100;
        return (
          <span
            key={i}
            className={`w-1 rounded-full ${barClassName}`}
            style={{
              height: `${30 + (seed % 62)}%`,
              transform: active ? undefined : 'scaleY(0.25)',
              transformOrigin: 'center',
              animation: active
                ? `mp-wave-bar ${620 + (seed % 460)}ms ease-in-out ${(i * 67) % 380}ms infinite alternate`
                : 'none',
              transition: 'transform 320ms ease',
            }}
          />
        );
      })}
    </div>
  );
}

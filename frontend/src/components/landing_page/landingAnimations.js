/**
 * MarketPulse landing page — scroll reveal system (Phase 2).
 *
 * How it works:
 * - CSS owns the animation: `[data-reveal]` elements start hidden
 *   (index.css) and transition to their final state when the
 *   `.is-revealed` class lands.
 * - ONE shared IntersectionObserver triggers every reveal on the
 *   page, then unobserves each element — reveals run exactly once,
 *   never replay, and cost nothing after they finish.
 * - Per-element delay: `data-reveal-delay="200"`.
 * - Stagger groups: a container declares `data-reveal-stagger`
 *   (optional `data-reveal-step`, default 90ms) and its direct
 *   `[data-reveal]` children get incremental delays.
 * - `prefers-reduced-motion`: the observer is never started and all
 *   elements are revealed immediately with no transition, so the
 *   static layout is the fully "settled" page.
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  );
}

function revealElement(el) {
  el.classList.add('is-revealed');
  // Drop the stagger delay once revealed so later hover transitions
  // on the same element stay snappy.
  const clearDelay = () => el.style.removeProperty('--reveal-delay');
  el.addEventListener('transitionend', clearDelay, { once: true });
  // Fallback if no transitionend fires (e.g. hidden tab, rare engines).
  window.setTimeout(clearDelay, 2500);
}

/**
 * Wire up all `[data-reveal]` elements on the page.
 * Returns a cleanup function that disconnects the observer.
 */
export function initScrollReveal() {
  if (typeof document === 'undefined') return () => {};

  const targets = Array.from(document.querySelectorAll('[data-reveal]'));
  if (targets.length === 0) return () => {};

  // Assign stagger delays to direct children of stagger containers.
  document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
    const base = Number(group.dataset.revealDelay || 0);
    const step = Number(group.dataset.revealStep || 90);
    Array.from(group.querySelectorAll(':scope > [data-reveal]')).forEach(
      (child, index) => {
        child.style.setProperty('--reveal-delay', `${base + index * step}ms`);
      }
    );
  });

  // Explicit per-element delays.
  targets.forEach((el) => {
    if (el.dataset.revealDelay && !el.style.getPropertyValue('--reveal-delay')) {
      el.style.setProperty('--reveal-delay', `${el.dataset.revealDelay}ms`);
    }
  });

  // Reduced motion or missing IntersectionObserver support:
  // show the finished page immediately, no observer needed.
  if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') {
    targets.forEach((el) => {
      el.classList.add('is-revealed');
      el.style.removeProperty('--reveal-delay');
    });
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        revealElement(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

export default initScrollReveal;

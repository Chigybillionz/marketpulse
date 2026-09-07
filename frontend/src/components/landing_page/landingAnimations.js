/**
 * MarketPulse Landing Animations
 * Scroll reveal system using Intersection Observer
 * - No external dependencies
 * - Respects prefers-reduced-motion
 * - Uses transform + opacity for performance
 */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation configuration
const animations = {
  'fade-up': {
    initial: { opacity: 0, transform: 'translateY(24px)' },
    final: { opacity: 1, transform: 'translateY(0)' },
    transition: { duration: 600, ease: [0.25, 0.1, 0.25, 1] },
  },
  'fade-in': {
    initial: { opacity: 0 },
    final: { opacity: 1 },
    transition: { duration: 500, ease: 'ease-out' },
  },
  'scale-in': {
    initial: { opacity: 0, transform: 'scale(0.96)' },
    final: { opacity: 1, transform: 'scale(1)' },
    transition: { duration: 550, ease: [0.25, 0.1, 0.25, 1] },
  },
  'slide-in-left': {
    initial: { opacity: 0, transform: 'translateX(-20px)' },
    final: { opacity: 1, transform: 'translateX(0)' },
    transition: { duration: 550, ease: [0.25, 0.1, 0.25, 1] },
  },
  'slide-in-right': {
    initial: { opacity: 0, transform: 'translateX(20px)' },
    final: { opacity: 1, transform: 'translateX(0)' },
    transition: { duration: 550, ease: [0.25, 0.1, 0.25, 1] },
  },
};

// Animate an element using CSS custom properties for GPU acceleration
function animateElement(element, animationName, delay = 0) {
  if (prefersReducedMotion()) {
    element.style.opacity = '1';
    element.style.transform = 'none';
    return;
  }

  const config = animations[animationName];
  if (!config) return;

  // Apply initial state
  element.style.opacity = config.initial.opacity;
  element.style.transform = config.initial.transform;
  element.style.transition = `opacity ${config.transition.duration}ms ${config.transition.ease}, transform ${config.transition.duration}ms ${config.transition.ease}`;
  element.style.transitionDelay = `${delay}ms`;

  // Force reflow
  element.offsetHeight;

  // Apply final state
  requestAnimationFrame(() => {
    element.style.opacity = config.final.opacity;
    element.style.transform = config.final.transform;
  });
}

// Hook for Intersection Observer
function useScrollReveal() {
  if (typeof document === 'undefined') return { observe: () => {} };

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observers = new Map();

  function observe(element, animationName, delay = 0, once = true) {
    if (!element || !element.dataset) return;

    // Avoid re-animating if already animated (unless once is false)
    if (once && element.dataset.animated) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    const id = `${element.dataset.revealId || Math.random().toString(36).slice(2)}-${animationName}-${delay}`;

    if (!observers.has(id)) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateElement(entry.target, animationName, delay);
              if (once) {
                entry.target.dataset.animated = 'true';
              }
            }
          });
        },
        observerOptions
      );
      observers.set(id, observer);
    }

    observers.get(id).observe(element);

    // Store for cleanup
    if (!element.dataset.observerIds) {
      element.dataset.observerIds = '';
    }
    element.dataset.observerIds += `${id},`;
  }

  function observeStaggered(parent, selector, animationName, staggerDelay = 100) {
    if (!parent) return;

    const children = parent.querySelectorAll(selector);
    children.forEach((child, index) => {
      observe(child, animationName, index * staggerDelay);
    });
  }

  function cleanup() {
    observers.forEach((observer) => observer.disconnect());
    observers.clear();
  }

  return { observe, observeStaggered, cleanup };
}

// Initialize animations on page load
function initScrollReveal() {
  if (typeof document === 'undefined') return { cleanup: () => {} };

  const { observe, observeStaggered, cleanup } = useScrollReveal();

  // Observe all elements with data-reveal attribute
  const revealElements = document.querySelectorAll('[data-reveal]');

  revealElements.forEach((element) => {
    const animation = element.dataset.reveal || 'fade-up';
    const delay = parseInt(element.dataset.revealDelay || '0', 10);
    const stagger = element.dataset.revealStagger;

    if (stagger) {
      observeStaggered(element, stagger, animation, delay);
    } else {
      observe(element, animation, delay);
    }
  });

  return { observe, observeStaggered, cleanup };
}

export { initScrollReveal, useScrollReveal, animateElement, animations };
export default initScrollReveal;

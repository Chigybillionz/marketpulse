import React, { useEffect, useRef, useState } from 'react';
import './StockpileHero.css';

const WORDS = [
  {
    word: 'Speak',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/83de7c35-dd91-4e56-bfb8-0ffafc83d0e0.webp',
    tint: '#E9C22E', // lemon cream / yellow
  },
  {
    word: 'Track',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/4d952211-0474-48cc-af48-58f68b3b7525.webp',
    tint: '#F2772F', // peach / apricot
  },
  {
    word: 'Collect',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/e2e91fca-5b3f-4e0e-a437-8a581592e407.webp',
    tint: '#3FB874', // warm sage / mint
  },
  {
    word: 'Stockpile',
    icon: 'https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/6b32bb47-4ad6-4938-a637-c997b373c68b.webp',
    tint: '#C564C4', // rose lilac
  },
];

const SLOT_DUR = 1.75; // 1.75s per word
const TOTAL_DUR = SLOT_DUR * 4; // 7.0s cycle

function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t) {
  return t * t * t;
}

export default function StockpileHero({ onNavigate }) {
  const [isLoggedIn, setIsLoggedIn] = useState(() => Boolean(localStorage.getItem('token')));
  const [useFallbackLogo, setUseFallbackLogo] = useState(false);

  const slotWrapperRef = useRef(null);
  const iconBoxRef = useRef(null);
  const iconImgRef = useRef(null);
  const iconTintRef = useRef(null);
  const slotWordRef = useRef(null);
  const btnVoiceRef = useRef(null);
  const glRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  // Listen to auth changes in localStorage
  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem('token')));
    };
    window.addEventListener('storage', handleAuthChange);
    return () => window.removeEventListener('storage', handleAuthChange);
  }, []);

  useEffect(() => {
    // Preload 3D icons
    WORDS.forEach((item) => {
      const img = new Image();
      img.src = item.icon;
    });

    const setIcon = (index) => {
      const item = WORDS[index];
      if (iconImgRef.current) iconImgRef.current.src = item.icon;
      if (iconTintRef.current) {
        iconTintRef.current.style.setProperty('--tint', item.tint);
        iconTintRef.current.style.maskImage = `url(${item.icon})`;
        iconTintRef.current.style.webkitMaskImage = `url(${item.icon})`;
      }
      if (slotWordRef.current) slotWordRef.current.textContent = item.word;
    };

    // Initial item
    setIcon(0);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIcon(1);
      glRefs.forEach((ref, i) => {
        if (ref.current) ref.current.style.opacity = i === 1 ? '1' : '0';
      });
      return;
    }

    let startTime = performance.now();
    let isPaused = false;
    let pausedAt = 0;
    let animFrameId = null;
    let currentSlotIndex = -1;

    const handleVisibility = () => {
      if (document.hidden) {
        isPaused = true;
        pausedAt = performance.now();
      } else {
        isPaused = false;
        startTime += performance.now() - pausedAt;
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);

    const tick = (now) => {
      if (isPaused) {
        animFrameId = requestAnimationFrame(tick);
        return;
      }

      const elapsedSec = (now - startTime) / 1000;
      const cycleTime = ((elapsedSec % TOTAL_DUR) + TOTAL_DUR) % TOTAL_DUR;
      const slotIdx = Math.floor(cycleTime / SLOT_DUR);
      const localTime = cycleTime % SLOT_DUR;

      if (slotIdx !== currentSlotIndex) {
        currentSlotIndex = slotIdx;
        setIcon(slotIdx);
      }

      // Enter (0.5s), Hold (0.5s-1.33s), Leave (last 0.42s)
      let opacity = 1;
      let translateY = 0;
      let blur = 0;
      let scale = 1;
      let iconScale = 1;
      let iconRotate = 0;

      if (localTime < 0.5) {
        const t = easeOutCubic(localTime / 0.5);
        opacity = t;
        translateY = (1 - t) * 0.32; // em
        blur = (1 - t) * 10; // px
        scale = 0.96 + 0.04 * t;

        // Icon follows 60ms later, scaling 0.7->1, untwisting -14deg->0deg
        const it = clamp((localTime - 0.06) / 0.44, 0, 1);
        const iEase = easeOutCubic(it);
        iconScale = 0.7 + 0.3 * iEase;
        iconRotate = -14 * (1 - iEase);
      } else if (localTime >= 1.33) {
        const t = easeInCubic((localTime - 1.33) / 0.42);
        opacity = 1 - t;
        translateY = -0.16 * t; // em
        blur = 8 * t; // px
        scale = 1;
      }

      // Idle float
      const idleY = Math.sin(elapsedSec * 2.2) * 0.028;
      const idleRot = Math.cos(elapsedSec * 1.8) * 3;

      if (slotWrapperRef.current) {
        slotWrapperRef.current.style.opacity = opacity;
        slotWrapperRef.current.style.transform = `translate3d(0, ${translateY}em, 0) scale(${scale})`;
        slotWrapperRef.current.style.filter = blur > 0.1 ? `blur(${blur}px)` : 'none';
      }

      if (iconBoxRef.current) {
        iconBoxRef.current.style.transform = `scale(${iconScale}) rotate(${iconRotate + idleRot}deg) translateY(${idleY}em)`;
      }

      // Panel crossfade (0.77s window straddling each boundary)
      for (let i = 0; i < 4; i++) {
        const el = glRefs[i].current;
        if (!el) continue;

        const distFromStart = ((cycleTime - i * SLOT_DUR) % TOTAL_DUR + TOTAL_DUR) % TOTAL_DUR;
        let layerOpacity = 0;
        if (distFromStart < 0.385) {
          layerOpacity = 0.5 + 0.5 * (distFromStart / 0.385);
        } else if (distFromStart < SLOT_DUR - 0.385) {
          layerOpacity = 1;
        } else if (distFromStart < SLOT_DUR + 0.385) {
          const leaveT = (distFromStart - (SLOT_DUR - 0.385)) / 0.77;
          layerOpacity = 1 - leaveT;
        }
        el.style.opacity = clamp(layerOpacity, 0, 1);

        // Background subtle gradient drift
        const driftX = Math.sin(elapsedSec * 0.35 + i) * 2.2;
        const driftY = Math.cos(elapsedSec * 0.4 + i) * 1.6;
        el.style.transform = `translate3d(${driftX}%, ${driftY}%, 0) scale(1.08)`;
      }

      // Primary CTA pulse during "Stockpile" (slot 3)
      if (btnVoiceRef.current) {
        if (slotIdx === 3 && localTime >= 0.4 && localTime <= 1.4) {
          const pulseT = Math.sin(((localTime - 0.4) / 1.0) * Math.PI);
          btnVoiceRef.current.style.backgroundColor = '#0D0D0C';
          btnVoiceRef.current.style.color = '#FBF6EF';
          btnVoiceRef.current.style.transform = `scale(${1 + pulseT * 0.03})`;
        } else {
          btnVoiceRef.current.style.backgroundColor = 'transparent';
          btnVoiceRef.current.style.color = '#0D0D0C';
          btnVoiceRef.current.style.transform = 'scale(1)';
        }
      }

      animFrameId = requestAnimationFrame(tick);
    };

    animFrameId = requestAnimationFrame(tick);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, []);

  const handleNav = (target, state) => {
    if (onNavigate) {
      onNavigate(target, state);
    } else {
      window.location.assign(`/${target}`);
    }
  };

  const handleNavLink = (sectionId, authTarget) => {
    if (isLoggedIn) {
      handleNav(authTarget);
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        handleNav('features');
      }
    }
  };

  const handleScrollDown = () => {
    const el = document.getElementById('product-showcase') || document.getElementById('voice-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.85, behavior: 'smooth' });
    }
  };

  return (
    <div className="stockpile-hero-root">
      {/* ─── Fixed Navigation (Stagnant Top Bar) ─── */}
      <header id="nav">
        <div
          className="nav-left brand-logo-container"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          role="button"
          tabIndex={0}
          aria-label="Stockpile home"
        >
          {!useFallbackLogo ? (
            <img
              src="/stockpile-logo-transparent.png"
              alt="Stockpile Logo"
              className="brand-logo-img"
              onError={() => setUseFallbackLogo(true)}
            />
          ) : (
            <div className="brand-logo-fallback">
              <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
                <rect x="4" y="4" width="24" height="24" rx="5" fill="#0D0D0C" />
                <path d="M8 11h16v3H8z M8 16h11v3H8z M8 21h14v3H8z" fill="#22e584" />
              </svg>
              <span className="brand-name">stockpile</span>
            </div>
          )}
        </div>

        <nav className="nav-right">
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavLink('voice-section', 'listeng')}
          >
            Voice Ledger <span className="nav-chevron" />
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavLink('inventory-section', 'home')}
          >
            Inventory <span className="nav-chevron" />
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNavLink('debtors-section', 'credit')}
          >
            Debtors <span className="nav-chevron" />
          </button>
          <button
            type="button"
            className="nav-link"
            onClick={() => handleNav('pricing')}
          >
            Pricing <span className="nav-chevron" />
          </button>

          <div className="nav-actions">
            {!isLoggedIn ? (
              <>
                <button
                  type="button"
                  className="btn-nav-login"
                  onClick={() => handleNav('login')}
                >
                  Log in
                </button>
                <button
                  type="button"
                  className="btn-open-ledger"
                  onClick={() => handleNav('signup')}
                >
                  Get Started
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="btn-open-ledger"
                  onClick={() => handleNav('home')}
                >
                  Open Ledger
                </button>
                <button
                  type="button"
                  className="btn-nav-login"
                  onClick={() => handleNav('logout')}
                >
                  Log out
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ─── Hero Panel (Top 75%) ─── */}
      <section id="hero-panel">
        {/* 4 Stacked Gradient Layers */}
        <div ref={glRefs[0]} className="gradient-layer gl-speak" style={{ opacity: 1 }} />
        <div ref={glRefs[1]} className="gradient-layer gl-track" style={{ opacity: 0 }} />
        <div ref={glRefs[2]} className="gradient-layer gl-collect" style={{ opacity: 0 }} />
        <div ref={glRefs[3]} className="gradient-layer gl-stockpile" style={{ opacity: 0 }} />

        {/* SVG Fractal Grain Texture */}
        <svg className="grain-overlay" xmlns="http://www.w3.org/2000/svg">
          <filter id="stockpile-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves={3} stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#stockpile-grain)" />
        </svg>

        {/* Headline Block (Top: 190u, Left: 112u) */}
        <div className="hero-content">
          <h1 className="hero-headline">
            <div className="headline-line-1">
              <div ref={slotWrapperRef} className="slot-wrapper" id="slot-wrapper">
                <span ref={iconBoxRef} className="icon-box" id="icon-box">
                  <img
                    ref={iconImgRef}
                    className="icon-img-base"
                    id="icon-img-base"
                    src={WORDS[0].icon}
                    alt="Hero Icon"
                  />
                  <span ref={iconTintRef} className="icon-tint-layer" id="icon-tint-layer" />
                </span>
                <span ref={slotWordRef} className="slot-word" id="slot-word">
                  Speak
                </span>
              </div>
            </div>
            <div className="headline-line-2">on your terms</div>
          </h1>
        </div>

        {/* Action Row (Top: 578u) */}
        <div className="hero-action-row">
          <div className="action-buttons">
            <button
              ref={btnVoiceRef}
              type="button"
              className="btn-action"
              id="btn-start-voice"
              onClick={() => {
                if (isLoggedIn) {
                  handleNav('listeng');
                } else {
                  handleNav('signup', { returnTo: 'listeng' });
                }
              }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="22" />
                <line x1="8" y1="22" x2="16" y2="22" />
              </svg>
              <span>Start Voice Log</span>
            </button>
            <button
              type="button"
              className="btn-action"
              onClick={() => {
                if (isLoggedIn) {
                  handleNav('home');
                } else {
                  handleNav('login', { returnTo: 'home' });
                }
              }}
            >
              <svg viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" />
              </svg>
              <span>Web Dashboard</span>
            </button>
          </div>
          <p className="hero-caption">
            Stockpile is a voice-first inventory, sales ledger, and
            <br />
            debtor tracker built for fast-moving shops and traders.
          </p>
        </div>
      </section>

      {/* ─── Stats Strip (Bottom 25%) ─── */}
      <footer id="stats-strip">
        {/* Curved Top Notch (Smooth S-curve Path) */}
        <div className="notch-container">
          <svg className="notch-svg" viewBox="0 0 1440 62" preserveAspectRatio="none">
            <path
              d="M0 62 H1062 C1092 62 1098 54 1116 34 C1138 9 1146 1 1178 1 H1440 V62 Z"
              fill="#FBF6EF"
            />
          </svg>
        </div>

        {/* Scroll Hint positioned on the raised notch */}
        <div
          className="scroll-hint"
          onClick={handleScrollDown}
          role="button"
          tabIndex={0}
        >
          <span>↓ Scroll to learn more</span>
        </div>

        {/* Stats Content */}
        <div className="stats-content">
          <div className="stats-lead">
            Every naira
            <br />
            accounted for
          </div>

          <div className="stats-metrics-group">
            <div className="stat-item">
              <span className="stat-value">&lt; 2.5s</span>
              <span className="stat-label">Voice sale entry</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">₦0</span>
              <span className="stat-label">Lost to forgotten debts</span>
            </div>

            <div className="stat-item">
              <span className="stat-value">100%</span>
              <span className="stat-label">Offline-ready sync</span>
            </div>
          </div>

          {/* Sprout Line Art (Far Right) */}
          <svg
            className="sprout-art"
            viewBox="0 0 50 50"
            fill="none"
            stroke="#0D0D0C"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M25 44 V24" />
            <path d="M25 34 C16 34 11 26 14 18 C22 17 25 26 25 34 Z" />
            <path d="M25 24 C34 24 39 16 36 8 C28 7 25 16 25 24 Z" />
            <path d="M8 44 H42" />
          </svg>
        </div>
      </footer>
    </div>
  );
}

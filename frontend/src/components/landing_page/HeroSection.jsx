/**
 * HeroSection — MarketPulse landing hero (Phase 2).
 *
 * Cinematic composition:
 * - Ambient background atmosphere (soft green drift + faint ledger grid),
 *   the slowest parallax layer.
 * - A realistic MarketPulse dashboard preview with animated KPIs,
 *   a growing 7-day chart and voice-sourced transaction rows —
 *   the moderate parallax layer.
 * - Floating product-data cards — the fastest parallax layer.
 * - The live voice demo (real VoiceRecorder + Gemini call) as a
 *   major visual element inside the dashboard.
 *
 * Parallax: one passive scroll listener → requestAnimationFrame →
 * CSS custom properties. No React state, no per-frame re-renders.
 * Disabled entirely under prefers-reduced-motion, damped below lg.
 */

import { useEffect, useRef, useState } from 'react';
import {
  Mic,
  Play,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  Wallet,
  Activity,
} from 'lucide-react';
import { VoiceRecorder } from '../../services/voiceRecorder';
import { transcribeAndAnalyze } from '../../services/geminiService';
import { useLanguage } from '../../i18n/LanguageContext';
import useInView from './useInView';
import { AnimatedCounter, VoiceWaveform } from './motionPrimitives';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

/* Entrance helper — CSS keyframes with `both` fill, so elements are
 * hidden during their delay and end fully visible. If animations are
 * unavailable the elements simply stay visible (graceful default). */
const enter = (delay, duration = 700) => ({
  animation: `mp-rise-in ${duration}ms ${MP_EASE} ${delay}ms both`,
});

/* ── Scroll parallax ────────────────────────────────────────────────
 * Writes CSS vars consumed by each layer:
 *   --mp-px-bg   atmosphere (lags most  → slowest)
 *   --mp-px-mid  dashboard   (slight lag)
 *   --mp-px-top  floating    (leads     → fastest)
 */
function useHeroParallax(sectionRef) {
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined;
    }

    const desktopQuery = window.matchMedia('(min-width: 1024px)');
    const intensity = () => (desktopQuery.matches ? 1 : 0.35);
    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollY = window.scrollY || 0;
      const progress = Math.min(scrollY / Math.max(window.innerHeight, 1), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const k = intensity();
      el.style.setProperty('--mp-px-bg', `${(eased * 26 * k).toFixed(1)}px`);
      el.style.setProperty('--mp-px-mid', `${(eased * 10 * k).toFixed(1)}px`);
      el.style.setProperty('--mp-px-top', `${(eased * -16 * k).toFixed(1)}px`);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    if (typeof desktopQuery.addEventListener === 'function') {
      desktopQuery.addEventListener('change', onScroll);
    }
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (typeof desktopQuery.removeEventListener === 'function') {
        desktopQuery.removeEventListener('change', onScroll);
      }
      if (raf) cancelAnimationFrame(raf);
    };
  }, [sectionRef]);
}

/* ── Floating product-data card ─────────────────────────────────── */
function FloatingCard({ className = '', style, floatDelay = '0s', children }) {
  return (
    <div className={`pointer-events-none absolute ${className}`} style={style}>
      <div
        className="rounded-xl border border-gray-100 bg-white/95 shadow-lg shadow-emerald-900/10 backdrop-blur"
        style={{ animation: `mp-float-y 7s ease-in-out ${floatDelay} infinite` }}
      >
        {children}
      </div>
    </div>
  );
}

/* ── Trend bars that grow once the hero is on screen ────────────── */
function HeroTrendBars({ active }) {
  const bars = [35, 52, 44, 63, 58, 80, 100];
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  return (
    <>
      <div className="mt-3 flex h-16 items-end gap-1.5 md:h-20" aria-hidden="true">
        {bars.map((height, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-md bg-gradient-to-t from-emerald-500 to-emerald-400"
            style={{
              height: `${height}%`,
              transform: active ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'bottom',
              transition: `transform 700ms ${MP_EASE} ${450 + i * 60}ms`,
            }}
          />
        ))}
      </div>
      <div className="mt-2 flex justify-between px-0.5" aria-hidden="true">
        {days.map((day, i) => (
          <span
            key={i}
            className="flex-1 text-center text-[9px] font-semibold text-gray-300"
            style={{
              opacity: active ? 1 : 0,
              transition: `opacity 500ms ease ${900 + i * 60}ms`,
            }}
          >
            {day}
          </span>
        ))}
      </div>
    </>
  );
}

export default function HeroSection({ onNavigate, onVoiceStateChange }) {
  const { t } = useLanguage();
  const [showDemoVideo, setShowDemoVideo] = useState(false);
  const [micState, setMicState] = useState('IDLE'); // IDLE, LISTENING, PROCESSING, ANALYZING, RESULT
  const [demoResult, setDemoResult] = useState(null);
  const [demoError, setDemoError] = useState(null);
  const recorderRef = useRef(null);
  const analyzeTimerRef = useRef(null);
  const sectionRef = useRef(null);
  const [stageRef, stageInView] = useInView({ threshold: 0.25 });

  useHeroParallax(sectionRef);

  /* Keep the ANALYZING stage of the existing state flow visible:
     the single real API call covers transcription + analysis, so the
     second stage is presented after a short beat while it runs. */
  useEffect(() => () => clearTimeout(analyzeTimerRef.current), []);

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate('signup');
    } else if (window.navigate) {
      window.navigate('/signup');
    }
  };

  const handleDemoRecord = async () => {
    setDemoError(null);
    setDemoResult(null);

    if (micState === 'LISTENING') {
      // Stop recording and analyze.
      try {
        setMicState('PROCESSING');
        if (onVoiceStateChange) onVoiceStateChange('PROCESSING');

        analyzeTimerRef.current = setTimeout(() => {
          setMicState((state) => (state === 'PROCESSING' ? 'ANALYZING' : state));
          if (onVoiceStateChange) onVoiceStateChange('ANALYZING');
        }, 1400);

        const audioBlob = await recorderRef.current.stopRecording();
        const base64 = await recorderRef.current.audioToBase64(audioBlob);
        const result = await transcribeAndAnalyze(base64);

        setDemoResult(result);
        setMicState('RESULT');
        if (onVoiceStateChange) onVoiceStateChange('RESULT');
      } catch (err) {
        let errorMsg = 'Could not analyze audio. Please try again.';
        if (err.message) {
          if (err.message.includes('401') || err.message.includes('credentials') || err.message.includes('API key') || err.message.includes('API_KEY')) {
            errorMsg = 'API Error: Invalid or missing API key on the server.';
          } else if (err.message.includes('network') || err.message.includes('fetch')) {
            errorMsg = 'Network failure. Please check your connection.';
          } else if (err.message.includes('JSON')) {
            errorMsg = 'The AI returned a malformed response.';
          } else if (err.message.includes('timeout')) {
            errorMsg = 'The request timed out. Please try again.';
          } else {
            errorMsg = err.message;
          }
        }
        setDemoError(errorMsg);
        console.error('Demo recording error:', err);
        setMicState('IDLE');
        if (onVoiceStateChange) onVoiceStateChange('IDLE');
      } finally {
        clearTimeout(analyzeTimerRef.current);
        recorderRef.current = null;
      }
    } else {
      // Start recording.
      try {
        recorderRef.current = new VoiceRecorder();
        await recorderRef.current.startRecording();
        setMicState('LISTENING');
        if (onVoiceStateChange) onVoiceStateChange('LISTENING');
      } catch (err) {
        setDemoError('Microphone access denied. Please allow microphone access.');
        console.error('Demo recording error:', err);
      }
    }
  };

  const resetDemo = () => {
    setMicState('IDLE');
    setDemoResult(null);
    setDemoError(null);
    if (onVoiceStateChange) onVoiceStateChange('IDLE');
  };

  const micDisabled = micState === 'PROCESSING' || micState === 'ANALYZING';
  const micLabel =
    micState === 'LISTENING'
      ? 'Stop recording and analyze'
      : micDisabled
      ? 'Analyzing audio'
      : 'Start voice demo recording';

  const resultTone =
    demoResult?.type === 'Expense'
      ? { ring: 'bg-red-100 text-red-600', text: 'text-red-600', sign: '-' }
      : demoResult?.type === 'CREDIT'
      ? { ring: 'bg-blue-100 text-blue-600', text: 'text-blue-600', sign: '+' }
      : { ring: 'bg-emerald-100 text-emerald-600', text: 'text-emerald-600', sign: '+' };

  return (
    <section
      ref={sectionRef}
      aria-label="MarketPulse AI introduction"
      className="relative w-full overflow-hidden bg-white"
    >
      {/* ── Ambient atmosphere (parallax: slowest layer) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ transform: 'translate3d(0, var(--mp-px-bg, 0px), 0)' }}
      >
        <div
          className="absolute -left-24 -top-32 h-80 w-80 rounded-full bg-emerald-100/70 blur-3xl"
          style={{ animation: 'mp-atmo-drift 14s ease-in-out infinite' }}
        />
        <div
          className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-emerald-50 blur-3xl"
          style={{ animation: 'mp-atmo-drift 18s ease-in-out 2s infinite' }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-lime-50/80 blur-3xl"
          style={{ animation: 'mp-atmo-drift 16s ease-in-out 1s infinite' }}
        />
        {/* Faint ledger grid, masked to the top of the hero */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(6,78,59,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,78,59,0.05) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage:
              'radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 78%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 90% 70% at 50% 30%, black 40%, transparent 78%)',
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 pb-24 pt-12 sm:px-6 md:pt-20 lg:grid-cols-2 lg:gap-12 lg:px-12 lg:pb-28">
        {/* ── Left: message ── */}
        <div className="relative z-10 max-w-xl">
          <div
            style={enter(0)}
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-[#E5E7EB]/60 px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm md:text-sm"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
            {t('landing_hero_trusted') || 'Trusted by 5,000+ Nigerian Traders'}
          </div>

          <h1
            style={enter(120)}
            className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-[#111827] md:text-5xl lg:text-6xl"
          >
            {t('landing_hero_title1') || 'Your Market Business,'}
            <br />
            <span className="text-[#064E3B]">{t('landing_hero_title2') || 'Perfectly Balanced.'}</span>
          </h1>

          <p
            style={enter(240)}
            className="mt-6 max-w-lg text-base font-medium leading-relaxed text-gray-600 md:text-lg"
          >
            {t('landing_hero_subtitle') || 'Speak your sales, expenses, and debts. We track it all instantly, so you always know your true profit. Voice-first bookkeeping built for the hustle.'}
          </p>

          <div
            style={enter(360)}
            className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center"
          >
            <button
              onClick={handleGetStarted}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#064E3B] px-7 py-3.5 font-bold text-white shadow-lg shadow-green-900/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#043d2e] hover:shadow-xl hover:shadow-green-900/30 sm:w-auto"
            >
              {t('landing_nav_get_started') || 'Get Started'} <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <button
              onClick={() => setShowDemoVideo(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-3.5 font-bold text-gray-800 shadow-sm transition-all duration-300 hover:bg-gray-50 hover:shadow-md sm:w-auto"
            >
              <Play size={18} className="text-gray-500" fill="currentColor" />
              {t('landing_hero_watch_demo') || 'Watch Demo'}
            </button>
          </div>

          {/* Trust indicators */}
          <div style={enter(500, 600)} className="flex items-center gap-6 pt-6">
            <div className="flex -space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-green-100 text-xs font-bold text-green-700">
                M
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-blue-100 text-xs font-bold text-blue-700">
                A
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-purple-100 text-xs font-bold text-purple-700">
                K
              </div>
            </div>
            <div className="text-xs font-medium text-gray-500">
              <span className="font-bold text-gray-700">4.9/5</span> from 2,000+ reviews
            </div>
          </div>
        </div>

        {/* ── Right: layered product stage ── */}
        <div className="relative pb-8 lg:pb-10" ref={stageRef}>
          {/* Soft glow behind the dashboard */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-6 bottom-6 top-10 rounded-[2.5rem] bg-gradient-to-br from-emerald-200/50 via-white to-blue-100/40 blur-2xl"
          />

          {/* Dashboard preview (parallax: moderate layer) */}
          <div style={{ transform: 'translate3d(0, var(--mp-px-mid, 0px), 0)' }}>
            <div
              style={enter(300, 800)}
              className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-2xl shadow-emerald-900/10 md:rounded-[1.75rem]"
            >
              {/* Mock UI header */}
              <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 md:px-6">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#064E3B] text-white">
                    <Activity size={14} />
                  </div>
                  <span className="text-sm font-bold text-gray-900">MarketPulse</span>
                  <span className="ml-1 hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 sm:inline">
                    Live
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden h-2 w-16 rounded-full bg-gray-100 sm:block" />
                  <div className="h-7 w-7 rounded-full border border-emerald-200/60 bg-gradient-to-br from-emerald-100 to-emerald-200" />
                </div>
              </div>

              {/* KPI row */}
              <div className="grid grid-cols-2 gap-3 px-4 pt-4 md:px-6">
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 md:p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 md:text-xs">
                    <TrendingUp size={12} className="text-emerald-600" />
                    Revenue
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-gray-900 md:text-2xl">
                    <AnimatedCounter value={847200} prefix="₦" />
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-600 md:text-xs">
                    +12.4% this week
                  </p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3 md:p-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400 md:text-xs">
                    <TrendingDown size={12} className="text-red-500" />
                    Expenses
                  </div>
                  <p className="mt-1 text-lg font-extrabold text-gray-900 md:text-2xl">
                    <AnimatedCounter value={312800} prefix="₦" />
                  </p>
                  <p className="text-[10px] font-semibold text-red-500 md:text-xs">
                    +3.2% this week
                  </p>
                </div>
              </div>

              {/* 7-day trend chart */}
              <div className="mx-4 mt-3 rounded-xl border border-gray-100 bg-gray-50/60 p-3 md:mx-6 md:p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 md:text-xs">
                    7-Day Profit Trend
                  </span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                    +18.2%
                  </span>
                </div>
                <HeroTrendBars active={stageInView} />
              </div>

              {/* Transaction rows — voice entry feeds the ledger */}
              <div className="space-y-2 px-4 pt-3 md:px-6">
                {/* Dynamically insert the real result at the top if it exists */}
                {demoResult && (
                  <div
                    className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/30 p-2.5 md:p-3"
                    style={{ animation: `mp-rise-in 600ms ${MP_EASE} both` }}
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        demoResult.type === 'Expense' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {demoResult.type === 'Expense' ? <ArrowDown size={14} /> : <Mic size={14} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900 md:text-sm">
                        {demoResult.description || 'Voice Entry'}
                      </p>
                      <p className="truncate text-[10px] text-gray-400 md:text-xs">Just now</p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                      Live AI
                    </span>
                    <p className={`shrink-0 text-xs font-extrabold md:text-sm ${
                      demoResult.type === 'Expense' ? 'text-red-500' : 'text-emerald-600'
                    }`}>
                      {demoResult.type === 'Expense' ? '-' : '+'}₦{(demoResult.amount || 0).toLocaleString()}
                    </p>
                  </div>
                )}
                {[
                  {
                    icon: <CheckCircle size={14} />,
                    iconClass: 'bg-emerald-100 text-emerald-600',
                    title: 'Sold 3 bags of rice',
                    meta: 'Voice entry · 2:14 PM',
                    amount: '+₦45,000',
                    amountClass: 'text-emerald-600',
                  },
                  {
                    icon: <ArrowDown size={14} />,
                    iconClass: 'bg-red-100 text-red-600',
                    title: 'Transport to Mile 12',
                    meta: 'Expense · 11:20 AM',
                    amount: '-₦8,500',
                    amountClass: 'text-red-500',
                  },
                  {
                    icon: <Wallet size={14} />,
                    iconClass: 'bg-blue-100 text-blue-600',
                    title: 'Chinedu — credit sale',
                    meta: 'Due Friday',
                    amount: '₦20,000',
                    amountClass: 'text-blue-600',
                  },
                ].map((row, i) => (
                  <div
                    key={row.title}
                    className="flex items-center gap-3 rounded-xl border border-gray-50 bg-white p-2.5 md:p-3"
                    style={
                      stageInView
                        ? {
                            animation: `mp-rise-in 600ms ${MP_EASE} ${520 + (demoResult ? i + 1 : i) * 120}ms both`,
                          }
                        : { opacity: 0 }
                    }
                  >
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${row.iconClass}`}
                    >
                      {row.icon}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-gray-900 md:text-sm">
                        {row.title}
                      </p>
                      <p className="truncate text-[10px] text-gray-400 md:text-xs">{row.meta}</p>
                    </div>
                    {row.chip && (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                        {row.chip}
                      </span>
                    )}
                    <p className={`shrink-0 text-xs font-extrabold md:text-sm ${row.amountClass}`}>
                      {row.amount}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Voice console: the live demo (real mic + Gemini) ── */}
              <div className="mt-4 border-t border-gray-100 bg-gradient-to-b from-white to-emerald-50/50 px-4 py-4 md:px-6 md:py-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <button
                    onClick={handleDemoRecord}
                    disabled={micDisabled}
                    aria-label={micLabel}
                    aria-pressed={micState === 'LISTENING'}
                    className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-80 ${
                      micState === 'LISTENING'
                        ? 'bg-red-500 shadow-red-500/40'
                        : micDisabled
                        ? 'bg-amber-500 shadow-amber-500/40'
                        : micState === 'RESULT'
                        ? 'bg-blue-500 shadow-blue-500/40'
                        : 'bg-[#064E3B] shadow-green-900/30 hover:bg-[#043d2e]'
                    }`}
                  >
                    {micState === 'LISTENING' && (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-red-400/60"
                          style={{ animation: 'mp-ring-pulse 1.4s ease-out infinite' }}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full bg-red-400/40"
                          style={{ animation: 'mp-ring-pulse 1.4s ease-out 0.45s infinite' }}
                        />
                      </>
                    )}
                    {micDisabled ? (
                      <span
                        aria-hidden="true"
                        className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
                      />
                    ) : micState === 'RESULT' ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Mic size={20} />
                    )}
                  </button>

                  {/* Status / result — announced to screen readers */}
                  <div
                    role="status"
                    aria-live="polite"
                    className="min-h-[3.5rem] flex-1 rounded-xl border border-gray-100 bg-white/80 px-3 py-2.5"
                  >
                    {micState === 'IDLE' && !demoError && (
                      <p className="text-xs font-semibold text-gray-700 md:text-sm">
                        Try the live demo — say{' '}
                        <span className="text-[#064E3B]">
                          “I sold 3 bags of rice for 45k”
                        </span>
                      </p>
                    )}

                    {micState === 'LISTENING' && (
                      <div className="flex items-center gap-3">
                        <VoiceWaveform
                          active
                          bars={12}
                          barClassName="bg-red-400"
                          className="h-6 w-24 shrink-0"
                        />
                        <p className="text-xs font-semibold text-red-600 md:text-sm">
                          Listening… tap the mic to finish
                        </p>
                      </div>
                    )}

                    {micDisabled && (
                      <div>
                        <p className="text-xs font-semibold text-amber-600 md:text-sm">
                          {micState === 'PROCESSING'
                            ? 'Transcribing your audio…'
                            : 'AI extracting amount, category & type…'}
                        </p>
                        <div
                          aria-hidden="true"
                          className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-amber-100"
                        >
                          <div
                            className="h-full w-1/2 rounded-full bg-amber-400"
                            style={{
                              animation: `mp-progress 2.8s ease-in-out${
                                micState === 'ANALYZING' ? ' 1.4s' : ''
                              } infinite`,
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {demoError && (
                      <p className="text-xs font-semibold text-red-600 md:text-sm">{demoError}</p>
                    )}

                    {micState === 'RESULT' && demoResult && (
                      <div
                        style={{ animation: `mp-result-in 500ms ${MP_EASE} both` }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${resultTone.ring}`}
                        >
                          {demoResult.type === 'Expense' ? (
                            <ArrowDown size={16} />
                          ) : demoResult.type === 'CREDIT' ? (
                            <Wallet size={16} />
                          ) : (
                            <ArrowUp size={16} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            {demoResult.description || 'Voice transaction'}
                          </p>
                          <p className={`text-base font-extrabold md:text-lg ${resultTone.text}`}>
                            {resultTone.sign}₦{(demoResult.amount || 0).toLocaleString()}
                          </p>
                        </div>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                          {demoResult.type === 'CREDIT' ? 'Credit' : demoResult.type}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {micState !== 'IDLE' && (
                  <button
                    onClick={resetDemo}
                    className="mt-2 text-[11px] font-semibold text-gray-400 underline underline-offset-2 transition-colors hover:text-gray-600"
                  >
                    Reset demo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── Floating product-data cards (parallax: fastest layer) ── */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{ transform: 'translate3d(0, var(--mp-px-top, 0px), 0)' }}
          >
            <FloatingCard className="-left-2 -top-5 sm:-left-5" style={enter(700, 600)}>
              <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <TrendingUp size={11} className="text-emerald-600" />
                  Profit margin
                </div>
                <p className="text-sm font-extrabold text-emerald-600">+23.5%</p>
              </div>
            </FloatingCard>

            <FloatingCard
              className="-right-2 top-1/3 hidden sm:-right-4 sm:block"
              style={enter(850, 600)}
              floatDelay="1.2s"
            >
              <div className="px-3 py-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  <Activity size={11} className="text-blue-600" />
                  Today's sales
                </div>
                <p className="text-sm font-extrabold text-gray-900">₦127,400</p>
              </div>
            </FloatingCard>

            <FloatingCard
              className="-bottom-2 right-3 sm:-bottom-5 sm:right-8"
              style={enter(1000, 600)}
              floatDelay="0.6s"
            >
              <div className="flex items-center gap-2 rounded-xl py-1.5 pl-1.5 pr-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#064E3B] text-white">
                  <Mic size={12} />
                </span>
                <VoiceWaveform active bars={5} barClassName="bg-emerald-500" className="h-4" />
                <span className="text-[11px] font-bold text-gray-600">Voice entry</span>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>

      {/* ── Demo video modal ── */}
      {showDemoVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm transition-opacity duration-300">
          <div className="relative w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-white/20 transition-transform duration-300 md:rounded-3xl">
            {/* Modal header */}
            <div className="pointer-events-none absolute left-0 right-0 top-0 z-10 flex items-center justify-between bg-gradient-to-b from-black/60 to-transparent p-4">
              <div className="flex items-center gap-2 text-white">
                <Play size={20} fill="currentColor" />
                <span className="text-sm font-bold md:text-base">MarketPulse AI Demo</span>
              </div>
              <button
                onClick={() => setShowDemoVideo(false)}
                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md transition-colors hover:bg-white/40"
                aria-label="Close demo video"
              >
                <X size={24} />
              </button>
            </div>

            {/* Video player */}
            <div className="aspect-video w-full bg-black">
              <video
                src="/demovideo.mp4"
                autoPlay
                controls
                className="h-full w-full object-contain"
                onEnded={() => setShowDemoVideo(false)}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../home/Header";
import AppShell from "../layout/AppShell";
import NavigationBar from "../home/NavigationBar";
import { getSummary } from "../../services/geminiService";
import { useLanguage } from "../../i18n/LanguageContext";

const base64ToBlobUrl = (base64, mimeType) => {
  const byteChars = atob(base64);
  const bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: mimeType }));
};

// ~150 spoken words per minute for the browser-voice fallback
const estimateDuration = (script) => {
  const words = (script || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(15, Math.round((words / 150) * 60));
};

const PERIOD_META = {
  daily: { label: "Daily", suffix: "today" },
  weekly: { label: "Weekly", suffix: "this week" },
  monthly: { label: "Monthly", suffix: "this month" },
};

// Friendly date-range shown under the tabs so the user always knows exactly
// what the current summary covers (e.g. "Today • Wednesday, 9 September").
const getPeriodRangeLabel = (period) => {
  const now = new Date();
  if (period === "daily") {
    return `Today • ${now.toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" })}`;
  }
  if (period === "monthly") {
    return now.toLocaleDateString("en-NG", { month: "long", year: "numeric" });
  }
  // Weekly: Monday – Sunday of the current week.
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() || 7) - 1));
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d) =>
    d.toLocaleDateString("en-NG", { weekday: "short", day: "numeric", month: "short" });
  return `This Week • ${fmt(monday)} – ${fmt(sunday)}`;
};

export default function WeeklyPulse({ onNavigate, businessName, initialPeriod = "weekly" }) {
  const { t } = useLanguage();
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const speechTimerRef = useRef(null);
  const speechOffsetRef = useRef(0);

  const [period, setPeriod] = useState(PERIOD_META[initialPeriod] ? initialPeriod : "weekly");
  const periodMeta = PERIOD_META[period] || PERIOD_META.weekly;

  const periodTabs = [
    { key: "daily", label: t("pulse_tab_daily", "Daily") },
    { key: "weekly", label: t("pulse_tab_weekly", "Weekly") },
    { key: "monthly", label: t("pulse_tab_monthly", "Monthly") },
  ];

  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [errorMsg, setErrorMsg] = useState("");
  const [script, setScript] = useState("");
  const [ttsUsed, setTtsUsed] = useState(true); // false = browser voice fallback
  const [stats, setStats] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(0); // seconds

  const totalDuration = duration || 1;

  /* ---------------------------- cleanup ---------------------------- */
  const stopEverything = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    if (speechTimerRef.current) {
      clearInterval(speechTimerRef.current);
      speechTimerRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  useEffect(() => {
    return () => {
      stopEverything();
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = null;
      }
    };
  }, [stopEverything]);

  /* ------------------------- load summary -------------------------- */
  const loadSummary = useCallback(async () => {
    stopEverything();
    setProgress(0);
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await getSummary(period);
      setScript(data.script || "");
      setStats(data.stats || null);

      if (data.audioBase64 && data.mimeType) {
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        audioUrlRef.current = base64ToBlobUrl(data.audioBase64, data.mimeType);
        setTtsUsed(true);
        setDuration(0); // real duration arrives with loadedmetadata
      } else {
        setTtsUsed(false);
        setDuration(estimateDuration(data.script));
      }
      setStatus("ready");
    } catch (error) {
      setErrorMsg(error.message || "Could not load your summary.");
      setStatus("error");
    }
  }, [stopEverything, period]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  /* ----------------------- audio (TTS) events ---------------------- */
  const handleLoadedMetadata = () => {
    const el = audioRef.current;
    if (el && isFinite(el.duration) && el.duration > 0) {
      setDuration(el.duration);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) setProgress(audioRef.current.currentTime);
  };
  const handleAudioEnded = () => setIsPlaying(false);

  /* -------------------- browser speech fallback -------------------- */
  const clearSpeechTimer = () => {
    if (speechTimerRef.current) {
      clearInterval(speechTimerRef.current);
      speechTimerRef.current = null;
    }
  };

  const speakFrom = useCallback(
    (offsetSec) => {
      if (!("speechSynthesis" in window) || !script) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      clearSpeechTimer();

      const words = script.trim().split(/\s+/).filter(Boolean);
      const total = duration || estimateDuration(script);
      const startWord = total > 0 ? Math.floor((offsetSec / total) * words.length) : 0;
      const utterance = new SpeechSynthesisUtterance(words.slice(startWord).join(" "));
      utterance.rate = 1;
      utterance.onend = () => {
        clearSpeechTimer();
        setProgress(total);
        setIsPlaying(false);
      };
      speechOffsetRef.current = offsetSec;
      synth.speak(utterance);

      const speechStartMs = Date.now();
      speechTimerRef.current = setInterval(() => {
        setProgress(Math.min(speechOffsetRef.current + (Date.now() - speechStartMs) / 1000, total));
      }, 250);
    },
    [script, duration]
  );

  /* --------------------------- play/pause -------------------------- */
  const togglePlay = async () => {
    if (status !== "ready") return;

    if (ttsUsed) {
      const el = audioRef.current;
      if (!el) return;
      if (el.paused) {
        try {
          await el.play();
          setIsPlaying(true);
        } catch {
          setErrorMsg("Playback failed. Tap retry to reload the audio.");
          setStatus("error");
        }
      } else {
        el.pause();
        setIsPlaying(false);
      }
      return;
    }

    // Browser speech fallback
    if (!("speechSynthesis" in window)) {
      setErrorMsg("Your browser cannot play audio summaries.");
      setStatus("error");
      return;
    }
    const synth = window.speechSynthesis;
    if (isPlaying) {
      speechOffsetRef.current = progress;
      clearSpeechTimer();
      synth.pause();
      setIsPlaying(false);
    } else if (synth.paused && synth.speaking) {
      synth.resume();
      const resumeFrom = speechOffsetRef.current;
      const speechResumeMs = Date.now();
      clearSpeechTimer();
      speechTimerRef.current = setInterval(() => {
        setProgress(Math.min(resumeFrom + (Date.now() - speechResumeMs) / 1000, totalDuration));
      }, 250);
      setIsPlaying(true);
    } else {
      setProgress(0);
      speakFrom(0);
      setIsPlaying(true);
    }
  };

  /* ------------------------------ seek ----------------------------- */
  const seekToRatio = (ratio) => {
    if (status !== "ready" || totalDuration <= 0) return;
    const target = Math.min(Math.max(ratio, 0), 1) * (duration || totalDuration);
    if (ttsUsed && audioRef.current) {
      audioRef.current.currentTime = target;
      setProgress(target);
    } else {
      setProgress(target);
      if (isPlaying) speakFrom(target);
      else speechOffsetRef.current = target;
    }
  };

  const handleScrub = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    seekToRatio((e.clientX - rect.left) / rect.width);
  };

  /* ---------------------------- download --------------------------- */
  const handleDownload = () => {
    if (status !== "ready") return;

    if (ttsUsed && audioUrlRef.current) {
      const link = document.createElement("a");
      link.href = audioUrlRef.current;
      link.download = `MarketPulse-${periodMeta.label}-Summary-${stats?.periodKey || stats?.weekKey || new Date().toISOString().slice(0, 10)}.wav`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      return;
    }

    // Fallback: save the spoken script as a text file
    const blob = new Blob([`MarketPulse Weekly Summary\n\n${script}`], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `MarketPulse-${periodMeta.label}-Summary-${stats?.periodKey || stats?.weekKey || new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };

  /* ---------------------------- helpers ---------------------------- */
  const formatTime = (secs) => {
    const s = Math.max(0, Math.floor(secs || 0));
    const minutes = Math.floor(s / 60);
    const seconds = s % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const waveformHeights = [
    18, 32, 44, 24, 40, 28, 36, 14, 42, 34, 45, 26, 38, 16, 36, 12, 38, 30,
  ];

  const currentPeriodLabel = period === "daily" ? t("pulse_tab_daily", "Daily") : period === "monthly" ? t("pulse_tab_monthly", "Monthly") : t("pulse_tab_weekly", "Weekly");

  const statusLabel =
    status === "loading"
      ? t("pulse_generating", "Preparing your summary…")
      : status === "error"
        ? (errorMsg || t("pulse_error_gen", "Could not load your summary."))
        : ttsUsed
          ? `MarketPulse AI • ${t("pulse_listen", "Tap play to listen")}`
          : `MarketPulse AI • Voice preview`;

  return (
    <AppShell
      active="pulse"
      onNavigate={onNavigate}
      businessName={businessName}
      title={`${currentPeriodLabel} ${t("pulse_title", "Pulse")}`}
      subtitle={t("pulse_listen", "Real-time performance audio-summary and insights.")}
    >
      <div
        style={{
          width: "100%",
          height: "100dvh",
          background: "#f4f6f4",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          boxSizing: "border-box",
          fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
          WebkitFontSmoothing: "antialiased",
        }}
      >
        <div style={{ flexShrink: 0 }}>
          <Header businessName={businessName} onNavigate={onNavigate} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96, scrollbarWidth: "none", msOverflowStyle: "none" }}>
          <section style={{ padding: "8px 20px 16px", textAlign: "left" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#030712", margin: 0, letterSpacing: "-0.5px", lineHeight: 1 }}>
              {currentPeriodLabel} {t("pulse_title", "Pulse")}
            </h1>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "#9ca3af", margin: "8px 0 0 0" }}>
              {t("pulse_listen", "Real-time performance audio-summary and insights.")}
            </p>
          </section>

          {/* Period tabs: Daily | Weekly | Monthly */}
          <section style={{ padding: "0 20px", marginTop: 16 }}>
            <div
              role="tablist"
              aria-label="Summary period"
              style={{
                display: "flex",
                gap: 4,
                padding: 4,
                backgroundColor: "#e9efe9",
                borderRadius: 14,
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.04)",
              }}
            >
              {periodTabs.map((tab) => {
                const active = period === tab.key;
                return (
                  <button
                    key={tab.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPeriod(tab.key)}
                    style={{
                      flex: 1,
                      border: "none",
                      background: active ? "#052e16" : "transparent",
                      color: active ? "#ffffff" : "#4b5563",
                      fontWeight: 800,
                      fontSize: 13,
                      letterSpacing: "0.02em",
                      padding: "10px 12px",
                      borderRadius: 10,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Current period range indicator */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: 10 }}>
              <span
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#065f46",
                  backgroundColor: "#d1fae5",
                  borderRadius: 999,
                  padding: "5px 14px",
                  letterSpacing: "0.01em",
                }}
              >
                {getPeriodRangeLabel(period)}
              </span>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 8 }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 24,
                padding: 20,
                boxShadow: "0 4px 24px rgba(0,0,0,0.03)",
                border: "1px solid #f3f4f6",
                display: "flex",
                flexDirection: "column",
                gap: 20,
                opacity: status === "loading" ? 0.75 : 1,
                transition: "opacity 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button
                  onClick={togglePlay}
                  disabled={status !== "ready"}
                  aria-label={isPlaying ? t("pulse_pause", "Pause summary") : t("pulse_play", "Play summary")}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    backgroundColor: status === "ready" ? "#052e16" : "#9ca3af",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    cursor: status === "ready" ? "pointer" : "not-allowed",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    flexShrink: 0,
                  }}
                >
                  {status === "loading" ? (
                    <svg
                      style={{ width: 22, height: 22, animation: "spin 1s linear infinite" }}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                  ) : isPlaying ? (
                    <svg style={{ width: 22, height: 22, fill: "white" }} viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  ) : (
                    <svg style={{ width: 22, height: 22, fill: "white", transform: "translateX(1.5px)" }} viewBox="0 0 24 24">
                      <polygon points="5 3 19 12 5 21" />
                    </svg>
                  )}
                </button>

                <div style={{ textAlign: "left", minWidth: 0 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                    {t("pulse_listen", `Listen to ${currentPeriodLabel} Summary`)}
                  </h3>
                  <span
                    style={{
                      fontSize: 11.5,
                      fontWeight: 500,
                      color: status === "error" ? "#dc2626" : "#9ca3af",
                      display: "block",
                      marginTop: 2,
                    }}
                  >
                    {statusLabel}
                  </span>
                  {status === "error" && (
                    <button
                      onClick={loadSummary}
                      style={{
                        marginTop: 6,
                        fontSize: 12,
                        fontWeight: 700,
                        color: "#052e16",
                        background: "#d1fae5",
                        border: "none",
                        borderRadius: 8,
                        padding: "5px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {t("common_retry", "Retry")}
                    </button>
                  )}
                </div>
              </div>

              {/* Waveform (tap to seek) */}
              <div
                onClick={handleScrub}
                role="slider"
                aria-label="Seek audio"
                aria-valuemin={0}
                aria-valuemax={Math.round(duration)}
                aria-valuenow={Math.round(progress)}
                style={{
                  height: 56,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  padding: "0 4px",
                  gap: 3,
                  cursor: status === "ready" ? "pointer" : "default",
                }}
              >
                {waveformHeights.map((height, i) => {
                  const isPlayed = i / waveformHeights.length < progress / totalDuration;
                  return (
                    <div
                      key={i}
                      style={{
                        width: 7,
                        borderRadius: 9999,
                        transition: "all 0.3s",
                        backgroundColor: isPlayed ? "#052e16" : "#e5e7eb",
                        height: `${height}px`,
                        flex: 1,
                        margin: "0 1px",
                      }}
                    />
                  );
                })}
              </div>

              {/* Progress bar (tap to seek) */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div
                  onClick={handleScrub}
                  style={{
                    width: "100%",
                    height: 12,
                    display: "flex",
                    alignItems: "center",
                    cursor: status === "ready" ? "pointer" : "default",
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: 5,
                      backgroundColor: "#f1f5f9",
                      borderRadius: 9999,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        backgroundColor: "#052e16",
                        borderRadius: 9999,
                        width: `${(progress / totalDuration) * 100}%`,
                        transition: ttsUsed ? "none" : "width 0.25s linear",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
                  <span>{formatTime(progress)}</span>
                  <span>{duration > 0 ? formatTime(duration) : "--:--"}</span>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 16 }}>
            <div
              style={{
                backgroundColor: "white",
                borderRadius: 16,
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                border: "1px solid #f3f4f6",
                borderLeft: "6px solid #052e16",
                padding: 16,
                textAlign: "left",
                display: "flex",
                flexDirection: "column",
                gap: 8,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", userSelect: "none" }}>
                Market Intelligence
              </span>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 4 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", backgroundColor: "#d1fae5", color: "#065f46", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                    <polyline points="17 6 23 6 23 12" />
                  </svg>
                </div>
                <h4 style={{ fontSize: 15.5, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                  {stats?.topMoving
                    ? `Top Moving Item: ${stats.topMoving.description} (₦${Math.round(stats.topMoving.total).toLocaleString()} ${periodMeta.suffix})`
                    : "No standout item yet — keep recording your sales and expenses."}
                </h4>
              </div>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 16 }}>
            <div
              style={{
                backgroundColor: "#052e16",
                borderRadius: 16,
                padding: 20,
                textAlign: "left",
                position: "relative",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 145,
              }}
            >
              <div style={{ position: "absolute", top: 8, right: 8, color: "rgba(255,255,255,0.05)", pointerEvents: "none", userSelect: "none" }}>
                <svg style={{ width: 96, height: 96 }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10-5.523 0-10-4.477-10-10 5.523 0 10-4.477 10-10z" />
                </svg>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#d1fae5", zIndex: 10 }}>
                <svg style={{ width: 20, height: 20, color: "#d1fae5" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                  <line x1="9" y1="18" x2="15" y2="18" />
                  <line x1="10" y1="22" x2="14" y2="22" />
                </svg>
                <span style={{ fontSize: 11.5, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  AI Smart Advice
                </span>
              </div>

              <p style={{ fontSize: 13, fontWeight: 500, color: "rgba(167, 243, 208, 0.9)", margin: "4px 0 0 0", lineHeight: 1.6, zIndex: 10 }}>
                {stats && stats.transactionCount > 0
                  ? stats.net >= 0
                    ? `You took in ₦${Math.round(stats.moneyIn).toLocaleString()} and spent ₦${Math.round(stats.moneyOut).toLocaleString()} ${periodMeta.suffix}, keeping ₦${Math.round(stats.net).toLocaleString()}. Consider setting aside a share of that surplus before restocking.`
                    : `Spending outpaced income ${periodMeta.suffix} by ₦${Math.abs(Math.round(stats.net)).toLocaleString()}. Review your biggest expenses before placing your next order.`
                  : "Record your sales and expenses every day so MarketPulse can give you smart, personalized advice here."}
              </p>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 20 }}>
            <button
              onClick={handleDownload}
              disabled={status !== "ready"}
              aria-label="Download the weekly summary audio"
              style={{
                width: "100%",
                backgroundColor: status === "ready" ? "#002b10" : "#9ca3af",
                color: "white",
                fontWeight: 700,
                padding: "16px 24px",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                cursor: status === "ready" ? "pointer" : "not-allowed",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                fontSize: 13.5,
                letterSpacing: "0.025em",
                transition: "all 0.2s",
              }}
            >
              <svg style={{ width: 18, height: 18, color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{ttsUsed ? `${t("pulse_listen", "Download")} ${currentPeriodLabel} ${t("pulse_title", "Pulse")} (Audio)` : `${t("pulse_listen", "Download")} Transcript`}</span>
            </button>
          </section>
        </div>

        <NavigationBar onNavigate={onNavigate} currentPage="pulse" />

        {/* Hidden audio element for real TTS playback */}
        {ttsUsed && audioUrlRef.current && (
          <audio
            ref={audioRef}
            src={audioUrlRef.current}
            preload="metadata"
            onLoadedMetadata={handleLoadedMetadata}
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleAudioEnded}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            style={{ display: "none" }}
          />
        )}

        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </AppShell>
  );
}

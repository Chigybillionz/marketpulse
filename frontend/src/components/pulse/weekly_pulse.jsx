import { useState, useEffect } from 'react';
import Header from '../home/Header';

export default function WeeklyPulse({ onNavigate, businessName }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(88); // 1:28 is 88 seconds
  const totalDuration = 252; // 4:12 is 252 seconds

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < totalDuration ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const waveformHeights = [
    18, 32, 44, 24, 40, 28, 36, 14, 42, 34, 45, 26, 38, 16, 36, 12, 38, 30
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#e8ede8", display: "flex", justifyContent: "center", alignItems: "flex-start", fontFamily: "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif", WebkitFontSmoothing: "antialiased" }}>
      <div style={{ width: "100%", maxWidth: 480, height: "100dvh", background: "#f4f6f4", display: "flex", flexDirection: "column", overflow: "hidden", position: "relative", boxSizing: "border-box" }}>
        
        <div style={{ flexShrink: 0 }}>
          <Header businessName={businessName} onNavigate={onNavigate} />
        </div>

        <div style={{ flex: 1, overflowY: "auto", paddingBottom: 96, scrollbarWidth: "none", msOverflowStyle: "none" }}>

          <section style={{ padding: "8px 20px 16px", textAlign: "left" }}>
            <h1 style={{ fontSize: 28, fontWeight: 800, color: "#030712", margin: 0, letterSpacing: "-0.5px", lineHeight: 1 }}>
              Weekly Pulse
            </h1>
            <p style={{ fontSize: 13.5, fontWeight: 500, color: "#9ca3af", margin: "8px 0 0 0" }}>
              Real-time performance audio-summary and insights.
            </p>
          </section>

          <section style={{ padding: "0 20px", marginTop: 8 }}>
            <div style={{ backgroundColor: "white", borderRadius: 24, padding: 20, boxShadow: "0 4px 24px rgba(0,0,0,0.03)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", gap: 20 }}>
              
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#052e16", color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                  {isPlaying ? (
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

                <div style={{ textAlign: "left" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: 0, lineHeight: 1.3 }}>
                    Listen to Weekly Summary
                  </h3>
                  <span style={{ fontSize: 11.5, fontWeight: 500, color: "#9ca3af", display: "block", marginTop: 2 }}>
                    Duration: 4:12 &bull; AI Generated
                  </span>
                </div>
              </div>

              <div style={{ height: 56, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 4px", gap: 3 }}>
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
                      }}
                    />
                  );
                })}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div 
                  style={{ width: "100%", height: 5, backgroundColor: "#f1f5f9", borderRadius: 9999, overflow: "hidden", cursor: "pointer", position: "relative" }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const newProgress = Math.floor((clickX / rect.width) * totalDuration);
                    setProgress(newProgress);
                  }}
                >
                  <div 
                    style={{ height: "100%", backgroundColor: "#052e16", borderRadius: 9999, width: `${(progress / totalDuration) * 100}%` }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 11, fontWeight: 700, color: "#9ca3af" }}>
                  <span>{formatTime(progress)}</span>
                  <span>{formatTime(totalDuration)}</span>
                </div>
              </div>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 16 }}>
            <div style={{ backgroundColor: "white", borderRadius: 16, boxShadow: "0 4px 20px rgba(0,0,0,0.02)", border: "1px solid #f3f4f6", borderLeft: "6px solid #052e16", padding: 16, textAlign: "left", display: "flex", flexDirection: "column", gap: 8, position: "relative", overflow: "hidden" }}>
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
                  Top Moving Item: Spaghetti (+20%)
                </h4>
              </div>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 16 }}>
            <div style={{ backgroundColor: "#052e16", borderRadius: 16, padding: 20, textAlign: "left", position: "relative", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", display: "flex", flexDirection: "column", gap: 12, minHeight: 145 }}>
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
                Inventory levels for Spaghetti are low while demand is surging. We recommend increasing your order by 15% this Wednesday to capture weekend sales and avoid stockouts.
              </p>
            </div>
          </section>

          <section style={{ padding: "0 20px", marginTop: 20 }}>
            <button style={{ width: "100%", backgroundColor: "#002b10", color: "white", fontWeight: 700, padding: "16px 24px", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 12, cursor: "pointer", border: "none", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)", fontSize: 13.5, letterSpacing: "0.025em", transition: "all 0.2s" }}>
              <svg style={{ width: 18, height: 18, color: "white" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span>Download Bank-Ready Statement (PDF)</span>
            </button>
          </section>

        </div>
        
        <div style={{ flexShrink: 0, width: "100%" }}>
          <nav style={{ backgroundColor: "white", borderTop: "1px solid #f3f4f6", padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 30, borderTopLeftRadius: 24, borderTopRightRadius: 24, boxShadow: "0 -4px 16px rgba(0,0,0,0.02)" }}>
            <button 
              onClick={() => onNavigate('home')}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
            >
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Home
              </span>
            </button>

            <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, background: "none", border: "none", cursor: "pointer" }}>
              <div style={{ backgroundColor: "#052e16", color: "white", padding: "6px 20px", borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center", transform: "scale(1.05)", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}>
                <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                  <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                  <line x1="12" y1="19" x2="12" y2="22" />
                </svg>
              </div>
              <span style={{ fontSize: 10, fontWeight: 800, color: "#052e16", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Pulse
              </span>
            </button>

            <button 
              onClick={() => onNavigate('history')}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
            >
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <polyline points="3 3 3 8 8 8" />
                <line x1="12" y1="7" x2="12" y2="12" />
                <line x1="12" y1="12" x2="16" y2="14" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                History
              </span>
            </button>

            <button 
              onClick={() => onNavigate('credit')}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flex: 1, color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
            >
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
                <path d="M6 14h.01M10 14h.01" />
              </svg>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Credit
              </span>
            </button>
          </nav>
        </div>

      </div>
    </div>
  );
}

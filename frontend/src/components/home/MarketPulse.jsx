import { useState } from 'react';
import { Volume2, Play, Sparkles } from 'lucide-react';

export default function MarketPulse({ onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (onNavigate) onNavigate('weekly_pulse', { period: 'daily' });
  };

  const waveHeights = [18, 32, 48, 26, 42, 60, 36, 52, 28, 44, 20, 38, 56, 30, 46, 24];

  return (
    <section style={{ padding: '4px 20px 12px 20px' }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Daily Voice Pulse: Tap to listen to your Stockpile audio advice."
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onTouchStart={() => setPressed(true)}
        onTouchEnd={() => setPressed(false)}
        style={{
          position: 'relative',
          borderRadius: 24,
          overflow: 'hidden',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #09371d 0%, #041f10 100%)',
          minHeight: 140,
          border: '1px solid rgba(74, 222, 128, 0.35)',
          boxShadow: hovered
            ? '0 12px 28px rgba(5, 46, 22, 0.35)'
            : '0 6px 18px rgba(5, 46, 22, 0.18)',
          transform: pressed ? 'scale(0.98)' : hovered ? 'translateY(-2px)' : 'none',
          transition: 'transform 0.15s ease, box-shadow 0.2s ease, border-color 0.2s ease',
          outline: 'none',
          userSelect: 'none',
          WebkitTapHighlightColor: 'transparent',
        }}
      >
        {/* Acoustic voice wave graphic in the background */}
        <div
          style={{
            position: 'absolute',
            right: 20,
            bottom: 20,
            display: 'flex',
            alignItems: 'flex-end',
            gap: 4,
            opacity: 0.28,
            pointerEvents: 'none',
          }}
        >
          {waveHeights.map((h, i) => (
            <div
              key={i}
              style={{
                width: 4,
                height: h,
                backgroundColor: '#34d399',
                borderRadius: 2,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '20px' }}>
          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(26, 90, 50, 0.85)',
              border: '1px solid rgba(74, 222, 128, 0.4)',
              borderRadius: 50,
              padding: '4px 12px',
              marginBottom: 10,
            }}
          >
            <Volume2 size={13} color="#a8f0c0" />
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#a8f0c0',
                textTransform: 'uppercase',
                letterSpacing: 1.5,
              }}
            >
              Stockpile Audio Pulse
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.3px',
              lineHeight: 1.2,
              margin: '0 0 6px',
            }}
          >
            Daily Voice Advice & Summary
          </h3>

          <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(255, 255, 255, 0.8)', fontWeight: 500 }}>
            Listen to your co-pilot explain today's market performance in plain English or Pidgin.
          </p>

          {/* Tap hint row */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(4px)',
              borderRadius: 999,
              padding: '6px 14px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
          >
            <Play size={12} fill="#d1fae5" color="#d1fae5" />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#d1fae5',
                letterSpacing: '0.02em',
              }}
            >
              Tap to play audio briefing
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

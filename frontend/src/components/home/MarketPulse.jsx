import { useState } from 'react';

export default function MarketPulse({ onNavigate }) {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (onNavigate) onNavigate('weekly_pulse');
  };

  return (
    <section style={{ padding: '4px 20px 12px 20px' }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Daily Pulse: Strong Buy. Open your Weekly Pulse insights."
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
          background: 'linear-gradient(135deg, #0d3d22 0%, #072915 100%)',
          minHeight: 176,
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
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.9)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(74, 222, 128, 0.35)';
        }}
      >
        {/* Candlestick chart background */}
        <svg
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}
          viewBox="0 0 400 160"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          {[
            { x: 20,  t: 30, h: 55, g: true  },
            { x: 52,  t: 48, h: 42, g: false },
            { x: 84,  t: 22, h: 60, g: true  },
            { x: 116, t: 38, h: 48, g: false },
            { x: 148, t: 15, h: 65, g: true  },
            { x: 180, t: 10, h: 68, g: true  },
            { x: 212, t: 32, h: 50, g: false },
            { x: 244, t: 8,  h: 72, g: true  },
            { x: 276, t: 14, h: 62, g: true  },
            { x: 308, t: 28, h: 50, g: false },
            { x: 340, t: 10, h: 66, g: true  },
            { x: 372, t: 5,  h: 74, g: true  },
          ].map(({ x, t, h, g }, i) => (
            <g key={i}>
              <line x1={x+6} y1={t-10} x2={x+6} y2={t+h+10} stroke={g ? '#4ade80' : '#f87171'} strokeWidth="1.5" />
              <rect x={x} y={t} width="12" height={h} fill={g ? '#4ade80' : '#f87171'} rx="2" />
            </g>
          ))}
        </svg>

        {/* Gradient overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(13,61,34,0.8) 0%, rgba(13,61,34,0.15) 50%, transparent 100%)',
          }}
        />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, padding: '20px 20px 16px' }}>
          {/* MARKET OPEN pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              background: 'rgba(26,90,50,0.85)',
              border: '1px solid rgba(74,222,128,0.4)',
              borderRadius: 50,
              padding: '6px 14px',
              marginBottom: 12,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 800,
                color: '#a8f0c0',
                textTransform: 'uppercase',
                letterSpacing: 2,
              }}
            >
              Market Open
            </span>
          </div>

          {/* Title */}
          <h3
            style={{
              fontSize: 26,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Daily Pulse: Strong Buy
          </h3>

          {/* Tap hint row */}
          <div
            style={{
              marginTop: 12,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255, 255, 255, 0.12)',
              backdropFilter: 'blur(4px)',
              borderRadius: 999,
              padding: '7px 14px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: '#d1fae5',
                letterSpacing: '0.02em',
              }}
            >
              Tap to view your weekly insights
            </span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d1fae5"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                transition: 'transform 0.2s ease',
                transform: hovered ? 'translateX(3px)' : 'none',
              }}
              aria-hidden="true"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

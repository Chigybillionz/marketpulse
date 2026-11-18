import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Mic,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function PrimaryWalletCard({
  balance = 0,
  moneyIn = 0,
  moneyOut = 0,
  onNavigate,
  onVoiceRecord,
}) {
  const { t } = useLanguage();

  // Privacy lock: mask amount with ₦••••••
  const [isHidden, setIsHidden] = useState(() => {
    return localStorage.getItem('stockpile_wallet_hidden') === 'true';
  });

  const toggleHide = (e) => {
    e.stopPropagation();
    const next = !isHidden;
    setIsHidden(next);
    localStorage.setItem('stockpile_wallet_hidden', next ? 'true' : 'false');
  };

  const fmtCurrency = (n) => {
    const val = Number(n) || 0;
    return `₦${val.toLocaleString()}`;
  };

  const netDaily = moneyIn - moneyOut;
  const isProfit = netDaily >= 0;

  return (
    <section style={{ padding: '12px 20px 10px 20px' }}>
      <div
        style={{
          background: 'linear-gradient(145deg, #063e26 0%, #0d5434 55%, #052e1d 100%)',
          borderRadius: 24,
          padding: '20px 20px 18px 20px',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(6, 62, 38, 0.22)',
          border: '1px solid rgba(74, 222, 128, 0.22)',
        }}
      >
        {/* Decorative background glow circle */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(52, 211, 153, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ── Top Row: Header & Eye Toggle ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#a7f3d0',
                letterSpacing: '0.02em',
              }}
            >
              Today's Trading Cash
            </span>
            <button
              type="button"
              onClick={toggleHide}
              aria-label={isHidden ? 'Show Amount' : 'Hide Amount'}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: 'none',
                borderRadius: 20,
                padding: '3px 8px',
                color: '#e2e8f0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                cursor: 'pointer',
                fontSize: 10.5,
                fontWeight: 600,
                outline: 'none',
              }}
            >
              {isHidden ? <Eye size={12} /> : <EyeOff size={12} />}
              <span>{isHidden ? 'Show' : 'Hide'}</span>
            </button>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              background: 'rgba(5, 46, 22, 0.65)',
              border: '1px solid rgba(52, 211, 153, 0.3)',
              borderRadius: 20,
              padding: '2px 9px',
              fontSize: 10,
              fontWeight: 700,
              color: '#34d399',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                backgroundColor: '#34d399',
                boxShadow: '0 0 6px #34d399',
              }}
            />
            <span>Live Shop</span>
          </div>
        </div>

        {/* ── Main Big Amount ── */}
        <div style={{ marginBottom: 16 }}>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              color: '#ffffff',
              fontFamily: "'Inter Tight', system-ui, sans-serif",
            }}
          >
            {isHidden ? '₦••••••••' : fmtCurrency(balance || moneyIn)}
          </div>
        </div>

        {/* ── Sub-Metrics: Money In, Money Out, Pocket Gain ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 8,
            background: 'rgba(0, 0, 0, 0.22)',
            borderRadius: 16,
            padding: '10px 12px',
            marginBottom: 0,
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          {/* Money In */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Inflow
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#4ade80',
                marginTop: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {isHidden ? '₦•••' : `+${fmtCurrency(moneyIn)}`}
            </span>
          </div>

          {/* Money Out */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Outflow
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: '#f87171',
                marginTop: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {isHidden ? '₦•••' : `-${fmtCurrency(moneyOut)}`}
            </span>
          </div>

          {/* Result / Pocket Gain */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              Gain / Loss
            </span>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: isProfit ? '#34d399' : '#f87171',
                marginTop: 2,
                whiteSpace: 'nowrap',
              }}
            >
              {isHidden ? '₦•••' : (isProfit ? `+${fmtCurrency(netDaily)}` : `-${fmtCurrency(Math.abs(netDaily))}`)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

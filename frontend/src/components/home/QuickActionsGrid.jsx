import React from 'react';
import {
  Package,
  ShoppingBag,
  Users,
  Volume2,
  FileText,
  History,
  PiggyBank,
  PlusCircle,
  Mic,
} from 'lucide-react';

export default function QuickActionsGrid({
  onOpenShelf,
  onOpenValuation,
  onOpenAudioPulse,
  onOpenDayClose,
  onNavigate,
  onVoiceLog,
  needsRestockCount = 0,
}) {
  const actions = [
    {
      id: 'shelf',
      label: 'Stock Shelf',
      icon: <Package size={22} strokeWidth={2.2} />,
      bg: '#e6f4ea',
      color: '#137333',
      badge: needsRestockCount > 0 ? `${needsRestockCount} low` : null,
      onClick: onOpenShelf,
    },
    {
      id: 'valuation',
      label: 'Goods Value',
      icon: <ShoppingBag size={22} strokeWidth={2.2} />,
      bg: '#e0f2fe',
      color: '#0369a1',
      badge: null,
      onClick: onOpenValuation,
    },
    {
      id: 'debtors',
      label: 'Debtors',
      icon: <Users size={22} strokeWidth={2.2} />,
      bg: '#fef3c7',
      color: '#b45309',
      badge: null,
      onClick: () => onNavigate && onNavigate('credit'),
    },
    {
      id: 'pulse',
      label: 'Audio Pulse',
      icon: <Volume2 size={22} strokeWidth={2.2} />,
      bg: '#f3e8ff',
      color: '#7e22ce',
      badge: 'Daily',
      onClick: onOpenAudioPulse,
    },
    {
      id: 'dayclose',
      label: 'Day Close',
      icon: <FileText size={22} strokeWidth={2.2} />,
      bg: '#fee2e2',
      color: '#b91c1c',
      badge: null,
      onClick: onOpenDayClose,
    },
    {
      id: 'savings',
      label: 'Save Advice',
      icon: <PiggyBank size={22} strokeWidth={2.2} />,
      bg: '#ecfdf5',
      color: '#047857',
      badge: 'Daily',
      onClick: () => onNavigate && onNavigate('savings_plan'),
    },
  ];

  return (
    <section style={{ padding: '4px 20px 16px 20px' }}>
      {/* ── Section Title ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#64748b',
          }}
        >
          Quick Actions
        </span>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: '#10b981',
            backgroundColor: '#ecfdf5',
            padding: '2px 8px',
            borderRadius: 12,
          }}
        >
          One-Tap Services
        </span>
      </div>

      {/* ── OPay-Style 3-Column Grid (6 Essential Services) ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '16px 12px',
          background: '#ffffff',
          borderRadius: 22,
          padding: '18px 12px',
          border: '1px solid #eef2f6',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        }}
      >
        {actions.map((act) => (
          <button
            key={act.id}
            type="button"
            onClick={act.onClick}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              outline: 'none',
              position: 'relative',
              userSelect: 'none',
              WebkitTapHighlightColor: 'transparent',
              transition: 'transform 0.12s ease',
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onTouchStart={(e) => (e.currentTarget.style.transform = 'scale(0.92)')}
            onTouchEnd={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {/* Circular / Squircle Icon Container */}
            <div
              style={{
                width: 50,
                height: 50,
                borderRadius: 16,
                backgroundColor: act.bg,
                color: act.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                marginBottom: 6,
              }}
            >
              {act.icon}

              {/* Micro badge (e.g. "Daily", "Fast", or "1 low") */}
              {act.badge && (
                <span
                  style={{
                    position: 'absolute',
                    top: -4,
                    right: -4,
                    fontSize: 8.5,
                    fontWeight: 800,
                    color: '#ffffff',
                    backgroundColor: act.badge.includes('low') ? '#ef4444' : '#10b981',
                    padding: '1px 5px',
                    borderRadius: 8,
                    lineHeight: 1.2,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  }}
                >
                  {act.badge}
                </span>
              )}
            </div>

            {/* Label */}
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: '#1e293b',
                textAlign: 'center',
                lineHeight: 1.2,
                maxWidth: 68,
              }}
            >
              {act.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}

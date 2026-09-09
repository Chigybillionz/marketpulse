import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function BalanceCard({ balance, moneyIn, moneyOut }) {
  const { t } = useLanguage();
  const fmt = (n) => {
    if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    if (n >= 1_000)     return `₦${Math.round(n / 1_000)}k`;
    return `₦${n}`;
  };

  return (
    <section style={{ padding: '8px 20px 12px 20px' }}>

      {/* ── MarketPulse AI sub-heading ── */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '-0.3px' }}>
          MarketPulse AI
        </h2>
        <p style={{ fontSize: 13, color: '#999', margin: '2px 0 0', fontWeight: 500 }}>
          Real-time trading insights
        </p>
      </div>

      {/* ── Three metric cards ── */}
      <div style={{ display: 'flex', gap: 10 }}>

        {/* MONEY IN */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: 16,
            padding: '14px 12px',
            borderLeft: '4px solid #1a7a3f',
            border: '1px solid #e8e8e8',
            borderLeftWidth: 4,
            borderLeftColor: '#1a7a3f',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 105,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            {t('home_money_in')}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {fmt(moneyIn)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
            <TrendingUp size={13} strokeWidth={2.5} color="#1a7a3f" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1a7a3f' }}>+12%</span>
          </div>
        </div>

        {/* MONEY OUT */}
        <div
          style={{
            flex: 1,
            background: '#fff',
            borderRadius: 16,
            padding: '14px 12px',
            border: '1px solid #e8e8e8',
            borderLeftWidth: 4,
            borderLeftColor: '#d32f2f',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 105,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            {t('home_money_out')}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#d32f2f', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {fmt(moneyOut)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
            <TrendingDown size={13} strokeWidth={2.5} color="#d32f2f" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#d32f2f' }}>-5%</span>
          </div>
        </div>

        {/* GLOBAL BALANCE */}
        <div
          style={{
            flex: 1,
            background: '#eef1fb',
            borderRadius: 16,
            padding: '14px 12px',
            border: '1px solid #dde2f5',
            borderLeftWidth: 4,
            borderLeftColor: '#5a6abf',
            boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: 6,
            minHeight: 105,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: 1.5 }}>
            {t('home_balance')}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {fmt(balance || 142500)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
            <BarChart2 size={13} strokeWidth={2.5} color="#888" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#888' }}>Stable</span>
          </div>
        </div>

      </div>
    </section>
  );
}

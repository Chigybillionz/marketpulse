import { TrendingUp, TrendingDown, BarChart2 } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function BalanceCard({
  balance = 0,
  moneyIn = 0,
  moneyOut = 0,
  netProfit = null,
  salesRevenue = null,
  operatingExpenses = null,
}) {
  const { t } = useLanguage();
  const fmt = (n) => {
    const val = Number(n) || 0;
    const abs = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (abs >= 1_000_000) return `${sign}₦${(abs / 1_000_000).toFixed(1).replace(/\.0$/, '')}m`;
    if (abs >= 1_000)     return `${sign}₦${Math.round(abs / 1_000)}k`;
    return `${sign}₦${abs}`;
  };

  const displayRevenue = salesRevenue !== null && salesRevenue !== undefined ? salesRevenue : moneyIn;
  const displayExpenses = operatingExpenses !== null && operatingExpenses !== undefined ? operatingExpenses : moneyOut;
  const hasProfitData = netProfit !== null && netProfit !== undefined;

  return (
    <section style={{ padding: '8px 20px 12px 20px' }}>

      {/* ── Stockpile sub-heading ── */}
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: 0, letterSpacing: '-0.3px' }}>
          Stockpile
        </h2>
        <p style={{ fontSize: 13, color: '#777', margin: '2px 0 0', fontWeight: 500 }}>
          Real-time trading insights
        </p>
      </div>

      {/* ── Three metric cards ── */}
      <div style={{ display: 'flex', gap: 10 }}>

        {/* MONEY IN / REVENUE */}
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
            {t('home_money_in', 'SALES REVENUE')}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {fmt(displayRevenue)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
            <TrendingUp size={13} strokeWidth={2.5} color="#1a7a3f" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#1a7a3f' }}>Sales Inflow</span>
          </div>
        </div>

        {/* MONEY OUT / EXPENSES */}
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
            {t('home_money_out', 'SHOP EXPENSES')}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#d32f2f', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {fmt(displayExpenses)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
            <TrendingDown size={13} strokeWidth={2.5} color="#d32f2f" />
            <span style={{ fontSize: 11, fontWeight: 700, color: '#d32f2f' }}>Operating Outflow</span>
          </div>
        </div>

        {/* GLOBAL BALANCE / AVAILABLE CASH */}
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
            {t('home_balance', 'AVAILABLE CASH')}
          </span>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', letterSpacing: '-0.5px', lineHeight: 1 }}>
            {fmt(balance)}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 'auto' }}>
            <BarChart2 size={13} strokeWidth={2.5} color={hasProfitData ? (netProfit >= 0 ? '#1a7a3f' : '#d32f2f') : '#888'} />
            <span style={{ fontSize: 11, fontWeight: 700, color: hasProfitData ? (netProfit >= 0 ? '#1a7a3f' : '#d32f2f') : '#888' }}>
              {hasProfitData ? `Net: ${netProfit >= 0 ? '+' : ''}${fmt(netProfit)}` : 'In Hand'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}

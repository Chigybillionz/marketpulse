import { useState } from 'react';
import {
  FileText,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  X,
  BellRing,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DailyInvoiceNotificationBanner({
  moneyIn = 0,
  moneyOut = 0,
  onOpenInvoice,
}) {
  const [dismissed, setDismissed] = useState(false);
  const { t } = useLanguage();

  if (dismissed) return null;

  const net = moneyIn - moneyOut;
  const isProfit = net >= 0;

  const fmtCurrency = (n) => `₦${Math.abs(Math.round(n || 0)).toLocaleString('en-NG')}`;

  return (
    <div style={{ padding: '8px 20px 4px 20px' }}>
      <div
        style={{
          background: isProfit
            ? 'linear-gradient(90deg, #ecfdf5 0%, #f0fdf4 100%)'
            : 'linear-gradient(90deg, #fef2f2 0%, #fff1f2 100%)',
          border: isProfit ? '1px solid #a7f3d0' : '1px solid #fecaca',
          borderRadius: 16,
          padding: '12px 14px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: isProfit ? '#064e3b' : '#991b1b',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <BellRing size={16} />
          </div>

          <div style={{ minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                {t('home_daily_invoice', "Daily Closing Invoice Ready")}
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: 6,
                  backgroundColor: isProfit ? '#dcfce7' : '#fee2e2',
                  color: isProfit ? '#15803d' : '#b91c1c',
                  textTransform: 'uppercase',
                }}
              >
                {(moneyIn === 0 && moneyOut === 0) ? 'STARTING SLIP' : isProfit ? 'PROFIT TODAY 🎉' : 'OUTFLOW TODAY'}
              </span>
            </div>

            <div
              style={{
                fontSize: 11,
                color: '#475569',
                marginTop: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {(moneyIn === 0 && moneyOut === 0) ? (
                <span>No trades recorded today • Slip updates live as you record sales</span>
              ) : (
                <>
                  In: <strong style={{ color: '#16a34a' }}>+{fmtCurrency(moneyIn)}</strong> • Out:{' '}
                  <strong style={{ color: '#dc2626' }}>-{fmtCurrency(moneyOut)}</strong> • Conclusion:{' '}
                  <strong style={{ color: isProfit ? '#16a34a' : '#dc2626' }}>
                    {isProfit ? '+' : '-'}{fmtCurrency(net)} {isProfit ? 'Gain' : 'Outflow'}
                  </strong>
                </>
              )}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          <button
            onClick={onOpenInvoice}
            style={{
              backgroundColor: isProfit ? '#064e3b' : '#991b1b',
              color: '#ffffff',
              border: 'none',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span>View Slip</span>
            <ArrowRight size={12} />
          </button>

          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss daily invoice notice"
            style={{
              background: 'none',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              padding: 4,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}

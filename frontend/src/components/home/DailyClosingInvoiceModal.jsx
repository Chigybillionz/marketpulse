import { useState } from 'react';
import {
  FileText,
  Share2,
  Printer,
  X,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
  ArrowDownLeft,
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import { getTotalGoodsValuation } from '../../services/productService';

export default function DailyClosingInvoiceModal({
  isOpen,
  onClose,
  businessName = 'My Store',
  moneyIn = 0,
  moneyOut = 0,
  transactionsList = [],
}) {
  if (!isOpen) return null;

  const today = new Date();
  const dateFormatted = today.toLocaleDateString('en-NG', {
    weekday: 'long',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const invoiceNo = `INV-${today.getFullYear()}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-01`;

  const net = moneyIn - moneyOut;
  const isProfit = net >= 0;
  const totalGoods = getTotalGoodsValuation();

  const fmtCurrency = (n) => `₦${Math.abs(Math.round(n || 0)).toLocaleString('en-NG')}`;

  // Filter transactions into today's income vs expenses
  const incomeTxs = transactionsList.filter((tx) => tx.isPositive || tx.type === 'credit' || tx.type === 'recovery');
  const expenseTxs = transactionsList.filter((tx) => !tx.isPositive && tx.type !== 'recovery');

  // WhatsApp share message
  const handleShareWhatsApp = () => {
    const message = `📋 *STOCKPILE DAILY CLOSING INVOICE*
🏪 *Store:* ${businessName || 'My Store'}
📅 *Date:* ${dateFormatted}
🧾 *Invoice:* ${invoiceNo}
----------------------------------
🟢 *SUMMARY OF AMOUNT THAT CAME IN:*
• Total Money In: ₦${Math.round(moneyIn).toLocaleString('en-NG')}
(${incomeTxs.length} sales / inflows recorded)

🔴 *SUMMARY OF AMOUNT THAT WENT OUT:*
• Total Money Out: ₦${Math.round(moneyOut).toLocaleString('en-NG')}
(${expenseTxs.length} restock & expense entries)
----------------------------------
⚖️ *DAY'S CONCLUSION:*
${isProfit ? '🎉 *VERDICT: TODAY IS PROFIT!*' : '⚠️ *VERDICT: OUTFLOW / RESTOCK DAY*'}
• Net Result: ${isProfit ? '+' : '-'}₦${Math.abs(Math.round(net)).toLocaleString('en-NG')}
• Shop Goods In Store: ₦${totalGoods.toLocaleString('en-NG')}
----------------------------------
Tracked securely on Stockpile`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        className="print-invoice-sheet"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: 24,
          maxWidth: 480,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          animation: 'fadeIn 0.2s ease-out',
        }}
      >
        {/* Invoice Modal Top Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '16px 20px',
            borderBottom: '1px solid #f1f5f9',
            backgroundColor: '#064e3b',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <img
              src="/stockpile-mark.png"
              alt="Stockpile"
              style={{ width: 28, height: 28, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: 0.5 }}>
                DAILY CLOSING INVOICE
              </div>
              <div style={{ fontSize: 10, color: '#a7f3d0' }}>{invoiceNo}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Receipt Body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {/* Shop Header Details */}
          <div style={{ textAlign: 'center', marginBottom: 18, borderBottom: '1px dashed #cbd5e1', paddingBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#0f172a' }}>
              {businessName || 'My Store'}
            </h2>
            <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
              {dateFormatted}
            </div>
            <div
              style={{
                display: 'inline-block',
                marginTop: 8,
                background: '#f1f5f9',
                color: '#334155',
                fontSize: 10,
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 999,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Official Day-End Financial Summary
            </div>
          </div>

          {/* ── SECTION 1: AMOUNT THAT CAME IN (MONEY IN) ── */}
          <div
            style={{
              backgroundColor: '#f0fdf4',
              borderRadius: 14,
              padding: '14px',
              border: '1px solid #bbf7d0',
              marginBottom: 14,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowDownLeft size={13} strokeWidth={3} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#166534', textTransform: 'uppercase' }}>
                  1. Amount That Came In
                </span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#15803d' }}>
                +{fmtCurrency(moneyIn)}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: 11, color: '#166534', fontWeight: 500 }}>
              Summary of all sales revenue, customer transfers, and debt collections recorded today.
            </p>

            {incomeTxs.length > 0 && (
              <div style={{ marginTop: 8, borderTop: '1px solid #dcfce7', paddingTop: 6 }}>
                {incomeTxs.slice(0, 3).map((tx, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: '#334155',
                      padding: '2px 0',
                    }}
                  >
                    <span>{tx.title || 'Sale'}</span>
                    <span style={{ fontWeight: 700, color: '#15803d' }}>{tx.amount}</span>
                  </div>
                ))}
                {incomeTxs.length > 3 && (
                  <div style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic', marginTop: 2 }}>
                    + {incomeTxs.length - 3} more sale items
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SECTION 2: AMOUNT THAT WENT OUT (MONEY OUT) ── */}
          <div
            style={{
              backgroundColor: '#fff1f2',
              borderRadius: 14,
              padding: '14px',
              border: '1px solid #fecdd3',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    backgroundColor: '#e11d48',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ArrowUpRight size={13} strokeWidth={3} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#9f1239', textTransform: 'uppercase' }}>
                  2. Amount That Went Out
                </span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#be123c' }}>
                -{fmtCurrency(moneyOut)}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: 11, color: '#9f1239', fontWeight: 500 }}>
              Summary of all inventory restocking, transportation, feeding, and shop operating expenses.
            </p>

            {expenseTxs.length > 0 && (
              <div style={{ marginTop: 8, borderTop: '1px solid #ffe4e6', paddingTop: 6 }}>
                {expenseTxs.slice(0, 3).map((tx, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 11,
                      color: '#334155',
                      padding: '2px 0',
                    }}
                  >
                    <span>{tx.title || 'Expense'}</span>
                    <span style={{ fontWeight: 700, color: '#be123c' }}>{tx.amount}</span>
                  </div>
                ))}
                {expenseTxs.length > 3 && (
                  <div style={{ fontSize: 10, color: '#64748b', fontStyle: 'italic', marginTop: 2 }}>
                    + {expenseTxs.length - 3} more expense items
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── SECTION 3: CONCLUSION OF LOSS OR PROFIT FOR TODAY ── */}
          <div
            style={{
              backgroundColor: isProfit ? '#064e3b' : '#7f1d1d',
              borderRadius: 16,
              padding: '16px',
              color: '#ffffff',
              boxShadow: isProfit
                ? '0 8px 18px rgba(6, 78, 59, 0.25)'
                : '0 8px 18px rgba(127, 29, 29, 0.25)',
              marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Sparkles size={16} color={isProfit ? '#6ee7b7' : '#fca5a5'} />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  color: isProfit ? '#a7f3d0' : '#fecaca',
                }}
              >
                Today's Final Conclusion
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '8px 0 6px' }}>
              <span
                style={{
                  fontSize: 28,
                  fontWeight: 900,
                  letterSpacing: '-0.5px',
                  color: isProfit ? '#4ade80' : '#fecaca',
                }}
              >
                {isProfit ? '+' : '-'}{fmtCurrency(net)}
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  padding: '2px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                }}
              >
                {isProfit ? 'NET PROFIT 🎉' : 'NET OUTFLOW ⚠️'}
              </span>
            </div>

            <p style={{ margin: 0, fontSize: 12, lineHeight: 1.4, color: 'rgba(255, 255, 255, 0.9)' }}>
              {isProfit
                ? `Well done! Your sales exceeded spending by ${fmtCurrency(net)} today. You have enough surplus to support tomorrow's market float.`
                : `You spent ${fmtCurrency(net)} more than came in today. Most of this went to restocking your shelves, which will convert back into cash.`}
            </p>
          </div>

          {/* Shop Goods Value Footnote */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              padding: '10px 14px',
              borderRadius: 10,
              fontSize: 12,
              color: '#475569',
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontWeight: 600 }}>Total Shop Goods Value:</span>
            <span style={{ fontWeight: 800, color: '#0f172a' }}>₦{totalGoods.toLocaleString('en-NG')}</span>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div
          style={{
            padding: '16px 20px',
            borderTop: '1px solid #f1f5f9',
            backgroundColor: '#ffffff',
            display: 'flex',
            gap: 10,
          }}
        >
          <button
            onClick={handleShareWhatsApp}
            style={{
              flex: 1,
              backgroundColor: '#25D366',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              boxShadow: '0 2px 6px rgba(37, 211, 102, 0.3)',
            }}
          >
            <Share2 size={16} /> Share on WhatsApp
          </button>

          <button
            onClick={handlePrint}
            style={{
              backgroundColor: '#f1f5f9',
              color: '#334155',
              border: 'none',
              borderRadius: 12,
              padding: '12px 14px',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Printer size={16} /> Print
          </button>
        </div>
      </div>
    </div>
  );
}

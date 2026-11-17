import { useState, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Mic,
  PlusCircle,
  Edit3,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PackagePlus,
  AlertCircle,
  Volume2
} from 'lucide-react';
import {
  getTotalGoodsValuation,
  setTotalGoodsValuation,
  adjustTotalGoodsValuation,
} from '../../services/productService';
import { useLanguage } from '../../i18n/LanguageContext';

export default function DailyProfitLossCard({ moneyIn = 0, moneyOut = 0, onNavigate, onOpenInvoice }) {
  const { t } = useLanguage();

  // Total Goods Valuation state
  const [totalGoods, setTotalGoods] = useState(getTotalGoodsValuation());
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [newValuationInput, setNewValuationInput] = useState('');

  // Restock modal state
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockAmount, setRestockAmount] = useState('');
  const [restockItemName, setRestockItemName] = useState('');

  // Voice restock state
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState(null);

  // Sync valuation updates across tabs/events
  useEffect(() => {
    const handleValuationUpdate = (e) => {
      setTotalGoods(e.detail !== undefined ? e.detail : getTotalGoodsValuation());
    };
    window.addEventListener('goodsValuationUpdated', handleValuationUpdate);
    return () => window.removeEventListener('goodsValuationUpdated', handleValuationUpdate);
  }, []);

  // Simple Plain Math: Gain or Loss
  const netDaily = moneyIn - moneyOut;
  const isProfit = netDaily >= 0;

  const fmtCurrency = (n) => `₦${Math.abs(Math.round(n || 0)).toLocaleString('en-NG')}`;

  // Handle manual restock addition
  const handleAddRestockSubmit = (e) => {
    e.preventDefault();
    const amount = Number(restockAmount);
    if (!amount || isNaN(amount) || amount <= 0) return;

    adjustTotalGoodsValuation(amount);
    setShowRestockModal(false);
    setRestockAmount('');
    setRestockItemName('');
    setVoiceNotice(`Added ₦${amount.toLocaleString()} worth of goods to your shop!`);
    setTimeout(() => setVoiceNotice(null), 4000);
  };

  // Handle manual valuation edit
  const handleSetValuationSubmit = (e) => {
    e.preventDefault();
    const val = Number(newValuationInput);
    if (isNaN(val) || val < 0) return;

    setTotalGoodsValuation(val);
    setShowValuationModal(false);
    setNewValuationInput('');
    setVoiceNotice(`Total shop goods value updated to ₦${val.toLocaleString()}`);
    setTimeout(() => setVoiceNotice(null), 4000);
  };

  // Voice Restock using Web Speech API if supported
  const handleVoiceRestock = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: open manual restock modal with focus
      setShowRestockModal(true);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-NG';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      setVoiceNotice('Listening... Speak your restock (e.g. "Restocked 50 thousand naira rice")');

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);

        // Try extracting numbers from transcript
        const numbersMatch = transcript.match(/\d+[\d,]*/);
        let detectedAmount = 0;

        if (numbersMatch) {
          detectedAmount = Number(numbersMatch[0].replace(/,/g, ''));
        } else if (transcript.toLowerCase().includes('thousand') || transcript.toLowerCase().includes('k')) {
          const words = transcript.match(/\d+/);
          if (words) {
            detectedAmount = Number(words[0]) * 1000;
          }
        }

        if (detectedAmount > 0) {
          adjustTotalGoodsValuation(detectedAmount);
          setVoiceNotice(`Heard: "${transcript}" — Added ₦${detectedAmount.toLocaleString()} to shop goods!`);
        } else {
          // Open modal prefilled with transcript
          setRestockItemName(transcript);
          setShowRestockModal(true);
          setVoiceNotice(`Heard: "${transcript}". Please confirm the restock amount.`);
        }
        setTimeout(() => setVoiceNotice(null), 5000);
      };

      recognition.onerror = () => {
        setIsListening(false);
        setVoiceNotice('Could not hear clearly. Opening manual restock...');
        setTimeout(() => {
          setVoiceNotice(null);
          setShowRestockModal(true);
        }, 1200);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      setIsListening(false);
      setShowRestockModal(true);
    }
  };

  return (
    <section style={{ padding: '4px 20px 14px 20px' }}>
      {/* Toast Notice */}
      {voiceNotice && (
        <div
          style={{
            marginBottom: 12,
            padding: '10px 14px',
            backgroundColor: '#064e3b',
            color: '#fff',
            borderRadius: 12,
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 4px 12px rgba(6, 78, 59, 0.25)',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <Sparkles size={16} color="#34d399" />
          <span>{voiceNotice}</span>
        </div>
      )}

      {/* ── CARD 1: SIMPLE DAILY PROFIT / LOSS (PLAIN FORMAT FOR TRADERS) ── */}
      <div
        style={{
          background: isProfit
            ? 'linear-gradient(135deg, #063d23 0%, #032414 100%)'
            : 'linear-gradient(135deg, #451a1a 0%, #290d0d 100%)',
          borderRadius: 24,
          padding: '20px',
          color: '#ffffff',
          boxShadow: isProfit
            ? '0 8px 24px rgba(6, 61, 35, 0.25)'
            : '0 8px 24px rgba(69, 26, 26, 0.25)',
          border: isProfit
            ? '1px solid rgba(52, 211, 153, 0.35)'
            : '1px solid rgba(248, 113, 113, 0.35)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 16,
        }}
      >
        {/* Subtle decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: -40,
            right: -40,
            width: 140,
            height: 140,
            borderRadius: '50%',
            background: isProfit ? 'rgba(52, 211, 153, 0.08)' : 'rgba(248, 113, 113, 0.08)',
            pointerEvents: 'none',
          }}
        />

        {/* Section Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span
              style={{
                display: 'inline-block',
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: isProfit ? '#34d399' : '#f87171',
                boxShadow: isProfit ? '0 0 8px #34d399' : '0 0 8px #f87171',
              }}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1.5,
                color: isProfit ? '#a7f3d0' : '#fca5a5',
              }}
            >
              {t('home_profit_check', "Today's Gain or Loss (Profit Check)")}
            </span>
          </div>

          {onOpenInvoice && (
            <button
              onClick={onOpenInvoice}
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                border: 'none',
                color: '#fff',
                borderRadius: 20,
                padding: '4px 10px',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              View Invoice <ArrowRight size={12} />
            </button>
          )}
        </div>

        {/* Big Profit / Loss Result */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
            <h2
              style={{
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: '-1px',
                margin: 0,
                lineHeight: 1.1,
                color: isProfit ? '#4ade80' : '#fca5a5',
              }}
            >
              {isProfit ? '+' : '-'}{fmtCurrency(netDaily)}
            </h2>
            <span
              style={{
                background: isProfit ? '#14532d' : '#7f1d1d',
                color: isProfit ? '#86efac' : '#fecaca',
                padding: '3px 8px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              {isProfit ? t('home_profit_verdict', 'PROFIT (GAIN) TODAY 🎉') : t('home_loss_verdict', 'OUTFLOW / LOSS TODAY ⚠️')}
            </span>
          </div>

          <p
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: 'rgba(255, 255, 255, 0.85)',
              margin: '6px 0 0',
              lineHeight: 1.4,
            }}
          >
            {isProfit
              ? `You took in ${fmtCurrency(moneyIn)} and spent ${fmtCurrency(moneyOut)}. You keep ${fmtCurrency(netDaily)} in pocket!`
              : `Spending of ${fmtCurrency(moneyOut)} passed your sales of ${fmtCurrency(moneyIn)} today by ${fmtCurrency(Math.abs(netDaily))}.`}
          </p>
        </div>

        {/* 1-2-3 Plain Math Breakdown (Easy for anyone to verify without charts) */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.25)',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr auto 1.2fr',
            alignItems: 'center',
            gap: 6,
            textAlign: 'center',
          }}
        >
          {/* Step 1: Money In */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              1. Money In
            </span>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#4ade80' }}>
              +{fmtCurrency(moneyIn)}
            </div>
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>Sales & Cash</span>
          </div>

          <span style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8' }}>−</span>

          {/* Step 2: Money Out */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
              2. Money Out
            </span>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#f87171' }}>
              -{fmtCurrency(moneyOut)}
            </div>
            <span style={{ fontSize: 10, color: '#cbd5e1' }}>Expenses & Restock</span>
          </div>

          <span style={{ fontSize: 16, fontWeight: 900, color: '#94a3b8' }}>=</span>

          {/* Step 3: Gain or Loss */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: isProfit ? '#86efac' : '#fca5a5', textTransform: 'uppercase' }}>
              3. Result
            </span>
            <div style={{ fontSize: 15, fontWeight: 900, color: isProfit ? '#34d399' : '#f87171' }}>
              {isProfit ? `+${fmtCurrency(netDaily)}` : `-${fmtCurrency(netDaily)}`}
            </div>
            <span style={{ fontSize: 10, fontWeight: 700, color: isProfit ? '#86efac' : '#fca5a5' }}>
              {isProfit ? 'Gain' : 'Loss'}
            </span>
          </div>
        </div>
      </div>

      {/* ── CARD 2: TOTAL GOODS IN SHOP / BUSINESS VALUATION ── */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: '18px 20px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  backgroundColor: '#e6f4ea',
                  color: '#064e3b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ShoppingBag size={16} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#1e293b' }}>
                {t('home_total_goods', 'Total Goods in My Shop')}
              </span>
            </div>
            <p style={{ fontSize: 11, color: '#64748b', margin: '4px 0 0 0', fontWeight: 500 }}>
              Merchandise valuation inside your business
            </p>
          </div>

          {/* Quick Edit Total Goods button */}
          <button
            onClick={() => {
              setNewValuationInput(totalGoods.toString());
              setShowValuationModal(true);
            }}
            aria-label="Edit total shop goods valuation"
            style={{
              background: '#f1f5f9',
              border: 'none',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              color: '#334155',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Edit3 size={12} /> Edit Value
          </button>
        </div>

        {/* Current Total Value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
            ₦{totalGoods.toLocaleString('en-NG')}
          </span>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: '#16a34a',
              background: '#f0fdf4',
              padding: '2px 8px',
              borderRadius: 6,
            }}
          >
            Live Shop Stock
          </span>
        </div>

        {/* Restock Actions Row: Voice Restock & Manual Add */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={handleVoiceRestock}
            disabled={isListening}
            style={{
              flex: 1,
              backgroundColor: isListening ? '#dc2626' : '#064e3b',
              color: '#ffffff',
              border: 'none',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'background 0.2s ease',
            }}
          >
            <Mic size={15} />
            {isListening ? 'Listening...' : 'Speak Restock'}
          </button>

          <button
            onClick={() => setShowRestockModal(true)}
            style={{
              flex: 1,
              backgroundColor: '#f8fafc',
              color: '#064e3b',
              border: '1px solid #cbd5e1',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <PackagePlus size={15} />
            + Add Goods Amount
          </button>
        </div>
      </div>

      {/* ── MODAL 1: ADD RESTOCK GOODS AMOUNT ── */}
      {showRestockModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              maxWidth: 420,
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
              Restock Shop Goods
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>
              Add new inventory value to your shop. This will increase your Total Goods Valuation.
            </p>

            <form onSubmit={handleAddRestockSubmit}>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Goods Added / Item Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 10 bags of rice, cartons of milk"
                  value={restockItemName}
                  onChange={(e) => setRestockItemName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Total Amount of New Goods (₦) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 150000"
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 16,
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Quick Amount Chips */}
              <div style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
                {[20000, 50000, 100000, 250000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setRestockAmount(amt.toString())}
                    style={{
                      background: '#f1f5f9',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      color: '#475569',
                    }}
                  >
                    +₦{(amt / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowRestockModal(false)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#064e3b',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Save Restock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── MODAL 2: SET / EDIT TOTAL GOODS VALUE DIRECTLY ── */}
      {showValuationModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: 20,
              maxWidth: 400,
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <h3 style={{ margin: '0 0 6px', fontSize: 18, fontWeight: 800, color: '#1e293b' }}>
              Set Total Shop Goods Value
            </h3>
            <p style={{ margin: '0 0 16px', fontSize: 12, color: '#64748b' }}>
              Estimate the total monetary value of all products currently inside your store.
            </p>

            <form onSubmit={handleSetValuationSubmit}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 4 }}>
                  Total Goods Value (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 2000000"
                  value={newValuationInput}
                  onChange={(e) => setNewValuationInput(e.target.value)}
                  required
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 16,
                    fontWeight: 700,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowValuationModal(false)}
                  style={{
                    flex: 1,
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#64748b',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#064e3b',
                    border: 'none',
                    borderRadius: 10,
                    padding: '12px',
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#fff',
                    cursor: 'pointer',
                  }}
                >
                  Update Value
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

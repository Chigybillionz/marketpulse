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
  Volume2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  PackageCheck,
  ChevronDown,
  ChevronUp,
  Clock
} from 'lucide-react';
import {
  getTotalGoodsValuation,
  setTotalGoodsValuation,
  adjustTotalGoodsValuation,
  getRestockHistory,
  addRestockRecord,
  INITIAL_PRODUCTS,
} from '../../services/productService';
import { useLanguage } from '../../i18n/LanguageContext';

/**
 * Intelligent helper to extract both monetary amount and item details from spoken transcript
 */
function parseVoiceRestock(transcript) {
  const text = (transcript || '').toLowerCase();

  // 1. Amount parsing (detect "50 thousand", "50k", "1.5 million", or plain numbers)
  let detectedAmount = 0;
  const millionMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:million|m)\b/i);
  const thousandMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:thousand|k)\b/i);
  const rawNumMatch = text.match(/(\d[\d,]*)/);

  if (millionMatch) {
    detectedAmount = Math.round(parseFloat(millionMatch[1]) * 1000000);
  } else if (thousandMatch) {
    detectedAmount = Math.round(parseFloat(thousandMatch[1]) * 1000);
  } else if (rawNumMatch) {
    detectedAmount = Number(rawNumMatch[1].replace(/,/g, ''));
  }

  // 2. Quantity parsing (e.g., "5 bags", "2 cartons", "10 tins")
  const qtyMatch = text.match(/(\d+)\s*(bags?|cartons?|tins?|packs?|kegs?|sachets?|pieces?|units?|crates?|bottles?)/i);
  const detectedQty = qtyMatch ? Number(qtyMatch[1]) : 1;
  let detectedUnit = qtyMatch ? qtyMatch[2] : 'units';

  // 3. Match against current products in shop inventory
  let matchedProduct = null;
  let catalog = [];
  try {
    const raw = localStorage.getItem('stockpile_products');
    if (raw) catalog = JSON.parse(raw);
  } catch (e) {}

  for (const p of (Array.isArray(catalog) ? catalog : [])) {
    if (!p?.name) continue;
    const base = p.name.toLowerCase().split('(')[0].trim();
    if (text.includes(base) || (p.category && text.includes(p.category.toLowerCase()))) {
      matchedProduct = p;
      break;
    }
  }

  let itemName = '';
  if (matchedProduct) {
    itemName = matchedProduct.name;
    if (!qtyMatch && matchedProduct.unit) {
      detectedUnit = matchedProduct.unit;
    }
  } else {
    // Strip restock helper words to leave the clean spoken item name
    let clean = transcript
      .replace(/restock(ed)?/gi, '')
      .replace(/i\s+(bought|added|purchased|got|took)/gi, '')
      .replace(/naira|ngn|\#/gi, '')
      .replace(/thousand|million/gi, '')
      .replace(/\d+[\d,]*/g, '')
      .replace(/(bags?|cartons?|tins?|packs?|kegs?|sachets?|pieces?|units?|crates?|bottles?)/gi, '')
      .replace(/\b(for|of|worth|and|with|to)\b/gi, '')
      .trim();
    itemName = clean ? (clean.charAt(0).toUpperCase() + clean.slice(1)) : 'Restocked Merchandise';
  }

  return { detectedAmount, itemName, detectedQty, detectedUnit, matchedProduct };
}

export default function DailyProfitLossCard({ moneyIn = 0, moneyOut = 0, onNavigate, onOpenInvoice }) {
  const { t } = useLanguage();

  // Card 1 (Daily Profit/Loss): Dedicated Lock (only locks) and Open (only opens)
  const [isCardLocked, setIsCardLocked] = useState(() => {
    return localStorage.getItem('stockpile_daily_profit_locked') === 'true';
  });

  const handleLockCard = (e) => {
    e?.stopPropagation();
    setIsCardLocked(true);
    localStorage.setItem('stockpile_daily_profit_locked', 'true');
  };

  const handleOpenCard = (e) => {
    e?.stopPropagation();
    setIsCardLocked(false);
    localStorage.setItem('stockpile_daily_profit_locked', 'false');
  };

  // Card 2 (Total Goods in My Shop): Dedicated Lock (only locks) and Open (only opens) for amount
  const [isGoodsAmountLocked, setIsGoodsAmountLocked] = useState(() => {
    return localStorage.getItem('stockpile_goods_amount_locked') === 'true';
  });

  const handleLockGoodsAmount = (e) => {
    e?.stopPropagation();
    setIsGoodsAmountLocked(true);
    localStorage.setItem('stockpile_goods_amount_locked', 'true');
  };

  const handleOpenGoodsAmount = (e) => {
    e?.stopPropagation();
    setIsGoodsAmountLocked(false);
    localStorage.setItem('stockpile_goods_amount_locked', 'false');
  };

  // Total Goods Valuation state
  const [totalGoods, setTotalGoods] = useState(getTotalGoodsValuation());
  const [showValuationModal, setShowValuationModal] = useState(false);
  const [newValuationInput, setNewValuationInput] = useState('');

  // Restock modal & history state
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockAmount, setRestockAmount] = useState('');
  const [restockItemName, setRestockItemName] = useState('');
  const [restockHistory, setRestockHistory] = useState(() => getRestockHistory());
  const [showAllRestocks, setShowAllRestocks] = useState(false);

  // Voice restock state
  const [isListening, setIsListening] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState(null);

  // Sync valuation & restock history updates across tabs/events
  useEffect(() => {
    const handleValuationUpdate = (e) => {
      setTotalGoods(e.detail !== undefined ? e.detail : getTotalGoodsValuation());
    };
    const handleRestockHistoryUpdate = (e) => {
      setRestockHistory(e.detail !== undefined ? e.detail : getRestockHistory());
    };

    window.addEventListener('goodsValuationUpdated', handleValuationUpdate);
    window.addEventListener('restockHistoryUpdated', handleRestockHistoryUpdate);

    return () => {
      window.removeEventListener('goodsValuationUpdated', handleValuationUpdate);
      window.removeEventListener('restockHistoryUpdated', handleRestockHistoryUpdate);
    };
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
    const itemName = restockItemName.trim() || 'Restocked Merchandise';
    addRestockRecord({
      name: itemName,
      amount: amount,
      source: 'manual',
    });

    setShowRestockModal(false);
    setRestockAmount('');
    setRestockItemName('');
    setVoiceNotice(`Added ₦${amount.toLocaleString()} of "${itemName}" to shop goods!`);
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

        const { detectedAmount, itemName, detectedQty, detectedUnit } = parseVoiceRestock(transcript);

        if (detectedAmount > 0) {
          adjustTotalGoodsValuation(detectedAmount);
          addRestockRecord({
            name: itemName,
            amount: detectedAmount,
            quantity: detectedQty,
            unit: detectedUnit,
            source: 'voice',
          });
          setVoiceNotice(`🎙️ Heard: "${transcript}" — Logged ${itemName} (+₦${detectedAmount.toLocaleString()})!`);
        } else {
          // Open modal prefilled with transcript
          setRestockItemName(itemName || transcript);
          setShowRestockModal(true);
          setVoiceNotice(`🎙️ Heard: "${transcript}". Please confirm or enter the restock amount.`);
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: isCardLocked ? 0 : 14 }}>
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* ── Eye Close / Padlock Button (Lock only locks, Open only opens) ── */}
            {isCardLocked ? (
              <button
                type="button"
                onClick={handleOpenCard}
                aria-label="Open daily profit card"
                title="Click to open daily profit card"
                style={{
                  background: 'rgba(255, 255, 255, 0.22)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s ease',
                }}
              >
                <Eye size={13} />
                <span>Open Card</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLockCard}
                aria-label="Hide daily profit card"
                title="Click to hide and lock daily profit card"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#fff',
                  borderRadius: 20,
                  padding: '4px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  transition: 'all 0.15s ease',
                }}
              >
                <EyeOff size={13} />
                <span>Hide Card</span>
              </button>
            )}

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
        </div>

        {/* ── CARD CONTENT: FULL CARD PRIVACY LOCK TOGGLE ── */}
        {isCardLocked ? (
          /* LOCKED STATE: Entire card content is closed / hidden */
          <div
            onClick={handleOpenCard}
            role="button"
            tabIndex={0}
            aria-label="Daily profit card is locked. Click to open and reveal details."
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleOpenCard();
              }
            }}
            style={{
              marginTop: 12,
              background: 'rgba(0, 0, 0, 0.28)',
              borderRadius: 16,
              padding: '18px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              cursor: 'pointer',
              border: '1px dashed rgba(255, 255, 255, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'rgba(255, 255, 255, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#a7f3d0',
                  flexShrink: 0,
                }}
              >
                <Lock size={20} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.2px' }}>
                  Daily Profit Figures Locked
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255, 255, 255, 0.75)', marginTop: 2 }}>
                  Entire card is closed for privacy • Tap to open and reveal
                </div>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: 8,
                padding: '6px 12px',
                fontSize: 11,
                fontWeight: 700,
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                flexShrink: 0,
              }}
            >
              <Eye size={13} />
              <span>Open Card</span>
            </div>
          </div>
        ) : (
          /* OPEN STATE: Entire card content is visible */
          <>
            {/* Big Profit / Loss Result */}
            <div style={{ marginBottom: 16, marginTop: 14 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <h2
                  style={{
                    fontSize: 34,
                    fontWeight: 900,
                    letterSpacing: '-1px',
                    margin: 0,
                    lineHeight: 1.1,
                    color: (moneyIn === 0 && moneyOut === 0) ? '#a7f3d0' : isProfit ? '#4ade80' : '#fca5a5',
                  }}
                >
                  {(moneyIn === 0 && moneyOut === 0) ? '₦0' : `${isProfit ? '+' : '-'}${fmtCurrency(netDaily)}`}
                </h2>
                <span
                  style={{
                    background: (moneyIn === 0 && moneyOut === 0) ? '#064e3b' : isProfit ? '#14532d' : '#7f1d1d',
                    color: (moneyIn === 0 && moneyOut === 0) ? '#a7f3d0' : isProfit ? '#86efac' : '#fecaca',
                    padding: '3px 8px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  {(moneyIn === 0 && moneyOut === 0)
                    ? 'READY FOR TODAY 🏁'
                    : isProfit
                    ? t('home_profit_verdict', 'PROFIT (GAIN) TODAY 🎉')
                    : t('home_loss_verdict', 'OUTFLOW / LOSS TODAY ⚠️')}
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
                {(moneyIn === 0 && moneyOut === 0)
                  ? 'No sales or expenses logged yet today. Tap the mic or Speak Restock to start tracking your daily profit!'
                  : isProfit
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
          </>
        )}
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

          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {/* Eye / Padlock for Goods Amount (Lock only locks, Open only opens) */}
            {isGoodsAmountLocked ? (
              <button
                type="button"
                onClick={handleOpenGoodsAmount}
                aria-label="Show goods amount"
                title="Click to open and show goods amount"
                style={{
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#064e3b',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                <Eye size={12} /> Show Amount
              </button>
            ) : (
              <button
                type="button"
                onClick={handleLockGoodsAmount}
                aria-label="Hide goods amount"
                title="Click to lock and hide goods amount"
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  padding: '6px 10px',
                  borderRadius: 8,
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#64748b',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  transition: 'all 0.15s ease',
                }}
              >
                <EyeOff size={12} /> Hide Amount
              </button>
            )}

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
        </div>

        {/* Current Total Value */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 14 }}>
          {isGoodsAmountLocked ? (
            <span
              onClick={handleOpenGoodsAmount}
              title="Click to reveal goods amount"
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: '#64748b',
                letterSpacing: '2px',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              ₦••••••••
            </span>
          ) : (
            <span style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>
              ₦{totalGoods.toLocaleString('en-NG')}
            </span>
          )}
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

        {/* ── RECENTLY RESTOCKED GOODS LOG ── */}
        <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PackageCheck size={15} color="#059669" />
              <span style={{ fontSize: 12, fontWeight: 800, color: '#1e293b' }}>
                Recently Restocked Goods
              </span>
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  background: '#ecfdf5',
                  color: '#064e3b',
                  padding: '2px 7px',
                  borderRadius: 10,
                }}
              >
                {restockHistory.length}
              </span>
            </div>

            {restockHistory.length > 5 && (
              <button
                type="button"
                onClick={() => setShowAllRestocks((prev) => !prev)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#059669',
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  padding: '2px 4px',
                }}
              >
                {showAllRestocks ? (
                  <>Show Less <ChevronUp size={13} /></>
                ) : (
                  <>See More ({restockHistory.length}) <ChevronDown size={13} /></>
                )}
              </button>
            )}
          </div>

          {/* List items */}
          {restockHistory.length === 0 ? (
            <div
              style={{
                padding: '14px',
                background: '#f8fafc',
                borderRadius: 12,
                fontSize: 12,
                color: '#64748b',
                textAlign: 'center',
              }}
            >
              No goods restocked yet today. Tap <strong>Speak Restock</strong> or <strong>+ Add Goods Amount</strong> to record items.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(showAllRestocks ? restockHistory : restockHistory.slice(0, 5)).map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: 10,
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: item.source === 'voice' ? '#ecfdf5' : '#eff6ff',
                        color: item.source === 'voice' ? '#059669' : '#2563eb',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      title={item.source === 'voice' ? 'Voice Restock' : 'Manual Restock'}
                    >
                      {item.source === 'voice' ? <Mic size={13} /> : <PackagePlus size={13} />}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b', lineHeight: 1.2 }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: 10, color: '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>{item.timestamp}</span>
                        {item.quantity && item.quantity > 1 && (
                          <>
                            <span>•</span>
                            <span>{item.quantity} {item.unit || 'units'}</span>
                          </>
                        )}
                        {item.source === 'voice' && (
                          <span
                            style={{
                              background: '#d1fae5',
                              color: '#065f46',
                              fontSize: 9,
                              fontWeight: 700,
                              padding: '1px 5px',
                              borderRadius: 4,
                            }}
                          >
                            Voice 🎙️
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    {isGoodsAmountLocked ? (
                      <span
                        onClick={handleOpenGoodsAmount}
                        title="Click to reveal amounts"
                        style={{
                          fontSize: 12,
                          fontWeight: 800,
                          color: '#64748b',
                          letterSpacing: '1px',
                          cursor: 'pointer',
                        }}
                      >
                        +₦••••
                      </span>
                    ) : (
                      <span style={{ fontSize: 12, fontWeight: 800, color: '#059669' }}>
                        +₦{Number(item.amount || 0).toLocaleString('en-NG')}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bottom "See More" toggle when list > 5 */}
          {restockHistory.length > 5 && !showAllRestocks && (
            <button
              type="button"
              onClick={() => setShowAllRestocks(true)}
              style={{
                width: '100%',
                marginTop: 8,
                padding: '7px 0',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              See More ({restockHistory.length - 5} older restocks) <ChevronDown size={13} />
            </button>
          )}

          {restockHistory.length > 5 && showAllRestocks && (
            <button
              type="button"
              onClick={() => setShowAllRestocks(false)}
              style={{
                width: '100%',
                marginTop: 8,
                padding: '7px 0',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                color: '#334155',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
              }}
            >
              Show Recent 5 Only <ChevronUp size={13} />
            </button>
          )}
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

import React, { useState, useEffect } from 'react';
import {
  PiggyBank,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ChevronRight,
  Wallet,
  Calendar,
  Sparkles,
  ArrowDownLeft,
  X,
  History,
  Info,
} from 'lucide-react';
import AppShell from '../layout/AppShell';
import Header from '../home/Header';
import NavigationBar from '../home/NavigationBar';
import useIsDesktop from '../../hooks/useIsDesktop';
import {
  getTodaySavingsPlan,
  confirmSavingsDecision,
  getSavingsHistory,
  getSavingsStats,
} from '../../services/savingsService';

export default function SavingsPlan({
  onNavigate,
  businessName = 'My Store',
  transactionsList = [],
}) {
  const isDesktop = useIsDesktop();
  const [loading, setLoading] = useState(true);
  const [plan, setPlan] = useState(null);
  const [stats, setStats] = useState({ totalSaved: 0, savedThisWeek: 0, savedThisMonth: 0 });
  const [history, setHistory] = useState([]);
  const [notice, setNotice] = useState(null);

  // Custom amount modal
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadAllSavingsData = async () => {
    setLoading(true);
    try {
      const todayPlan = await getTodaySavingsPlan(transactionsList);
      setPlan(todayPlan);

      const st = await getSavingsStats();
      setStats(st);

      const hist = await getSavingsHistory();
      setHistory(hist);
    } catch (err) {
      console.error('Failed to load savings suggestion data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllSavingsData();
  }, [transactionsList]);

  const fmt = (n) => `₦${Math.abs(Math.round(n || 0)).toLocaleString('en-NG')}`;

  const handleMarkSetAside = async () => {
    if (!plan) return;
    setIsSubmitting(true);
    try {
      await confirmSavingsDecision('SAVE_RECOMMENDED', 0, plan);
      setNotice(`✅ Recorded: You set aside ${fmt(plan.recommendation.recommendedAmount)} into your personal account/safe!`);
      await loadAllSavingsData();
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      alert('Could not update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveCustom = async (e) => {
    e.preventDefault();
    const val = Number(customAmountInput.replace(/[^0-9.]/g, ''));
    if (isNaN(val) || val <= 0) return;

    setIsSubmitting(true);
    try {
      await confirmSavingsDecision('SAVE_CUSTOM', val, plan);
      setShowCustomModal(false);
      setCustomAmountInput('');
      setNotice(`✅ Recorded: You set aside ${fmt(val)} for personal savings today!`);
      await loadAllSavingsData();
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      alert('Could not record custom amount. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeepInBusiness = async () => {
    setIsSubmitting(true);
    try {
      await confirmSavingsDecision('SKIP', 0, plan);
      setNotice('Noted: You chose to keep all cash inside your business today.');
      await loadAllSavingsData();
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      alert('Could not update status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const rec = plan?.recommendation || { status: 'SAVE_TODAY', recommendedAmount: 0, reason: '' };
  const userAction = plan?.userAction || { status: 'PENDING', actualSavedAmount: 0 };
  const financials = plan?.financials || { netProfit: 0, salesRevenue: 0, availableCash: 0 };

  const isMarkedSetAside = userAction.status === 'SAVED' || userAction.status === 'CUSTOM_SAVED';
  const isKeptInShop = userAction.status === 'SKIPPED';

  // Capital retained for shop
  const retainedForShop = Math.max(0, financials.netProfit - (isMarkedSetAside ? userAction.actualSavedAmount : rec.recommendedAmount));

  // Theme styling based on recommendation status
  const getStatusTheme = (status) => {
    if (status === 'DO_NOT_SAVE') {
      return {
        bg: '#fee2e2',
        border: '#fca5a5',
        badgeBg: '#dc2626',
        badgeText: '#ffffff',
        titleColor: '#991b1b',
        accent: '#ef4444',
        label: 'DO NOT SAVE TODAY',
      };
    }
    if (status === 'SAVE_SMALLER') {
      return {
        bg: '#fef3c7',
        border: '#fde68a',
        badgeBg: '#d97706',
        badgeText: '#ffffff',
        titleColor: '#92400e',
        accent: '#f59e0b',
        label: 'SUGGESTION: SAVE SMALLER',
      };
    }
    return {
      bg: '#ecfdf5',
      border: '#a7f3d0',
      badgeBg: '#059669',
      badgeText: '#ffffff',
      titleColor: '#065f46',
      accent: '#10b981',
      label: 'SUGGESTION: SAVE TODAY',
    };
  };

  const theme = getStatusTheme(rec.status);

  return (
    <AppShell
      active="savings"
      onNavigate={onNavigate}
      businessName={businessName}
      title="Daily Savings Suggestion"
      subtitle="Smart daily savings advisory based on today's actual business profit"
    >
      <div style={{ maxWidth: 900, margin: '0 auto', padding: isDesktop ? '20px 24px' : '12px 16px' }}>
        
        {/* Mobile Header */}
        {!isDesktop && (
          <div style={{ marginBottom: 14 }}>
            <Header businessName={businessName} onNavigate={onNavigate} />
          </div>
        )}

        {/* Success Alert Banner */}
        {notice && (
          <div
            style={{
              background: '#064e3b',
              color: '#a7f3d0',
              padding: '12px 16px',
              borderRadius: 14,
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(6, 78, 59, 0.2)',
            }}
          >
            <Sparkles size={18} color="#34d399" />
            <span>{notice}</span>
          </div>
        )}

        {/* ── 1. MAIN HERO RECOMMENDATION / ADVISORY CARD ── */}
        <div
          style={{
            background: isMarkedSetAside
              ? 'linear-gradient(135deg, #064e3b 0%, #032e23 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 24,
            padding: isDesktop ? '28px' : '20px',
            border: isMarkedSetAside ? '1px solid #34d399' : `2px solid ${theme.border}`,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
            marginBottom: 20,
            color: isMarkedSetAside ? '#ffffff' : '#0f172a',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top Tag & Date */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
            <span
              style={{
                backgroundColor: isMarkedSetAside ? '#10b981' : theme.badgeBg,
                color: '#ffffff',
                fontSize: 11,
                fontWeight: 900,
                padding: '4px 12px',
                borderRadius: 999,
                letterSpacing: 1,
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <PiggyBank size={14} />
              {isMarkedSetAside ? 'ADVICE NOTED ✅' : theme.label}
            </span>

            <span style={{ fontSize: 12, fontWeight: 600, color: isMarkedSetAside ? '#a7f3d0' : '#64748b' }}>
              {new Date().toLocaleDateString('en-NG', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>

          {/* Recommended Figure / Confirmed Saved State */}
          <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: isMarkedSetAside ? '#d1fae5' : '#64748b', textTransform: 'uppercase' }}>
              {isMarkedSetAside ? 'Amount You Took Home / Saved Privately' : 'Today\'s Suggested Savings'}
            </span>
            <div
              style={{
                fontSize: isDesktop ? 44 : 36,
                fontWeight: 900,
                letterSpacing: '-1px',
                lineHeight: 1.1,
                marginTop: 4,
                color: isMarkedSetAside ? '#4ade80' : rec.status === 'DO_NOT_SAVE' ? '#dc2626' : '#15803d',
              }}
            >
              {isMarkedSetAside ? fmt(userAction.actualSavedAmount) : fmt(rec.recommendedAmount)}
            </div>
          </div>

          {/* Plain-English Co-Pilot Explanation */}
          <p
            style={{
              fontSize: 13.5,
              fontWeight: 500,
              lineHeight: 1.5,
              color: isMarkedSetAside ? '#e2e8f0' : '#334155',
              margin: '0 0 20px 0',
              maxWidth: 680,
            }}
          >
            {isMarkedSetAside
              ? `You noted taking home ${fmt(userAction.actualSavedAmount)} today to your personal bank/safe. Your shop retains ${fmt(retainedForShop)} for restocking and daily running costs.`
              : isKeptInShop
              ? `You chose to keep all ${fmt(financials.availableCash)} inside your shop drawer today. No money was moved to personal savings.`
              : rec.reason}
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            {isMarkedSetAside ? (
              <button
                type="button"
                onClick={() => setShowCustomModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  color: '#ffffff',
                  padding: '10px 18px',
                  borderRadius: 14,
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Adjust Noted Amount
              </button>
            ) : rec.status !== 'DO_NOT_SAVE' ? (
              <>
                <button
                  type="button"
                  onClick={handleMarkSetAside}
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#15803d',
                    color: '#ffffff',
                    border: 'none',
                    padding: '13px 22px',
                    borderRadius: 14,
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(21, 128, 61, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 8,
                    transition: 'transform 0.1s ease',
                  }}
                >
                  <CheckCircle2 size={18} />
                  <span>I Set Aside {fmt(rec.recommendedAmount)}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowCustomModal(true)}
                  style={{
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '12px 18px',
                    borderRadius: 14,
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  I Set Aside Different Amount
                </button>

                <button
                  type="button"
                  onClick={handleKeepInBusiness}
                  style={{
                    background: 'transparent',
                    color: '#64748b',
                    border: 'none',
                    padding: '12px 14px',
                    fontSize: 12.5,
                    fontWeight: 600,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                >
                  Keep All in Business
                </button>
              </>
            ) : (
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: '#dc2626',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <AlertCircle size={16} />
                  No savings suggested today. Protect your shop capital.
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(true)}
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#334155',
                    border: '1px solid #cbd5e1',
                    padding: '6px 12px',
                    borderRadius: 10,
                    fontSize: 11.5,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Record Custom Savings
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── 2. THREE SUMMARY ADVISORY CARDS ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isDesktop ? '1fr 1fr 1fr' : '1fr 1fr',
            gap: 12,
            marginBottom: 20,
          }}
        >
          {/* Card 1: Today's Suggested Savings */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Suggested To Save
            </span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#15803d', marginTop: 4 }}>
              {fmt(isMarkedSetAside ? userAction.actualSavedAmount : rec.recommendedAmount)}
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, display: 'block' }}>
              From today's realized profit
            </span>
          </div>

          {/* Card 2: Keep in Business */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Keep For Shop Restock
            </span>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0369a1', marginTop: 4 }}>
              {fmt(retainedForShop)}
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, display: 'block' }}>
              Working capital in your shop
            </span>
          </div>

          {/* Card 3: Real Net Profit */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 18,
              padding: '16px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.03)',
              gridColumn: isDesktop ? 'auto' : '1 / -1',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
              Today's Net Profit
            </span>
            <div
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: financials.netProfit >= 0 ? '#15803d' : '#dc2626',
                marginTop: 4,
              }}
            >
              {financials.netProfit >= 0 ? '+' : '-'}{fmt(financials.netProfit)}
            </div>
            <span style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, display: 'block' }}>
              After goods cost & shop bills
            </span>
          </div>
        </div>

        {/* ── 3. TODAY'S FINANCIAL REALITY (SIMPLE 3 METRICS) ── */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 18,
            padding: '16px 20px',
            border: '1px solid #e2e8f0',
            marginBottom: 20,
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 12 }}>
            Today's Financial Reality
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Sales Revenue
              </span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#15803d', marginTop: 2 }}>
                +{fmt(financials.salesRevenue)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Net Profit
              </span>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 800,
                  color: financials.netProfit >= 0 ? '#15803d' : '#dc2626',
                  marginTop: 2,
                }}
              >
                {financials.netProfit >= 0 ? '+' : '-'}{fmt(financials.netProfit)}
              </div>
            </div>

            <div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Cash In Hand
              </span>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#0369a1', marginTop: 2 }}>
                {fmt(financials.availableCash)}
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. DAILY SAVINGS SUGGESTION HISTORY ── */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: '20px',
            border: '1px solid #e2e8f0',
            marginBottom: 20,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <History size={18} color="#15803d" />
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800, color: '#0f172a' }}>
                Savings Suggestion History
              </h3>
            </div>
            <span style={{ fontSize: 11, color: '#64748b' }}>Past daily recommendations</span>
          </div>

          {history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: '#94a3b8', fontSize: 13 }}>
              No previous suggestions logged yet. Track your trades daily to view past advisory history!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {history.map((item, idx) => {
                const itemRec = item.recommendation || {};
                const itemAct = item.userAction || {};
                const itemSnap = item.financialSnapshot || {};
                const savedAmt = itemAct.actualSavedAmount || 0;
                const wasSaved = itemAct.status === 'SAVED' || itemAct.status === 'CUSTOM_SAVED';
                const wasSkipped = itemAct.status === 'SKIPPED';

                return (
                  <div
                    key={item._id || item.dayKey || idx}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 14px',
                      backgroundColor: '#f8fafc',
                      borderRadius: 14,
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#0f172a' }}>
                        {new Date(item.date).toLocaleDateString('en-NG', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </div>
                      <div style={{ fontSize: 11, color: '#64748b', marginTop: 2 }}>
                        Profit: {fmt(itemSnap.netProfit || 0)} • Suggested: {fmt(itemRec.recommendedAmount || 0)}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 800,
                          color: wasSaved ? '#15803d' : '#64748b',
                        }}
                      >
                        {wasSaved ? `Set Aside: ${fmt(savedAmt)}` : wasSkipped ? 'Kept in Shop' : 'Suggested'}
                      </div>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: 6,
                          textTransform: 'uppercase',
                          backgroundColor: wasSaved ? '#dcfce7' : wasSkipped ? '#f1f5f9' : '#fef3c7',
                          color: wasSaved ? '#15803d' : wasSkipped ? '#64748b' : '#b45309',
                          marginTop: 3,
                          display: 'inline-block',
                        }}
                      >
                        {wasSaved ? 'SET ASIDE' : wasSkipped ? 'KEPT IN SHOP' : 'ADVISED'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── 5. PRODUCT CO-PILOT DISCLAIMER ── */}
        <div
          style={{
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            marginBottom: 40,
          }}
        >
          <Info size={18} color="#0369a1" style={{ flexShrink: 0, marginTop: 2 }} />
          <p style={{ margin: 0, fontSize: 12, lineHeight: 1.5, color: '#475569' }}>
            <strong>Stockpile Co-Pilot Notice:</strong> Stockpile is your intelligent shop manager, not a bank. We analyze your actual profit and cash flow to recommend safe daily savings amounts so your business never runs out of capital. Your physical money remains in your own cash drawer or commercial bank account.
          </p>
        </div>
      </div>

      {/* ── CUSTOM AMOUNT MODAL ── */}
      {showCustomModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1200,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 20,
              maxWidth: 400,
              width: '100%',
              padding: 24,
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#0f172a' }}>
                Record Amount Set Aside
              </h3>
              <button
                type="button"
                onClick={() => setShowCustomModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: 12.5, color: '#64748b', margin: '0 0 16px 0' }}>
              How much did you physically set aside for personal savings today?
            </p>

            <form onSubmit={handleSaveCustom}>
              <div style={{ marginBottom: 16 }}>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={customAmountInput}
                  onChange={(e) => setCustomAmountInput(e.target.value)}
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    fontSize: 18,
                    fontWeight: 700,
                    borderRadius: 12,
                    border: '1.5px solid #15803d',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f1f5f9',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 700,
                    cursor: 'pointer',
                    color: '#475569',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !customAmountInput}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#15803d',
                    border: 'none',
                    borderRadius: 12,
                    fontWeight: 800,
                    cursor: 'pointer',
                    color: '#ffffff',
                  }}
                >
                  Record Amount
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      {!isDesktop && (
        <div className="mobile-only-nav" style={{ width: '100%', flexShrink: 0 }}>
          <NavigationBar onNavigate={onNavigate} currentPage="savings" />
        </div>
      )}
    </AppShell>
  );
}

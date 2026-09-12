import { useState, useEffect } from 'react';
import AppShell from './layout/AppShell';
import Header from './home/Header';
import NavigationBar from './home/NavigationBar';
import { getDebtors, logReminder, resolveCredit } from '../services/debtorService';
import { useLanguage } from '../i18n/LanguageContext';

function MessageIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 5h14v11H9l-4 4V5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M8 9h8M8 12h6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg viewBox="0 0 28 18" aria-hidden="true">
      <path d="M2 15 9 8l5 4 9-10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 2h5v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function UserAvatarIcon() {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function formatRemindedTime(lastRemindedAt, t) {
  if (!lastRemindedAt) return null;
  const elapsedMs = Date.now() - new Date(lastRemindedAt).getTime();
  if (elapsedMs < 0) return t("credit_reminded_recent", "Reminded recently");
  const mins = Math.floor(elapsedMs / (1000 * 60));
  if (mins < 1) return t("credit_reminded_just_now", "Reminded just now");
  if (mins < 60) return t("credit_reminded_mins", `Reminded ${mins}m ago`);
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("credit_reminded_hours", `Reminded ${hours}h ago`);
  const days = Math.floor(hours / 24);
  if (days === 1) return t("credit_reminded_yesterday", "Reminded yesterday");
  return t("credit_reminded_days", `Reminded ${days}d ago`);
}

function DebtorCard({ debtor, businessName, email, onNavigate, onRemindSuccess, onResolveClick, onToast, t }) {
  const [reminding, setReminding] = useState(false);
  const isOverdue = debtor.dueDate && new Date(debtor.dueDate) < new Date() && debtor.status !== 'RESOLVED' && debtor.status !== 'PAID_OFF';
  const remindedText = formatRemindedTime(debtor.lastRemindedAt, t);

  const initial = debtor.customerName && debtor.customerName.trim() && debtor.customerName.toLowerCase() !== 'unknown customer'
    ? debtor.customerName.trim().charAt(0).toUpperCase()
    : null;

  const handleRemind = async (e) => {
    e.stopPropagation();
    if (!debtor.phoneNumber) {
      onToast(t("credit_no_phone", "No phone number available for this debtor."));
      return;
    }

    // Client-side quick cooldown check (24 hours)
    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    if (debtor.lastRemindedAt) {
      const elapsed = Date.now() - new Date(debtor.lastRemindedAt).getTime();
      if (elapsed < COOLDOWN_MS) {
        const remainingHours = Math.ceil((COOLDOWN_MS - elapsed) / (1000 * 60 * 60));
        onToast(t("credit_cooldown_toast", `You already reminded ${debtor.customerName} today. You can remind again in ${remainingHours}h.`));
        return;
      }
    }

    let phone = debtor.phoneNumber.trim();
    if (phone.startsWith('0')) {
      phone = '234' + phone.substring(1); // Nigerian default
    } else if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }

    const message = t("credit_remind_msg", "Hello {name}, this is a friendly reminder from {store} regarding your outstanding balance of {amount}. Thank you!", {
      name: debtor.customerName,
      store: businessName || "MarketPulse",
      amount: `₦${debtor.totalOwed.toLocaleString()}`
    });
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    setReminding(true);
    try {
      const effectiveEmail = email || localStorage.getItem('email') || debtor.merchantEmail;
      const res = await logReminder(debtor._id, effectiveEmail, 'whatsapp', message);
      window.open(waLink, '_blank');
      onToast(t("credit_reminder_sent", `Reminder logged for ${debtor.customerName}. Opening WhatsApp...`));
      if (onRemindSuccess) {
        onRemindSuccess(debtor._id, res.lastRemindedAt || new Date().toISOString(), res.reminder);
      }
    } catch (error) {
      if (error.status === 429) {
        onToast(error.message || t("credit_cooldown_toast", `You already reminded ${debtor.customerName} recently.`));
      } else {
        window.open(waLink, '_blank');
        onToast(t("credit_remind_opened_fallback", "Opening WhatsApp..."));
      }
    } finally {
      setReminding(false);
    }
  };

  return (
    <article 
      className="credit-debtor" 
      onClick={() => onNavigate && onNavigate(`credit/${debtor._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="credit-debtor-avatar">
        {initial ? <span>{initial}</span> : <UserAvatarIcon />}
      </div>

      <div className="credit-debtor-main">
        <h3>{debtor.customerName}</h3>
        <p>{debtor.phoneNumber || t("credit_no_phone", "No phone number available for this debtor.")}</p>
        <div>
          <strong className={isOverdue ? "credit-amount-overdue" : ""}>
            ₦{debtor.totalOwed.toLocaleString()}
          </strong>
          <span>{new Date(debtor.dueDate || debtor.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="credit-debtor-actions">
        {isOverdue && <span className="credit-overdue">{t("credit_overdue", "OVERDUE")}</span>}
        {debtor.status === 'PARTIALLY_PAID' && !isOverdue && (
          <span className="credit-partial-badge">{t("credit_partially_paid", "PARTIALLY PAID")}</span>
        )}
        {remindedText && (
          <span className="credit-reminded-badge">
            <ClockIcon /> {remindedText}
          </span>
        )}
        <button 
          type="button" 
          className="credit-remind-btn"
          onClick={handleRemind} 
          disabled={reminding}
        >
          <MessageIcon />{reminding ? t("common_sending", "Sending...") : t("credit_remind", "Remind")}
        </button>
        <button 
          type="button" 
          className="credit-resolve-btn"
          onClick={(e) => {
            e.stopPropagation();
            onResolveClick(debtor);
          }}
        >
          {t("credit_resolve", "Resolve")}
        </button>
      </div>
    </article>
  );
}

function ResolvedDebtorCard({ debtor, onNavigate, t }) {
  const initial = debtor.customerName && debtor.customerName.trim() && debtor.customerName.toLowerCase() !== 'unknown customer'
    ? debtor.customerName.trim().charAt(0).toUpperCase()
    : null;

  const resolvedAmt = debtor.resolvedAmount || debtor.originalAmount || debtor.totalOwed || 0;
  const resolvedDate = new Date(debtor.resolvedAt || debtor.updatedAt).toLocaleDateString();

  return (
    <article 
      className="credit-debtor credit-debtor-resolved" 
      onClick={() => onNavigate && onNavigate(`credit/${debtor._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="credit-debtor-avatar credit-avatar-resolved">
        {initial ? <span>{initial}</span> : <UserAvatarIcon />}
      </div>

      <div className="credit-debtor-main">
        <h3>{debtor.customerName}</h3>
        <p>{debtor.phoneNumber || t("credit_no_phone", "No phone number available for this debtor.")}</p>
        <div className="credit-resolved-meta">
          <span className="credit-resolved-badge-text">
            {t("credit_resolved_prefix", "Resolved")}: <strong>₦{resolvedAmt.toLocaleString()}</strong>
          </span>
          <span className="credit-resolved-date">{resolvedDate}</span>
        </div>
      </div>
    </article>
  );
}

function ResolveModal({ debtor, onClose, onConfirm, isSubmitting, t }) {
  const [amount, setAmount] = useState(debtor?.totalOwed ? String(debtor.totalOwed) : '');
  const [description, setDescription] = useState(
    debtor?.customerName ? `${debtor.customerName} Credit Payment` : 'Credit Repayment'
  );

  if (!debtor) return null;

  const numAmount = Number(amount) || 0;
  const isFullSettlement = numAmount >= debtor.totalOwed;
  const remainingAfterPayment = Math.max(0, debtor.totalOwed - numAmount);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!numAmount || numAmount <= 0) return;
    onConfirm(numAmount, description);
  };

  return (
    <div className="portability-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="resolve-modal-title">
      <div className="credit-resolve-modal">
        <div className="credit-modal-header">
          <div>
            <h2 id="resolve-modal-title">{t("credit_resolve_title", "Resolve Credit")}</h2>
            <p>{t("credit_resolve_subtitle", "Record payment from {name} and move into store income.", { name: debtor.customerName })}</p>
          </div>
          <button 
            type="button" 
            className="credit-modal-close" 
            onClick={onClose}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Outstanding Balance Banner */}
          <div className="credit-balance-banner">
            <span>{t("credit_current_owed", "Current Outstanding Debt")}</span>
            <strong>₦{debtor.totalOwed.toLocaleString()}</strong>
          </div>

          {/* Amount input */}
          <div className="credit-form-group">
            <label htmlFor="resolve-amount">{t("credit_payment_amount", "Payment Amount (₦)")}</label>
            <input
              id="resolve-amount"
              type="number"
              min="1"
              max={debtor.totalOwed}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              required
              autoFocus
            />
            <div className="credit-quick-amounts">
              <button 
                type="button" 
                onClick={() => setAmount(String(debtor.totalOwed))}
                className={numAmount === debtor.totalOwed ? "active" : ""}
              >
                {t("credit_full_amount", "Full Amount (₦{amt})", { amt: debtor.totalOwed.toLocaleString() })}
              </button>
              {debtor.totalOwed > 1000 && (
                <button 
                  type="button" 
                  onClick={() => setAmount(String(Math.floor(debtor.totalOwed / 2)))}
                  className={numAmount === Math.floor(debtor.totalOwed / 2) ? "active" : ""}
                >
                  50% (₦{Math.floor(debtor.totalOwed / 2).toLocaleString()})
                </button>
              )}
            </div>
          </div>

          {/* Description / source note */}
          <div className="credit-form-group">
            <label htmlFor="resolve-description">{t("credit_description_label", "Payment Note / Description")}</label>
            <input
              id="resolve-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Cash payment or transfer"
            />
          </div>

          {/* Dynamic Result Status Preview */}
          <div className={`credit-status-preview ${isFullSettlement ? 'resolved' : 'partial'}`}>
            <span className="status-indicator"></span>
            <div>
              <strong>
                {isFullSettlement 
                  ? t("credit_will_resolve", "Status: RESOLVED (Debt completely cleared)") 
                  : t("credit_will_be_partial", "Status: PARTIALLY_PAID (₦{rem} remaining)", { rem: remainingAfterPayment.toLocaleString() })}
              </strong>
              <p>
                {t("credit_income_notice", "₦{amt} will be automatically added as an Income transaction in your financial records.", { amt: numAmount.toLocaleString() })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="credit-modal-actions">
            <button 
              type="button" 
              className="credit-btn-cancel" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              {t("common_cancel", "Cancel")}
            </button>
            <button 
              type="submit" 
              className="credit-btn-confirm" 
              disabled={isSubmitting || !numAmount || numAmount <= 0}
            >
              {isSubmitting ? t("common_saving", "Recording...") : t("credit_confirm_payment", "Confirm & Record Income")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Credit({ onNavigate, businessName, email }) {
  const { t } = useLanguage();
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [resolvingDebtor, setResolvingDebtor] = useState(null);
  const [isSubmittingResolve, setIsSubmittingResolve] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleRemindSuccess = (debtorId, lastRemindedAt, reminder) => {
    setDebtors(prev => prev.map(d => {
      if (d._id === debtorId) {
        const reminders = d.reminders ? [...d.reminders, reminder] : [reminder];
        return {
          ...d,
          lastRemindedAt,
          reminders
        };
      }
      return d;
    }));
  };

  const fetchDebtors = async () => {
    try {
      const effectiveEmail = email || localStorage.getItem('email');
      const data = await getDebtors(effectiveEmail);
      setDebtors(data || []);
    } catch (error) {
      console.error("Failed to fetch debtors", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebtors();
  }, [email]);

  const handleResolveConfirm = async (amount, description) => {
    if (!resolvingDebtor) return;
    setIsSubmittingResolve(true);
    try {
      const effectiveEmail = email || localStorage.getItem('email') || resolvingDebtor.merchantEmail;
      const res = await resolveCredit(resolvingDebtor._id, amount, description, effectiveEmail);
      
      // Update debtor list state with the returned debtor
      if (res.debtor) {
        setDebtors(prev => prev.map(d => (d._id === res.debtor._id ? res.debtor : d)));
      } else {
        await fetchDebtors();
      }

      // Notify other app components (e.g. Home financial balances)
      window.dispatchEvent(new CustomEvent('financialDataUpdated'));
      window.dispatchEvent(new CustomEvent('transactionsUpdated'));

      showToast(
        res.debtor?.status === 'RESOLVED'
          ? t("credit_resolve_success", `₦${amount.toLocaleString()} recorded as income! Credit for ${resolvingDebtor.customerName} resolved.`)
          : t("credit_partial_success", `₦${amount.toLocaleString()} recorded as income! Remaining balance updated.`)
      );

      setResolvingDebtor(null);
    } catch (error) {
      console.error("Resolve credit failed:", error);
      showToast(error.message || t("credit_resolve_failed", "Failed to resolve credit."));
    } finally {
      setIsSubmittingResolve(false);
    }
  };

  // Separate active debtors from resolved debtors
  const activeDebtors = debtors.filter(d => 
    (d.status === 'ACTIVE' || d.status === 'PARTIALLY_PAID') && d.totalOwed > 0
  );

  const resolvedDebtors = debtors.filter(d => 
    d.status === 'RESOLVED' || d.status === 'PAID_OFF' || d.totalOwed === 0
  );

  const totalMoneyOutside = activeDebtors.reduce((sum, debtor) => sum + debtor.totalOwed, 0);

  return (
    <AppShell
      active="credit"
      onNavigate={onNavigate}
      businessName={businessName}
      title={t("credit_title", "Credit Ledger")}
      subtitle={t("credit_total_owed", "Track money owed to your store")}
    >
      <main className="credit-page">
        <Header businessName={businessName} onNavigate={onNavigate} />
        
        {/* Credit Overview Hero Banner */}
        <section className="credit-overview">
          <span>{t("credit_title", "CREDIT LEDGER").toUpperCase()}</span>
          <h1>{t("credit_total_owed", "Total Outstanding Credit")}:<br />₦{totalMoneyOutside.toLocaleString()}</h1>
          <p><TrendIcon />+0%</p>
        </section>
        
        {/* Active Debtors Section */}
        <div className="credit-section-title">
          <h2>{t("credit_active_debtors", "Active Debtors")} ({activeDebtors.length} items)</h2>
          <span>{activeDebtors.length} (count) items</span>
        </div>
        
        <section className="credit-list">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>{t("common_loading", "Loading debtors...")}</p>
          ) : activeDebtors.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>{t("credit_no_debtors", "No active debtors found.")}</p>
          ) : (
            activeDebtors.map((debtor) => (
              <DebtorCard 
                key={debtor._id} 
                debtor={debtor} 
                businessName={businessName} 
                email={email}
                onNavigate={onNavigate} 
                onRemindSuccess={handleRemindSuccess}
                onResolveClick={(d) => setResolvingDebtor(d)}
                onToast={showToast}
                t={t}
              />
            ))
          )}
        </section>

        {/* Resolved Income Section */}
        <div className="credit-section-title credit-resolved-title">
          <h2>{t("credit_resolved_income", "Resolved Income")} ({resolvedDebtors.length} items)</h2>
        </div>

        <section className="credit-list credit-resolved-list">
          {loading ? null : resolvedDebtors.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>{t("credit_no_resolved", "No resolved credits yet.")}</p>
          ) : (
            resolvedDebtors.map((debtor) => (
              <ResolvedDebtorCard 
                key={debtor._id} 
                debtor={debtor} 
                onNavigate={onNavigate}
                t={t}
              />
            ))
          )}
        </section>

        {/* Resolve Confirmation Modal */}
        {resolvingDebtor && (
          <ResolveModal
            debtor={resolvingDebtor}
            onClose={() => setResolvingDebtor(null)}
            onConfirm={handleResolveConfirm}
            isSubmitting={isSubmittingResolve}
            t={t}
          />
        )}

        {/* Toast Feedback */}
        {toastMessage && (
          <div className="portability-toast" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{toastMessage}</span>
          </div>
        )}
        
        <NavigationBar onNavigate={onNavigate} currentPage="credit" />
      </main>
    </AppShell>
  );
}

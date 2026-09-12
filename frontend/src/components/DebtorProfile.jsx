import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from './layout/AppShell';
import { logRepayment, logReminder } from '../services/debtorService';
import apiClient from '../services/api';
import { ChevronLeft, MessageSquare, Bell, BellOff } from 'lucide-react';

export default function DebtorProfile({ onNavigate, businessName, email }) {
  const { id } = useParams();
  const [debtor, setDebtor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayAmount, setRepayAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reminding, setReminding] = useState(false);
  const [toastNotice, setToastNotice] = useState(null);

  const showToast = (msg) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  const fetchDebtor = async () => {
    try {
      const res = await apiClient(`/debtors/${id}`);
      setDebtor(res);
    } catch (error) {
      console.error("Failed to fetch debtor", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDebtor();
    }
  }, [id]);

  const handleRepay = async (e) => {
    e.preventDefault();
    if (!repayAmount || isNaN(repayAmount) || Number(repayAmount) <= 0) return;
    
    setIsSubmitting(true);
    try {
      const effectiveEmail = email || localStorage.getItem('email') || debtor?.merchantEmail;
      await logRepayment(id, Number(repayAmount), "Credit Repayment", effectiveEmail);
      setShowRepayModal(false);
      setRepayAmount('');
      window.dispatchEvent(new CustomEvent('financialDataUpdated'));
      window.dispatchEvent(new CustomEvent('transactionsUpdated'));
      showToast("Repayment recorded and added to store income!");
      fetchDebtor(); // Refresh data
    } catch (error) {
      console.error("Repayment failed", error);
      showToast("Failed to record repayment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemind = async () => {
    if (!debtor) return;
    if (!debtor.phoneNumber) {
      showToast("No phone number available for this debtor.");
      return;
    }

    // Check client-side cooldown (24 hours)
    const COOLDOWN_MS = 24 * 60 * 60 * 1000;
    if (debtor.lastRemindedAt) {
      const elapsed = Date.now() - new Date(debtor.lastRemindedAt).getTime();
      if (elapsed < COOLDOWN_MS) {
        const remainingHours = Math.ceil((COOLDOWN_MS - elapsed) / (1000 * 60 * 60));
        showToast(`You already reminded ${debtor.customerName} today. Try again in ${remainingHours}h.`);
        return;
      }
    }

    let phone = debtor.phoneNumber.trim();
    if (phone.startsWith('0')) {
      phone = '234' + phone.substring(1);
    } else if (phone.startsWith('+')) {
      phone = phone.substring(1);
    }

    const message = `Hello ${debtor.customerName}, this is a friendly reminder from ${businessName || "MarketPulse"} regarding your outstanding balance of ₦${debtor.totalOwed.toLocaleString()}. Thank you!`;
    const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    setReminding(true);
    try {
      const effectiveEmail = email || localStorage.getItem('email') || debtor.merchantEmail;
      const res = await logReminder(debtor._id, effectiveEmail, 'whatsapp', message);
      window.open(waLink, '_blank');
      showToast(`Reminder logged for ${debtor.customerName}. Opening WhatsApp...`);
      setDebtor(prev => ({
        ...prev,
        lastRemindedAt: res.lastRemindedAt || new Date().toISOString(),
        reminders: prev.reminders ? [res.reminder, ...prev.reminders] : [res.reminder],
      }));
    } catch (error) {
      if (error.status === 429) {
        showToast(error.message || `You already reminded ${debtor.customerName} recently.`);
      } else {
        window.open(waLink, '_blank');
        showToast("Opening WhatsApp...");
      }
    } finally {
      setReminding(false);
    }
  };

  if (loading) {
    return (
      <AppShell active="credit" onNavigate={onNavigate} businessName={businessName} title="Debtor Profile" subtitle="Loading...">
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
      </AppShell>
    );
  }

  if (!debtor) {
    return (
      <AppShell active="credit" onNavigate={onNavigate} businessName={businessName} title="Debtor Not Found" subtitle="Error">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Debtor not found.</p>
          <button onClick={() => onNavigate('credit')} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#16A34A', color: 'white', borderRadius: '8px', border: 'none' }}>Go Back</button>
        </div>
      </AppShell>
    );
  }

  // Sorted reminders (newest first)
  const sortedReminders = debtor.reminders 
    ? [...debtor.reminders].sort((a, b) => new Date(b.sentAt) - new Date(a.sentAt)) 
    : [];

  return (
    <AppShell
      active="credit"
      onNavigate={onNavigate}
      businessName={businessName}
      title={debtor.customerName}
      subtitle={debtor.phoneNumber || 'No phone number'}
    >
      <main className="credit-page" style={{ paddingBottom: '100px' }}>
        <header className="store-profile-topbar" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            type="button"
            onClick={() => onNavigate && onNavigate("credit")}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#111827' }}
          >
            <ChevronLeft size={30} />
          </button>
          <h1 style={{ fontSize: '20px', fontWeight: 'bold' }}>{debtor.customerName}</h1>
        </header>

        <section style={{ padding: '0 20px', marginTop: '20px' }}>
          <div style={{ background: '#111827', color: 'white', borderRadius: '16px', padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Balance</span>
              <span style={{
                fontSize: '11px',
                fontWeight: '800',
                padding: '4px 10px',
                borderRadius: '20px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                background: (debtor.status === 'RESOLVED' || debtor.status === 'PAID_OFF') ? '#059669' : debtor.status === 'PARTIALLY_PAID' ? '#d97706' : '#374151',
                color: '#ffffff'
              }}>
                {debtor.status === 'RESOLVED' || debtor.status === 'PAID_OFF' ? 'RESOLVED' : debtor.status === 'PARTIALLY_PAID' ? 'PARTIALLY PAID' : 'ACTIVE'}
              </span>
            </div>
            <h1 style={{ fontSize: '36px', margin: '8px 0', fontWeight: '900' }}>₦{debtor.totalOwed.toLocaleString()}</h1>
            
            {debtor.lastRemindedAt && (
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '6px 0 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Bell size={13} color="#34D399" />
                <span>Last reminded: {new Date(debtor.lastRemindedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(debtor.lastRemindedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </p>
            )}

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {debtor.totalOwed > 0 ? (
                <button 
                  onClick={() => setShowRepayModal(true)}
                  style={{ flex: 1, background: '#16A34A', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Log Repayment
                </button>
              ) : (
                <button 
                  disabled
                  style={{ flex: 1, background: '#064e3b', color: '#6ee7b7', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'default' }}
                >
                  Debt Settled
                </button>
              )}

              {debtor.totalOwed > 0 && (
                <button
                  onClick={handleRemind}
                  disabled={reminding}
                  style={{
                    flex: 1,
                    background: '#25D366',
                    color: '#073616',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    opacity: reminding ? 0.7 : 1
                  }}
                >
                  <MessageSquare size={18} />
                  {reminding ? 'Sending...' : 'Remind'}
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Transaction History */}
        <div style={{ padding: '24px 20px 8px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>Transaction History</h2>
        </div>

        <section style={{ padding: '0 20px' }}>
          {debtor.transactions && debtor.transactions.map((tx, index) => (
            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #E5E7EB' }}>
              <div>
                <p style={{ fontWeight: '600', color: tx.type === 'REPAYMENT' ? '#16A34A' : '#111827' }}>
                  {tx.type === 'REPAYMENT' ? 'Payment Received' : 'Credit Sale'}
                </p>
                <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
                  {new Date(tx.date).toLocaleDateString()}
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 'bold', color: tx.type === 'REPAYMENT' ? '#16A34A' : '#111827' }}>
                  {tx.type === 'REPAYMENT' ? '-' : '+'}₦{tx.amount.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {(!debtor.transactions || debtor.transactions.length === 0) && (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '20px' }}>No transactions found.</p>
          )}
        </section>

        {/* Reminder History Section */}
        <div style={{ padding: '24px 20px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>Reminder History</h2>
          <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: '600' }}>
            {sortedReminders.length} Sent
          </span>
        </div>

        <section style={{ padding: '0 20px' }}>
          {sortedReminders.length > 0 ? (
            sortedReminders.map((r, index) => (
              <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bell size={18} />
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#111827', fontSize: '14px', margin: 0 }}>
                      WhatsApp Reminder
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                      {new Date(r.sentAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '13px', fontWeight: '700', color: '#059669', background: '#ecfdf5', padding: '4px 8px', borderRadius: '6px' }}>
                    ₦{(r.amountAtTime ?? debtor.totalOwed).toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '24px 16px', color: '#9CA3AF', background: '#F9FAFB', borderRadius: '12px', marginTop: '8px' }}>
              <BellOff size={28} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
              <p style={{ fontSize: '13px', margin: 0 }}>No reminders sent yet.</p>
            </div>
          )}
        </section>

        {showRepayModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ background: 'white', width: '100%', padding: '24px', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '8px' }}>Log Payment</h2>
              <p style={{ color: '#6b7280', marginBottom: '24px', fontSize: '14px' }}>Record a partial or full payment from {debtor.customerName}.</p>
              
              <form onSubmit={handleRepay}>
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>Amount (₦)</label>
                  <input 
                    type="number" 
                    value={repayAmount}
                    onChange={(e) => setRepayAmount(e.target.value)}
                    placeholder="Enter amount"
                    style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #E5E7EB', fontSize: '16px' }}
                    autoFocus
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    type="button" 
                    onClick={() => setShowRepayModal(false)}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#F3F4F6', color: '#374151', border: 'none', fontWeight: 'bold' }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !repayAmount}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', background: '#16A34A', color: 'white', border: 'none', fontWeight: 'bold', opacity: (isSubmitting || !repayAmount) ? 0.5 : 1 }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save Payment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Feedback */}
        {toastNotice && (
          <div className="portability-toast" role="status" aria-live="polite">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{toastNotice}</span>
          </div>
        )}
      </main>
    </AppShell>
  );
}

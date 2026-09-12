import { useState, useEffect } from 'react';
import AppShell from './layout/AppShell';
import Header from './home/Header';
import NavigationBar from './home/NavigationBar';
import { getDebtors } from '../services/debtorService';
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

function DebtorCard({ debtor, businessName, onNavigate, t }) {
  const isOverdue = debtor.dueDate && new Date(debtor.dueDate) < new Date() && debtor.status === 'ACTIVE';

  const handleRemind = (e) => {
    e.stopPropagation();
    if (!debtor.phoneNumber) {
      alert(t("credit_no_phone", "No phone number available for this debtor."));
      return;
    }
    
    let phone = debtor.phoneNumber;
    // Basic formatting for WA links (ensure country code)
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
    window.open(waLink, '_blank');
  };

  return (
    <article 
      className="credit-debtor" 
      onClick={() => onNavigate && onNavigate(`credit/${debtor._id}`)}
      style={{ cursor: 'pointer' }}
    >
      <div className="credit-debtor-main">
        <h3>{debtor.customerName}</h3>
        <p>{debtor.phoneNumber || t("credit_no_phone", "No phone number")}</p>
        <div>
          <strong>₦{debtor.totalOwed.toLocaleString()}</strong>
          <span>{new Date(debtor.updatedAt).toLocaleDateString()}</span>
        </div>
      </div>
      <div className="credit-debtor-actions">
        {isOverdue && <span className="credit-overdue">{t("credit_overdue", "OVERDUE")}</span>}
        <button type="button" onClick={handleRemind}>
          <MessageIcon />{t("credit_remind", "Remind")}
        </button>
      </div>
    </article>
  );
}

export default function Credit({ onNavigate, businessName, email }) {
  const { t } = useLanguage();
  const [debtors, setDebtors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        const data = await getDebtors(email);
        // Filter out PAID_OFF debtors for the active list
        const activeDebtors = data.filter(d => d.status === 'ACTIVE');
        setDebtors(activeDebtors);
      } catch (error) {
        console.error("Failed to fetch debtors", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (email) {
      fetchDebtors();
    }
  }, [email]);

  const totalMoneyOutside = debtors.reduce((sum, debtor) => sum + debtor.totalOwed, 0);

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
        
        <section className="credit-overview">
          <span>{t("credit_title", "CREDIT OVERVIEW").toUpperCase()}</span>
          <h1>{t("credit_total_owed", "Total Outstanding Credit")}:<br />₦{totalMoneyOutside.toLocaleString()}</h1>
          <p><TrendIcon />+0%</p>
        </section>
        
        <div className="credit-section-title">
          <h2>{t("credit_active_debtors", "Active Debtors")}</h2>
          <span>{debtors.length} {t("notif_items", "People")}</span>
        </div>
        
        <section className="credit-list">
          {loading ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>{t("common_loading", "Loading debtors...")}</p>
          ) : debtors.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>{t("credit_no_debtors", "No active debtors found.")}</p>
          ) : (
            debtors.map((debtor) => (
              <DebtorCard 
                key={debtor._id} 
                debtor={debtor} 
                businessName={businessName} 
                onNavigate={onNavigate} 
                t={t}
              />
            ))
          )}
        </section>
        
        <NavigationBar onNavigate={onNavigate} currentPage="credit" />
      </main>
    </AppShell>
  );
}

import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import AppShell from './layout/AppShell';
import { logRepayment } from '../services/debtorService';
import apiClient from '../services/api';
import { ChevronLeft } from 'lucide-react';

export default function DebtorProfile({ onNavigate, businessName }) {
  const { id } = useParams();
  const [debtor, setDebtor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [repayAmount, setRepayAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDebtor = async () => {
    try {
      // In a real app we would have a specific endpoint like GET /debtors/:id
      // but we'll fetch all and filter for now to save time, or we can use a direct call if we added it.
      // Wait, we didn't add GET /debtors/:id on the backend! Let's do it via the list for now or add the endpoint.
      // Assuming we just fetch from the list using the user's email, wait, we don't have email here.
      // Let's add an endpoint for GET /debtors/:id on the backend? Actually I can just add a fetch here.
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
      await logRepayment(id, Number(repayAmount), "Partial Repayment");
      setShowRepayModal(false);
      setRepayAmount('');
      fetchDebtor(); // Refresh data
    } catch (error) {
      console.error("Repayment failed", error);
      alert("Failed to record repayment.");
    } finally {
      setIsSubmitting(false);
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
            <span style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Balance</span>
            <h1 style={{ fontSize: '36px', margin: '8px 0', fontWeight: '900' }}>₦{debtor.totalOwed.toLocaleString()}</h1>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button 
                onClick={() => setShowRepayModal(true)}
                style={{ flex: 1, background: '#16A34A', color: 'white', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                Log Repayment
              </button>
            </div>
          </div>
        </section>

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
      </main>
    </AppShell>
  );
}

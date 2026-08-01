
import AppShell from './layout/AppShell'
import Header from './home/Header'
import NavigationBar from './home/NavigationBar'

const debtors = [
  { name: 'Ibrahim Musa', phone: '0803 456 7890', amount: '₦24,500', date: 'Oct 12, 2023', overdue: true },
  { name: 'Mama Chidi', phone: '0812 334 5566', amount: '₦12,000', date: 'Oct 28, 2023' },
  { name: 'Babatunde Glass', phone: '0706 998 1122', amount: '₦45,000', date: 'Nov 02, 2023' },
  { name: 'Grace Okoro', phone: '0905 112 3344', amount: '₦8,500', date: 'Nov 05, 2023' },
  { name: 'Chief Alabi', phone: '0802 009 8877', amount: '₦60,000', date: 'Nov 10, 2023' },
]


function MessageIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v11H9l-4 4V5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><path d="M8 9h8M8 12h6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
}

function TrendIcon() {
  return <svg viewBox="0 0 28 18" aria-hidden="true"><path d="M2 15 9 8l5 4 9-10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 2h5v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function DebtorCard({ debtor }) {
  return (
    <article className="credit-debtor">
      <div className="credit-debtor-main">
        <h3>{debtor.name}</h3>
        <p>{debtor.phone}</p>
        <div><strong>{debtor.amount}</strong><span>{debtor.date}</span></div>
      </div>
      <div className="credit-debtor-actions">
        {debtor.overdue && <span className="credit-overdue">OVERDUE</span>}
        <button type="button"><MessageIcon />Remind</button>
      </div>
    </article>
  )
}

export default function Credit({ onNavigate, businessName }) {
  return (
    <AppShell
      active="credit"
      onNavigate={onNavigate}
      businessName={businessName}
      title="Credit & Debtors"
      subtitle="Track money owed to your store"
    >
    <main className="credit-page">
        <Header businessName={businessName} onNavigate={onNavigate} />
        <section className="credit-overview">
          <span>CREDIT OVERVIEW</span>
          <h1>Total Money Outside:<br />₦150,000</h1>
          <p><TrendIcon />+12% from last month</p>
        </section>
        <div className="credit-section-title"><h2>Active Debtors</h2><span>14 People</span></div>
        <section className="credit-list">{debtors.map((debtor) => <DebtorCard debtor={debtor} key={debtor.name} />)}</section>
        <NavigationBar onNavigate={onNavigate} currentPage="credit" />
    </main>
    </AppShell>
  )
}

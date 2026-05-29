const debtors = [
  { name: 'Ibrahim Musa', phone: '0803 456 7890', amount: '₦24,500', date: 'Oct 12, 2023', overdue: true },
  { name: 'Mama Chidi', phone: '0812 334 5566', amount: '₦12,000', date: 'Oct 28, 2023' },
  { name: 'Babatunde Glass', phone: '0706 998 1122', amount: '₦45,000', date: 'Nov 02, 2023' },
  { name: 'Grace Okoro', phone: '0905 112 3344', amount: '₦8,500', date: 'Nov 05, 2023' },
  { name: 'Chief Alabi', phone: '0802 009 8877', amount: '₦60,000', date: 'Nov 10, 2023' },
]

function StoreIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 13h20l-2.2-6.5H8.2L6 13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /><path d="M8 13v12h16V13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /><path d="M11 25v-7h10v7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /><path d="M5 13h22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" /></svg>
}

function UserIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.3" /><circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.3" /><path d="M8.8 25c1.6-4 4-6 7.2-6s5.6 2 7.2 6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" /></svg>
}

function MessageIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v11H9l-4 4V5Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round" /><path d="M8 9h8M8 12h6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
}

function TrendIcon() {
  return <svg viewBox="0 0 28 18" aria-hidden="true"><path d="M2 15 9 8l5 4 9-10" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M18 2h5v5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

function NavIcon({ name }) {
  const paths = {
    home: <path d="M5 12.4 14 5l9 7.4V24h-6v-7h-6v7H5V12.4Z" />,
    pulse: <><rect x="11" y="5" width="6" height="13" rx="3" /><path d="M6 14c0 4.5 3.4 8 8 8s8-3.5 8-8M14 22v4" /></>,
    history: <><path d="M7.5 8.2A9 9 0 1 1 6 15" /><path d="M4 8.2h3.5V4.7" /><path d="M14 9v6l4 2" /></>,
    credit: <><rect x="4" y="8" width="20" height="13" rx="1.5" /><circle cx="14" cy="14.5" r="3.2" /></>,
  }
  return <svg viewBox="0 0 28 28" aria-hidden="true">{paths[name]}</svg>
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

export default function Credit() {
  return (
    <main className="credit-page">
      <section className="credit-phone">
        <header className="credit-header">
          <div className="credit-brand"><span><StoreIcon /></span><strong>Mama Ngozi<br />Provisions</strong></div>
          <button className="credit-user" type="button" aria-label="Profile"><UserIcon /></button>
        </header>
        <section className="credit-overview">
          <span>CREDIT OVERVIEW</span>
          <h1>Total Money Outside:<br />₦150,000</h1>
          <p><TrendIcon />+12% from last month</p>
        </section>
        <div className="credit-section-title"><h2>Active Debtors</h2><span>14 People</span></div>
        <section className="credit-list">{debtors.map((debtor) => <DebtorCard debtor={debtor} key={debtor.name} />)}</section>
        <nav className="mp-bottom-nav credit-active">
          {['home', 'pulse', 'history', 'credit'].map((item) => <a className={item === 'credit' ? 'active' : ''} href={`#${item}`} key={item}><span className="nav-icon"><NavIcon name={item} /></span><span>{item[0].toUpperCase() + item.slice(1)}</span></a>)}
        </nav>
      </section>
    </main>
  )
}

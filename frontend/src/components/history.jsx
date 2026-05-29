const transactions = [
  { type: 'credit', icon: 'bag', title: 'Bulk Flour Sale', meta: '10:24 AM • Invoice #882', amount: '+ ₦45,000' },
  { type: 'debit', icon: 'truck', title: 'Logistics Fee', meta: '09:15 AM • GIG Motors', amount: '- ₦12,400' },
  { type: 'credit', icon: 'receipt', title: 'Retail Groceries', meta: '08:45 AM • POS Terminal 1', amount: '+ ₦8,200' },
]

const yesterday = [
  { type: 'debit', icon: 'box', title: 'Wholesale Stock', meta: 'Yesterday • Dangote Ltd', amount: '- ₦210,000' },
  { type: 'debit', icon: 'bolt', title: 'Electricity Bill', meta: 'Yesterday • EKEDP', amount: '- ₦15,000' },
]

function StoreIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M6 13h20l-2.2-6.5H8.2L6 13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /><path d="M8 13v12h16V13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /><path d="M11 25v-7h10v7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" /><path d="M5 13h22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" /></svg>
}

function UserIcon() {
  return <svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.3" /><circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.3" /><path d="M8.8 25c1.6-4 4-6 7.2-6s5.6 2 7.2 6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" /></svg>
}

function ItemIcon({ icon }) {
  const paths = {
    bag: <><path d="M10 13h12v10H10V13Z" /><path d="M13 13v-2a3 3 0 0 1 6 0v2" /></>,
    truck: <><path d="M6 11h12v8H6z" /><path d="M18 14h4l2 3v2h-6z" /><circle cx="10" cy="21" r="1.5" /><circle cx="20" cy="21" r="1.5" /></>,
    receipt: <><path d="M9 6h12v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L9 24V6Z" /><path d="M12 11h6M12 15h6M12 19h4" /></>,
    box: <><path d="M8 10h16v13H8z" /><path d="M8 10l2-4h12l2 4M12 15h8" /></>,
    bolt: <path d="M16 4 8 17h7l-3 9 9-14h-7l2-8Z" />,
  }
  return <svg viewBox="0 0 32 32" aria-hidden="true">{paths[icon]}</svg>
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

function TransactionCard({ item }) {
  return (
    <button className="history-card" type="button">
      <span className={`history-icon ${item.type}`}><ItemIcon icon={item.icon} /></span>
      <span className="history-details"><strong>{item.title}</strong><small>{item.meta}</small></span>
      <span className={`history-money ${item.type}`}><strong>{item.amount}</strong><em>{item.type.toUpperCase()}</em></span>
    </button>
  )
}

export default function History() {
  return (
    <main className="history-page">
      <section className="history-phone">
        <header className="history-header">
          <div className="history-brand"><span><StoreIcon /></span><strong>Mama Ngozi<br />Provisions</strong></div>
          <button className="history-user" type="button" aria-label="Profile"><UserIcon /></button>
        </header>
        <div className="history-tabs"><button className="active">Today</button><button>Yesterday</button><button>This Week</button></div>
        <section className="history-balance"><span>NET BALANCE TODAY</span><strong>₦142,500.00</strong></section>
        <section className="history-list">{transactions.map((item) => <TransactionCard item={item} key={item.title} />)}</section>
        <div className="history-divider"><span>YESTERDAY</span></div>
        <section className="history-list yesterday">{yesterday.map((item) => <TransactionCard item={item} key={item.title} />)}</section>
        <nav className="mp-bottom-nav history-active">
          {['home', 'pulse', 'history', 'credit'].map((item) => <a className={item === 'history' ? 'active' : ''} href={`#${item}`} key={item}><span className="nav-icon"><NavIcon name={item} /></span><span>{item[0].toUpperCase() + item.slice(1)}</span></a>)}
        </nav>
      </section>
    </main>
  )
}

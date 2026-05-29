const sections = [
  {
    title: 'Business Details',
    items: [
      { icon: 'store', label: 'Store Profile', sub: 'Mama Ngozi Provisions', target: 'storeProfile' },
      { icon: 'category', label: 'Market Category', sub: 'Wholesale Dry Goods', target: 'market_category' },
      { icon: 'bell', label: 'Inventory Alerts', sub: 'Enabled at 10% stock', target: 'inventoryAlert' },
    ],
  },
  {
    title: 'Account Settings',
    items: [
      { icon: 'phone', label: 'Phone Number', sub: '+234 803 123 4567' },
      { icon: 'language', label: 'Language', sub: 'English / Pidgin' },
    ],
  },
  {
    title: 'Security',
    items: [
      { icon: 'lock', label: 'Change Trade PIN' },
      { icon: 'fingerprint', label: 'Biometric Login', toggle: true },
    ],
  },
  {
    title: 'Help & Support',
    items: [
      { icon: 'support', label: 'Contact Support' },
      { icon: 'faq', label: 'FAQs' },
    ],
  },
]

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a8 8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 5h-6l-.4 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 3h6l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" /></>,
    pencil: <path d="m5 18.5 3.5-.8L19 7.2 16.8 5 6.3 15.5 5 18.5Z" />,
    location: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    trend: <path d="M4 17 10 11l4 4 7-8M16 7h5v5" />,
    box: <><path d="M5 7h14v14H5z" /><path d="M5 11h14M9 7V5h6v2" /></>,
    store: <><path d="M4 10h16L18 5H6l-2 5Z" /><path d="M6 10v10h12V10M9 20v-6h6v6" /></>,
    category: <><path d="m12 5 4 7H8l4-7ZM5 16h6v6H5zM15 16h6v6h-6z" /></>,
    bell: <><path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4L6 17Z" /><path d="M10 20h4" /></>,
    phone: <path d="M8 5h3l1 4-2 1c1 2 2.5 3.5 5 5l1-2 4 1v3c0 1-1 2-2 2A13 13 0 0 1 6 7c0-1 1-2 2-2Z" />,
    language: <><path d="M4 6h9M8.5 4v2M6 18l5-12M4 18h9M16 20l4-10 4 10M17.5 16h5" /></>,
    lock: <><rect x="6" y="10" width="12" height="10" rx="1.5" /><path d="M9 10V7a3 3 0 0 1 6 0v3" /></>,
    fingerprint: <><path d="M7 13a5 5 0 0 1 10 0M5 16a7 7 0 0 1 14 0M9 20c1-2 1-4 1-7a2 2 0 0 1 4 0c0 5-.7 7-2 9M14 20c1.6-1.7 2-4 2-7" /></>,
    support: <><path d="M5 15v-3a7 7 0 0 1 14 0v3" /><path d="M5 15h4v5H7a2 2 0 0 1-2-2v-3ZM19 15h-4v5h2a2 2 0 0 0 2-2v-3Z" /></>,
    faq: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.8 2.8 0 0 1 5.1 1.6c0 2-2.6 2.2-2.6 4M12 18h.01" /></>,
    chevron: <path d="m9 5 7 7-7 7" />,
    logout: <><path d="M10 6H6v12h4M13 9l3 3-3 3M16 12H8" /></>,
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>
}

function SettingItem({ item, onClick }) {
  return (
    <button className="profile-setting-item" type="button" onClick={onClick}>
      <span className="profile-setting-icon"><Icon name={item.icon} /></span>
      <span className="profile-setting-copy">
        <strong>{item.label}</strong>
        {item.sub && <small>{item.sub}</small>}
      </span>
      {item.toggle ? <span className="profile-toggle" aria-hidden="true"><span /></span> : <span className="profile-chevron"><Icon name="chevron" /></span>}
    </button>
  )
}

export default function Profile({ onNavigate }) {
  return (
    <main className="profile-page">
      <section className="profile-phone">
        <header className="profile-nav">
          <button type="button" aria-label="Go back" onClick={() => onNavigate && onNavigate('home')}><Icon name="back" /></button>
          <h1>Profile &amp; Settings</h1>
          <button type="button" aria-label="Settings"><Icon name="gear" /></button>
        </header>

        <section className="profile-hero">
          <div className="profile-avatar">
            <span>MN</span>
            <button type="button" aria-label="Edit profile photo"><Icon name="pencil" /></button>
          </div>
          <h2>Mama Ngozi</h2>
          <p>Mama Ngozi Provisions</p>
          <div className="profile-location"><Icon name="location" />Onyingbo Market, Lagos</div>
        </section>

        <section className="profile-insights" aria-label="Quick insights">
          <article><Icon name="trend" /><span>MONTH GROWTH</span><strong className="success">+12.4%</strong></article>
          <article><Icon name="box" /><span>ALERTS</span><strong className="alert">3 Items Low</strong></article>
        </section>

        {sections.map((section) => (
          <section className="profile-section" key={section.title}>
            <h3>{section.title}</h3>
            <div className="profile-settings-card">
              {section.items.map((item) => (
                <SettingItem 
                  item={item} 
                  key={item.label} 
                  onClick={() => {
                    if (item.target && onNavigate) {
                      onNavigate(item.target);
                    }
                  }} 
                />
              ))}
            </div>
          </section>
        ))}

        <button className="profile-logout" type="button">
          <Icon name="logout" />
          Logout
        </button>

        <p className="profile-version">Version 2.4.0 • Built for Nigerian Markets</p>
      </section>
    </main>
  )
}

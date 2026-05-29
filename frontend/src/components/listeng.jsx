function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 13h20l-2.2-6.5H8.2L6 13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M8 13v12h16V13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M11 25v-7h10v7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M5 13h22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <circle cx="16" cy="16" r="13" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <circle cx="16" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="2.3" />
      <path d="M8.8 25c1.6-4 4-6 7.2-6s5.6 2 7.2 6" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  )
}

function MicrophoneIcon() {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect x="24" y="10" width="16" height="31" rx="8" fill="currentColor" />
      <path d="M16 31c0 9 6.7 16 16 16s16-7 16-16" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <path d="M32 47v9" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="8" y="8" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="2.7" />
    </svg>
  )
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 12.4 14 5l9 7.4V24h-6v-7h-6v7H5V12.4Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
    </svg>
  )
}

function HistoryIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <path d="M7.5 8.2A9 9 0 1 1 6 15" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M4 8.2h3.5V4.7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 9v6l4 2" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function CreditIcon() {
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true">
      <rect x="4" y="8" width="20" height="13" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.4" />
      <circle cx="14" cy="14.5" r="3.2" fill="none" stroke="currentColor" strokeWidth="2.1" />
      <path d="M4 12h3M21 17h3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

export default function Listeng() {
  return (
    <main className="listening-page" aria-label="MarketPulse AI voice listening screen">
      <section className="listening-phone">
        <header className="listening-header">
          <div className="listening-brand" aria-label="Mama Ngozi Provisions">
            <span className="listening-store-icon">
              <StoreIcon />
            </span>
            <span>Mama Ngozi<br />Provisions</span>
          </div>

          <button className="listening-user" type="button" aria-label="Open profile">
            <UserIcon />
          </button>
        </header>

        <section className="listening-main" aria-labelledby="listening-title">
          <button className="listening-mic" type="button" aria-label="Recording active">
            <MicrophoneIcon />
          </button>

          <h1 id="listening-title">Listening...</h1>
          <p>Go ahead, tell me about your trade (e.g., "Sold 2 bags of garri for 15k")</p>

          <div className="listening-actions">
            <button type="button" className="listening-stop">
              <StopIcon />
              <span>Stop &amp; Analyze</span>
            </button>
            <button type="button" className="listening-cancel">
              Cancel
            </button>
          </div>
        </section>

        <nav className="listening-bottom-nav" aria-label="Primary navigation">
          <a href="#home" aria-label="Home">
            <HomeIcon />
            <span>Home</span>
          </a>
          <a href="#pulse" className="active" aria-current="page" aria-label="Pulse">
            <span className="active-icon">
              <MicrophoneIcon />
            </span>
            <span>Pulse</span>
          </a>
          <a href="#history" aria-label="History">
            <HistoryIcon />
            <span>History</span>
          </a>
          <a href="#credit" aria-label="Credit">
            <CreditIcon />
            <span>Credit</span>
          </a>
        </nav>
      </section>
    </main>
  )
}

import { useState } from "react";

const DATA_POINTS = [
  {
    id: "voice",
    title: "Voice Recordings",
    body: "Used strictly for real-time market command analysis and sentiment detection.",
    icon: "mic",
  },
  {
    id: "location",
    title: "Location",
    body: "To optimize server latency and provide region-specific market news and alerts.",
    icon: "pin",
  },
  {
    id: "phone",
    title: "Phone Number",
    body: "Required for secure 2FA and direct SMS alerts for critical trade executions.",
    icon: "phone",
  },
];

const USAGE_POINTS = [
  {
    id: "ai",
    title: "AI Analysis",
    body: "Your voice prompts are converted to text and processed locally where possible to ensure your strategies remain yours alone.",
  },
  {
    id: "security",
    title: "Institutional Security",
    body: "We employ 256-bit AES encryption for all data at rest and TLS 1.3 for all data in transit, mirroring the standards of global financial institutions.",
  },
  {
    id: "fraud",
    title: "Fraud Prevention",
    body: "Real-time location data helps us identify unauthorized login attempts from unfamiliar geographic regions.",
  },
];

const RIGHTS = [
  {
    id: "portability",
    title: "Data Portability",
    body: "Request a copy of all your trade history and profile data at any time.",
    icon: "download",
    tone: "neutral",
    target: "data_portability",
  },
  {
    id: "erasure",
    title: "Right to Erasure",
    body: "Request permanent deletion of your account and all associated voice data.",
    icon: "trash",
    tone: "danger",
    target: "delete_data",
  },
];

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    shield: <path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" />,
    mic: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    phone: (
      <path d="M8 5h3l1 4-2 1c1 2 2.5 3.5 5 5l1-2 4 1v3c0 1-1 2-2 2A13 13 0 0 1 6 7c0-1 1-2 2-2Z" />
    ),
    usage: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l2.5 2.5" />
      </>
    ),
    check: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </>
    ),
    rights: <path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3ZM9.5 12l1.8 1.8 3.5-3.8" />,
    download: <path d="M12 4v10m0 0-4-4m4 4 4-4M5 19h14" />,
    trash: (
      <>
        <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    mail: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="m4 8 8 5 8-5" />
      </>
    ),
    checkmark: <path d="m5 12 5 5 9-11" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function PrivacyPolicy({ onNavigate, onClose, onBack }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const isLoggedIn = !!localStorage.getItem('token');

  // Works as a routed page (back -> real history) and as a modal (back -> onClose).
  const dismiss = () => {
    if (onClose) onClose();
    else if (onBack) onBack();
    else if (onNavigate) onNavigate("profile");
  };

  const handleAccept = () => {
    setIsAccepted(true);
    setTimeout(() => {
      dismiss();
    }, 600); // Wait for animation
  };

  return (
    <main className="privacy-page" aria-label="Privacy policy">
      <section className="privacy-shell">
        <header className="privacy-topbar">
          <button
            className="privacy-back"
            type="button"
            aria-label="Go back"
            onClick={dismiss}
          >
            <Icon name="back" />
          </button>
          <h1>Privacy Policy</h1>
          <span className="privacy-topbar-spacer" aria-hidden="true" />
        </header>

        <div className="privacy-scroll">
          <section className="privacy-intro">
            <span className="privacy-shield">
              <Icon name="shield" />
            </span>
            <h2>Your Privacy Matters</h2>
            <p className="privacy-updated">Last Updated: October 24, 2023</p>
          </section>

          <section className="privacy-card" aria-label="What data we collect">
            <h3 className="privacy-card-title">
              <Icon name="usage" />
              What Data We Collect
            </h3>
            <div className="privacy-datalist">
              {DATA_POINTS.map((point) => (
                <article className="privacy-data" key={point.id}>
                  <span className="privacy-data-icon">
                    <Icon name={point.icon} />
                  </span>
                  <div>
                    <strong>{point.title}</strong>
                    <p>{point.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="privacy-block" aria-label="How we use your data">
            <h3 className="privacy-heading">
              <Icon name="usage" />
              How We Use Your Data
            </h3>
            <p className="privacy-lead">
              MarketPulse AI leverages your information to create a bespoke
              trading environment. Our proprietary AI models analyze
              high-frequency data to provide you with a competitive edge in the
              Nigerian markets.
            </p>

            <ul className="privacy-usage">
              {USAGE_POINTS.map((point) => (
                <li key={point.id}>
                  <span className="privacy-usage-icon">
                    <Icon name="check" />
                  </span>
                  <p>
                    <strong>{point.title}:</strong> {point.body}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="privacy-compliance">
            <h3>Compliance Guaranteed</h3>
            <p>
              We strictly adhere to the Nigeria Data Protection Act (NDPA) and
              global GDPR standards for maximum transparency.
            </p>
          </section>

          <section className="privacy-block" aria-label="Your rights and control">
            <h3 className="privacy-heading">
              <Icon name="rights" />
              Your Rights &amp; Control
            </h3>
            <div className="privacy-rights">
              {RIGHTS.map((right) => (
                <button
                  className={`privacy-right ${right.tone}`}
                  type="button"
                  key={right.id}
                  onClick={() => {
                    if (!isLoggedIn) {
                      // User not logged in - navigate to login
                      if (onNavigate) onNavigate('login');
                    } else {
                      // User logged in - navigate to the feature
                      if (right.target && onNavigate) onNavigate(right.target);
                    }
                  }}
                >
                  <span className="privacy-right-icon">
                    <Icon name={right.icon} />
                  </span>
                  <span className="privacy-right-copy">
                    <strong>{right.title}</strong>
                    <small>{isLoggedIn ? right.body : 'Login to access this feature'}</small>
                  </span>
                  <span className="privacy-right-chevron">
                    {!isLoggedIn && <span style={{fontSize: '12px', color: '#666', marginRight: '8px'}}>🔒</span>}
                    <Icon name="chevron" />
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="privacy-footnote">
            <p>
              Have questions about our privacy practices? Our compliance team is
              available 24/7.
            </p>
            <a className="privacy-mail" href="mailto:privacy@marketpulse.ai">
              <Icon name="mail" />
              privacy@marketpulse.ai
            </a>
          </section>
        </div>

        <footer className="privacy-footer">
          <button 
            className={`privacy-accept ${isAccepted ? 'is-accepted' : ''}`} 
            type="button" 
            onClick={handleAccept}
          >
            <span>{isAccepted ? "Confirmed" : "I Understand"}</span>
            <Icon name="checkmark" />
          </button>
          <small>By clicking, you confirm you have read the policy.</small>
        </footer>
      </section>
    </main>
  );
}

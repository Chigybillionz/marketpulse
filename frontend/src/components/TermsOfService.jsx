const SECTIONS = [
  {
    id: "intro",
    icon: "info",
    title: "1. Introduction",
    body: [
      'Welcome to MarketPulse AI. These Terms of Service ("Terms") govern your access to and use of our financial analysis platform, including our artificial intelligence tools, data feeds, and algorithmic services.',
      "By accessing or using our services, you confirm that you are at least 18 years old and have the legal capacity to enter into this agreement in the Federal Republic of Nigeria.",
    ],
  },
  {
    id: "accounts",
    icon: "user",
    title: "2. User Accounts",
    body: [
      "To access certain features of the platform, you must register for an account. You agree to provide accurate, current, and complete information during registration.",
    ],
    bullets: [
      "You are responsible for safeguarding your password.",
      "You must notify us immediately of any unauthorized use.",
      "One account per user; multi-user access sharing is prohibited.",
    ],
  },
  {
    id: "usage",
    icon: "rights",
    title: "3. Usage Rights",
    body: [
      "MarketPulse AI grants you a limited, non-exclusive, non-transferable license to access our proprietary insights for personal or internal business use. You may not:",
    ],
    quote:
      "Scrape, harvest, or utilize automated systems to extract data from MarketPulse AI for the purpose of reselling or redistribution to third parties.",
  },
  {
    id: "privacy",
    icon: "shield",
    title: "4. Privacy & Data Protection",
    body: [
      "Your privacy is paramount. We handle your personal data in accordance with the Nigeria Data Protection Act (NDPA). Please refer to our Privacy Policy for details on how we collect, use, and secure your financial information.",
    ],
  },
  {
    id: "liability",
    icon: "warning",
    title: "5. Limitation of Liability",
    lead: "IMPORTANT: Financial markets involve significant risk.",
    body: [
      "MarketPulse AI provides information for educational and analytical purposes only. We are NOT a registered financial advisor. Under no circumstances shall MarketPulse AI be liable for any trading losses or financial damages resulting from your use of the platform.",
    ],
  },
  {
    id: "termination",
    icon: "ban",
    title: "6. Termination",
    body: [
      "We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users or the platform's integrity.",
    ],
  },
];

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8h.01" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    rights: (
      <path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" />
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" />
        <path d="M9.5 12l1.8 1.8 3.5-3.8" />
      </>
    ),
    warning: (
      <>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    ban: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m6 6 12 12" />
      </>
    ),
    check: <path d="m5 12 5 5 9-11" />,
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

export default function TermsOfService({ onNavigate, onClose, onBack }) {
  const dismiss = () => {
    if (onClose) onClose();
    else if (onBack) onBack();
    else if (onNavigate) onNavigate("welcome");
  };

  return (
    <main className="terms-page" aria-label="Terms of service">
      <section className="terms-shell">
        <header className="terms-topbar">
          <button
            className="terms-back"
            type="button"
            aria-label="Go back"
            onClick={dismiss}
          >
            <Icon name="back" />
          </button>
          <h1>Legal &amp; Compliance</h1>
          <span className="terms-topbar-spacer" aria-hidden="true" />
        </header>

        <div className="terms-scroll">
          <section className="terms-intro">
            <div className="terms-meta">
              <span className="terms-version">v2.4.0</span>
              <span className="terms-updated">Last Updated: june 30, 2026</span>
            </div>
            <h2>Terms of Service</h2>
            <p>
              Please read these terms carefully before using MarketPulse AI.
              Your use of the platform constitutes agreement to these binding
              legal terms.
            </p>
          </section>

          <div className="terms-card">
            {SECTIONS.map((section, index) => (
              <article
                className={`terms-section ${index === 0 ? "first" : ""}`}
                key={section.id}
              >
                <h3 className="terms-section-title">
                  <span className="terms-section-icon">
                    <Icon name={section.icon} />
                  </span>
                  {section.title}
                </h3>

                {section.lead && <p className="terms-alert">{section.lead}</p>}

                {section.body.map((paragraph, i) => (
                  <p className="terms-body" key={i}>
                    {paragraph}
                  </p>
                ))}

                {section.bullets && (
                  <ul className="terms-bullets">
                    {section.bullets.map((bullet, i) => (
                      <li key={i}>{bullet}</li>
                    ))}
                  </ul>
                )}

                {section.quote && (
                  <blockquote className="terms-quote">
                    &ldquo;{section.quote}&rdquo;
                  </blockquote>
                )}
              </article>
            ))}
          </div>
        </div>

        <footer className="terms-footer">
          <button className="terms-accept" type="button" onClick={dismiss}>
            <Icon name="check" />
            <span>Accept Terms</span>
          </button>
          <button className="terms-close" type="button" onClick={dismiss}>
            Close &amp; Go Back
          </button>
        </footer>
      </section>
    </main>
  );
}

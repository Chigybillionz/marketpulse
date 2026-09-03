import { useMemo, useState } from "react";

const FAQS = [
  {
    id: "sale",
    question: "How to record a sale?",
    answer:
      "Go to Home, tap the mic or add button, confirm trade details, then approve with your Trade PIN.",
  },
  {
    id: "pin",
    question: "What is a Trade PIN?",
    answer:
      "A 4-digit security code used to approve sensitive entries like sales, expenses, and credit updates.",
  },
  {
    id: "debt",
    question: "How to track debt?",
    answer:
      "Use the Credit section to add debtor records, set reminders, and monitor overdue balances in one place.",
  },
];

function ChevronIcon({ open }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={open ? "open" : ""}>
      <path
        d="m6 9 6 6 6-6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle
        cx="11"
        cy="11"
        r="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
      />
      <path
        d="m16.5 16.5 4 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 12H5M12 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M8 5l8 7-8 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactSupport({ onNavigate, onBack, businessName }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState(null);

  const filteredFaqs = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return FAQS;
    return FAQS.filter(
      (item) =>
        item.question.toLowerCase().includes(term) ||
        item.answer.toLowerCase().includes(term),
    );
  }, [query]);

  return (
    <main className="contact-support-page" aria-label="Help and support">
      <section className="contact-support-shell">
        <header className="contact-support-topbar">
          <button
            className="contact-support-back"
            type="button"
            aria-label="Go back"
            onClick={() =>
              onBack ? onBack() : onNavigate && onNavigate("home")
            }
          >
            <BackIcon />
          </button>

          <div className="contact-support-titleblock">
            <p>Need assistance</p>
            <h1>Help &amp; Support</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <main className="contact-support-content">
          <aside className="contact-support-preview">
            <article className="contact-support-hero">
              <span className="contact-support-kicker">Priority support</span>
              <h2>Get help quickly, in the channel you prefer.</h2>
              <p>
                {businessName || "My Store"} can contact support through instant
                chat or a direct phone call.
              </p>
            </article>
          </aside>

          <section className="contact-support-panel">
            <label className="contact-support-search" htmlFor="support-search">
              <span>
                <SearchIcon />
              </span>
              <input
                id="support-search"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for answers..."
              />
            </label>

            <section
              className="contact-support-faqs"
              aria-label="Frequently asked questions"
            >
              <h2>Frequently Asked Questions</h2>
              <div className="contact-support-faq-list">
                {filteredFaqs.length ? (
                  filteredFaqs.map((item) => {
                    const open = item.id === openId;
                    return (
                      <article
                        className={`contact-support-faq ${open ? "open" : ""}`}
                        key={item.id}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenId(open ? null : item.id)}
                          aria-expanded={open}
                          className="contact-support-faq-trigger"
                        >
                          <strong>{item.question}</strong>
                          <ChevronIcon open={open} />
                        </button>
                        {open && <p>{item.answer}</p>}
                      </article>
                    );
                  })
                ) : (
                  <p className="contact-support-empty">
                    No matching FAQs found.
                  </p>
                )}
              </div>
            </section>

            <section
              className="contact-support-channels"
              aria-label="Contact channels"
            >
              <h2>Contact Support</h2>
              <button
                className="contact-support-channel whatsapp"
                type="button"
              >
                <span className="contact-support-channel-icon">W</span>
                <span className="contact-support-channel-copy">
                  <strong>WhatsApp Support</strong>
                  <small>Instant chat with our team</small>
                </span>
                <ArrowIcon />
              </button>

              <button className="contact-support-channel call" type="button">
                <span className="contact-support-channel-icon">C</span>
                <span className="contact-support-channel-copy">
                  <strong>Phone Call</strong>
                  <small>Speak to an agent (9AM - 5PM)</small>
                </span>
                <ArrowIcon />
              </button>
            </section>
          </section>
        </main>
      </section>
    </main>
  );
}

import { useMemo, useState } from "react";

const FAQS = [
  {
    id: "data-safe",
    question: "Is my data safe?",
    answer:
      "Yes. Your records are encrypted with 256-bit AES at rest and TLS 1.3 in transit. Voice prompts are processed locally where possible, so your trading strategies stay private to you.",
  },
  {
    id: "bank-statement",
    question: "How do I download my bank statement?",
    answer:
      "Open the History screen, tap the export icon in the top right, choose a date range, and we generate a PDF statement you can save or share instantly.",
  },
  {
    id: "ai-misses",
    question: "What if the AI misses an item?",
    answer:
      "You can review every entry before it is saved. On the confirmation screen just edit the amount or category, and the AI learns from your correction for next time.",
  },
  {
    id: "multiple-accounts",
    question: "Can I use multiple bank accounts?",
    answer:
      "Absolutely. Link as many accounts as you need from Profile → Account Settings. Each transaction is tagged to the right account so your ledgers never mix.",
  },
];

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

function SupportIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 15v-3a7 7 0 0 1 14 0v3"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M5 15h4v5H7a2 2 0 0 1-2-2v-3ZM19 15h-4v5h2a2 2 0 0 0 2-2v-3Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 5h16v11H9l-5 4V5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
      <path
        d="M8 9h8M8 12.5h5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Faqs({ onNavigate }) {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState("data-safe");

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
    <main className="faqs-page" aria-label="Frequently asked questions">
      <section className="faqs-shell">
        <header className="faqs-topbar">
          <button
            className="faqs-back"
            type="button"
            aria-label="Go back"
            onClick={() => onNavigate && onNavigate("profile")}
          >
            <BackIcon />
          </button>

          <div className="faqs-titleblock">
            <p>Help center</p>
            <h1>FAQs</h1>
          </div>

          <button className="faqs-avatar" type="button" aria-label="Profile">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120"
              alt="Profile"
            />
          </button>
        </header>

        <div className="faqs-content">
          <aside className="faqs-preview">
            <article className="faqs-hero">
              <span className="faqs-kicker">Support center</span>
              <h2>How can we help you today?</h2>
              <p>
                Browse the answers our traders reach for most, or search for
                something specific. Still stuck? Our team is one tap away.
              </p>
            </article>
          </aside>

          <section className="faqs-panel">
            <h2 className="faqs-lead">How can we help you today?</h2>

            <label className="faqs-search" htmlFor="faqs-search-input">
              <span>
                <SearchIcon />
              </span>
              <input
                id="faqs-search-input"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search questions..."
              />
            </label>

            <div className="faqs-list">
              {filteredFaqs.length ? (
                filteredFaqs.map((item) => {
                  const open = item.id === openId;
                  return (
                    <article
                      className={`faqs-item ${open ? "open" : ""}`}
                      key={item.id}
                    >
                      <button
                        type="button"
                        className="faqs-item-trigger"
                        aria-expanded={open}
                        onClick={() => setOpenId(open ? null : item.id)}
                      >
                        <strong>{item.question}</strong>
                        <ChevronIcon open={open} />
                      </button>
                      {open && <p>{item.answer}</p>}
                    </article>
                  );
                })
              ) : (
                <p className="faqs-empty">No matching questions found.</p>
              )}
            </div>

            <article className="faqs-cta">
              <h3>Still have questions?</h3>
              <p>
                Our support team is available 24/7 to assist you with your
                trading journey.
              </p>
              <button
                className="faqs-cta-button"
                type="button"
                onClick={() => onNavigate && onNavigate("contact_support")}
              >
                <SupportIcon />
                <span>Contact Support</span>
              </button>
            </article>
          </section>
        </div>
      </section>

      <button
        className="faqs-fab"
        type="button"
        aria-label="Open live chat"
        onClick={() => onNavigate && onNavigate("contact_support")}
      >
        <ChatIcon />
      </button>
    </main>
  );
}

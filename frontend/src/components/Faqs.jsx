import { useMemo, useState } from "react";
import { useLanguage } from "../i18n/LanguageContext";

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

export default function Faqs({ onNavigate, onBack }) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState("sale");

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
    <main className="faqs-page" aria-label={t("faq_page_title", "Frequently asked questions")}>
      <section className="faqs-shell">
        <header className="faqs-topbar">
          <button
            className="faqs-back"
            type="button"
            aria-label={t("common_back", "Go back")}
            onClick={() => (onBack ? onBack() : onNavigate ? onNavigate("profile") : window.history.back())}
          >
            <BackIcon />
          </button>

          <div className="faqs-titleblock">
            <p>{t("faq_subtitle", "Help center")}</p>
            <h1>{t("faq_page_title", "FAQs")}</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <div className="faqs-content">
          <aside className="faqs-preview">
            <article className="faqs-hero">
              <span className="faqs-kicker">{t("support_page_title", "Support center")}</span>
              <h2>{t("faq_subtitle", "How can we help you today?")}</h2>
              <p>
                Browse the answers our traders reach for most, or search for
                something specific. Still stuck? Our team is one tap away.
              </p>
            </article>
          </aside>

          <section className="faqs-panel">
            <h2 className="faqs-lead">{t("faq_subtitle", "How can we help you today?")}</h2>

            <label className="faqs-search" htmlFor="faqs-search-input">
              <span>
                <SearchIcon />
              </span>
              <input
                id="faqs-search-input"
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t("common_search", "Search questions...")}
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
                <p className="faqs-empty">{t("hist_no_tx", "No matching questions found.")}</p>
              )}
            </div>

            <section className="contact-support-channels" aria-label={t("support_page_title", "Contact channels")} style={{ marginTop: '2rem' }}>
              <h3>{t("support_page_title", "Contact Support")}</h3>
              <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '1.5rem' }}>
                {t("support_subtitle", "Our support team is available 24/7 to assist you with your trading journey.")}
              </p>
              <a
                href="https://wa.me/2347081104368"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-support-channel whatsapp"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', textDecoration: 'none', color: '#166534', marginBottom: '12px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="contact-support-channel-icon" style={{ width: '40px', height: '40px', background: '#22c55e', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>W</span>
                  <span className="contact-support-channel-copy" style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '16px' }}>{t("support_whatsapp", "WhatsApp Support")}</strong>
                    <small style={{ color: '#166534', opacity: 0.8 }}>Instant chat with our team</small>
                  </span>
                </div>
                <div style={{ width: '20px', height: '20px' }}>
                  <SupportIcon />
                </div>
              </a>

              <a
                href="tel:+2347081104368"
                className="contact-support-channel call block md:hidden"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', textDecoration: 'none', color: '#334155' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span className="contact-support-channel-icon" style={{ width: '40px', height: '40px', background: '#94a3b8', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>C</span>
                  <span className="contact-support-channel-copy" style={{ display: 'flex', flexDirection: 'column' }}>
                    <strong style={{ fontSize: '16px' }}>{t("support_call", "Phone Call")}</strong>
                    <small style={{ color: '#475569', opacity: 0.8 }}>Speak to an agent (9AM - 5PM)</small>
                  </span>
                </div>
                <div style={{ width: '20px', height: '20px' }}>
                  <SupportIcon />
                </div>
              </a>
            </section>
          </section>
        </div>
      </section>

      <a
        href="https://wa.me/2347081104368"
        target="_blank"
        rel="noopener noreferrer"
        className="faqs-fab"
        aria-label={t("support_whatsapp", "Open live chat")}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
      >
        <ChatIcon />
      </a>
    </main>
  );
}

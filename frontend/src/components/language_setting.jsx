import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

const LANGUAGES = [
  {
    id: "en",
    label: "English",
    subLabel: "Default System Language",
  },
  {
    id: "pidgin",
    label: "Pidgin English",
    subLabel: "Common Market Language",
  },
  {
    id: "yo",
    label: "Yoruba",
    subLabel: "Èdè Yorùbá",
  },
  {
    id: "ig",
    label: "Igbo",
    subLabel: "Asụsụ Igbo",
  },
  {
    id: "ha",
    label: "Hausa",
    subLabel: "Harshen Hausa",
  },
];

export default function LanguageSetting({ onNavigate, businessName }) {
  const [selectedId, setSelectedId] = useState("en");
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = () => {
    setShowNotification(true);
    setTimeout(() => {
      setShowNotification(false);
      if (onNavigate) {
        onNavigate("profile");
      }
    }, 2000);
  };

  const selectedLanguage =
    LANGUAGES.find((lang) => lang.id === selectedId) || LANGUAGES[0];

  return (
    <div className="language-page">
      <div className="language-shell">
        <header className="language-topbar">
          <button
            type="button"
            className="language-back"
            onClick={() => onNavigate && onNavigate("home")}
            aria-label="Go back"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          <div className="language-titleblock">
            <p>Trading preferences</p>
            <h1>Language</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <main className="language-content">
          <aside className="language-preview">
            <div className="language-preview-hero">
              <span className="language-kicker">Localized support</span>
              <h2>{selectedLanguage.label}</h2>
              <p>
                {businessName || "My Store"} can trade in the language that
                feels most natural for your team.
              </p>

              <div className="language-preview-card">
                <span>Currently selected</span>
                <strong>{selectedLanguage.subLabel}</strong>
              </div>
            </div>

            <div className="language-note">
              <p>
                Picking a familiar language keeps notifications and trading
                actions easier to understand.
              </p>
            </div>
          </aside>

          <section className="language-panel">
            <p className="language-intro">
              Choose your preferred language for trading and notifications.
            </p>

            <div className="language-card-list">
              {LANGUAGES.map((lang) => {
                const isSelected = selectedId === lang.id;
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => setSelectedId(lang.id)}
                    className={`language-option ${
                      isSelected ? "is-selected" : ""
                    }`}
                  >
                    <div className="language-option-copy">
                      <span>{lang.label}</span>
                      <small>{lang.subLabel}</small>
                    </div>

                    <div className="language-option-radio" aria-hidden="true">
                      {isSelected ? (
                        <div className="language-option-dot" />
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="language-support">
              <h3>Localized Support</h3>
              <p>
                {businessName || "My Store"} now supports local languages to
                help you trade with more confidence and clarity.
              </p>
            </div>
          </section>
        </main>

        <footer className="language-footer">
          <button
            type="button"
            onClick={handleSave}
          >
            Set Language
          </button>
        </footer>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>Language updated successfully!</span>
      </div>
    </div>
  );
}

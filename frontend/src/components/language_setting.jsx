import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useLanguage, LANGUAGE_IDS } from "../i18n/LanguageContext";

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
  const { language, setLanguage, t } = useLanguage();

  // Preselect the currently active language.
  const activeEntry = LANGUAGES.find((l) => LANGUAGE_IDS[l.id] === language);
  const [selectedId, setSelectedId] = useState(activeEntry?.id || "en");
  const [showNotification, setShowNotification] = useState(false);

  const handleSave = () => {
    const chosen = LANGUAGES.find((lang) => lang.id === selectedId);
    if (chosen) {
      // Switching the context re-renders the whole app in the new language.
      setLanguage(LANGUAGE_IDS[chosen.id]);
    }
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
  const storeName = businessName || t("common_my_store");

  return (
    <div className="language-page">
      <div className="language-shell">
        <header className="language-topbar">
          <button
            type="button"
            className="language-back"
            onClick={() => onNavigate && onNavigate("home")}
            aria-label={t("common_back")}
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
            <p>{t("lang_settings_kicker")}</p>
            <h1>{t("lang_settings_title")}</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <main className="language-content">
          <aside className="language-preview">
            <div className="language-preview-hero">
              <span className="language-kicker">{t("lang_settings_localized_support")}</span>
              <h2>{selectedLanguage.label}</h2>
              <p>
                {t("lang_settings_preview_copy", { store: storeName })}
              </p>

              <div className="language-preview-card">
                <span>{t("lang_settings_selected")}</span>
                <strong>{selectedLanguage.subLabel}</strong>
              </div>
            </div>

            <div className="language-note">
              <p>
                {t("lang_settings_note")}
              </p>
            </div>
          </aside>

          <section className="language-panel">
            <p className="language-intro">
              {t("lang_settings_intro")}
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
              <h3>{t("lang_settings_localized_support")}</h3>
              <p>
                {t("lang_settings_support_copy", { store: storeName })}
              </p>
            </div>
          </section>
        </main>

        <footer className="language-footer">
          <button
            type="button"
            onClick={handleSave}
          >
            {t("lang_settings_save")}
          </button>
        </footer>
      </div>

      <div className={`store-profile-notification ${showNotification ? 'show' : ''}`}>
        <CheckCircle2 size={24} />
        <span>{t("lang_settings_saved")}</span>
      </div>
    </div>
  );
}

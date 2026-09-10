import { createContext, useContext, useEffect, useState } from "react";
import translations from "./translations";

/**
 * Maps the ids used by language_setting.jsx ("en", "pidgin", "yo", "ig", "ha")
 * to the dictionary keys in translations.js ("English", "Pidgin", ...).
 */
export const LANGUAGE_IDS = {
  en: "English",
  pidgin: "Pidgin",
  yo: "Yoruba",
  ig: "Igbo",
  ha: "Hausa",
};

const STORAGE_KEY = "appLanguage";

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch (err) {
    // localStorage unavailable (private mode) — fall through to default.
  }
  return "English";
}

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getInitialLanguage);

  // Keep the choice across reloads.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (err) {
      // ignore persistence failures
    }
  }, [language]);

  const setLanguage = (lang) => {
    if (translations[lang]) {
      setLanguageState(lang);
    }
  };

  /**
   * t("key") -> translated string.
   * t("key", { count: 3, amount: "₦15,000" }) -> replaces {name} placeholders.
   * Falls back to English, then to the raw key.
   */
  const t = (key, params) => {
    let str =
      translations[language]?.[key] ?? translations["English"]?.[key] ?? key;
    if (params) {
      for (const [name, value] of Object.entries(params)) {
        str = str.replaceAll(`{${name}}`, String(value));
      }
    }
    return str;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, supportedLanguages: Object.values(LANGUAGE_IDS) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

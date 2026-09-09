import { useLanguage } from "../../i18n/LanguageContext";

const NAV_LABEL_KEYS = {
  home: "nav_home",
  pulse: "nav_pulse",
  history: "nav_history",
  credit: "nav_credit",
  profile: "nav_profile",
};

function NavIcon({ name }) {
  const paths = {
    home: <path d="M5 12.4 14 5l9 7.4V24h-6v-7h-6v7H5V12.4Z" />,
    pulse: (
      <>
        <rect x="11" y="5" width="6" height="13" rx="3" />
        <path d="M6 14c0 4.5 3.4 8 8 8s8-3.5 8-8M14 22v4" />
      </>
    ),
    history: (
      <>
        <path d="M7.5 8.2A9 9 0 1 1 6 15" />
        <path d="M4 8.2h3.5V4.7" />
        <path d="M14 9v6l4 2" />
      </>
    ),
    credit: (
      <>
        <rect x="4" y="8" width="20" height="13" rx="1.5" />
        <circle cx="14" cy="14.5" r="3.2" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 28 28" aria-hidden="true" width="20" height="20">
      {paths[name]}
    </svg>
  );
}

export default function NavigationBar({ onNavigate, currentPage }) {
  const { t } = useLanguage();
  // Normalize currentPage so 'listeng' matches 'pulse'
  const activePage = currentPage === 'listeng' ? 'pulse' : currentPage;
  
  return (
    <nav className={`mp-bottom-nav mobile-only-nav ${activePage}-active`}>
      {["home", "pulse", "history", "credit"].map((item) => (
        <button
          type="button"
          className={`cursor-pointer ${
            item === activePage ? "active" : ""
          }`}
          onClick={() =>
            onNavigate && onNavigate(item === "pulse" ? "listeng" : item)
          }
          key={item}
        >
          <span className="nav-icon">
            <NavIcon name={item} />
          </span>
          <span>{t(NAV_LABEL_KEYS[item])}</span>
        </button>
      ))}
    </nav>
  );
}

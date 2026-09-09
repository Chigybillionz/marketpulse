import { Home, Mic2, History, CreditCard, User } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

const NAV_ITEMS = [
  { key: "home", labelKey: "nav_home", target: "home", Icon: Home },
  { key: "pulse", labelKey: "nav_pulse", target: "listeng", Icon: Mic2 },
  { key: "history", labelKey: "nav_history", target: "history", Icon: History },
  { key: "credit", labelKey: "nav_credit", target: "credit", Icon: CreditCard },
  { key: "profile", labelKey: "nav_profile", target: "profile", Icon: User },
];

/**
 * Desktop-only left navigation rail for the dashboard app shell.
 * Rendered inside AppShell and hidden on mobile via CSS.
 */
export default function Sidebar({ active, onNavigate, businessName }) {
  const { t } = useLanguage();
  const initials = businessName
    ? businessName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MS";

  return (
    <aside className="mp-shell__sidebar">
      <div className="mp-side-brand">
        <img
          className="mp-side-brand__logo"
          src="/mylogo.png"
          alt="MarketPulse logo"
        />
        MarketPulse
      </div>

      <nav className="mp-side-nav">
        {NAV_ITEMS.map(({ key, labelKey, target, Icon }) => (
          <button
            key={key}
            type="button"
            className={`mp-side-link${active === key ? " active" : ""}`}
            onClick={() => onNavigate && onNavigate(target)}
          >
            <Icon size={21} strokeWidth={2} />
            {t(labelKey)}
          </button>
        ))}
      </nav>

      <div className="mp-side-spacer" />

      <div className="mp-side-foot">
        <span className="mp-side-avatar">{initials}</span>
        <span>{businessName || t("common_my_store")}</span>
      </div>
    </aside>
  );
}

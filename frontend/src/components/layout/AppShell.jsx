import Sidebar from "./Sidebar";
import { useLanguage } from "../../i18n/LanguageContext";

/**
 * Dashboard layout wrapper (Home / History / Credit / Profile).
 *
 * - Mobile: renders as a transparent pass-through (sidebar + topbar are
 *   hidden by CSS), so each screen keeps its existing full-bleed phone
 *   layout and its own bottom nav.
 * - Desktop (>=1024px): becomes a two-column app shell with a persistent
 *   left sidebar and a top bar, and the screen content flows into the wide
 *   main area.
 */
export default function AppShell({
  active,
  onNavigate,
  businessName,
  title,
  subtitle,
  children,
}) {
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
    <div className="mp-shell">
      <Sidebar active={active} onNavigate={onNavigate} businessName={businessName} />

      <div className="mp-shell__main">
        <header className="mp-shell__topbar">
          <div className="mp-top-heading">
            <span className="mp-top-title">{title || businessName || t("common_my_store")}</span>
            {subtitle && <span className="mp-top-sub">{subtitle}</span>}
          </div>
          <button
            type="button"
            className="mp-top-user"
            aria-label={t("nav_profile")}
            onClick={() => onNavigate && onNavigate("profile")}
          >
            {initials}
          </button>
        </header>

        <div className="mp-shell__content">{children}</div>
      </div>
    </div>
  );
}

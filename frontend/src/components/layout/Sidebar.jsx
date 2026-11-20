import { Home, Mic2, History, CreditCard, PiggyBank, User, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "../../i18n/LanguageContext";

const NAV_ITEMS = [
  { key: "home", labelKey: "nav_home", defaultLabel: "Home", target: "home", Icon: Home },
  { key: "pulse", labelKey: "nav_pulse", defaultLabel: "Voice Pulse", target: "listeng", Icon: Mic2 },
  { key: "history", labelKey: "nav_history", defaultLabel: "History", target: "history", Icon: History },
  { key: "credit", labelKey: "nav_credit", defaultLabel: "Debtors", target: "credit", Icon: CreditCard },
  { key: "savings", labelKey: "nav_savings", defaultLabel: "Savings Advisor", target: "savings_plan", Icon: PiggyBank },
  { key: "profile", labelKey: "nav_profile", defaultLabel: "Profile", target: "profile", Icon: User },
];

/**
 * Desktop-only left navigation rail for the dashboard app shell.
 * Spans the full height of the viewport (top-to-bottom edge flush).
 * Supports movable / collapsible toggle between full width and compact rail.
 */
export default function Sidebar({ active, onNavigate, businessName, collapsed, onToggleCollapse }) {
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
    <aside className={`mp-shell__sidebar ${collapsed ? "is-collapsed" : ""}`}>
      {/* ── Movable / Collapsible Edge Handle ── */}
      <button
        type="button"
        className="mp-side-edge-toggle"
        onClick={onToggleCollapse}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* ── Brand Header ── */}
      <div className="mp-side-brand" onClick={collapsed ? onToggleCollapse : undefined} style={{ cursor: collapsed ? "pointer" : "default" }}>
        <img
          className="mp-side-brand__logo"
          src="/stockpile-mark.png"
          alt="Stockpile logo"
        />
        {!collapsed && <span className="mp-side-brand__title">Stockpile</span>}
      </div>

      {/* ── Navigation Links ── */}
      <nav className="mp-side-nav">
        {NAV_ITEMS.map(({ key, labelKey, defaultLabel, target, Icon }) => {
          const label = t(labelKey, defaultLabel);
          return (
            <button
              key={key}
              type="button"
              className={`mp-side-link${active === key ? " active" : ""}`}
              onClick={() => onNavigate && onNavigate(target)}
              title={collapsed ? label : undefined}
            >
              <Icon size={21} strokeWidth={2} />
              {!collapsed && <span className="mp-side-link__label">{label}</span>}
            </button>
          );
        })}
      </nav>

      <div className="mp-side-spacer" />

      {/* ── Footer Profile Pill ── */}
      <div
        className="mp-side-foot"
        onClick={() => onNavigate && onNavigate("profile")}
        title={businessName || t("common_my_store")}
        style={{ cursor: "pointer" }}
      >
        <span className="mp-side-avatar">{initials}</span>
        {!collapsed && (
          <span className="mp-side-foot__name">
            {businessName || t("common_my_store")}
          </span>
        )}
      </div>
    </aside>
  );
}

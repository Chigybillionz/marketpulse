import { useState } from "react";
import { PanelLeft } from "lucide-react";
import Sidebar from "./Sidebar";
import { useLanguage } from "../../i18n/LanguageContext";

/**
 * Dashboard layout wrapper (Home / History / Credit / Profile).
 *
 * - Mobile: renders as a transparent pass-through (sidebar + topbar are
 *   hidden by CSS), so each screen keeps its existing full-bleed phone
 *   layout and its own bottom nav.
 * - Desktop (>=1024px): two-column app shell with full-bleed left sidebar
 *   anchored edge-to-edge from top to bottom of viewport, and movable/collapsible.
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
  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("stockpile_sidebar_collapsed") === "true";
  });

  const toggleCollapse = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem("stockpile_sidebar_collapsed", String(next));
      return next;
    });
  };

  const initials = businessName
    ? businessName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MS";

  return (
    <div className={`mp-shell ${collapsed ? "mp-shell--collapsed" : ""}`}>
      <Sidebar
        active={active}
        onNavigate={onNavigate}
        businessName={businessName}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      <div className="mp-shell__main">
        <header className="mp-shell__topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              type="button"
              className="mp-topbar-sidebar-toggle"
              onClick={toggleCollapse}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <PanelLeft size={18} />
            </button>
            <div className="mp-top-heading">
              <span className="mp-top-title">{title || businessName || t("common_my_store")}</span>
              {subtitle && <span className="mp-top-sub">{subtitle}</span>}
            </div>
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

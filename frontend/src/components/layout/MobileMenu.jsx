import { useEffect } from "react";

const SECTIONS = [
  {
    title: "Business",
    items: [
      { icon: "store", label: "Store Profile", target: "storeProfile" },
      { icon: "tag", label: "Market Category", target: "market_category" },
      { icon: "bell", label: "Inventory Alerts", target: "inventoryAlert" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: "globe", label: "Language", target: "language_setting" },
      { icon: "support", label: "Contact Support", target: "contact_support" },
      { icon: "faq", label: "FAQs", target: "faqs" },
      { icon: "shield", label: "Privacy Policy", target: "privacy_policy" },
    ],
  },
];

function Icon({ name }) {
  const paths = {
    close: <path d="M6 6l12 12M18 6 6 18" />,
    store: (
      <>
        <path d="M4 10h16L18 5H6l-2 5Z" />
        <path d="M6 10v10h12V10M9 20v-6h6v6" />
      </>
    ),
    tag: <path d="m12 5 4 7H8l4-7ZM5 16h6v6H5zM15 16h6v6h-6z" />,
    bell: (
      <>
        <path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4L6 17Z" />
        <path d="M10 20h4" />
      </>
    ),
    globe: <path d="M4 6h9M8.5 4v2M6 18l5-12M4 18h9M16 20l4-10 4 10M17.5 16h5" />,
    support: (
      <>
        <path d="M5 15v-3a7 7 0 0 1 14 0v3" />
        <path d="M5 15h4v5H7a2 2 0 0 1-2-2v-3ZM19 15h-4v5h2a2 2 0 0 0 2-2v-3Z" />
      </>
    ),
    faq: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.8 2.8 0 0 1 5.1 1.6c0 2-2.6 2.2-2.6 4M12 18h.01" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" />
        <path d="M9.5 12l1.8 1.8 3.5-3.8" />
      </>
    ),
    chevron: <path d="m9 5 7 7-7 7" />,
    logout: <path d="M10 6H6v12h4M13 9l3 3-3 3M16 12H8" />,
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function MobileMenu({ open, onClose, onNavigate, businessName }) {
  const initials = businessName
    ? businessName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MS";

  // Close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const go = (target) => {
    onClose();
    if (target && onNavigate) onNavigate(target);
  };

  return (
    <div
      className={`mp-menu ${open ? "open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
    >
      <div className="mp-menu__overlay" onClick={onClose} />

      <aside className="mp-menu__panel">
        <header className="mp-menu__head">
          <button
            className="mp-menu__profile"
            type="button"
            onClick={() => go("profile")}
          >
            <span className="mp-menu__avatar">{initials}</span>
            <span className="mp-menu__id">
              <strong>{businessName || "My Store"}</strong>
              <small>View profile &amp; settings</small>
            </span>
          </button>
          <button
            className="mp-menu__close"
            type="button"
            aria-label="Close menu"
            onClick={onClose}
          >
            <Icon name="close" />
          </button>
        </header>

        <nav className="mp-menu__nav">
          {SECTIONS.map((section) => (
            <div className="mp-menu__section" key={section.title}>
              <p className="mp-menu__section-title">{section.title}</p>
              {section.items.map((item) => (
                <button
                  className="mp-menu__item"
                  type="button"
                  key={item.target}
                  onClick={() => go(item.target)}
                >
                  <span className="mp-menu__item-icon">
                    <Icon name={item.icon} />
                  </span>
                  <span className="mp-menu__item-label">{item.label}</span>
                  <span className="mp-menu__item-chevron">
                    <Icon name="chevron" />
                  </span>
                </button>
              ))}
            </div>
          ))}
        </nav>

        <footer className="mp-menu__foot">
          <button
            className="mp-menu__logout"
            type="button"
            onClick={() => go("logout")}
          >
            <Icon name="logout" />
            <span>Logout</span>
          </button>
        </footer>
      </aside>
    </div>
  );
}

import { useState } from "react";
import AppShell from "./layout/AppShell";

function getSections(businessName) {
  return [
    {
      title: "Business Details",
      items: [
        {
          icon: "store",
          label: "Store Profile",
          sub: businessName || "My Store",
          target: "storeProfile",
        },
        {
          icon: "category",
          label: "Market Category",
          sub: "Wholesale Dry Goods",
          target: "market_category",
        },
        {
          icon: "bell",
          label: "Inventory Alerts",
          sub: "Enabled at 10% stock",
          target: "inventoryAlert",
        },
      ],
    },
    {
      title: "Account Settings",
      items: [
        {
          icon: "phone",
          label: "Phone Number",
          sub: "+234 803 123 4567",
          target: "phoneNumber",
        },
        {
          icon: "language",
          label: "Language",
          sub: "English / Pidgin",
          target: "language_setting",
        },
      ],
    },
    {
      title: "Security",
      items: [
        {
          icon: "lock",
          label: "Change Trade PIN",
          sub: "Update your 4-digit approval code",
          target: "pulse_trade_pin",
        },
        { icon: "fingerprint", label: "Biometric Login", toggle: true },
      ],
    },
    {
      title: "Help & Support",
      items: [
        {
          icon: "support",
          label: "Contact Support",
          target: "contact_support",
        },
        { icon: "faq", label: "FAQs", target: "contact_support" },
      ],
    },
  ];
}

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    gear: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a8 8 0 0 0 .1-2l2-1.5-2-3.5-2.4 1a7 7 0 0 0-1.7-1L15 5h-6l-.4 3a7 7 0 0 0-1.7 1l-2.4-1-2 3.5 2 1.5a8 8 0 0 0 .1 2l-2 1.5 2 3.5 2.4-1a7 7 0 0 0 1.7 1l.4 3h6l.4-3a7 7 0 0 0 1.7-1l2.4 1 2-3.5-2.2-1.5Z" />
      </>
    ),
    pencil: <path d="m5 18.5 3.5-.8L19 7.2 16.8 5 6.3 15.5 5 18.5Z" />,
    location: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
    trend: <path d="M4 17 10 11l4 4 7-8M16 7h5v5" />,
    box: (
      <>
        <path d="M5 7h14v14H5z" />
        <path d="M5 11h14M9 7V5h6v2" />
      </>
    ),
    store: (
      <>
        <path d="M4 10h16L18 5H6l-2 5Z" />
        <path d="M6 10v10h12V10M9 20v-6h6v6" />
      </>
    ),
    category: (
      <>
        <path d="m12 5 4 7H8l4-7ZM5 16h6v6H5zM15 16h6v6h-6z" />
      </>
    ),
    bell: (
      <>
        <path d="M6 17h12l-1.5-2v-4a4.5 4.5 0 0 0-9 0v4L6 17Z" />
        <path d="M10 20h4" />
      </>
    ),
    phone: (
      <path d="M8 5h3l1 4-2 1c1 2 2.5 3.5 5 5l1-2 4 1v3c0 1-1 2-2 2A13 13 0 0 1 6 7c0-1 1-2 2-2Z" />
    ),
    language: (
      <>
        <path d="M4 6h9M8.5 4v2M6 18l5-12M4 18h9M16 20l4-10 4 10M17.5 16h5" />
      </>
    ),
    lock: (
      <>
        <rect x="6" y="10" width="12" height="10" rx="1.5" />
        <path d="M9 10V7a3 3 0 0 1 6 0v3" />
      </>
    ),
    fingerprint: (
      <>
        <path d="M7 13a5 5 0 0 1 10 0M5 16a7 7 0 0 1 14 0M9 20c1-2 1-4 1-7a2 2 0 0 1 4 0c0 5-.7 7-2 9M14 20c1.6-1.7 2-4 2-7" />
      </>
    ),
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
    chevron: <path d="m9 5 7 7-7 7" />,
    logout: (
      <>
        <path d="M10 6H6v12h4M13 9l3 3-3 3M16 12H8" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function SettingItem({ item, onClick }) {
  return (
    <button className="profile-setting-item" type="button" onClick={onClick}>
      <span className="profile-setting-icon">
        <Icon name={item.icon} />
      </span>
      <span className="profile-setting-copy">
        <strong>{item.label}</strong>
        {item.sub && <small>{item.sub}</small>}
      </span>
      {item.toggle ? (
        <span className="profile-toggle" aria-hidden="true">
          <span />
        </span>
      ) : (
        <span className="profile-chevron">
          <Icon name="chevron" />
        </span>
      )}
    </button>
  );
}

export default function Profile({ onNavigate, businessName }) {
  const sections = getSections(businessName);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [businessAvatarUrl, setBusinessAvatarUrl] = useState(null);

  const initials = businessName
    ? businessName
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "MS";
  return (
    <AppShell
      active="profile"
      onNavigate={onNavigate}
      businessName={businessName}
      title="Profile & Settings"
      subtitle="Manage your store and account"
    >
      <main className="profile-page">
        <section className="profile-phone">
          <header className="profile-nav">
            <button
              type="button"
              aria-label="Go back"
              onClick={() => onNavigate && onNavigate("home")}
            >
              <Icon name="back" />
            </button>
            <h1>Profile &amp; Settings</h1>
            <button type="button" aria-label="Settings">
              <Icon name="gear" />
            </button>
          </header>

          <section className="profile-hero">
            <div className="profile-avatar">
              {businessAvatarUrl ? (
                <img
                  src={businessAvatarUrl}
                  alt="Business profile"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "50%",
                  }}
                />
              ) : (
                <span>{initials}</span>
              )}
              <button
                type="button"
                aria-label="Edit profile photo"
                onClick={() => setShowAvatarPicker(true)}
              >
                <Icon name="pencil" />
              </button>
            </div>

            {showAvatarPicker && (
              <div
                style={{
                  position: "fixed",
                  inset: 0,
                  backgroundColor: "rgba(0,0,0,0.35)",
                  zIndex: 99999,
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  padding: 18,
                }}
                role="dialog"
                aria-modal="true"
              >
                <div
                  style={{
                    width: "100%",
                    maxWidth: 420,
                    borderRadius: 18,
                    background: "#ffffff",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      padding: 18,
                      borderBottom: "1px solid #F3F4F6",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 12,
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 900,
                          color: "#111827",
                        }}
                      >
                        Add business photo
                      </h2>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "#6B7280",
                          lineHeight: 1.45,
                        }}
                      >
                        Choose an image from your device.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(false)}
                      style={{
                        background: "none",
                        border: 0,
                        cursor: "pointer",
                        padding: 4,
                        color: "#6B7280",
                      }}
                      aria-label="Close"
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  <div
                    style={{
                      padding: 18,
                      display: "flex",
                      flexDirection: "column",
                      gap: 14,
                    }}
                  >
                    <label
                      style={{
                        borderRadius: 14,
                        border: "1px dashed #D1D5DB",
                        padding: "16px 14px",
                        textAlign: "center",
                        cursor: "pointer",
                        color: "#111827",
                        fontWeight: 900,
                      }}
                    >
                      Upload photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          const file = e.target.files && e.target.files[0];
                          if (!file) return;
                          const url = URL.createObjectURL(file);
                          setBusinessAvatarUrl(url);
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() => setShowAvatarPicker(false)}
                      style={{
                        width: "100%",
                        borderRadius: 14,
                        padding: "14px 16px",
                        border: 0,
                        background: "#052e16",
                        color: "#ffffff",
                        fontWeight: 900,
                        cursor: "pointer",
                        boxShadow: "0 14px 24px rgba(5,46,22,0.18)",
                      }}
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

            <h2>{businessName || "My Store"}</h2>
            <p>{businessName || "My Store"}</p>
            <div className="profile-location">
              <Icon name="location" />
              Onyingbo Market, Lagos
            </div>
          </section>

          <section className="profile-insights" aria-label="Quick insights">
            <article>
              <Icon name="trend" />
              <span>MONTH GROWTH</span>
              <strong className="success">+12.4%</strong>
            </article>
            <article>
              <Icon name="box" />
              <span>ALERTS</span>
              <strong className="alert">3 Items Low</strong>
            </article>
          </section>

          <div className="profile-sections-grid">
            {sections.map((section) => (
              <section className="profile-section" key={section.title}>
                <h3>{section.title}</h3>
                <div className="profile-settings-card">
                  {section.items.map((item) => (
                    <SettingItem
                      item={item}
                      key={item.label}
                      onClick={() => {
                        if (item.target && onNavigate) {
                          onNavigate(item.target);
                        }
                      }}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>

          <button
            className="profile-logout"
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
          >
            <Icon name="logout" />
            Logout
          </button>

          {showLogoutConfirm && (
            <div
              style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0,0,0,0.35)",
                zIndex: 9999,
                display: "flex",

                alignItems: "flex-end",
                justifyContent: "center",
                padding: 18,
              }}
              role="dialog"
              aria-modal="true"
            >
              <div
                style={{
                  width: "100%",
                  maxWidth: 420,
                  borderRadius: 18,
                  background: "#ffffff",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: 18,
                    borderBottom: "1px solid #F3F4F6",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 12,
                  }}
                >
                  <div
                    style={{ display: "flex", gap: 12, alignItems: "center" }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: "#FEE2E2",
                        display: "grid",
                        placeItems: "center",
                        color: "#991B1B",
                        flex: "0 0 auto",
                      }}
                    >
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                    </div>
                    <div>
                      <h2
                        style={{
                          margin: 0,
                          fontSize: 16,
                          fontWeight: 900,
                          color: "#111827",
                        }}
                      >
                        Logout?
                      </h2>
                      <p
                        style={{
                          margin: "6px 0 0",
                          fontSize: 13.5,
                          fontWeight: 600,
                          color: "#6B7280",
                          lineHeight: 1.45,
                        }}
                      >
                        Are you sure you want to logout?
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{
                      background: "none",
                      border: 0,
                      cursor: "pointer",
                      padding: 4,
                      color: "#6B7280",
                    }}
                    aria-label="Close"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>

                <div
                  style={{
                    padding: 18,
                    display: "flex",
                    gap: 12,
                    justifyContent: "flex-end",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setShowLogoutConfirm(false)}
                    style={{
                      borderRadius: 14,
                      padding: "14px 16px",
                      minWidth: 120,
                      border: "1px solid #E5E7EB",
                      background: "#ffffff",
                      color: "#111827",
                      fontWeight: 800,
                      cursor: "pointer",
                    }}
                  >
                    No
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLogoutConfirm(false);
                      if (onNavigate) onNavigate("welcome");
                    }}
                    style={{
                      borderRadius: 14,
                      padding: "14px 16px",
                      minWidth: 120,
                      border: "0",
                      background: "#052e16",
                      color: "#ffffff",
                      fontWeight: 900,
                      cursor: "pointer",
                      boxShadow: "0 14px 24px rgba(5,46,22,0.18)",
                    }}
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          )}

          <p className="profile-version">
            Version 2.4.0 • Built for Nigerian Markets
          </p>
        </section>
      </main>
    </AppShell>
  );
}

import { useState } from "react";

const FORMATS = [
  {
    id: "csv",
    glyph: "CSV",
    title: "CSV",
    sub: "Best for Excel & Google Sheets",
  },
  {
    id: "json",
    glyph: "{ }",
    title: "JSON",
    sub: "Standard for developers & APIs",
  },
];

const RECENT_EXPORTS = [
  {
    id: "trade-history",
    name: "Trade_History_May_2024.csv",
    meta: "May 24, 2024 • 4.2 MB",
    status: "Completed",
  },
  {
    id: "account-summary",
    name: "Account_Summary_2023.json",
    meta: "Dec 31, 2023 • 1.8 MB",
    status: "Completed",
  },
];

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.6 2.6 0 0 1 4.8 1.3c0 1.7-2.3 2-2.3 3.4M12 17h.01" />
      </>
    ),
    folder: (
      <>
        <path d="M4 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" />
        <path d="M14.5 12.5 17 15l-2.5 2.5M13 15h4" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 5 6v5c0 4.2 2.9 7.7 7 9 4.1-1.3 7-4.8 7-9V6l-7-3Z" />
        <path d="M9.5 12l1.8 1.8 3.5-3.8" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
    lock: (
      <>
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V8a4 4 0 0 1 8 0v3" />
      </>
    ),
    download: <path d="M12 4v10m0 0-4-4m4 4 4-4M5 19h14" />,
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

export default function DataPortability({ onNavigate, onBack }) {
  const [format, setFormat] = useState("csv");

  const goBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("privacy_policy");
  };

  const requestExport = () => {
    // A valid Trade PIN is required to authorize export generation.
    if (onNavigate) onNavigate("pulse_trade_pin");
  };

  return (
    <main className="portability-page" aria-label="Data portability export">
      <section className="portability-shell">
        <header className="portability-topbar">
          <button
            className="portability-icon-btn"
            type="button"
            aria-label="Go back"
            onClick={goBack}
          >
            <Icon name="back" />
          </button>
          <h1>Data Portability</h1>
          <button
            className="portability-icon-btn ghost"
            type="button"
            aria-label="Help"
          >
            <Icon name="help" />
          </button>
        </header>

        <div className="portability-content">
          <div className="portability-primary">
            <article className="portability-intro">
              <div className="portability-intro-head">
                <span className="portability-intro-icon">
                  <Icon name="folder" />
                </span>
                <h2>Export Your Records</h2>
              </div>
              <p>
                Download a comprehensive archive of your{" "}
                <strong>MarketPulse AI</strong> activity. This includes your full
                trade history, credit logs, performance analytics, and profile
                data in machine-readable formats for external audits or personal
                backups.
              </p>
            </article>

            <section className="portability-formats" aria-label="Format selection">
              <h3 className="portability-label">Format Selection</h3>
              <div className="portability-format-grid">
                {FORMATS.map((item) => {
                  const active = item.id === format;
                  return (
                    <button
                      className={`portability-format ${active ? "active" : ""}`}
                      type="button"
                      key={item.id}
                      aria-pressed={active}
                      onClick={() => setFormat(item.id)}
                    >
                      <span className="portability-format-glyph">
                        {item.glyph}
                      </span>
                      <strong>{item.title}</strong>
                      <small>{item.sub}</small>
                    </button>
                  );
                })}
              </div>
            </section>

            <article className="portability-security">
              <span className="portability-security-icon">
                <Icon name="shield" />
              </span>
              <div>
                <strong>Security Check</strong>
                <p>
                  For your protection, a valid <strong>Trade PIN</strong> will be
                  required to authorize the data generation process.
                </p>
              </div>
            </article>
          </div>

          <div className="portability-aside">
            <article className="portability-archive">
              <span className="portability-archive-lock">
                <Icon name="lock" />
              </span>
              <div className="portability-archive-copy">
                <h3>Secure Archives</h3>
                <p>Bank-grade encryption on all exports</p>
              </div>
            </article>

            <section className="portability-recent" aria-label="Recent exports">
              <h3 className="portability-label">Recent Exports</h3>
              <div className="portability-recent-list">
                {RECENT_EXPORTS.map((item) => (
                  <article className="portability-file" key={item.id}>
                    <span className="portability-file-icon">
                      <Icon name="clock" />
                    </span>
                    <span className="portability-file-copy">
                      <strong>{item.name}</strong>
                      <small>{item.meta}</small>
                    </span>
                    <span className="portability-file-status">
                      {item.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>

            <button
              className="portability-submit"
              type="button"
              onClick={requestExport}
            >
              <Icon name="download" />
              <span>Request Data Export</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

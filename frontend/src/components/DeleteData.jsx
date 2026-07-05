import { useState } from "react";

const LOSS_ITEMS = [
  { id: "ledger", icon: "ledger", label: "Complete Trade History & Ledger" },
  { id: "voice", icon: "mic", label: "AI Voice Recordings & Transcripts" },
  { id: "profile", icon: "id", label: "Personal Profile & KYC Documents" },
];

const STEPS = [
  "Your account will be immediately deactivated and logged out from all sessions.",
  'A 30-day "Cooling Off" grace period begins where data is stored in a secure vault but inaccessible.',
  "After 30 days, our automated systems perform total erasure of all database records and physical backups.",
];

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    warning: (
      <>
        <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4M12 17h.01" />
      </>
    ),
    ledger: (
      <>
        <path d="M6 3h10l4 4v14H6z" />
        <path d="M9 8h6M9 12h6M9 16h4" />
      </>
    ),
    mic: (
      <>
        <rect x="9" y="3" width="6" height="11" rx="3" />
        <path d="M6 11a6 6 0 0 0 12 0M12 17v4M9 21h6" />
      </>
    ),
    id: (
      <>
        <circle cx="12" cy="9" r="3" />
        <circle cx="12" cy="12" r="9" />
        <path d="M6.5 19a5.5 5.5 0 0 1 11 0" />
      </>
    ),
    download: <path d="M12 4v10m0 0-4-4m4 4 4-4M5 19h14" />,
    trash: <path d="M5 7h14M10 7V5h4v2M6 7l1 13h10l1-13M10 11v6M14 11v6" />,
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

export default function DeleteData({ onNavigate, onBack }) {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  const goBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("privacy_policy");
  };

  const handleDelete = () => {
    if (!canDelete) return;
    if (onNavigate) onNavigate("welcome");
  };

  return (
    <main className="delete-data-page" aria-label="Delete my data">
      <section className="delete-data-shell">
        <header className="delete-data-topbar">
          <button
            className="delete-data-back"
            type="button"
            aria-label="Go back"
            onClick={goBack}
          >
            <Icon name="back" />
          </button>
          <h1>Delete My Data</h1>
          <span className="delete-data-topbar-spacer" aria-hidden="true" />
        </header>

        <div className="delete-data-content">
          <div className="delete-data-primary">
            <article className="delete-data-warning">
              <div className="delete-data-warning-head">
                <span className="delete-data-warning-icon">
                  <Icon name="warning" />
                </span>
                <div>
                  <h2>Permanent Deletion</h2>
                  <p>
                    This action is irreversible. Once processed, you will lose
                    access to all your platform data forever.
                  </p>
                </div>
              </div>

              <ul className="delete-data-loss">
                {LOSS_ITEMS.map((item) => (
                  <li key={item.id}>
                    <span className="delete-data-loss-icon">
                      <Icon name={item.icon} />
                    </span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </article>

            <section className="delete-data-steps" aria-label="What happens next">
              <h3>What happens next?</h3>
              <ol>
                {STEPS.map((step, index) => (
                  <li key={index}>
                    <span className="delete-data-step-num">{index + 1}</span>
                    <p>{step}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <div className="delete-data-action">
            <button className="delete-data-download" type="button">
              <span className="delete-data-download-copy">
                <strong>Download first?</strong>
                <small>Keep a copy of your records for tax purposes.</small>
              </span>
              <span className="delete-data-download-cta">
                Data Portability
                <Icon name="download" />
              </span>
            </button>

            <section className="delete-data-confirm" aria-label="Confirm identity">
              <h3>Confirm Identity</h3>
              <p>
                To confirm you want to proceed with permanent deletion, type{" "}
                <strong>DELETE</strong> in the field below.
              </p>
              <input
                type="text"
                className="delete-data-input"
                value={confirmText}
                onChange={(event) => setConfirmText(event.target.value)}
                placeholder="Type DELETE"
                aria-label="Type DELETE to confirm"
                autoComplete="off"
                spellCheck="false"
              />
            </section>

            <button
              className="delete-data-submit"
              type="button"
              disabled={!canDelete}
              onClick={handleDelete}
            >
              <Icon name="trash" />
              <span>Permanently Delete All Data</span>
            </button>

            <p className="delete-data-footnote">
              By clicking above, you agree to our{" "}
              <a href="#erasure-policy" onClick={(e) => e.preventDefault()}>
                Right to Erasure Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

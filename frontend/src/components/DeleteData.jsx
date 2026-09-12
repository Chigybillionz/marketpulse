import { useState, useEffect } from "react";
import { requestAccountDeletion, getDeletionStatus } from "../services/authService";

const LOSS_ITEMS = [
  { id: "ledger", icon: "ledger", label: "Complete Trade History & Ledger" },
  { id: "voice", icon: "mic", label: "AI Voice Recordings & Transcripts" },
  { id: "profile", icon: "id", label: "Personal Profile & KYC Documents" },
];

const STEPS = [
  {
    num: "1",
    text: "Your account will be immediately deactivated and logged out from all sessions.",
  },
  {
    num: "2",
    text: 'A 3–day “Cooling Off” grace period begins where data as stored in a secure vault but inaccessible.',
  },
  {
    num: "3",
    text: "After 30 days, our automated systems perform total erasure of all database records and physical backups.",
  },
];

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 19l-7-7 7-7" />,
    help: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M9.5 9a2.6 2.6 0 0 1 4.8 1.3c0 1.7-2.3 2-2.3 3.4M12 17h.01" />
      </>
    ),
    warning: (
      <>
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </>
    ),
    ledger: (
      <>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </>
    ),
    mic: (
      <>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </>
    ),
    id: (
      <>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </>
    ),
    download: (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </>
    ),
    trash: (
      <>
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </>
    ),
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

export default function DeleteData({ onNavigate, onBack, email }) {
  const [confirmText, setConfirmText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [deletionInfo, setDeletionInfo] = useState(null);

  const activeEmail = email || localStorage.getItem("email") || "";
  const canDelete = confirmText.trim().toUpperCase() === "DELETE";

  useEffect(() => {
    if (activeEmail) {
      getDeletionStatus(activeEmail)
        .then((res) => {
          if (res && res.hasRequest) {
            setDeletionInfo(res);
          }
        })
        .catch(() => {});
    }
  }, [activeEmail]);

  const goBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("privacy_policy");
  };

  const handleDelete = async () => {
    if (!canDelete || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await requestAccountDeletion(confirmText.trim(), activeEmail);
      if (res && res.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(res?.message || "Failed to process deletion request");
      }
    } catch (err) {
      console.error("Deletion error:", err);
      setErrorMessage(err.message || "Failed to submit deletion request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("businessName");
    localStorage.removeItem("profilePicture");
    localStorage.removeItem("location");
    localStorage.removeItem("hasPin");
    if (onNavigate) {
      onNavigate("welcome");
    } else {
      window.location.href = "/";
    }
  };

  return (
    <main className="delete-data-page" aria-label="Delete my data">
      {/* Background Lamp Asset from User */}
      <div className="delete-data-lamp-container" aria-hidden="true">
        <img
          src="/lamp.png"
          alt=""
          className="delete-data-lamp-img"
        />
        <div className="delete-data-lamp-glow" />
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="delete-data-modal-overlay" role="dialog" aria-modal="true">
          <div className="delete-data-modal-card">
            <h3>About Right to Erasure</h3>
            <p>
              Under the Nigeria Data Protection Act (NDPA) and global privacy standards, you have the right
              to request permanent deletion of your account and personal records.
            </p>
            <p>
              Once initiated, your account enters a 3-day &quot;Cooling Off&quot; grace period. If you do not
              cancel, all records will be permanently erased after 30 days.
            </p>
            <div className="delete-data-modal-actions">
              <button
                type="button"
                className="delete-data-modal-btn"
                onClick={() => setShowHelpModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Deletion Modal */}
      {showSuccessModal && (
        <div className="delete-data-modal-overlay" role="dialog" aria-modal="true">
          <div className="delete-data-modal-card">
            <div className="delete-data-modal-icon-wrap">
              <Icon name="warning" />
            </div>
            <h3>Account Deactivation Confirmed</h3>
            <p>
              Your deletion request has been registered. Your account is now deactivated and locked.
            </p>
            <p className="delete-data-modal-sub">
              You have a <strong>3-day grace period</strong> to change your mind before permanent purge commences.
            </p>
            <div className="delete-data-modal-actions">
              <button
                type="button"
                className="delete-data-modal-btn danger"
                onClick={handleFinalLogout}
              >
                Log Out Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="delete-data-wrapper">
        {/* Top Bar */}
        <header className="delete-data-topbar">
          <div className="delete-data-topbar-left">
            <button
              className="delete-data-back-btn"
              type="button"
              aria-label="Back"
              onClick={goBack}
              style={{
                background: "#ffffff",
                backgroundColor: "#ffffff",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
              }}
            >
              <Icon name="back" />
            </button>
            <h1 className="delete-data-title">Delete My Data</h1>
          </div>

          <button
            className="delete-data-help-btn"
            type="button"
            aria-label="Help and information"
            onClick={() => setShowHelpModal(true)}
            style={{
              background: "transparent",
              color: "#64748b",
              border: "1.5px solid #94a3b8"
            }}
          >
            <Icon name="help" />
          </button>
        </header>

        {/* Top Cards Grid */}
        <section className="delete-data-top-grid">
          {/* Left Card: Permanent Deletion */}
          <article className="delete-data-card delete-data-warning-card">
            <div className="delete-data-warning-glow">
              <Icon name="warning" />
            </div>

            <h2 className="delete-data-warning-title">Permanent Deletion</h2>
            <p className="delete-data-warning-lead">
              This action is irreversible. Once processed, you will lose access to all your platform data forever.
            </p>

            <ul className="delete-data-loss-list">
              {LOSS_ITEMS.map((item) => (
                <li key={item.id} className="delete-data-loss-item">
                  <span className="delete-data-loss-badge">
                    <Icon name={item.icon} />
                  </span>
                  <span className="delete-data-loss-text">{item.label}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Right Column (2 Cards) */}
          <div className="delete-data-right-col">
            {/* Card 1: What happens next? */}
            <article className="delete-data-card delete-data-steps-card">
              <h3 className="delete-data-steps-title">What happens next?</h3>

              <div className="delete-data-timeline">
                {STEPS.map((step, idx) => (
                  <div key={idx} className="delete-data-step-row">
                    <div className="delete-data-step-marker">
                      <span className="delete-data-step-sphere">{step.num}</span>
                      {idx < STEPS.length - 1 && <div className="delete-data-step-line" />}
                    </div>
                    <div className="delete-data-step-content">
                      <p>{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Card 2: Download first? */}
            <article className="delete-data-card delete-data-download-card">
              <div className="delete-data-download-info">
                <h3>Download first?</h3>
                <p>Keep a copy of your records for tax purposes.</p>
              </div>

              <button
                type="button"
                className="delete-data-portability-btn"
                onClick={() => {
                  if (onNavigate) onNavigate("data_portability");
                  else window.location.href = "/data-portability";
                }}
              >
                <span>Data Portability</span>
                <Icon name="download" />
              </button>
            </article>
          </div>
        </section>

        {/* Bottom Card: Confirm Identity */}
        <section className="delete-data-confirm-section" aria-label="Confirm Identity">
          <div className="delete-data-card delete-data-confirm-card">
            <h3 className="delete-data-confirm-title">Confirm Identity</h3>
            <p className="delete-data-confirm-desc">
              To confirm, you want to proceed with permanent deletion, type the field below.
            </p>

            <div className="delete-data-input-wrap">
              <input
                type="text"
                className="delete-data-input"
                placeholder="Type DELETE"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value);
                  setErrorMessage("");
                }}
                disabled={isSubmitting}
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            {errorMessage && (
              <div className="delete-data-error-msg" role="alert">
                {errorMessage}
              </div>
            )}

            <button
              type="button"
              className="delete-data-submit-btn"
              disabled={!canDelete || isSubmitting}
              onClick={handleDelete}
            >
              <Icon name="trash" />
              <span>{isSubmitting ? "Processing Deletion..." : "Permanently Delete All Data"}</span>
            </button>
          </div>

          <p className="delete-data-policy-footnote">
            By clicking above, you agree to our{" "}
            <a
              href="#erasure-policy"
              onClick={(e) => {
                e.preventDefault();
                setShowHelpModal(true);
              }}
            >
              Right to Erasure Policy
            </a>
          </p>
        </section>
      </div>
    </main>
  );
}

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Edit3,
  CheckCircle,
  Shield,
  Bell,
  Lock,
  Clock,
} from "lucide-react";

export default function Email({ onNavigate, email, setEmail }) {
  const [isChanging, setIsChanging] = useState(false);
  const [changeStatus, setChangeStatus] = useState({
    remainingChanges: 3,
    cooldownDays: 0,
    lastChangeDate: null,
  });
  const [showModal, setShowModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load email change status from localStorage or backend
  useEffect(() => {
    const loadEmailStatus = async () => {
      try {
        const userEmail = email || localStorage.getItem("email");
        if (!userEmail) return;

        // Try to fetch from backend first
        const apiUrl = import.meta.env.VITE_BACKEND_URL || "https://marketpulse-jaxo.onrender.com/api";
        const response = await fetch(`${apiUrl}/welcome-auth/profile?email=${encodeURIComponent(userEmail)}`);
        
        // For now, use localStorage as fallback
        const savedStatus = localStorage.getItem("emailChangeStatus");
        if (savedStatus) {
          setChangeStatus(JSON.parse(savedStatus));
        } else {
          // Default: 3 changes remaining, no cooldown
          setChangeStatus({
            remainingChanges: 3,
            cooldownDays: 0,
            lastChangeDate: null,
          });
        }
      } catch (error) {
        console.error("Failed to load email status:", error);
        setChangeStatus({
          remainingChanges: 3,
          cooldownDays: 0,
          lastChangeDate: null,
        });
      }
    };
    loadEmailStatus();
  }, [email]);

  const handleChangeEmail = () => {
    if (changeStatus.remainingChanges <= 0) {
      alert(`You've used all your email changes for this week. Please wait ${changeStatus.cooldownDays} more day(s).`);
      return;
    }
    setShowModal(true);
  };

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSubmitNewEmail = async () => {
    if (!newEmail.trim()) {
      setEmailError("Please enter an email address");
      return;
    }

    if (!validateEmail(newEmail)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    setEmailError("");

    try {
      const userEmail = email || localStorage.getItem("email");
      const apiUrl = import.meta.env.VITE_BACKEND_URL || "https://marketpulse-jaxo.onrender.com/api";

      const response = await fetch(`${apiUrl}/welcome-auth/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email: userEmail, newEmail: newEmail.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update email");
      }

      // Update local state
      if (setEmail) setEmail(newEmail.trim());
      localStorage.setItem("email", newEmail.trim());

      // Update change status
      const newStatus = {
        remainingChanges: data.user.emailChangeCount >= 3 ? 0 : 3 - data.user.emailChangeCount,
        cooldownDays: data.user.emailChangeCount >= 3 ? 7 : 0,
        lastChangeDate: new Date().toISOString(),
      };
      setChangeStatus(newStatus);
      localStorage.setItem("emailChangeStatus", JSON.stringify(newStatus));

      setShowModal(false);
      setNewEmail("");
      alert("Email updated successfully!");

      if (onNavigate) {
        onNavigate("home");
      }
    } catch (err) {
      setEmailError(err.message || "Failed to update email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const verificationItems = [
    {
      icon: Shield,
      title: "Secure Trading",
      copy: "Email addresses are encrypted and never shared with third parties.",
      tone: "secure",
    },
    {
      icon: Bell,
      title: "Instant Alerts",
      copy: "Get email alerts for successful provision deliveries and credit updates.",
      tone: "alerts",
    },
    {
      icon: Lock,
      title: "Account Recovery",
      copy: "Your email is required to reset your password or trade PIN if you forget them.",
      tone: "secure",
    },
  ];

  return (
    <div className="email-page">
      <div className="email-shell">
        <header className="email-topbar">
          <button
            type="button"
            className="email-back"
            onClick={() => onNavigate && onNavigate("home")}
            aria-label="Go back"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="email-titleblock">
            <p>Account security</p>
            <h1>Email Address</h1>
          </div>

          <div style={{ width: 40 }} />
        </header>

        <main className="email-content">
          <aside className="email-preview">
            <div className="email-hero">
              <span className="email-kicker">Verified email</span>
              <h2>Keep your store connected with a secure email address.</h2>
              <p>
                Your verified email is used for alerts, account recovery, and
                identity checks.
              </p>

              <div className="email-hero-card">
                <div>
                  <span>Current verified email</span>
                  <strong>{email || "No email set"}</strong>
                </div>
                <div className="email-badge">
                  <CheckCircle size={16} />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            <div className="email-rate-info">
              <Clock size={20} />
              <div>
                <strong>Email changes remaining this week</strong>
                <span>{changeStatus.remainingChanges} of 3</span>
              </div>
            </div>
          </aside>

          <section className="email-panel">
            <p className="email-intro">
              Your email address is used for account security, trade
              notifications, and identity verification.
            </p>

            <div className="email-card">
              <div className="email-card-top">
                <h2>Current Verified Email</h2>
                <div className="email-verified-pill">
                  <CheckCircle size={16} />
                  <span>Verified</span>
                </div>
              </div>

              <div className="email-value-wrapper">
                <p className="email-value">{email || "No email set"}</p>
                {email && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(email);
                      alert("Email copied to clipboard!");
                    }}
                    className="email-copy-btn"
                    aria-label="Copy email"
                  >
                    Copy
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={isChanging || changeStatus.remainingChanges <= 0}
              className="email-change-btn"
            >
              <Edit3 size={22} />
              <span>
                {isChanging
                  ? "Processing..."
                  : changeStatus.remainingChanges <= 0
                  ? `Change Email (Resets in ${changeStatus.cooldownDays} days)`
                  : "Change Email Address"}
              </span>
            </button>

            {changeStatus.remainingChanges <= 0 && (
              <div className="email-cooldown-notice">
                <Clock size={18} />
                <p>
                  You can change your email {changeStatus.cooldownDays} more day(s).
                  This helps protect your account from unauthorized changes.
                </p>
              </div>
            )}

            <div className="email-features">
              {verificationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className={`email-feature ${item.tone}`}
                  >
                    <div className="email-feature-icon">
                      <Icon size={24} />
                    </div>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        </main>

        <footer className="email-footer">
          <button
            type="button"
            onClick={handleChangeEmail}
            disabled={isChanging || changeStatus.remainingChanges <= 0}
            className="email-footer-btn"
          >
            <Edit3 size={20} />
            <span>{isChanging ? "Processing..." : "Change Email Address"}</span>
          </button>
        </footer>
      </div>

      {/* Modal for changing email */}
      {showModal && (
        <div
          className="email-modal-overlay"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="email-modal">
            <div className="email-modal-header">
              <h2>Change Email Address</h2>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="email-modal-close"
                aria-label="Close"
              >
                <ChevronLeft size={24} />
              </button>
            </div>

            <div className="email-modal-body">
              <p className="email-modal-description">
                Enter your new email address below. You can change your email up to 3 times per week.
              </p>

              <div className="email-modal-form">
                <label htmlFor="new-email" className="email-modal-label">
                  New Email Address
                </label>
                <input
                  id="new-email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => {
                    setNewEmail(e.target.value);
                    setEmailError("");
                  }}
                  placeholder="your@email.com"
                  className="email-modal-input"
                  autoFocus
                />

                {emailError && (
                  <p className="email-modal-error">{emailError}</p>
                )}

                <div className="email-modal-info">
                  <CheckCircle size={16} />
                  <span>
                    {changeStatus.remainingChanges > 0
                      ? `You have ${changeStatus.remainingChanges} change(s) remaining this week`
                      : "No changes remaining this week"}
                  </span>
                </div>
              </div>

              <div className="email-modal-actions">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="email-modal-cancel"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitNewEmail}
                  disabled={isSubmitting}
                  className="email-modal-submit"
                >
                  {isSubmitting ? "Updating..." : "Update Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

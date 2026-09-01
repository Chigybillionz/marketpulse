import { useState } from "react";
import {
  ChevronLeft,
  Edit3,
  CheckCircle,
  Shield,
  Bell,
  Package,
} from "lucide-react";

export default function Email({ onNavigate, email, setEmail }) {
  const [isChanging, setIsChanging] = useState(false);

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
  ];

  const handleChangeEmail = () => {
    setIsChanging(true);
    setTimeout(() => {
      alert("Redirecting to email change flow...");
      setIsChanging(false);
      if (onNavigate) {
        onNavigate("profile");
      }
    }, 1000);
  };

  return (
    <div className="phone-number-page">
      <div className="phone-number-shell">
        <header className="phone-number-topbar">
          <button
            type="button"
            className="phone-number-back"
            onClick={() => onNavigate && onNavigate("profile")}
            aria-label="Go back"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="phone-number-titleblock">
            <p>Account security</p>
            <h1>Email Address</h1>
          </div>

          <button
            type="button"
            className="phone-number-avatar"
            aria-label="Profile"
          >
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop"
              alt="Profile"
            />
          </button>
        </header>

        <main className="phone-number-content">
          <aside className="phone-number-preview">
            <div className="phone-number-hero">
              <span className="phone-number-kicker">Verified email</span>
              <h2>Keep your store connected with a secure email address.</h2>
              <p>
                Your verified email is used for alerts, account recovery, and
                identity checks.
              </p>

              <div className="phone-number-hero-card">
                <div>
                  <span>Current verified email</span>
                  <strong>{email || "No email set"}</strong>
                </div>
                <div className="phone-number-badge">
                  <CheckCircle size={16} />
                  <span>Verified</span>
                </div>
              </div>
            </div>

            <div className="phone-number-note">
              <Package size={18} />
              <p>
                One verified email keeps delivery updates and support messages
                in one place.
              </p>
            </div>
          </aside>

          <section className="phone-number-panel">
            <p className="phone-number-intro">
              Your email address is used for account security, trade
              notifications, and identity verification.
            </p>

            <div className="phone-number-card">
              <div className="phone-number-card-top">
                <h2>Current Verified Email</h2>
                <div className="phone-number-verified-pill">
                  <CheckCircle size={16} />
                  <span>Verified</span>
                </div>
              </div>

              <p className="phone-number-value">{email || "No email set"}</p>
            </div>

            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={isChanging}
              className="phone-number-change"
            >
              <Edit3 size={22} />
              <span>
                {isChanging ? "Processing..." : "Change Email Address"}
              </span>
            </button>

            <div className="phone-number-features">
              {verificationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className={`phone-number-feature ${item.tone}`}
                  >
                    <div className="phone-number-feature-icon">
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

        <footer className="phone-number-footer">
          <button
            type="button"
            onClick={handleChangeEmail}
            disabled={isChanging}
          >
            <Edit3 size={20} />
            <span>{isChanging ? "Processing..." : "Change Email Address"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
}

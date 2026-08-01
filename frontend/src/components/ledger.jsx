import { useState } from "react";
// import { setupPin } from "../services/authService";

function BackArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M19 12H5M12 5l-7 7 7 7"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 28 22" fill="none" aria-hidden="true">
      <path
        d="M10.2 2h14.3A1.5 1.5 0 0 1 26 3.5v15a1.5 1.5 0 0 1-1.5 1.5H10.2L2 11l8.2-9Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m15 7.5 6 6M21 7.5l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <rect x="14" y="27" width="36" height="27" rx="7" fill="#0E2F1B" />
      <path
        d="M22 27v-7c0-6 4.7-11 10-11s10 5 10 11v7"
        stroke="#F2C94C"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M32 36v9"
        stroke="#F2C94C"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="m4 10.4 3.4 3.4L16 5.2"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export default function Ledger({ onNavigate }) {
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const isComplete = pin.length === 4;

  const addDigit = (digit) => {
    setError(null);
    setPin((prev) => (prev.length < 4 ? prev + digit : prev));
  };

  const removeDigit = () => {
    setError(null);
    setPin((prev) => prev.slice(0, -1));
  };

  const handleSetPin = async () => {
    if (!isComplete || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      // PIN setup is temporarily bypassed while the UI flow is being built.
      // Restore this call when the backend is ready.
      // await setupPin(phoneNumber, pin);
      onNavigate?.("home");
    } catch (err) {
      setError(err.message || "Failed to set PIN. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="ledger-page">
      <section className="ledger-panel" aria-label="Ledger security summary">
        <div className="ledger-panel-brand">
          <img src="/mylogo.png" alt="MarketPulse AI logo" />
          <span>MarketPulse AI</span>
        </div>

        <div className="ledger-panel-copy">
          <p className="ledger-eyebrow">Secure setup</p>
          <h1>Protect every sale, expense, and credit entry.</h1>
          <p>
            Your Trade PIN becomes the approval step before sensitive ledger
            actions are saved to your store account.
          </p>
        </div>

        <div className="ledger-assurance">
          {[
            "Private four digit authorization",
            "Used for sales and credit approvals",
            "Designed for quick market-day entry",
          ].map((item) => (
            <div className="ledger-assurance-item" key={item}>
              <span>
                <CheckIcon />
              </span>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="ledger-stage" aria-label="Set Trade PIN">
        <div className="ledger-card">
          <header className="ledger-nav">
            <button
              className="ledger-back"
              onClick={() => onNavigate?.("otp")}
              aria-label="Go back"
              type="button"
            >
              <BackArrowIcon />
            </button>
            <div className="ledger-mobile-brand">
              <img src="/mylogo.png" alt="MarketPulse AI logo" />
              <span>MarketPulse AI</span>
            </div>
            <span className="ledger-nav-spacer" aria-hidden="true" />
          </header>

          <section className="ledger-hero">
            <div className="ledger-security-orb">
              <LockIcon />
            </div>
            <p className="ledger-step">Step 2 of 2</p>
            <h2>Secure Your Ledger</h2>
            <p>
              Set a 4-digit Trade PIN to authorize sales, expenses, and credit
              entries.
            </p>
          </section>

          <div
            className="ledger-pin-indicators"
            role="status"
            aria-label={`${pin.length} of 4 PIN digits entered`}
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={i < pin.length ? "filled" : ""}
                aria-hidden="true"
              />
            ))}
          </div>

          {error && <p className="ledger-error">{error}</p>}

          <div className="ledger-keypad" aria-label="PIN keypad">
            {KEYS.map((digit) => (
              <button
                className="ledger-key"
                key={digit}
                onClick={() => addDigit(digit)}
                type="button"
              >
                {digit}
              </button>
            ))}
            <span className="ledger-key-empty" aria-hidden="true" />
            <button
              className="ledger-key"
              onClick={() => addDigit("0")}
              type="button"
            >
              0
            </button>
            <button
              className="ledger-delete"
              onClick={removeDigit}
              aria-label="Delete last digit"
              type="button"
            >
              <DeleteIcon />
            </button>
          </div>

          <button
            className={`ledger-cta ${isComplete ? "active" : ""}`}
            disabled={!isComplete || isLoading}
            onClick={handleSetPin}
            type="button"
          >
            {isLoading ? "Securing Ledger..." : "Set Secure PIN"}
          </button>
        </div>
      </section>
    </main>
  );
}

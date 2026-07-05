import { useState } from "react";

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        d="M6 13h20l-2.2-6.5H8.2L6 13Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M8 13v12h16V13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M11 25v-7h10v7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinejoin="round"
      />
      <path
        d="M5 13h22"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M15 21v-6.2C15 9.6 18.9 6 24 6s9 3.6 9 8.8V21"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <rect
        x="12"
        y="20"
        width="24"
        height="20"
        rx="2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="30" r="3" fill="currentColor" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg viewBox="0 0 32 24" aria-hidden="true">
      <path
        d="M11 4h15c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H11l-7-8 7-8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
      <path
        d="m16 8 7 8M23 8l-7 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M5 12h13"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="m13 6 6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function PulseTradePin({
  onNavigate,
  onBack,
  businessName,
  setBalance,
  setMoneyIn,
  setTransactionsList,
}) {
  const [pin, setPin] = useState("");
  const canConfirm = pin.length === 4;

  const addDigit = (digit) => {
    setPin((currentPin) =>
      currentPin.length < 4 ? `${currentPin}${digit}` : currentPin,
    );
  };

  const removeDigit = () => {
    setPin((currentPin) => currentPin.slice(0, -1));
  };

  const handleConfirm = () => {
    if (!canConfirm) return;

    if (setBalance) {
      setBalance((prev) => prev + 15000);
    }

    if (setMoneyIn) {
      setMoneyIn((prev) => prev + 15000);
    }

    if (setTransactionsList) {
      const newTx = {
        id: Date.now(),
        type: "credit",
        icon: "bag",
        title: "Bulk Garri Sale",
        meta: "Today, 11:30 AM - Voice Input",
        amount: "+\u20A615,000",
        isPositive: true,
        iconBg: "bg-green-100",
        iconColor: "text-green-800",
      };

      setTransactionsList((prev) => [newTx, ...prev]);
    }

    onNavigate("weekly_pulse");
  };

  return (
    <main className="trade-pin-page" aria-label="Verify transaction PIN screen">
      <section className="trade-pin-shell">
        <header className="trade-pin-topbar">
          <button
            className="trade-pin-close"
            type="button"
            aria-label="Back"
            onClick={() => (onBack ? onBack() : onNavigate("ai_confirmation"))}
            style={{ cursor: "pointer" }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111827"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="trade-pin-titleblock">
            <p>Secure approval</p>
            <h1>Trade PIN</h1>
          </div>

          <div
            className="trade-pin-brand"
            aria-label={businessName || "My Store"}
          >
            <span className="trade-pin-store">
              <StoreIcon />
            </span>
            <span>{businessName || "My Store"}</span>
          </div>
        </header>

        <main className="trade-pin-content">
          <aside className="trade-pin-preview">
            <div className="trade-pin-hero">
              <div className="trade-pin-lock-badge">
                <LockIcon />
              </div>

              <span className="trade-pin-kicker">Approval required</span>
              <h2>Confirm this transaction with your 4-digit Trade PIN.</h2>
              <p>
                Your PIN protects sales, expenses, and credit entries before
                they reach your secure ledger.
              </p>

              <div className="trade-pin-hero-card">
                <span>Transaction amount</span>
                <strong>&#8358;15,000</strong>
              </div>
            </div>

            <div className="trade-pin-preview-note">
              <span>Locked by design</span>
              <p>Only the right 4 digits can authorize this action.</p>
            </div>
          </aside>

          <section className="trade-pin-panel">
            <div className="trade-pin-intro">
              <p>
                Enter your 4-digit PIN to confirm this sale of{" "}
                <strong>&#8358;15,000.</strong>
              </p>
            </div>

            <div className="trade-pin-sections">
              <article className="trade-pin-section current">
                <div className="trade-pin-section-head">
                  <h2>Enter your Trade PIN</h2>
                </div>
                <div
                  className="trade-pin-dots"
                  aria-label="Trade PIN digits entered"
                >
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      className={index < pin.length ? "filled" : ""}
                      key={index}
                    />
                  ))}
                </div>
              </article>
            </div>

            <section className="trade-pin-keypad" aria-label="PIN keypad">
              {digits.map((digit) => (
                <button
                  className="trade-pin-key"
                  type="button"
                  onClick={() => addDigit(digit)}
                  key={digit}
                >
                  {digit}
                </button>
              ))}
              <span className="trade-pin-empty" />
              <button
                className="trade-pin-key"
                type="button"
                onClick={() => addDigit("0")}
              >
                0
              </button>
              <button
                className="trade-pin-delete"
                type="button"
                onClick={removeDigit}
                aria-label="Delete last digit"
              >
                <DeleteIcon />
              </button>
            </section>

            <footer className="trade-pin-footer">
              <a href="#forgot-pin" onClick={(event) => event.preventDefault()}>
                Forgot PIN?
              </a>
              <button
                className="trade-pin-confirm"
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
              >
                <span>Confirm</span>
                <ArrowRightIcon />
              </button>
            </footer>
          </section>
        </main>
      </section>
    </main>
  );
}

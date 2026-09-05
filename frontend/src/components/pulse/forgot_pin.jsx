import { useEffect, useState } from "react";
import { sendResetCode, verifyResetCode, resetPin } from "../../services/authService";

const CODE_LENGTH = 4;
const PIN_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function maskEmail(email) {
  if (!email) return "u***@example.com";
  const [localPart, domain] = email.split('@');
  const maskedLocal = localPart.length > 2 
    ? `${localPart.slice(0, 2)}***` 
    : `${localPart.charAt(0)}***`;
  return `${maskedLocal}@${domain || 'example.com'}`;
}

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    phone: (
      <path d="M8 5h3l1 4-2 1c1 2 2.5 3.5 5 5l1-2 4 1v3c0 1-1 2-2 2A13 13 0 0 1 6 7c0-1 1-2 2-2Z" />
    ),
    lock: (
      <>
        <rect x="6" y="10" width="12" height="10" rx="1.6" />
        <path d="M9 10V7a3 3 0 0 1 6 0v3" />
      </>
    ),
    check: <path d="m5 12 5 5 9-11" />,
    arrow: <path d="M5 12h13m-6-6 6 6-6 6" />,
    delete: (
      <>
        <path d="M11 5h9a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-9l-6-7 6-7Z" />
        <path d="m15 9-4 6M11 9l4 6" />
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

function Keypad({ onKey, onDelete }) {
  return (
    <div className="forgot-pin-keypad" aria-label="Number keypad">
      {KEYS.map((key) => (
        <button
          className="forgot-pin-key"
          type="button"
          key={key}
          onClick={() => onKey(key)}
        >
          {key}
        </button>
      ))}
      <span className="forgot-pin-key-empty" />
      <button
        className="forgot-pin-key"
        type="button"
        onClick={() => onKey("0")}
      >
        0
      </button>
      <button
        className="forgot-pin-key forgot-pin-key-delete"
        type="button"
        onClick={onDelete}
        aria-label="Delete last digit"
      >
        <Icon name="delete" />
      </button>
    </div>
  );
}

function Dots({ length, filled }) {
  return (
    <div className="forgot-pin-dots" aria-hidden="true">
      {Array.from({ length }).map((_, index) => (
        <span className={index < filled ? "filled" : ""} key={index} />
      ))}
    </div>
  );
}

export default function ForgotPin({ onNavigate, onBack, email }) {
  const [step, setStep] = useState("verify"); // verify | code | create | confirm | done
  const [code, setCode] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const masked = maskEmail(email);
  const stepNumber = { verify: 1, code: 1, create: 2, confirm: 2, done: 3 }[step];

  const goBack = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate("pulse_trade_pin");
  };

  // Auto-advance once a full PIN is entered.
  useEffect(() => {
    if (step === "create" && newPin.length === PIN_LENGTH) {
      const timer = setTimeout(() => setStep("confirm"), 180);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [newPin, step]);

  useEffect(() => {
    if (step === "confirm" && confirmPin.length === PIN_LENGTH) {
      const timer = setTimeout(async () => {
        if (confirmPin === newPin) {
          try {
            setIsLoading(true);
            await resetPin(email, code, newPin);
            setStep("done");
          } catch (err) {
            setError(err.message || "Failed to reset PIN. Try again.");
            setNewPin("");
            setConfirmPin("");
            setStep("create");
          } finally {
            setIsLoading(false);
          }
        } else {
          setError("Those PINs don't match. Let's try again.");
          setNewPin("");
          setConfirmPin("");
          setStep("create");
        }
      }, 180);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [confirmPin, newPin, step, email, code]);

  const handleSendCode = async () => {
    try {
      setError("");
      setIsLoading(true);
      await sendResetCode(email);
      setStep("code");
    } catch (err) {
      setError(err.message || "Failed to send reset code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setError("");
      setIsLoading(true);
      await verifyResetCode(email, code);
      setStep("create");
    } catch (err) {
      setError(err.message || "Invalid code. Try again.");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (digit) => {
    setError("");
    if (step === "code") {
      setCode((value) => (value.length < CODE_LENGTH ? value + digit : value));
    } else if (step === "create") {
      setNewPin((value) => (value.length < PIN_LENGTH ? value + digit : value));
    } else if (step === "confirm") {
      setConfirmPin((value) =>
        value.length < PIN_LENGTH ? value + digit : value,
      );
    }
  };

  const handleDelete = () => {
    setError("");
    if (step === "code") setCode((value) => value.slice(0, -1));
    else if (step === "create") setNewPin((value) => value.slice(0, -1));
    else if (step === "confirm") setConfirmPin((value) => value.slice(0, -1));
  };

  return (
    <main className="forgot-pin-page" aria-label="Reset Trade PIN">
      <section className="forgot-pin-shell">
        <header className="forgot-pin-topbar">
          <button
            className="forgot-pin-back"
            type="button"
            aria-label="Go back"
            onClick={goBack}
          >
            <Icon name="back" />
          </button>
          <h1>Reset Trade PIN</h1>
          <span className="forgot-pin-topbar-spacer" aria-hidden="true" />
        </header>

        <div className="forgot-pin-content">
          <article className="forgot-pin-card">
            {step !== "done" && (
              <div
                className="forgot-pin-progress"
                aria-label={`Step ${stepNumber} of 3`}
              >
                {[1, 2, 3].map((n) => (
                  <span
                    className={`forgot-pin-progress-step ${
                      n <= stepNumber ? "active" : ""
                    }`}
                    key={n}
                  />
                ))}
              </div>
            )}

            {step === "verify" && (
              <>
                <span className="forgot-pin-badge">
                  <Icon name="phone" />
                </span>
                <h2>Reset your Trade PIN</h2>
                <p>
                  We&apos;ll send a 4-digit reset code to your registered email
                  address to confirm it&apos;s you.
                </p>
                <div className="forgot-pin-phone">{masked}</div>
                <button
                  className="forgot-pin-primary"
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading}
                >
                  <span>{isLoading ? "Sending..." : "Send reset code"}</span>
                  <Icon name="arrow" />
                </button>
                {error && <p className="forgot-pin-error" style={{marginTop: '10px'}}>{error}</p>}
              </>
            )}

            {step === "code" && (
              <>
                <span className="forgot-pin-badge">
                  <Icon name="phone" />
                </span>
                <h2>Enter reset code</h2>
                <p>
                  Enter the 4-digit code we sent to <strong>{masked}</strong>.
                </p>
                <div className="forgot-pin-code" aria-hidden="true">
                  {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                    <span
                      className={code[index] ? "filled" : ""}
                      key={index}
                    >
                      {code[index] || ""}
                    </span>
                  ))}
                </div>
                <Keypad onKey={handleKey} onDelete={handleDelete} />
                <button
                  className="forgot-pin-primary"
                  type="button"
                  disabled={code.length !== CODE_LENGTH || isLoading}
                  onClick={handleVerifyCode}
                >
                  <span>{isLoading ? "Verifying..." : "Verify code"}</span>
                  <Icon name="arrow" />
                </button>
                {error && <p className="forgot-pin-error" style={{marginTop: '10px'}}>{error}</p>}
                <button
                  className="forgot-pin-resend"
                  type="button"
                  onClick={handleSendCode}
                  disabled={isLoading}
                >
                  Resend code
                </button>
              </>
            )}

            {(step === "create" || step === "confirm") && (
              <>
                <span className="forgot-pin-badge">
                  <Icon name="lock" />
                </span>
                <h2>
                  {step === "create"
                    ? "Create new Trade PIN"
                    : "Confirm new Trade PIN"}
                </h2>
                <p>
                  {step === "create"
                    ? "Choose a new 4-digit PIN you'll remember."
                    : "Re-enter your new PIN to confirm."}
                </p>
                <Dots
                  length={PIN_LENGTH}
                  filled={step === "create" ? newPin.length : confirmPin.length}
                />
                {error && <p className="forgot-pin-error">{error}</p>}
                <Keypad onKey={handleKey} onDelete={handleDelete} />
              </>
            )}

            {step === "done" && (
              <>
                <span className="forgot-pin-badge success">
                  <Icon name="check" />
                </span>
                <h2>Trade PIN updated</h2>
                <p>
                  Your new Trade PIN is ready. Use it to approve your next
                  transaction.
                </p>
                <button
                  className="forgot-pin-primary"
                  type="button"
                  onClick={() =>
                    onNavigate && onNavigate("pulse_trade_pin")
                  }
                >
                  <span>Back to Trade PIN</span>
                  <Icon name="arrow" />
                </button>
              </>
            )}
          </article>
        </div>
      </section>
    </main>
  );
}

import { useState } from "react";
import { sendPasswordResetCode, verifyPasswordResetCode, resetPassword } from "../services/authService";
import FlowLayout from "./layout/FlowLayout";

const CODE_LENGTH = 4;
const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function maskEmail(email) {
  if (!email) return "u***@example.com";
  const [localPart, domain] = email.split("@");
  const maskedLocal =
    localPart.length > 2
      ? `${localPart.slice(0, 2)}***`
      : `${localPart.charAt(0)}***`;
  return `${maskedLocal}@${domain || "example.com"}`;
}

function Icon({ name }) {
  const paths = {
    back: <path d="M19 12H5M12 5l-7 7 7 7" />,
    mail: (
      <>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 6L2 7" />
      </>
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
    eye: (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
      </>
    ),
  };

  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      {paths[name]}
    </svg>
  );
}

function Keypad({ onKey, onDelete }) {
  const keyStyle = {
    width: 64,
    height: 56,
    borderRadius: 14,
    border: "none",
    backgroundColor: "#E8EDF2",
    color: "#111827",
    fontSize: 22,
    fontWeight: 600,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 10,
        justifyItems: "center",
        maxWidth: 240,
        margin: "0 auto",
      }}
      aria-label="Number keypad"
    >
      {KEYS.map((key) => (
        <button
          style={keyStyle}
          type="button"
          key={key}
          onClick={() => onKey(key)}
        >
          {key}
        </button>
      ))}
      <span />
      <button
        style={keyStyle}
        type="button"
        onClick={() => onKey("0")}
      >
        0
      </button>
      <button
        style={{ ...keyStyle, backgroundColor: "#FEE2E2", color: "#DC2626" }}
        type="button"
        onClick={onDelete}
        aria-label="Delete last digit"
      >
        <Icon name="delete" />
      </button>
    </div>
  );
}

export default function ForgotPassword({ onNavigate, email }) {
  const [step, setStep] = useState("verify"); // verify | code | new_password | done
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [inputEmail, setInputEmail] = useState(email || "");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const masked = maskEmail(inputEmail);
  const stepNumber = { verify: 1, code: 1, new_password: 2, done: 3 }[step];

  const handleSendCode = async () => {
    const targetEmail = inputEmail.trim();
    if (!targetEmail) {
      setError("Please enter your email address.");
      return;
    }
    try {
      setError("");
      setIsLoading(true);
      await sendPasswordResetCode(targetEmail);
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
      await verifyPasswordResetCode(inputEmail.trim(), code);
      setStep("new_password");
    } catch (err) {
      setError(err.message || "Invalid code. Try again.");
      setCode("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      setError("");
      setIsLoading(true);
      await resetPassword(inputEmail.trim(), code, newPassword);
      setStep("done");
    } catch (err) {
      setError(err.message || "Failed to reset password. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKey = (digit) => {
    setError("");
    if (step === "code") {
      setCode((value) => (value.length < CODE_LENGTH ? value + digit : value));
    }
  };

  const handleDelete = () => {
    setError("");
    if (step === "code") setCode((value) => value.slice(0, -1));
  };

  const goBack = () => {
    if (onNavigate) onNavigate("login");
  };

  return (
    <FlowLayout>
      <div
        className="mp-flow__card"
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#EEF1F5",
          fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
          position: "relative",
        }}
      >
        {/* Top Bar */}
        <header
          style={{
            backgroundColor: "#EEF1F5",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 12px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <button
            onClick={goBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 13,
              fontWeight: 500,
              color: "#111827",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 10px",
              borderRadius: 8,
            }}
          >
            <Icon name="back" />
          </button>
          <h1
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#111827",
              letterSpacing: "-0.4px",
            }}
          >
            Reset Password
          </h1>
          <span style={{ width: 32 }} aria-hidden="true" />
        </header>

        {/* Header Section */}
        <div
          style={{
            width: "100%",
            height: 200,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#F5F5E8",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(180,198,215,0.45)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              zIndex: 5,
            }}
          >
            <div
              style={{
                width: 76,
                height: 76,
                borderRadius: "50%",
                backgroundColor: "#1B3D2F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 6px 24px rgba(0,0,0,0.30)",
                flexShrink: 0,
              }}
            >
              <Icon name="lock" />
            </div>
            <div
              style={{
                textAlign: "center",
                padding: "0 32px",
                width: "100%",
              }}
            >
              <h1
                style={{
                  fontSize: 27,
                  fontWeight: 800,
                  color: "#111827",
                  letterSpacing: "-0.5px",
                  marginBottom: 8,
                  lineHeight: 1.2,
                  textAlign: "center",
                }}
              >
                {step === "verify"
                  ? "Forgot Password?"
                  : step === "code"
                  ? "Check Your Email"
                  : step === "new_password"
                  ? "Create New Password"
                  : "Password Reset!"}
              </h1>
              <p
                style={{
                  fontSize: 14.5,
                  color: "#374151",
                  lineHeight: 1.6,
                  maxWidth: 280,
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                {step === "verify"
                  ? "Enter your email and we'll send you a code to reset your password."
                  : step === "code"
                  ? `You requested a password reset. We sent a 4-digit code to ${masked}.`
                  : step === "new_password"
                  ? "Choose a strong password for your account."
                  : "Your password has been updated. You can now log in."}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "28px 24px 24px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Progress Steps */}
          {step !== "done" && (
            <div
              style={{
                display: "flex",
                gap: 8,
                marginBottom: 24,
                justifyContent: "center",
              }}
            >
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  style={{
                    height: 4,
                    flex: 1,
                    maxWidth: 80,
                    borderRadius: 2,
                    backgroundColor: n <= stepNumber ? "#1B3D2F" : "#E5E7EB",
                    transition: "background-color 0.3s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Step: Verify - Send Code */}
          {step === "verify" && (
            <>
              <div style={{ marginBottom: 22 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={inputEmail}
                  onChange={(e) => {
                    setInputEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="e.g., user@example.com"
                  style={{
                    width: "100%",
                    boxSizing: "border-box",
                    backgroundColor: "#F3F4F6",
                    border: "none",
                    borderBottom: "1.5px solid #D1D5DB",
                    borderRadius: "6px 6px 0 0",
                    padding: "12px 14px",
                    fontSize: 15,
                    color: "#111827",
                    outline: "none",
                  }}
                  onFocus={(e) => (e.target.style.borderBottomColor = "#1B3D2F")}
                  onBlur={(e) => (e.target.style.borderBottomColor = "#D1D5DB")}
                />
              </div>
              {error && (
                <p
                  style={{
                    marginTop: 7,
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 500,
                  }}
                >
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading}
                style={{
                  marginTop: 24,
                  width: "100%",
                  backgroundColor: isLoading ? "#4B5563" : "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 24px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  letterSpacing: "-0.2px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1f2937")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#111827")
                }
              >
                {isLoading ? "Sending..." : "Send Reset Code"}
                <Icon name="arrow" />
              </button>
            </>
          )}

          {/* Step: Enter Code */}
          {step === "code" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  marginBottom: 24,
                }}
              >
                {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                  <div
                    key={index}
                    style={{
                      width: 56,
                      height: 64,
                      borderRadius: 12,
                      border: code[index]
                        ? "2px solid #1B3D2F"
                        : "2px solid #E5E7EB",
                      backgroundColor: code[index] ? "#F0FDF4" : "#F9FAFB",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      fontWeight: 700,
                      color: "#111827",
                      transition: "all 0.2s",
                    }}
                  >
                    {code[index] || ""}
                  </div>
                ))}
              </div>
              {error && (
                <p
                  style={{
                    textAlign: "center",
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </p>
              )}
              <Keypad onKey={handleKey} onDelete={handleDelete} />
              <button
                type="button"
                disabled={code.length !== CODE_LENGTH || isLoading}
                onClick={handleVerifyCode}
                style={{
                  marginTop: 20,
                  width: "100%",
                  backgroundColor:
                    code.length !== CODE_LENGTH || isLoading
                      ? "#D1D5DB"
                      : "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 24px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor:
                    code.length !== CODE_LENGTH || isLoading
                      ? "not-allowed"
                      : "pointer",
                  letterSpacing: "-0.2px",
                }}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
                <Icon name="arrow" />
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={isLoading}
                style={{
                  marginTop: 12,
                  width: "100%",
                  background: "none",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#1B3D2F",
                  cursor: "pointer",
                  padding: "8px",
                }}
              >
                Resend Code
              </button>
            </>
          )}

          {/* Step: New Password */}
          {step === "new_password" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    color: "#111827",
                    marginBottom: 8,
                  }}
                >
                  New Password
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="At least 6 characters"
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      backgroundColor: "#F3F4F6",
                      border: "none",
                      borderBottom: "1.5px solid #D1D5DB",
                      borderRadius: "6px 6px 0 0",
                      padding: "12px 40px 12px 14px",
                      fontSize: 15,
                      color: "#111827",
                      outline: "none",
                    }}
                    onFocus={(e) =>
                      (e.target.style.borderBottomColor = "#1B3D2F")
                    }
                    onBlur={(e) =>
                      (e.target.style.borderBottomColor = "#D1D5DB")
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 8,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "#9CA3AF",
                      padding: 4,
                    }}
                  >
                    <Icon name={showPassword ? "eyeOff" : "eye"} />
                  </button>
                </div>
              </div>
              {error && (
                <p
                  style={{
                    fontSize: 12,
                    color: "#EF4444",
                    fontWeight: 500,
                    marginBottom: 12,
                  }}
                >
                  {error}
                </p>
              )}
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={isLoading || newPassword.length < 6}
                style={{
                  marginTop: 24,
                  width: "100%",
                  backgroundColor:
                    isLoading || newPassword.length < 6
                      ? "#D1D5DB"
                      : "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 24px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor:
                    isLoading || newPassword.length < 6
                      ? "not-allowed"
                      : "pointer",
                  letterSpacing: "-0.2px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1f2937")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#111827")
                }
              >
                {isLoading ? "Resetting..." : "Reset Password"}
                <Icon name="arrow" />
              </button>
            </>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  backgroundColor: "#DCFCE7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                  color: "#16A34A",
                }}
              >
                <Icon name="check" />
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#374151",
                  lineHeight: 1.6,
                  marginBottom: 24,
                }}
              >
                Your password has been successfully reset. You can now log in
                with your new password.
              </p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate("login")}
                style={{
                  width: "100%",
                  backgroundColor: "#111827",
                  color: "white",
                  border: "none",
                  borderRadius: 14,
                  padding: "16px 24px",
                  fontSize: 16,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  cursor: "pointer",
                  letterSpacing: "-0.2px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1f2937")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#111827")
                }
              >
                Back to Login
                <Icon name="arrow" />
              </button>
            </div>
          )}
        </div>
      </div>
    </FlowLayout>
  );
}

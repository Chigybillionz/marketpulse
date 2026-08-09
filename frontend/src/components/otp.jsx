import { useState, useEffect } from "react";
import { verifyOTP } from "../services/authService";
import FlowLayout from "./layout/FlowLayout";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

export default function Otp({ onNavigate, phoneNumber, isNewUser, businessName }) {
  const [legalView, setLegalView] = useState(null);
  const [countdown, setCountdown] = useState(55);
  const [otpDigits, setOtpDigits] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const formatCountdown = (s) => `0:${s < 10 ? "0" : ""}${s}`;

  const handleOtpChange = (index, value) => {
    const newValue = value.replace(/[^0-9]/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = newValue;
    setOtpDigits(newDigits);

    // Auto-focus next input
    if (newValue && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerify = async () => {
    const otp = otpDigits.join("");
    // OTP validation is temporarily bypassed while the UI flow is being built.
    // Restore this block and the verifyOTP call when the backend is ready.
    if (otp.length < 4) {
      setError("Please enter the full 4-digit code");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await verifyOTP(phoneNumber, otp);
      
      // Save the JWT token
      if (response.token) {
        localStorage.setItem("token", response.token);
      }

      if (onNavigate) {
        onNavigate(isNewUser ? "ledger" : "pulse_trade_pin");
      }
    } catch (err) {
      setError(err.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FlowLayout
      headline="Verify it's really you"
      sub="Enter the 4-digit code we sent by SMS to keep your store records secure."
    >
    <div
      className="mp-flow__card"
      style={{
        backgroundColor: "#EEF1F5",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* ── HEADER ── */}
      <header
        style={{
          backgroundColor: "#EEF1F5",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "18px 20px 14px",
        }}
      >
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          {/* Store icon */}
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111827"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ marginTop: 3, flexShrink: 0 }}
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: "#111827",
              lineHeight: 1.2,
              letterSpacing: "-0.3px",
            }}
          >
            {businessName || 'My Store'}
          </div>
        </div>
        {/* Close X */}
        <button
          onClick={() => onNavigate && onNavigate("welcome")}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 4,
            marginTop: 2,
          }}
          aria-label="Close"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#111827"
            strokeWidth="2.3"
            strokeLinecap="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </header>

      {/* ── MAIN CONTENT ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#F5F5E8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "36px 24px 32px",
        }}
      >
        {/* Security badge — dark green circle with shield + lock */}
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            backgroundColor: "#1B3D2F",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 28,
            flexShrink: 0,
          }}
        >
          {/* Shield */}
          <svg width="22" height="24" viewBox="0 0 22 24" fill="none">
            <path
              d="M11 1L2 5v6c0 5.25 3.85 10.15 9 11.35C16.15 21.15 20 16.25 20 11V5L11 1Z"
              fill="#5A8A6A"
            />
          </svg>
          {/* Lock */}
          <svg width="18" height="22" viewBox="0 0 18 22" fill="none">
            <rect x="2" y="9" width="14" height="12" rx="2" fill="#5A8A6A" />
            <path
              d="M5 9V6a4 4 0 0 1 8 0v3"
              stroke="#5A8A6A"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="9" cy="15" r="1.5" fill="#1B3D2F" />
          </svg>
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#111827",
            letterSpacing: "-0.8px",
            marginBottom: 14,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Verification Code
        </h1>

        {/* Subtitle with phone + edit icon */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 32,
            textAlign: "center",
            flexWrap: "wrap",
          }}
        >
          <p
            style={{
              fontSize: 15,
              color: "#374151",
              lineHeight: 1.5,
              margin: 0,
              textAlign: "center",
            }}
          >
            Enter the 4-digit code sent to{" "}
            <strong style={{ color: "#111827", fontWeight: 800 }}>
              {phoneNumber || "+234 803 000 0000"}
            </strong>
          </p>
          <button
            onClick={() => onNavigate && onNavigate("welcome")}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              flexShrink: 0,
            }}
            aria-label="Edit phone number"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6B7280"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m11 4-7 7 .7 3.3 3.3.7 7-7-4-4Z" />
              <path d="m15 3 4 4" />
            </svg>
          </button>
        </div>

        {/* 4 OTP Input Boxes */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 20,
            width: "100%",
            justifyContent: "center",
          }}
        >
          {[0, 1, 2, 3].map((i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={otpDigits[i]}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              style={{
                width: 72,
                height: 72,
                backgroundColor: "#F0EFE6",
                border: "1.5px solid #D6D5C9",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                color: "#111827",
                textAlign: "center",
                flexShrink: 0,
                outline: "none",
                transition: "border-color 0.2s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#1B3D2F";
                e.target.style.backgroundColor = "white";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#D6D5C9";
                e.target.style.backgroundColor = "#F0EFE6";
              }}
            />
          ))}
        </div>

        {/* Resend timer or Error message */}
        {error ? (
          <p style={{ fontSize: 14, color: "#EF4444", marginBottom: 28, fontWeight: 500 }}>
            {error}
          </p>
        ) : (
          <p style={{ fontSize: 14, color: "#9CA3AF", marginBottom: 28 }}>
            Resend code in{" "}
            <strong style={{ color: "#374151", fontWeight: 700 }}>
              {formatCountdown(countdown)}
            </strong>
          </p>
        )}

        {/* Teal phone overlay — decorative */}
        <div
          style={{
            position: "relative",
            width: "100%",
            height: 220,
            borderRadius: 16,
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: 30,
              bottom: 0,
              top: 20,
              width: 120,
              backgroundColor: "#1A7B8A",
              borderRadius: "16px 16px 0 0",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 10px",
              boxShadow: "-6px 0 24px rgba(0,0,0,0.3)",
              gap: 10,
            }}
          >
            {/* Lock icon on phone */}
            <svg width="36" height="40" viewBox="0 0 36 40" fill="none">
              <rect
                x="4"
                y="18"
                width="28"
                height="20"
                rx="3.5"
                fill="white"
                fillOpacity="0.9"
              />
              <path
                d="M10 18v-6a8 8 0 0 1 16 0v6"
                stroke="white"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="18" cy="28" r="3" fill="#1A7B8A" />
            </svg>
            {/* Form lines */}
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 5,
              }}
            >
              {[1, 2].map((j) => (
                <div
                  key={j}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "rgba(255,255,255,0.18)",
                    borderRadius: 5,
                    padding: "5px 8px",
                  }}
                >
                  <div
                    style={{
                      width: 50,
                      height: 5,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.7)",
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.7)",
                    }}
                  />
                </div>
              ))}
              <div
                style={{
                  backgroundColor: "rgba(255,255,255,0.9)",
                  borderRadius: 6,
                  padding: "6px 0",
                  textAlign: "center",
                }}
              >
                <span
                  style={{ fontSize: 9, fontWeight: 700, color: "#1A7B8A" }}
                >
                  Verify
                </span>
              </div>
            </div>
            {/* Bottom nav dots */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              {[0, 1, 2].map((k) => (
                <div
                  key={k}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    border: "1.5px solid rgba(255,255,255,0.6)",
                    background: k === 1 ? "white" : "transparent",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <button
          onClick={handleVerify}
          disabled={isLoading}
          style={{
            width: "100%",
            backgroundColor: isLoading ? "#4B5563" : "#1B3D2F",
            color: "white",
            border: "none",
            borderRadius: 14,
            padding: "17px 24px",
            fontSize: 17,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            cursor: isLoading ? "not-allowed" : "pointer",
            marginBottom: 18,
            letterSpacing: "-0.2px",
          }}
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
          {!isLoading && (
            <svg width="20" height="16" viewBox="0 0 20 16" fill="none">
              <path
                d="M1 8h18M12 2l6 6-6 6"
                stroke="white"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {/* Legal text */}
        <p
          style={{
            fontSize: 13.5,
            color: "#6B7280",
            textAlign: "center",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          By continuing, you agree to our{" "}
          <button
            onClick={() => setLegalView("terms")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: 13.5,
              fontWeight: 800,
              color: "#111827",
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            Terms of Service
          </button>{" "}
          and{" "}
          <button
            onClick={() => setLegalView("privacy")}
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: 13.5,
              fontWeight: 800,
              color: "#111827",
              cursor: "pointer",
            }}
          >
            Privacy Policy
          </button>
          .
        </p>
      </div>

      {/* ── LEGAL OVERLAY ── */}
      {legalView === "terms" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", display: "flex", flexDirection: "column" }}>
          <TermsOfService onBack={() => setLegalView(null)} />
        </div>
      )}
      {legalView === "privacy" && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", display: "flex", flexDirection: "column" }}>
          <PrivacyPolicy onBack={() => setLegalView(null)} />
        </div>
      )}
    </div>
    </FlowLayout>
  );
}

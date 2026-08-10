import { useState } from "react";
import { requestOTP } from "../services/authService";
import FlowLayout from "./layout/FlowLayout";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

export default function WelcomePage({
  onNavigate,
  businessName,
  setBusinessName,
  phoneNumber,
  setPhoneNumber,
  setIsNewUser,
}) {
  const [language, setLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [countryCode, setCountryCode] = useState("+234");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendOtp = async () => {
    const phoneDigits = phoneNumber.replace(/\D/g, "");

    if (phoneDigits.length < 9) {
      setError("enter a valid contact");
      return;
    }

    const fullPhoneNumber = `${countryCode}${phoneDigits}`;

    setIsLoading(true);
    setError(null);

    try {
      // OTP is temporarily bypassed on the frontend so the onboarding flow can be tested
      // without waiting for SMS delivery or backend verification.
      console.log("Sending OTP request to backend...");
      await requestOTP(fullPhoneNumber, businessName);
      console.log("OTP request successful!");

      // Logic for new/returning user
      if (businessName.trim().toLowerCase() === "mama ngozi provisions") {
        setIsNewUser(false);
      } else {
        setIsNewUser(true);
      }

      onNavigate("otp");
    } catch (err) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    /* ── FlowLayout: branded split panel on desktop, centered card on mobile ── */
    <FlowLayout>
      {/* ── SCREEN CARD ── */}
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
        {/* ── NAV BAR ── */}
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
          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img
              src="/mylogo.png"
              alt="MarketPulse AI logo"
              style={{
                width: 32,
                height: 32,
                objectFit: "contain",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 800,
                color: "#111827",
                letterSpacing: "-0.4px",
              }}
            >
              MarketPulse AI
            </span>
          </div>

          {/* Language selector */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
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
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle
                  cx="8"
                  cy="8"
                  r="6.5"
                  stroke="#111827"
                  strokeWidth="1.3"
                />
                <ellipse
                  cx="8"
                  cy="8"
                  rx="3"
                  ry="6.5"
                  stroke="#111827"
                  strokeWidth="1.3"
                />
                <path
                  d="M1.5 6h13M1.5 10h13"
                  stroke="#111827"
                  strokeWidth="1.3"
                />
              </svg>
              {language}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1l4 4 4-4"
                  stroke="#111827"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showLanguageDropdown && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "100%",
                  marginTop: 4,
                  width: 140,
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: 12,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  zIndex: 50,
                  overflow: "hidden",
                }}
              >
                {["English", "Yoruba", "Hausa", "Igbo"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#374151",
                      background: "white",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f3f4f6")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* ── HERO ── */}
        <div
          style={{
            width: "100%",
            height: 330,
            position: "relative",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {/* Background color */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "#F5F5E8",
            }}
          />
          {/* Tint overlay */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(180,198,215,0.45)",
            }}
          />

          {/* Centered content — wallet icon + text */}
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
            {/* Wallet circle */}
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
              <svg width="34" height="28" viewBox="0 0 34 28" fill="none">
                <rect
                  x="1"
                  y="5"
                  width="32"
                  height="22"
                  rx="3.5"
                  stroke="white"
                  strokeWidth="2"
                />
                <path d="M1 11h32" stroke="white" strokeWidth="2" />
                <rect
                  x="21"
                  y="15.5"
                  width="9"
                  height="6"
                  rx="2"
                  fill="white"
                />
                <path
                  d="M5 5V3.5C5 2.12 6.12 1 7.5 1h19C27.88 1 29 2.12 29 3.5V5"
                  stroke="white"
                  strokeWidth="1.8"
                />
              </svg>
            </div>

            {/* Text */}
            <div
              style={{ textAlign: "center", padding: "0 32px", width: "100%" }}
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
                Welcome Back
              </h1>
              <p
                style={{
                  fontSize: 14.5,
                  color: "#374151",
                  lineHeight: 1.6,
                  maxWidth: 240,
                  margin: "0 auto",
                  textAlign: "center",
                }}
              >
                Securely access your market trading account and manage your
                provisions.
              </p>
            </div>
          </div>
        </div>

        {/* ── FORM CARD ── */}
        <div
          style={{
            flex: 1,
            backgroundColor: "white",
            padding: "28px 24px 24px",
          }}
        >
          {/* Business Name */}
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
              Business Name
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., Mama Ngozi Provisions"
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

          {/* Phone Number */}
          <div style={{ marginBottom: 4 }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                fontWeight: 600,
                color: "#111827",
                marginBottom: 8,
              }}
            >
              Phone Number
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#F3F4F6",
                border: error ? "1.5px solid #EF4444" : "1.5px solid #D1D5DB",
                borderRadius: 8,
                overflow: "hidden",
              }}
            >
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                style={{
                  padding: "12px 8px 12px 14px",
                  border: "none",
                  borderRight: "1.5px solid #D1D5DB",
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#111827",
                  backgroundColor: "#EAECEF",
                  cursor: "pointer",
                  outline: "none",
                  flexShrink: 0,
                }}
              >
                <option value="+234">🇳🇬 +234</option>
                <option value="+233">🇬🇭 +233</option>
                <option value="+255">🇹🇿 +255</option>
                <option value="+260">🇿🇲 +260</option>
                <option value="+254">🇰🇪 +254</option>
                <option value="+27">🇿🇦 +27</option>
              </select>
              <input
                type="tel"
                inputMode="numeric"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "");
                  if (val.startsWith("0")) {
                    val = val.substring(1);
                  }
                  // Keep digits only and never allow more than 10 (11th is dropped).
                  setPhoneNumber(val.slice(0, 10));
                  setError(null);
                }}
                placeholder="803 000 0000"
                style={{
                  flex: 1,
                  padding: "12px 14px",
                  fontSize: 15,
                  color: "#111827",
                  background: "transparent",
                  border: "none",
                  outline: "none",
                }}
              />
            </div>
            {error ? (
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
            ) : (
              <p style={{ marginTop: 7, fontSize: 12, color: "#9CA3AF" }}>
                We'll send a verification code via SMS
              </p>
            )}
          </div>

          {/* Send OTP Button */}
          <button
            type="button"
            onClick={handleSendOtp}
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
            Send OTP code
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path
                d="M1 7h16M11 1l6 6-6 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

        </div>

        {/* ── FOOTER ── */}
        <div
          style={{
            backgroundColor: "white",
            paddingBottom: 32,
            paddingTop: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{ height: 1, backgroundColor: "#F3F4F6", marginBottom: 16 }}
          />
          <a
            href="#help"
            onClick={(event) => {
              event.preventDefault();
              onNavigate && onNavigate("contact_support");
            }}
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              color: "#16A34A",
              marginBottom: 10,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Need help accessing your account?
          </a>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Privacy Policy
            </button>
            <button
              type="button"
              onClick={() => setShowTerms(true)}
              style={{
                fontSize: 12,
                color: "#9CA3AF",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              Terms of Service
            </button>
          </div>
        </div>

      </div>

      {showTerms && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", display: "flex", flexDirection: "column" }}>
          <TermsOfService onBack={() => setShowTerms(false)} />
        </div>
      )}
      {showPrivacy && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#fff", display: "flex", flexDirection: "column" }}>
          <PrivacyPolicy onBack={() => setShowPrivacy(false)} />
        </div>
      )}
    </FlowLayout>
  );
}

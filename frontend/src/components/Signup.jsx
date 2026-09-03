import { useState } from "react";
import { signup } from "../services/authService";
import FlowLayout from "./layout/FlowLayout";
import TermsOfService from "./TermsOfService";
import PrivacyPolicy from "./PrivacyPolicy";

export default function Signup({
  onNavigate,
  businessName,
  setBusinessName,
  email,
  setEmail,
  setIsNewUser,
  setProfilePicture,
}) {
  const [language, setLanguage] = useState("English");
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [password, setPassword] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignup = async () => {
    if (!businessName || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log("Sending signup request to backend...");
      const res = await signup(businessName, email, password);
      console.log("Signup successful!");
      
      setIsNewUser(true);
      onNavigate("login");
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
                <circle cx="8" cy="8" r="6.5" stroke="#111827" strokeWidth="1.3" />
                <ellipse cx="8" cy="8" rx="3" ry="6.5" stroke="#111827" strokeWidth="1.3" />
                <path d="M1.5 6h13M1.5 10h13" stroke="#111827" strokeWidth="1.3" />
              </svg>
              {language}
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1l4 4 4-4" stroke="#111827" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f3f4f6")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "white")}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        <div style={{ width: "100%", height: 330, position: "relative", overflow: "hidden", flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, backgroundColor: "#F5F5E8" }} />
          <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(180,198,215,0.45)" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, zIndex: 5 }}>
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
                <rect x="1" y="5" width="32" height="22" rx="3.5" stroke="white" strokeWidth="2" />
                <path d="M1 11h32" stroke="white" strokeWidth="2" />
                <rect x="21" y="15.5" width="9" height="6" rx="2" fill="white" />
                <path d="M5 5V3.5C5 2.12 6.12 1 7.5 1h19C27.88 1 29 2.12 29 3.5V5" stroke="white" strokeWidth="1.8" />
              </svg>
            </div>
            <div style={{ textAlign: "center", padding: "0 32px", width: "100%" }}>
              <h1 style={{ fontSize: 27, fontWeight: 800, color: "#111827", letterSpacing: "-0.5px", marginBottom: 8, lineHeight: 1.2, textAlign: "center" }}>
                Create Account
              </h1>
              <p style={{ fontSize: 14.5, color: "#374151", lineHeight: 1.6, maxWidth: 240, margin: "0 auto", textAlign: "center" }}>
                Join MarketPulse AI to manage your trades securely.
              </p>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, backgroundColor: "white", padding: "28px 24px 24px" }}>
          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
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

          <div style={{ marginBottom: 22 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(null);
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

          <div style={{ marginBottom: 4 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 8 }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••"
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
            {error ? (
              <p style={{ marginTop: 7, fontSize: 12, color: "#EF4444", fontWeight: 500 }}>
                {error}
              </p>
            ) : (
              <p style={{ marginTop: 7, fontSize: 12, color: "#9CA3AF" }}>
                Must be at least 8 characters long
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleSignup}
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
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#111827")}
          >
            Create Account
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
              <path d="M1 7h16M11 1l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div style={{ backgroundColor: "white", paddingBottom: 32, paddingTop: 12, textAlign: "center" }}>
          <div style={{ height: 1, backgroundColor: "#F3F4F6", marginBottom: 16 }} />
          <a
            href="#login"
            onClick={(event) => {
              event.preventDefault();
              onNavigate && onNavigate("login");
            }}
            style={{
              display: "block",
              fontSize: 14,
              fontWeight: 600,
              color: "#1B3D2F",
              marginBottom: 16,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span style={{ color: "#6B7280", fontWeight: 500 }}>Already have an account?</span> Log In
          </a>
          <div style={{ display: "flex", justifyContent: "center", gap: 24 }}>
            <button type="button" onClick={() => setShowPrivacy(true)} style={{ fontSize: 12, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer" }}>
              Privacy Policy
            </button>
            <button type="button" onClick={() => setShowTerms(true)} style={{ fontSize: 12, color: "#9CA3AF", background: "none", border: "none", cursor: "pointer" }}>
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

import { useState } from "react";

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M19 12H5M12 5l-7 7 7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M14 7V5a1 1 0 0 0-1-1H6a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1v-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10 12h11m0 0-3.5-3.5M21 12l-3.5 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logout({ onNavigate }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const goBack = () => onNavigate && onNavigate("home");

  return (
    <>
      <main className="logout-page" aria-label="Confirm logout">
        <section className="logout-shell">
          <header className="logout-topbar">
            <button
              className="logout-back"
              type="button"
              aria-label="Go back"
              onClick={goBack}
            >
              <BackIcon />
            </button>

            <div className="logout-titleblock">
              <p>Account</p>
              <h1>Logout</h1>
            </div>

            <div style={{ width: 40 }} />
          </header>

          <div className="logout-content">
            <article className="logout-card">
              <span className="logout-badge">
                <LogoutIcon />
              </span>

              <h2>Are you sure you want to log out?</h2>
              <p>
                Logging out will end your current trading session. Make sure all
                your trades are confirmed.
              </p>

              <div className="logout-actions">
                <button
                  className="logout-confirm"
                  type="button"
                  onClick={async () => {
                    setIsLoggingOut(true);
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    localStorage.removeItem("token");
                    localStorage.removeItem("businessName");
                    localStorage.removeItem("email");
                    window.location.href = "/";
                  }}
                >
                  {isLoggingOut ? "Logging out..." : "Yes, Log Out"}
                </button>
                <button className="logout-cancel" type="button" onClick={goBack}>
                  No, Stay Logged In
                </button>
              </div>
            </article>
          </div>
        </section>
      </main>

      {isLoggingOut && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            backgroundColor: "#1B3D2F",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "4px solid rgba(255,255,255,0.2)",
              borderTopColor: "white",
              animation: "spin 1s linear infinite",
            }}
          />
          <p
            style={{
              color: "white",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "-0.3px",
            }}
          >
            Logging you out...
          </p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}
    </>
  );
}

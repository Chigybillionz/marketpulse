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
  const goBack = () => onNavigate && onNavigate("profile");

  return (
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

          <button className="logout-avatar" type="button" aria-label="Profile">
            <img
              src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=120"
              alt="Profile"
            />
          </button>
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
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/";
                }}
              >
                Yes, Log Out
              </button>
              <button className="logout-cancel" type="button" onClick={goBack}>
                No, Stay Logged In
              </button>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}

import Header from "./Header";
import BalanceCard from "./BalanceCard";
import MarketPulse from "./MarketPulse";
import TransactionList from "./TransactionList";
import FloatingMic from "./FloatingMic";
import NavigationBar from "./NavigationBar";
import AppShell from "../layout/AppShell";
import useIsDesktop from "../../hooks/useIsDesktop";

export default function Homepage({
  onNavigate,
  businessName,
  balance,
  moneyIn,
  moneyOut,
  transactionsList,
}) {
  const isDesktop = useIsDesktop();

  return (
    <AppShell
      active="home"
      onNavigate={onNavigate}
      businessName={businessName}
      title={businessName || "My Store"}
      subtitle="Real-time trading insights"
    >
      {isDesktop ? (
        /* ── Desktop: wide dashboard grid inside the app shell ── */
        <div className="mp-home">
          <BalanceCard balance={balance} moneyIn={moneyIn} moneyOut={moneyOut} />
          <div className="mp-home-grid">
            <MarketPulse onNavigate={onNavigate} />
            <TransactionList
              transactionsList={transactionsList}
              onNavigate={onNavigate}
            />
          </div>
          <FloatingMic onNavigate={onNavigate} variant="desktop" />
        </div>
      ) : (
        /* ── Mobile: phone frame with fixed header + bottom nav ── */
        <div
          style={{
            minHeight: "100vh",
            background: "#e8ede8",
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            fontFamily:
              "'Inter', 'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
            WebkitFontSmoothing: "antialiased",
          }}
        >
          {/* Phone container */}
          <div
            style={{
              width: "100%",
              maxWidth: 480,
              height: "100dvh",
              background: "#f4f6f4",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* 1 — Header */}
            <div style={{ flexShrink: 0 }}>
              <Header businessName={businessName} onNavigate={onNavigate} />
            </div>

            {/* 2 — Scrollable body */}
            <div
              style={{
                flex: 1,
                overflowY: "auto",
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <style>{`.home-scroll::-webkit-scrollbar{display:none}`}</style>
              <div
                className="home-scroll"
                style={{
                  height: "100%",
                  overflowY: "auto",
                  scrollbarWidth: "none",
                }}
              >
                <BalanceCard balance={balance} moneyIn={moneyIn} moneyOut={moneyOut} />
                <MarketPulse onNavigate={onNavigate} />
                <TransactionList
                  transactionsList={transactionsList}
                  onNavigate={onNavigate}
                />
                {/* Spacer for floating mic clearance */}
                <div style={{ height: 40 }} />
              </div>
            </div>

            {/* 3 — Floating mic */}
            <FloatingMic onNavigate={onNavigate} />

            {/* 4 — Bottom navigation — always at bottom */}
            <div style={{ flexShrink: 0 }}>
              <NavigationBar onNavigate={onNavigate} currentPage="home" />
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

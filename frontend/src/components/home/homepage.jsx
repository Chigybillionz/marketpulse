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
        /* ── Mobile: Native fluid layout with fixed header + bottom nav ── */
        <main className="home-page">
          <Header businessName={businessName} onNavigate={onNavigate} />
          
          <div className="home-scroll">
            <BalanceCard balance={balance} moneyIn={moneyIn} moneyOut={moneyOut} />
            <MarketPulse onNavigate={onNavigate} />
            <TransactionList
              transactionsList={transactionsList}
              onNavigate={onNavigate}
            />
            {/* Spacer for floating mic clearance */}
            <div style={{ height: 120 }} />
          </div>

          <FloatingMic onNavigate={onNavigate} />

          <div className="mobile-only-nav" style={{ width: "100%", flexShrink: 0 }}>
            <NavigationBar onNavigate={onNavigate} currentPage="home" />
          </div>
        </main>
      )}
    </AppShell>
  );
}

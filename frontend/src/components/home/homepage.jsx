import { useState, useEffect } from "react";
import Header from "./Header";
import BalanceCard from "./BalanceCard";
import MarketPulse from "./MarketPulse";
import TransactionList from "./TransactionList";
import FloatingMic from "./FloatingMic";
import NavigationBar from "./NavigationBar";
import AppShell from "../layout/AppShell";
import useIsDesktop from "../../hooks/useIsDesktop";
import DailyProfitLossCard from "./DailyProfitLossCard";
import GoodsStockIndicator from "./GoodsStockIndicator";
import DailyInvoiceNotificationBanner from "./DailyInvoiceNotificationBanner";
import DailyClosingInvoiceModal from "./DailyClosingInvoiceModal";

export default function Homepage({
  onNavigate,
  businessName,
  balance,
  moneyIn,
  moneyOut,
  transactionsList = [],
}) {
  const isDesktop = useIsDesktop();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Listen for global request to open invoice (e.g. from NotificationBell)
  useEffect(() => {
    const handleOpenInvoiceEvent = () => setShowInvoiceModal(true);
    window.addEventListener("openDailyClosingInvoice", handleOpenInvoiceEvent);
    return () => window.removeEventListener("openDailyClosingInvoice", handleOpenInvoiceEvent);
  }, []);

  return (
    <AppShell
      active="home"
      onNavigate={onNavigate}
      businessName={businessName}
      title={businessName || "My Store"}
      subtitle="Real-time trading insights"
    >
      {/* ── Daily Closing Invoice Modal ── */}
      <DailyClosingInvoiceModal
        isOpen={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        businessName={businessName}
        moneyIn={moneyIn}
        moneyOut={moneyOut}
        transactionsList={transactionsList}
      />

      {isDesktop ? (
        /* ── Desktop: wide dashboard grid inside the app shell ── */
        <div className="mp-home">
          <DailyInvoiceNotificationBanner
            moneyIn={moneyIn}
            moneyOut={moneyOut}
            onOpenInvoice={() => setShowInvoiceModal(true)}
          />

          <BalanceCard balance={balance} moneyIn={moneyIn} moneyOut={moneyOut} />

          <div className="mp-home-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <DailyProfitLossCard
                moneyIn={moneyIn}
                moneyOut={moneyOut}
                onNavigate={onNavigate}
                onOpenInvoice={() => setShowInvoiceModal(true)}
              />
              <GoodsStockIndicator onNavigate={onNavigate} />
              <MarketPulse onNavigate={onNavigate} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              <TransactionList
                transactionsList={transactionsList}
                onNavigate={onNavigate}
              />
            </div>
          </div>

          <FloatingMic onNavigate={onNavigate} variant="desktop" />
        </div>
      ) : (
        /* ── Mobile: Native fluid layout with fixed header + bottom nav ── */
        <main className="home-page">
          <Header businessName={businessName} onNavigate={onNavigate} />

          <div className="home-scroll">
            <DailyInvoiceNotificationBanner
              moneyIn={moneyIn}
              moneyOut={moneyOut}
              onOpenInvoice={() => setShowInvoiceModal(true)}
            />

            <BalanceCard balance={balance} moneyIn={moneyIn} moneyOut={moneyOut} />

            <DailyProfitLossCard
              moneyIn={moneyIn}
              moneyOut={moneyOut}
              onNavigate={onNavigate}
              onOpenInvoice={() => setShowInvoiceModal(true)}
            />

            <GoodsStockIndicator onNavigate={onNavigate} />

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

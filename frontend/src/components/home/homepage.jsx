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
import QuickActionsGrid from "./QuickActionsGrid";
import PrimaryWalletCard from "./PrimaryWalletCard";
import HomeServiceDrawer from "./HomeServiceDrawer";
import { getProducts } from "../../services/productService";

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
  const [showShelfDrawer, setShowShelfDrawer] = useState(false);
  const [showValuationDrawer, setShowValuationDrawer] = useState(false);
  const [showPulseDrawer, setShowPulseDrawer] = useState(false);
  const [needsRestockCount, setNeedsRestockCount] = useState(0);

  // Check low stock count for Quick Action badge
  useEffect(() => {
    const checkStockAlerts = async () => {
      try {
        const prods = await getProducts();
        if (Array.isArray(prods)) {
          const count = prods.filter(
            (p) => (p.quantityInStock || 0) <= (p.lowStockThreshold || 10)
          ).length;
          setNeedsRestockCount(count);
        }
      } catch (err) {
        console.error("Failed to check stock alerts:", err);
      }
    };

    checkStockAlerts();
    window.addEventListener("inventoryUpdated", checkStockAlerts);
    return () => window.removeEventListener("inventoryUpdated", checkStockAlerts);
  }, []);

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

      {/* ── Slide-up Drawer: Stock & Shelf Check ── */}
      <HomeServiceDrawer
        isOpen={showShelfDrawer}
        onClose={() => setShowShelfDrawer(false)}
        title="Physical Goods & Shelf Check"
        subtitle="Live inventory counts and restock check"
      >
        <GoodsStockIndicator
          onNavigate={(target) => {
            setShowShelfDrawer(false);
            onNavigate(target);
          }}
        />
      </HomeServiceDrawer>

      {/* ── Slide-up Drawer: Total Goods Valuation ── */}
      <HomeServiceDrawer
        isOpen={showValuationDrawer}
        onClose={() => setShowValuationDrawer(false)}
        title="Total Goods in My Shop"
        subtitle="Shop stock valuation and restock records"
      >
        <div style={{ padding: "12px 16px" }}>
          <DailyProfitLossCard
            mode="valuation"
            moneyIn={moneyIn}
            moneyOut={moneyOut}
            onNavigate={(target) => {
              setShowValuationDrawer(false);
              onNavigate(target);
            }}
            onOpenInvoice={() => {
              setShowValuationDrawer(false);
              setShowInvoiceModal(true);
            }}
          />
        </div>
      </HomeServiceDrawer>

      {/* ── Slide-up Drawer: Audio Pulse Briefing ── */}
      <HomeServiceDrawer
        isOpen={showPulseDrawer}
        onClose={() => setShowPulseDrawer(false)}
        title="Stockpile Audio Pulse"
        subtitle="Daily Voice Advice & Market Summary"
      >
        <div style={{ padding: "16px 20px" }}>
          <MarketPulse
            onNavigate={(target, state) => {
              setShowPulseDrawer(false);
              onNavigate(target, state);
            }}
          />
        </div>
      </HomeServiceDrawer>

      {isDesktop ? (
        /* ── Desktop: wide dashboard grid inside the app shell ── */
        <div className="mp-home">
          <DailyInvoiceNotificationBanner
            moneyIn={moneyIn}
            moneyOut={moneyOut}
            onOpenInvoice={() => setShowInvoiceModal(true)}
          />

          <PrimaryWalletCard
            balance={balance}
            moneyIn={moneyIn}
            moneyOut={moneyOut}
            onNavigate={onNavigate}
            onVoiceRecord={() => onNavigate("listeng")}
          />

          <QuickActionsGrid
            onOpenShelf={() => setShowShelfDrawer(true)}
            onOpenValuation={() => setShowValuationDrawer(true)}
            onOpenAudioPulse={() => setShowPulseDrawer(true)}
            onOpenDayClose={() => setShowInvoiceModal(true)}
            onNavigate={onNavigate}
            onVoiceLog={() => onNavigate("listeng")}
            needsRestockCount={needsRestockCount}
          />

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
        /* ── Mobile: Native fluid layout with OPay-style clean hierarchy ── */
        <main className="home-page">
          <Header businessName={businessName} onNavigate={onNavigate} />

          <div className="home-scroll">
            {/* OPay-Style Compact Primary Balance Card */}
            <PrimaryWalletCard
              balance={balance}
              moneyIn={moneyIn}
              moneyOut={moneyOut}
              onNavigate={onNavigate}
            />

            {/* OPay-Style Quick Actions Icon Matrix */}
            <QuickActionsGrid
              onOpenShelf={() => setShowShelfDrawer(true)}
              onOpenValuation={() => setShowValuationDrawer(true)}
              onOpenAudioPulse={() => setShowPulseDrawer(true)}
              onOpenDayClose={() => setShowInvoiceModal(true)}
              onNavigate={onNavigate}
              needsRestockCount={needsRestockCount}
            />

            {/* Real-Time Recent Transactions Stream */}
            <TransactionList
              transactionsList={transactionsList}
              onNavigate={onNavigate}
            />

            {/* Spacer for floating mic clearance */}
            <div style={{ height: 110 }} />
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

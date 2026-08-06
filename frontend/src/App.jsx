import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LandingPage from "./components/landing_page/LandingPage";
import WelcomePage from "./components/WelcomePage";
import Otp from "./components/otp";
import Homepage from "./components/home/homepage";
import Listeng from "./components/pulse/listeng";
import PulseTradePin from "./components/pulse/trade_pin";
import ForgotPin from "./components/pulse/forgot_pin";
import Analysing from "./components/pulse/analysing";
import History from "./components/history";
import Credit from "./components/credit";
import WeeklyPulse from "./components/pulse/weekly_pulse";
import Profile from "./components/profile";
import StoreProfile from "./components/StoreProfile";
import InventoryAlert from "./components/InventoryAlert";
import PhoneNumber from "./components/PhoneNumber";
import MarketCategory from "./components/market_category";
import LanguageSetting from "./components/language_setting";
import ContactSupport from "./components/ContactSupport";
import Faqs from "./components/Faqs";
import Logout from "./components/Logout";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import DeleteData from "./components/DeleteData";
import DataPortability from "./components/DataPortability";
import Ledger from "./components/ledger";
import AIConfirmation from "./components/ai_confirmation";
import AppShell from "./components/layout/AppShell";
import "./App.css";

// Single source of truth: page id (used everywhere as onNavigate("id")) -> URL path.
const PATHS = {
  landing: "/",
  login: "/login",
  welcome: "/login",
  otp: "/otp",
  ledger: "/ledger",
  home: "/home",
  listeng: "/record",
  analysing: "/analysing",
  ai_confirmation: "/ai-confirmation",
  pulse_trade_pin: "/trade-pin",
  forgot_pin: "/forgot-pin",
  history: "/history",
  credit: "/credit",
  weekly_pulse: "/weekly-pulse",
  profile: "/profile",
  storeProfile: "/store-profile",
  inventoryAlert: "/inventory-alerts",
  phoneNumber: "/phone-number",
  market_category: "/market-category",
  language_setting: "/language",
  contact_support: "/contact-support",
  faqs: "/faqs",
  privacy_policy: "/privacy-policy",
  terms_of_service: "/terms",
  delete_data: "/delete-data",
  data_portability: "/data-portability",
  logout: "/logout",
};

function App() {
  const navigate = useNavigate();

  // User Onboarding Details
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isNewUser, setIsNewUser] = useState(true);

  // Financial States
  const [balance, setBalance] = useState(142500); // initial balance of 142,500
  const [moneyIn, setMoneyIn] = useState(142000);
  const [moneyOut, setMoneyOut] = useState(89000);
  const [transactionsList, setTransactionsList] = useState([
    {
      id: 1,
      type: "debit",
      icon: "bag",
      title: "Bulk Flour Restock",
      meta: "Today, 10:45 AM",
      amount: "-₦24,500",
      isPositive: false,
      iconBg: "bg-green-100",
      iconColor: "text-green-800",
    },
    {
      id: 2,
      type: "credit",
      icon: "receipt",
      title: "POS Settlement",
      meta: "Today, 08:30 AM",
      amount: "+₦12,200",
      isPositive: true,
      iconBg: "bg-[#052e16]/10",
      iconColor: "text-[#052e16]",
    },
    {
      id: 3,
      type: "debit",
      icon: "bolt",
      title: "Utility Payment",
      meta: "Yesterday",
      amount: "-₦5,000",
      isPositive: false,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
    },
  ]);

  // Navigate by page id (keeps the existing onNavigate("id") API across the app).
  const handleNavigate = (page, state) => {
    navigate(PATHS[page] ?? "/home", { state });
  };

  // "Back" uses the real browser history, so arrows return to the actual
  // previous page. Falls back to a default if there is nothing to go back to.
  const handleBack = (fallback = "home") => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(PATHS[fallback] ?? "/home");
    }
  };

  return (
    <Routes>
      <Route
        path={PATHS.landing}
        element={<LandingPage onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.welcome}
        element={
          <WelcomePage
            onNavigate={handleNavigate}
            businessName={businessName}
            setBusinessName={setBusinessName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            setIsNewUser={setIsNewUser}
          />
        }
      />
      <Route
        path={PATHS.otp}
        element={
          <Otp
            onNavigate={handleNavigate}
            phoneNumber={phoneNumber}
            isNewUser={isNewUser}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.ledger}
        element={
          <Ledger onNavigate={handleNavigate} phoneNumber={phoneNumber} />
        }
      />
      <Route
        path={PATHS.home}
        element={
          <Homepage
            onNavigate={handleNavigate}
            businessName={businessName}
            balance={balance}
            moneyIn={moneyIn}
            moneyOut={moneyOut}
            transactionsList={transactionsList}
          />
        }
      />
      <Route
        path={PATHS.listeng}
        element={
          <AppShell
            active="pulse"
            onNavigate={handleNavigate}
            businessName={businessName}
            title="MarketPulse AI"
            subtitle="Record a trade update for analysis"
          >
            <Listeng onNavigate={handleNavigate} businessName={businessName} />
          </AppShell>
        }
      />
      <Route
        path={PATHS.analysing}
        element={
          <AppShell
            active="pulse"
            onNavigate={handleNavigate}
            businessName={businessName}
            title="MarketPulse AI"
            subtitle="Sorting your voice note into ledger details"
          >
            <Analysing onNavigate={handleNavigate} businessName={businessName} />
          </AppShell>
        }
      />
      <Route
        path={PATHS.ai_confirmation}
        element={<AIConfirmation onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.pulse_trade_pin}
        element={
          <PulseTradePin
            onNavigate={handleNavigate}
            onBack={() => handleBack("ai_confirmation")}
            businessName={businessName}
            setBalance={setBalance}
            setMoneyIn={setMoneyIn}
            setMoneyOut={setMoneyOut}
            setTransactionsList={setTransactionsList}
          />
        }
      />
      <Route
        path={PATHS.forgot_pin}
        element={
          <ForgotPin
            onNavigate={handleNavigate}
            onBack={() => handleBack("pulse_trade_pin")}
            phoneNumber={phoneNumber}
          />
        }
      />
      <Route
        path={PATHS.history}
        element={
          <History
            onNavigate={handleNavigate}
            balance={balance}
            transactionsList={transactionsList}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.credit}
        element={
          <Credit onNavigate={handleNavigate} businessName={businessName} />
        }
      />
      <Route
        path={PATHS.weekly_pulse}
        element={
          <WeeklyPulse onNavigate={handleNavigate} businessName={businessName} />
        }
      />
      <Route
        path={PATHS.profile}
        element={
          <Profile
            onNavigate={handleNavigate}
            businessName={businessName}
            phoneNumber={phoneNumber}
          />
        }
      />
      <Route
        path={PATHS.storeProfile}
        element={
          <StoreProfile
            onNavigate={handleNavigate}
            businessName={businessName}
            setBusinessName={setBusinessName}
          />
        }
      />
      <Route
        path={PATHS.inventoryAlert}
        element={<InventoryAlert onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.phoneNumber}
        element={
          <PhoneNumber
            onNavigate={handleNavigate}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        }
      />
      <Route
        path={PATHS.market_category}
        element={<MarketCategory onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.language_setting}
        element={
          <LanguageSetting
            onNavigate={handleNavigate}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.contact_support}
        element={
          <ContactSupport
            onNavigate={handleNavigate}
            onBack={() => handleBack("profile")}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.faqs}
        element={<Faqs onNavigate={handleNavigate} businessName={businessName} />}
      />
      <Route
        path={PATHS.privacy_policy}
        element={
          <PrivacyPolicy
            onNavigate={handleNavigate}
            onBack={() => handleBack("welcome")}
          />
        }
      />
      <Route
        path={PATHS.terms_of_service}
        element={
          <TermsOfService
            onNavigate={handleNavigate}
            onBack={() => handleBack("welcome")}
          />
        }
      />
      <Route
        path={PATHS.delete_data}
        element={
          <DeleteData
            onNavigate={handleNavigate}
            onBack={() => handleBack("privacy_policy")}
          />
        }
      />
      <Route
        path={PATHS.data_portability}
        element={
          <DataPortability
            onNavigate={handleNavigate}
            onBack={() => handleBack("privacy_policy")}
          />
        }
      />
      <Route path={PATHS.logout} element={<Logout onNavigate={handleNavigate} />} />
      <Route path="*" element={<Navigate to={PATHS.welcome} replace />} />
    </Routes>
  );
}

export default App;

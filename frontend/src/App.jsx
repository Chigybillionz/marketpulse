import { useState, useEffect } from "react";
import { getTransactions } from "./services/transactionService";
import { getUserProfile } from "./services/authService";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import LandingPage from "./components/landing_page/LandingPage";
import FeaturesPage from "./components/landing_page/FeaturesPage";
import HowItWorksPage from "./components/landing_page/HowItWorksPage";
import PricingPage from "./components/landing_page/PricingPage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Homepage from "./components/home/homepage";
import Listeng from "./components/pulse/listeng";
import PulseTradePin from "./components/pulse/trade_pin";
import ForgotPin from "./components/pulse/forgot_pin";
import ForgotPassword from "./components/ForgotPassword";
import Analysing from "./components/pulse/analysing";
import History from "./components/history";
import Credit from "./components/credit";
import WeeklyPulse from "./components/pulse/weekly_pulse";
import Profile from "./components/profile";
import StoreProfile from "./components/StoreProfile";
import InventoryAlert from "./components/InventoryAlert";
import Email from "./components/Email";
import MarketCategory from "./components/market_category";
import LanguageSetting from "./components/language_setting";
import ContactSupport from "./components/ContactSupport";
import Faqs from "./components/Faqs";
import DebtorProfile from "./components/DebtorProfile";
import Logout from "./components/Logout";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermsOfService";
import DeleteData from "./components/DeleteData";
import DataPortability from "./components/DataPortability";
import Ledger from "./components/ledger";
import AIConfirmation from "./components/ai_confirmation";
import AppShell from "./components/layout/AppShell";
import { LanguageProvider } from "./i18n/LanguageContext";
import "./App.css";

// Single source of truth: page id (used everywhere as onNavigate("id")) -> URL path.
const PATHS = {
  landing: "/",
  features: "/features",
  "how-it-works": "/how-it-works",
  pricing: "/pricing",
  login: "/login",
  signup: "/signup",
  ledger: "/ledger",
  home: "/home",
  listeng: "/record",
  analysing: "/analysing",
  ai_confirmation: "/ai-confirmation",
  pulse_trade_pin: "/trade-pin",
  forgot_pin: "/forgot-pin",
  forgot_password: "/forgot-password",
  history: "/history",
  credit: "/credit",
  weekly_pulse: "/weekly-pulse",
  profile: "/profile",
  storeProfile: "/store-profile",
  inventoryAlert: "/inventory-alerts",
  email: "/email",
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
  const location = useLocation();

  // User Onboarding Details
  const [businessName, setBusinessName] = useState(() => localStorage.getItem('businessName') || "");
  const [email, setEmail] = useState(() => localStorage.getItem('email') || "");
  const [profilePicture, setProfilePicture] = useState(() => localStorage.getItem('profilePicture') || "");
  const [locationStr, setLocationStr] = useState(() => localStorage.getItem('location') || "");
  const [businessType, setBusinessType] = useState(() => localStorage.getItem('businessType') || "Retail");
  const [isNewUser, setIsNewUser] = useState(true);

  // Financial States
  const [balance, setBalance] = useState(0); 
  const [moneyIn, setMoneyIn] = useState(0);
  const [moneyOut, setMoneyOut] = useState(0);
  const [transactionsList, setTransactionsList] = useState([]);

  // Listen for location changes dispatched across components or storage
  useEffect(() => {
    const handleLocationUpdate = (e) => {
      const newLoc = e.detail !== undefined ? e.detail : localStorage.getItem('location');
      setLocationStr(newLoc || "");
    };
    window.addEventListener('storeLocationChanged', handleLocationUpdate);
    window.addEventListener('storage', handleLocationUpdate);
    return () => {
      window.removeEventListener('storeLocationChanged', handleLocationUpdate);
      window.removeEventListener('storage', handleLocationUpdate);
    };
  }, []);

  // Fetch transactions and profile on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // Wait until logged in

        const email = localStorage.getItem('email');
        if (email) {
          try {
            const profileRes = await getUserProfile(email);
            if (profileRes && profileRes.user) {
              const u = profileRes.user;
              localStorage.setItem('businessName', u.businessName || "");
              localStorage.setItem('email', u.email || "");
              localStorage.setItem('profilePicture', u.profilePicture || "");
              localStorage.setItem('location', u.location || "");
              localStorage.setItem('businessType', u.businessType || "Retail");
              localStorage.setItem('category', u.category || "Dry Goods");
              localStorage.setItem('hasPin', u.hasPin ? 'true' : 'false');
              if (u.language) {
                localStorage.setItem('appLanguage', u.language);
                window.dispatchEvent(new CustomEvent('appLanguageChanged', { detail: u.language }));
              }
              setBusinessName(u.businessName || "");
              setEmail(u.email || "");
              setProfilePicture(u.profilePicture || "");
              setLocationStr(u.location || "");
              setBusinessType(u.businessType || "Retail");
            }
          } catch (profileError) {
            console.error("Failed to load profile:", profileError);
          }
        }

        const data = await getTransactions();
        
        let calcBalance = 0;
        let calcMoneyIn = 0;
        let calcMoneyOut = 0;
        
        const formattedTxs = data.map(tx => {
          const isIncome = tx.type === 'Income';
          const amountNum = Number(tx.amount);
          
          if (isIncome) {
            calcMoneyIn += amountNum;
            calcBalance += amountNum;
          } else {
            calcMoneyOut += amountNum;
            calcBalance -= amountNum;
          }

          return {
            id: tx._id,
            type: isIncome ? "credit" : "debit",
            icon: isIncome ? "bag" : "bolt",
            title: tx.description,
            meta: new Date(tx.date).toLocaleDateString() + ' ' + new Date(tx.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
            amount: `${isIncome ? '+' : '-'}\u20A6${amountNum.toLocaleString()}`,
            isPositive: isIncome,
            iconBg: isIncome ? "bg-green-100" : "bg-red-100",
            iconColor: isIncome ? "text-green-800" : "text-red-600",
            rawDate: new Date(tx.date),
          };
        });

        setTransactionsList(formattedTxs);
        setBalance(calcBalance);
        setMoneyIn(calcMoneyIn);
        setMoneyOut(calcMoneyOut);
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    };

    fetchData();
  }, [location.pathname]);

  // Inactivity Auto-Logout (5 minutes)
  useEffect(() => {
    let inactivityTimer;

    const handleLogout = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("businessName");
      localStorage.removeItem("email");
      localStorage.removeItem("hasPin");
      localStorage.removeItem("profilePicture");
      localStorage.removeItem("location");
      localStorage.removeItem("businessType");
      // Redirect to login if they time out
      window.location.href = "/login";
    };

    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      // Only set the auto-logout timer if a user is logged in
      if (localStorage.getItem("token")) {
        inactivityTimer = setTimeout(handleLogout, 5 * 60 * 1000); // 5 minutes
      }
    };

    // Start timer on mount
    resetTimer();

    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
    ];

    // Reset timer whenever user interacts with the app
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [location.pathname]);

  // Navigate by page id (keeps the existing onNavigate("id") API across the app).
  const handleNavigate = (page, state) => {
    if (page.startsWith("credit/")) {
      navigate(`/${page}`, { state });
    } else {
      navigate(PATHS[page] ?? "/home", { state });
    }
  };

  // "Back" uses context-aware navigation:
  // 1. If explicit previous route context is passed via location.state?.from, return there.
  // 2. If browser/in-app history exists (SPA history index > 0), navigate(-1).
  // 3. Otherwise fall back safely to the specified fallback route (defaulting to "profile" or "home").
  const handleBack = (fallback = "home") => {
    const from = location.state?.from;
    const hasInAppHistory =
      window.history.state &&
      typeof window.history.state.idx === "number" &&
      window.history.state.idx > 0;

    if (from && PATHS[from]) {
      if (hasInAppHistory) {
        navigate(-1);
      } else {
        navigate(PATHS[from]);
      }
      return;
    }

    if (hasInAppHistory) {
      navigate(-1);
    } else {
      navigate(PATHS[fallback] ?? "/home");
    }
  };

  return (
    <LanguageProvider>
    <Routes>
      <Route
        path={PATHS.landing}
        element={<LandingPage onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.features}
        element={<FeaturesPage onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS["how-it-works"]}
        element={<HowItWorksPage onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.pricing}
        element={<PricingPage onNavigate={handleNavigate} />}
      />
      <Route
        path={PATHS.login}
        element={
          <Login
            onNavigate={handleNavigate}
            email={email}
            setEmail={setEmail}
            setIsNewUser={setIsNewUser}
            setBusinessName={setBusinessName}
            setProfilePicture={setProfilePicture}
            setLocationStr={setLocationStr}
            setBusinessType={setBusinessType}
          />
        }
      />
      <Route
        path={PATHS.signup}
        element={
          <Signup
            onNavigate={handleNavigate}
            businessName={businessName}
            setBusinessName={setBusinessName}
            email={email}
            setEmail={setEmail}
            setIsNewUser={setIsNewUser}
            setProfilePicture={setProfilePicture}
          />
        }
      />
      <Route
        path={PATHS.ledger}
        element={
          <Ledger onNavigate={handleNavigate} email={email} />
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
            onBack={() =>
              handleBack(
                location.state?.pinMode === "change" || location.state?.from === "profile"
                  ? "profile"
                  : "ai_confirmation"
              )
            }
            businessName={businessName}
            email={email}
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
            email={email}
          />
        }
      />
      <Route
        path={PATHS.forgot_password}
        element={
          <ForgotPassword
            onNavigate={handleNavigate}
            email={email}
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
          <Credit onNavigate={handleNavigate} businessName={businessName} email={email} />
        }
      />
      <Route
        path="/credit/:id"
        element={
          <DebtorProfile onNavigate={handleNavigate} businessName={businessName} email={email} />
        }
      />
      <Route
        path={PATHS.weekly_pulse}
        element={
          <WeeklyPulse
            onNavigate={handleNavigate}
            businessName={businessName}
            initialPeriod={location.state?.period}
          />
        }
      />
      <Route
        path={PATHS.profile}
        element={
          <Profile
            onNavigate={handleNavigate}
            businessName={businessName}
            email={email}
            profilePicture={profilePicture}
            locationStr={locationStr}
            setLocationStr={setLocationStr}
          />
        }
      />
      <Route
        path={PATHS.storeProfile}
        element={
          <StoreProfile
            onNavigate={handleNavigate}
            onBack={() => handleBack("profile")}
            businessName={businessName}
            setBusinessName={setBusinessName}
            email={email}
            profilePicture={profilePicture}
            setProfilePicture={setProfilePicture}
            locationStr={locationStr}
            setLocationStr={setLocationStr}
            businessType={businessType}
            setBusinessType={setBusinessType}
          />
        }
      />
      <Route
        path={PATHS.inventoryAlert}
        element={
          <InventoryAlert
            onNavigate={handleNavigate}
            onBack={() => handleBack("profile")}
          />
        }
      />
      <Route
        path={PATHS.email}
        element={
          <Email
            onNavigate={handleNavigate}
            onBack={() => handleBack("profile")}
            email={email}
            setEmail={setEmail}
          />
        }
      />
      <Route
        path={PATHS.market_category}
        element={
          <MarketCategory
            onNavigate={handleNavigate}
            onBack={() => handleBack("profile")}
            profilePicture={profilePicture}
          />
        }
      />
      <Route
        path={PATHS.language_setting}
        element={
          <LanguageSetting
            onNavigate={handleNavigate}
            onBack={() => handleBack("profile")}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.contact_support}
        element={
          <ContactSupport
            onNavigate={handleNavigate}
            onBack={() => handleBack(location.state?.from || "profile")}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.faqs}
        element={
          <Faqs
            onNavigate={handleNavigate}
            onBack={() => handleBack(location.state?.from || "profile")}
            businessName={businessName}
          />
        }
      />
      <Route
        path={PATHS.privacy_policy}
        element={
          <PrivacyPolicy
            onNavigate={handleNavigate}
            onBack={() => handleBack(location.state?.from || "profile")}
          />
        }
      />
      <Route
        path={PATHS.terms_of_service}
        element={
          <TermsOfService
            onNavigate={handleNavigate}
            onBack={() => handleBack(location.state?.from || "profile")}
          />
        }
      />
      <Route
        path={PATHS.delete_data}
        element={
          <DeleteData
            onNavigate={handleNavigate}
            onBack={() => handleBack("privacy_policy")}
            email={email}
          />
        }
      />
      <Route
        path={PATHS.data_portability}
        element={
          <DataPortability
            onNavigate={handleNavigate}
            onBack={() => handleBack("privacy_policy")}
            profilePicture={profilePicture}
            email={email}
          />
        }
      />
      <Route
        path={PATHS.logout}
        element={
          <Logout
            onNavigate={handleNavigate}
            onBack={() => handleBack(location.state?.from || "profile")}
          />
        }
      />

      {/* Direct profile settings URL aliases */}
      <Route path="/profile/store" element={<Navigate to={PATHS.storeProfile} replace state={{ from: "profile" }} />} />
      <Route path="/profile/alerts" element={<Navigate to={PATHS.inventoryAlert} replace state={{ from: "profile" }} />} />
      <Route path="/profile/inventory" element={<Navigate to={PATHS.inventoryAlert} replace state={{ from: "profile" }} />} />
      <Route path="/profile/inventory-alerts" element={<Navigate to={PATHS.inventoryAlert} replace state={{ from: "profile" }} />} />
      <Route path="/profile/category" element={<Navigate to={PATHS.market_category} replace state={{ from: "profile" }} />} />
      <Route path="/profile/market-category" element={<Navigate to={PATHS.market_category} replace state={{ from: "profile" }} />} />
      <Route path="/profile/language" element={<Navigate to={PATHS.language_setting} replace state={{ from: "profile" }} />} />
      <Route path="/profile/email" element={<Navigate to={PATHS.email} replace state={{ from: "profile" }} />} />
      <Route path="/profile/security" element={<Navigate to={PATHS.pulse_trade_pin} replace state={{ pinMode: "change", from: "profile" }} />} />
      <Route path="*" element={<Navigate to={PATHS.login} replace />} />
    </Routes>
    </LanguageProvider>
  );
}

export default App;

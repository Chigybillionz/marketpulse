import { useState } from "react";
import WelcomePage from "./components/WelcomePage";
import Otp from "./components/otp";
import Homepage from "./components/homepage";
import Listeng from "./components/listeng";
import OtpVerification from "./components/otpVerification";
import Analysing from "./components/analysing";
import History from "./components/history";
import Credit from "./components/credit";
import WeeklyPulse from "./components/weekly_pulse";
import Profile from "./components/profile";
import StoreProfile from "./components/StoreProfile";
import InventoryAlert from "./components/InventoryAlert";
import PhoneNumber from "./components/PhoneNumber";
import MarketCategory from "./components/market_category";
import LanguageSetting from "./components/language_setting";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("language_setting");

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === "welcome" && <WelcomePage onNavigate={handleNavigate} />}
      {currentPage === "otp" && <Otp onNavigate={handleNavigate} />}
      {currentPage === "home" && <Homepage onNavigate={handleNavigate} />}
      {currentPage === "listeng" && <Listeng onNavigate={handleNavigate} />}
      {currentPage === "otpVerification" && (
        <OtpVerification onNavigate={handleNavigate} />
      )}
      {currentPage === "analysing" && <Analysing onNavigate={handleNavigate} />}
      {currentPage === "history" && <History onNavigate={handleNavigate} />}
      {currentPage === "credit" && <Credit onNavigate={handleNavigate} />}
      {currentPage === "weekly_pulse" && (
        <WeeklyPulse onNavigate={handleNavigate} />
      )}
      {currentPage === "profile" && <Profile onNavigate={handleNavigate} />}
      {currentPage === "storeProfile" && (
        <StoreProfile onNavigate={handleNavigate} />
      )}
      {currentPage === "inventoryAlert" && (
        <InventoryAlert onNavigate={handleNavigate} />
      )}
      {currentPage === "phoneNumber" && (
        <PhoneNumber onNavigate={handleNavigate} />
      )}
      {currentPage === "market_category" && (
        <MarketCategory onNavigate={handleNavigate} />
      )}
      {currentPage === "language_setting" && (
        <LanguageSetting onNavigate={handleNavigate} />
      )}
    </>
  );
}

export default App;

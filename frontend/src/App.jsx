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
import Ledger from "./components/ledger";
import AIConfirmation from "./components/ai_confirmation";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("welcome");
  
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
      type: 'debit',
      icon: 'bag',
      title: 'Bulk Flour Restock',
      meta: 'Today, 10:45 AM',
      amount: '-₦24,500',
      isPositive: false,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-800'
    },
    {
      id: 2,
      type: 'credit',
      icon: 'receipt',
      title: 'POS Settlement',
      meta: 'Today, 08:30 AM',
      amount: '+₦12,200',
      isPositive: true,
      iconBg: 'bg-[#052e16]/10',
      iconColor: 'text-[#052e16]'
    },
    {
      id: 3,
      type: 'debit',
      icon: 'bolt',
      title: 'Utility Payment',
      meta: 'Yesterday',
      amount: '-₦5,000',
      isPositive: false,
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {currentPage === "welcome" && (
        <WelcomePage 
          onNavigate={handleNavigate} 
          businessName={businessName} 
          setBusinessName={setBusinessName} 
          phoneNumber={phoneNumber} 
          setPhoneNumber={setPhoneNumber} 
          setIsNewUser={setIsNewUser}
        />
      )}
      {currentPage === "otp" && (
        <Otp 
          onNavigate={handleNavigate} 
          phoneNumber={phoneNumber} 
          isNewUser={isNewUser}
        />
      )}
      {currentPage === "ledger" && (
        <Ledger 
          onNavigate={handleNavigate} 
        />
      )}
      {currentPage === "home" && (
        <Homepage 
          onNavigate={handleNavigate} 
          businessName={businessName} 
          balance={balance} 
          moneyIn={moneyIn}
          moneyOut={moneyOut}
          transactionsList={transactionsList}
        />
      )}
      {currentPage === "listeng" && (
        <Listeng 
          onNavigate={handleNavigate} 
          businessName={businessName}
        />
      )}
      {currentPage === "analysing" && (
        <Analysing 
          onNavigate={handleNavigate} 
          businessName={businessName}
        />
      )}
      {currentPage === "ai_confirmation" && (
        <AIConfirmation 
          onNavigate={handleNavigate} 
        />
      )}
      {currentPage === "otpVerification" && (
        <OtpVerification 
          onNavigate={handleNavigate} 
          businessName={businessName}
          setBalance={setBalance}
          setMoneyIn={setMoneyIn}
          setTransactionsList={setTransactionsList}
        />
      )}
      {currentPage === "history" && (
        <History 
          onNavigate={handleNavigate} 
          balance={balance}
          transactionsList={transactionsList}
        />
      )}
      {currentPage === "credit" && (
        <Credit 
          onNavigate={handleNavigate} 
        />
      )}
      {currentPage === "weekly_pulse" && (
        <WeeklyPulse 
          onNavigate={handleNavigate} 
          businessName={businessName}
        />
      )}
      {currentPage === "profile" && (
        <Profile 
          onNavigate={handleNavigate} 
          businessName={businessName} 
          phoneNumber={phoneNumber}
        />
      )}
      {currentPage === "storeProfile" && (
        <StoreProfile 
          onNavigate={handleNavigate} 
          businessName={businessName}
          setBusinessName={setBusinessName}
        />
      )}
      {currentPage === "inventoryAlert" && (
        <InventoryAlert 
          onNavigate={handleNavigate} 
        />
      )}
      {currentPage === "phoneNumber" && (
        <PhoneNumber 
          onNavigate={handleNavigate} 
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
      )}
      {currentPage === "market_category" && (
        <MarketCategory 
          onNavigate={handleNavigate} 
        />
      )}
      {currentPage === "language_setting" && (
        <LanguageSetting 
          onNavigate={handleNavigate} 
        />
      )}
    </>
  );
}

export default App;

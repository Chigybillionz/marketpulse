import { useState } from "react";
import { useLocation } from "react-router-dom";

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

function StoreIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 32 32" aria-hidden="true">
      <path d="M6 13h20l-2.2-6.5H8.2L6 13Z" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M8 13v12h16V13" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M11 25v-7h10v7" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinejoin="round" />
      <path d="M5 13h22" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 48 48" aria-hidden="true">
      <path d="M15 21v-6.2C15 9.6 18.9 6 24 6s9 3.6 9 8.8V21" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <rect x="12" y="20" width="24" height="20" rx="2.5" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
      <circle cx="24" cy="30" r="3" fill="currentColor" />
    </svg>
  );
}

function DeleteIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 32 24" aria-hidden="true">
      <path d="M11 4h15c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H11l-7-8 7-8Z" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="m16 8 7 8M23 8l-7 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg className="w-full h-full" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h13" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="m13 6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PulseTradePin({
  onNavigate,
  onBack,
  businessName,
  setBalance,
  setMoneyIn,
  setMoneyOut,
  setTransactionsList,
}) {
  const [pin, setPin] = useState("");
  const location = useLocation();
  const transactionData = location.state?.transactionData || {
    type: "credit",
    amount: 15000,
    description: "Bulk Garri Sale",
    category: "Dry Goods"
  };
  const amountNum = Number(transactionData.amount) || 15000;
  const isIncome = transactionData.type?.toLowerCase() === 'income' || transactionData.type?.toLowerCase() === 'credit';
  
  const canConfirm = pin.length === 4;

  const addDigit = (digit) => {
    setPin((currentPin) =>
      currentPin.length < 4 ? `${currentPin}${digit}` : currentPin,
    );
  };

  const removeDigit = () => {
    setPin((currentPin) => currentPin.slice(0, -1));
  };

  const handleConfirm = () => {
    if (!canConfirm) return;

    if (setBalance) {
      setBalance((prev) => isIncome ? prev + amountNum : prev - amountNum);
    }

    if (isIncome && setMoneyIn) {
      setMoneyIn((prev) => prev + amountNum);
    } else if (!isIncome && setMoneyOut) {
      setMoneyOut((prev) => prev + amountNum);
    }

    if (setTransactionsList) {
      const newTx = {
        id: Date.now(),
        type: isIncome ? "credit" : "debit",
        icon: isIncome ? "bag" : "bolt",
        title: transactionData.description || "Voice Input",
        meta: `Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - Voice Input`,
        amount: `${isIncome ? '+' : '-'}\u20A6${amountNum.toLocaleString()}`,
        isPositive: isIncome,
        iconBg: isIncome ? "bg-green-100" : "bg-red-100",
        iconColor: isIncome ? "text-green-800" : "text-red-600",
      };

      setTransactionsList((prev) => [newTx, ...prev]);
    }

    onNavigate("home");
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Topbar for mobile, absolutely positioned on desktop */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none lg:pointer-events-auto">
          <button
            type="button"
            aria-label="Back"
            onClick={() => (onBack ? onBack() : onNavigate("ai_confirmation"))}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm border border-slate-200 text-slate-800 pointer-events-auto hover:bg-white transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <path d="M12 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="hidden lg:flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-slate-200 pointer-events-auto">
            <span className="w-6 h-6 text-slate-700">
              <StoreIcon />
            </span>
            <span className="font-bold text-slate-800 text-sm">{businessName || "My Store"}</span>
          </div>
        </header>

        {/* Left Side: Rich Hero Panel */}
        <div className="flex-1 lg:max-w-md bg-[#052e16] p-8 lg:p-14 flex flex-col justify-center text-white relative overflow-hidden pt-24">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-10 border border-white/20 shadow-inner">
            <div className="w-7 h-7 text-green-100">
              <LockIcon />
            </div>
          </div>

          <span className="text-green-300/80 text-xs font-bold tracking-widest uppercase mb-3 block">
            Approval required
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mb-6">
            Confirm this transaction with your 4-digit Trade PIN.
          </h2>
          <p className="text-green-100/70 text-base leading-relaxed mb-12">
            Your PIN protects sales, expenses, and credit entries before they reach your secure ledger.
          </p>

          <div className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
            <span className="block text-green-200/80 text-xs font-bold tracking-widest uppercase mb-2">
              Transaction amount
            </span>
            <strong className="text-4xl font-serif font-bold text-white">
              &#8358;{amountNum.toLocaleString()}
            </strong>
          </div>
        </div>

        {/* Right Side: Keypad Panel */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full lg:mt-8">
            <div className="mb-10 text-center lg:text-left">
              <p className="text-slate-600 text-lg lg:text-xl">
                Enter your 4-digit PIN to confirm this {isIncome ? 'sale' : 'expense'} of{" "}
                <strong className="text-slate-900 font-bold">&#8358;{amountNum.toLocaleString()}</strong>.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 mb-12 shadow-inner">
              <div className="text-center mb-6">
                <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                  Enter your Trade PIN
                </h2>
              </div>
              <div className="flex justify-center gap-6" aria-label="Trade PIN digits entered">
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded-full border-4 transition-all duration-200 ${
                      index < pin.length 
                        ? "bg-slate-800 border-slate-800 scale-110" 
                        : "bg-transparent border-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-[320px] mx-auto mb-10">
              {digits.map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => addDigit(digit)}
                  className="h-16 lg:h-20 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] text-3xl font-bold text-slate-800 active:scale-95 transition-all"
                >
                  {digit}
                </button>
              ))}
              <div className="h-16 lg:h-20"></div> {/* Empty cell */}
              <button
                type="button"
                onClick={() => addDigit("0")}
                className="h-16 lg:h-20 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] text-3xl font-bold text-slate-800 active:scale-95 transition-all"
              >
                0
              </button>
              <button
                type="button"
                onClick={removeDigit}
                aria-label="Delete last digit"
                className="h-16 lg:h-20 rounded-2xl bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-500 active:scale-95 transition-all"
              >
                <div className="w-8 h-6">
                  <DeleteIcon />
                </div>
              </button>
            </div>

            <div className="flex items-center justify-between">
              <a
                href="#forgot-pin"
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate("forgot_pin");
                }}
                className="text-slate-500 font-semibold hover:text-slate-800 transition-colors"
              >
                Forgot PIN?
              </a>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  canConfirm 
                    ? "bg-[#7e9c86] hover:bg-[#6b8572] text-white shadow-[#7e9c86]/30 active:scale-95 cursor-pointer" 
                    : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                }`}
              >
                <span>Confirm</span>
                <div className="w-6 h-6">
                  <ArrowRightIcon />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}

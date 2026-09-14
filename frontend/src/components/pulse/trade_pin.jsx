import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { createTransaction } from "../../services/transactionService";
import { setupPin, verifyPin } from "../../services/authService";
import { addCreditTransaction } from "../../services/debtorService";
import { useLanguage } from "../../i18n/LanguageContext";

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
      <path d="m16 8 7 8M23 8l-7 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
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

function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function PulseTradePin({
  onNavigate,
  onBack,
  businessName,
  email,
  setBalance,
  setMoneyIn,
  setMoneyOut,
  setTransactionsList,
}) {
  const { t } = useLanguage();
  const location = useLocation();

  // ── Change-PIN mode ────────────────────────────────────────────────
  // Entered from Profile → "Change Trade PIN" (location.state.pinMode ===
  // "change"). In this mode NO transaction data or amount is shown — the
  // user only manages their PIN:
  //   verify (current PIN) → create (new PIN) → confirm → done.
  const transactionData = location.state?.transactionData;
  const isChangeMode = location.state?.pinMode === "change" || !transactionData;

  const [pin, setPin] = useState("");
  const [createdPin, setCreatedPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine mode: "create" | "confirm" | "verify"
  const [mode, setMode] = useState(isChangeMode ? "verify" : "verify");


  const amountNum = transactionData?.amount !== undefined && transactionData?.amount !== null ? Number(transactionData.amount) : 15000;
  const isIncome = transactionData?.type?.toLowerCase() === 'income' || transactionData?.type?.toLowerCase() === 'credit';

  // On mount, check if user has a PIN (normal transaction flow only —
  // change mode always starts by verifying the current PIN).
  useEffect(() => {
    if (isChangeMode) {
      setMode("verify");
      return;
    }
    const hasPin = localStorage.getItem('hasPin');
    if (hasPin === 'true') {
      setMode("verify");
    } else {
      setMode("create");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const canConfirm = pin.length === 4;

  const triggerShake = (msg) => {
    setError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
    setPin("");
  };

  const addDigit = (digit) => {
    if (error) setError("");
    setPin((currentPin) =>
      currentPin.length < 4 ? `${currentPin}${digit}` : currentPin,
    );
  };

  const removeDigit = () => {
    setPin((currentPin) => currentPin.slice(0, -1));
  };

  const isCredit = transactionData?.type?.toUpperCase() === 'CREDIT';

  const saveTransaction = async () => {
    try {
      if (isCredit) {
        // Save as debtor credit
        const emailToUse = email || localStorage.getItem("email");
        const cd = transactionData.creditDetails || {};
        await addCreditTransaction(
          emailToUse,
          cd.customerName || "Unknown Customer",
          cd.phoneNumber || "",
          amountNum,
          transactionData.description || "Voice Input",
          cd.dueDate || null
        );

        if (setBalance) {
          setBalance((prev) => prev - amountNum);
        }
        if (setMoneyOut) {
          setMoneyOut((prev) => prev + amountNum);
        }
        if (setTransactionsList) {
          const newTx = {
            id: Date.now(),
            type: "debit",
            icon: "bolt",
            title: `${cd.customerName || "Customer"} - Credit Given`,
            meta: `Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
            amount: `-\u20A6${amountNum.toLocaleString()}`,
            isPositive: false,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
          };
          setTransactionsList((prev) => [newTx, ...prev]);
        }
      } else {
        // Normal income/expense
        const apiTx = await createTransaction({
          type: isIncome ? 'Income' : 'Expense',
          amount: amountNum,
          category: transactionData.category || 'Other',
          description: transactionData.description || 'Voice Input'
        });

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
            id: apiTx._id || Date.now(),
            type: isIncome ? "credit" : "debit",
            icon: isIncome ? "bag" : "bolt",
            title: apiTx.description || transactionData.description || "Voice Input",
            meta: `Today, ${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
            amount: `${isIncome ? '+' : '-'}\u20A6${amountNum.toLocaleString()}`,
            isPositive: isIncome,
            iconBg: isIncome ? "bg-green-100" : "bg-red-100",
            iconColor: isIncome ? "text-green-800" : "text-red-600",
          };
          setTransactionsList((prev) => [newTx, ...prev]);
        }
      }
      onNavigate("home");
    } catch (error) {
      console.error("Failed to save transaction:", error);
      onNavigate("home");
    }
  };

  const handleConfirm = async () => {
    if (!canConfirm) return;
    setIsLoading(true);

    try {
      if (mode === "create") {
        // Save the first PIN entry and move to confirm mode
        setCreatedPin(pin);
        setPin("");
        setMode("confirm");
        return;
      }

      if (mode === "confirm") {
        // Check if confirmation matches
        if (pin !== createdPin) {
          triggerShake(t("pin_error_mismatch"));
          setCreatedPin("");
          setMode("create");
          return;
        }

        // PINs match — save to backend
        const userEmail = email || localStorage.getItem('email');
        await setupPin(userEmail, pin);
        localStorage.setItem('hasPin', 'true');

        // Change mode: PIN updated, nothing to record → back to profile.
        if (isChangeMode) {
          onNavigate("profile");
          return;
        }

        // PIN set successfully, now save the transaction
        await saveTransaction();
        return;
      }

      if (mode === "verify") {
        // Verify against backend
        const userEmail = email || localStorage.getItem('email');
        try {
          await verifyPin(userEmail, pin);

          // Change mode: current PIN accepted → move on to the new PIN.
          if (isChangeMode) {
            setCreatedPin("");
            setPin("");
            setMode("create");
            return;
          }

          // PIN is valid — save the transaction
          await saveTransaction();
        } catch (err) {
          triggerShake(t("pin_error_invalid"));
        }
        return;
      }
    } catch (err) {
      console.error("PIN Error:", err);
      triggerShake(err.message || t("pin_error_generic"));
    } finally {
      setIsLoading(false);
    }
  };

  // ── Localized copy per mode ────────────────────────────────────────
  const heroTitle = isChangeMode
    ? mode === "verify"
      ? t("pin_hero_change")
      : mode === "create"
        ? t("pin_hero_create")
        : t("pin_hero_confirm")
    : {
        create: t("pin_hero_create"),
        confirm: t("pin_hero_confirm"),
        verify: t("pin_hero_verify"),
      }[mode];

  const kicker = isChangeMode && mode === "verify"
    ? t("pin_kicker_change")
    : {
        create: t("pin_kicker_create"),
        confirm: t("pin_kicker_confirm"),
        verify: t("pin_kicker_verify"),
      }[mode];

  const keypadTitle = isChangeMode && mode === "verify"
    ? t("pin_keypad_change")
    : {
        create: t("pin_keypad_create"),
        confirm: t("pin_keypad_confirm"),
        verify: t("pin_keypad_verify"),
      }[mode];

  // Right-panel prompt. Amount is ONLY shown in the normal (transaction)
  // flow — never in change mode, since there is nothing being recorded.
  const kind = isIncome ? t("pin_kind_sale") : t("pin_kind_expense");
  const amountStr = `\u20A6${amountNum.toLocaleString()}`;
  const rightPanelText = isChangeMode
    ? mode === "verify"
      ? t("pin_sub_change")
      : mode === "create"
        ? t("pin_hero_create")
        : t("pin_hero_confirm")
    : {
        create: t("pin_sub_create", { kind, amount: amountStr }),
        confirm: t("pin_sub_confirm"),
        verify: t("pin_sub_verify", { kind, amount: amountStr }),
      }[mode];

  const buttonLabel = isLoading
    ? t("pin_processing")
    : mode === "create"
      ? t("pin_next")
      : mode === "confirm"
        ? t("pin_set_confirm")
        : isChangeMode
          ? t("pin_verify_continue")
          : t("pin_confirm");

  const showAmountCard = !isChangeMode;
  const showAmountInline = !isChangeMode && mode !== "confirm";

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-8 lg:p-12 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col lg:flex-row relative">
        
        {/* Topbar */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20 pointer-events-none lg:pointer-events-auto">
          <button
            type="button"
            aria-label={t("common_back")}
            onClick={() => (onBack ? onBack() : onNavigate(isChangeMode ? "profile" : "ai_confirmation"))}
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
            <span className="font-bold text-slate-800 text-sm">{businessName || t("common_my_store")}</span>
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
            {kicker}
          </span>
          <h2 className="text-3xl lg:text-4xl font-serif font-bold leading-tight mb-6">
            {heroTitle}
          </h2>
          <p className="text-green-100/70 text-base leading-relaxed mb-12">
            {t("pin_protects")}
          </p>

          {/* Warning for create mode */}
          {(mode === "create" || mode === "confirm") && (
            <div className="bg-yellow-500/15 border border-yellow-400/30 rounded-2xl p-5 mb-8 flex items-start gap-3">
              <span className="text-yellow-300 flex-shrink-0 mt-0.5">
                <WarningIcon />
              </span>
              <p className="text-yellow-100/90 text-sm font-semibold leading-relaxed">
                {t("pin_remember")}
              </p>
            </div>
          )}

          {/* Transaction amount card — hidden in change mode */}
          {showAmountCard && (
            <div className="bg-white/10 border border-white/10 rounded-2xl p-6 backdrop-blur-md">
              <span className="block text-green-200/80 text-xs font-bold tracking-widest uppercase mb-2">
                {t("pin_transaction_amount")}
              </span>
              <strong className="text-4xl font-serif font-bold text-white">
                {amountStr}
              </strong>
            </div>
          )}
        </div>

        {/* Right Side: Keypad Panel */}
        <div className="flex-1 p-8 lg:p-16 flex flex-col justify-center bg-white">
          <div className="max-w-sm mx-auto w-full lg:mt-8">
            <div className="mb-10 text-center lg:text-left">
              <p className="text-slate-600 text-lg lg:text-xl">
                {rightPanelText}
                {!isChangeMode && showAmountInline && "."}
              </p>
            </div>

            <div className={`bg-slate-50 border rounded-3xl p-6 mb-8 shadow-inner transition-all ${error ? 'border-red-300 bg-red-50/30' : 'border-slate-100'} ${shake ? 'animate-shake' : ''}`}>
              <div className="text-center mb-6">
                <h2 className="text-xs font-bold text-slate-400 tracking-widest uppercase">
                  {keypadTitle}
                </h2>
              </div>
              <div className="flex justify-center gap-6" aria-label={keypadTitle}>
                {[0, 1, 2, 3].map((index) => (
                  <div
                    key={index}
                    className={`w-5 h-5 rounded-full border-4 transition-all duration-200 ${
                      index < pin.length 
                        ? error
                          ? "bg-red-500 border-red-500 scale-110"
                          : mode === "create" || mode === "confirm"
                            ? "bg-green-600 border-green-600 scale-110"
                            : "bg-slate-800 border-slate-800 scale-110"
                        : "bg-transparent border-slate-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 text-center">
                <p className="text-red-500 text-sm font-bold">{error}</p>
              </div>
            )}

            {/* Mode indicator badge */}
            {(mode === "create" || mode === "confirm") && (
              <div className="mb-6 text-center">
                <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold ${
                  mode === "create" 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  <span className={`w-2 h-2 rounded-full ${mode === "create" ? "bg-green-500" : "bg-blue-500"}`}></span>
                  {mode === "create" ? t("pin_step_1") : t("pin_step_2")}
                </span>
              </div>
            )}

            {/* Keypad */}
            <div className="grid grid-cols-3 gap-4 lg:gap-6 max-w-[320px] mx-auto mb-10">
              {digits.map((digit) => (
                <button
                  key={digit}
                  type="button"
                  onClick={() => addDigit(digit)}
                  disabled={isLoading}
                  className="h-16 lg:h-20 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] text-3xl font-bold text-slate-800 active:scale-95 transition-all disabled:opacity-50"
                >
                  {digit}
                </button>
              ))}
              <div className="h-16 lg:h-20"></div>
              <button
                type="button"
                onClick={() => addDigit("0")}
                disabled={isLoading}
                className="h-16 lg:h-20 rounded-2xl bg-white hover:bg-slate-50 border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] text-3xl font-bold text-slate-800 active:scale-95 transition-all disabled:opacity-50"
              >
                0
              </button>
              <button
                type="button"
                onClick={removeDigit}
                disabled={isLoading}
                aria-label={t("pin_delete_digit")}
                className="h-16 lg:h-20 rounded-2xl bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-100 border border-slate-100 shadow-[0_4px_14px_rgba(0,0,0,0.05)] flex items-center justify-center text-slate-500 active:scale-95 transition-all disabled:opacity-50"
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
                {t("pin_forgot")}
              </a>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={!canConfirm || isLoading}
                className={`flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                  canConfirm && !isLoading
                    ? mode === "create" || mode === "confirm"
                      ? "bg-[#052e16] hover:bg-[#0a4a2e] text-white shadow-[#052e16]/30 active:scale-95 cursor-pointer"
                      : "bg-[#7e9c86] hover:bg-[#6b8572] text-white shadow-[#7e9c86]/30 active:scale-95 cursor-pointer"
                    : "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed"
                }`}
              >
                <span>{buttonLabel}</span>
                <div className="w-6 h-6">
                  <ArrowRightIcon />
                </div>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Shake animation style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </main>
  );
}

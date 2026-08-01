import { useLocation } from 'react-router-dom';

export default function AIConfirmation({ onNavigate }) {
  const location = useLocation();
  const transactionData = location.state?.transactionData || {
    type: 'Income',
    amount: 15000,
    description: '2 bags of garri',
    category: 'Dry Goods'
  };

  const isIncome = transactionData.type?.toLowerCase() === 'income';
  return (
    <div className="ai-confirmation-page">
      <section className="ai-confirmation-shell">
        
        {/* 1. Top Navigation Bar */}
        <header style={{ flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f8f9ff", zIndex: 30 }}>
          <button 
            onClick={() => onNavigate('home')}
            style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", cursor: "pointer", border: "none", background: "transparent", color: "#111827" }}
            aria-label="Go back"
          >
            <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          
          <h1 style={{ fontWeight: 800, color: "#111827", fontSize: "20px", letterSpacing: "-0.025em", margin: 0 }}>
            AI Confirmation
          </h1>
          
          <div style={{ width: 40, height: 40, borderRadius: "50%", overflow: "hidden", border: "1px solid #e5e7eb" }}>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" 
              alt="User profile" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        </header>

        {/* Content Container */}
        <div style={{ flex: 1, overflowY: "auto", scrollbarWidth: "none", msOverflowStyle: "none", padding: "10px 20px 120px", boxSizing: "border-box", width: "100%" }}>
          
          {/* Introduction Text */}
          <div style={{ paddingBottom: "20px", textAlign: "left" }}>
            <h2 style={{ color: "#6b7280", fontSize: "14px", fontWeight: 500, lineHeight: 1.625, margin: 0 }}>
              Confirm the transaction details parsed by Gemini 1.5 Flash.
            </h2>
          </div>

          {/* Transaction Confirmation Card */}
          <div style={{ background: "#ffffff", borderRadius: "16px", padding: "24px", border: "1px solid #e5e7eb", boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", minHeight: "220px", textAlign: "left" }}>
            
            {/* Card Watermark */}
            <svg style={{ position: "absolute", right: "16px", bottom: "16px", width: "112px", height: "112px", color: "#f9fafb", pointerEvents: "none" }} viewBox="0 0 100 100" fill="currentColor">
              <circle cx="50" cy="20" r="6" />
              <circle cx="35" cy="35" r="6" />
              <circle cx="65" cy="35" r="6" />
              <circle cx="20" cy="50" r="6" />
              <circle cx="50" cy="50" r="6" />
              <circle cx="80" cy="50" r="6" />
              <circle cx="35" cy="65" r="6" />
              <circle cx="65" cy="65" r="6" />
              <circle cx="50" cy="80" r="6" />
            </svg>

            {/* Icon Box + Transaction Type Tag */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", zIndex: 10 }}>
              <div style={{ width: 48, height: 48, borderRadius: "12px", background: "#dcfce7", color: "#15803d", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                  <path d="M21 8l-2-4H5L3 8" />
                  <path d="M10 12h4" />
                </svg>
              </div>
              <span style={{ fontSize: "11px", fontWeight: 800, padding: "4px 12px", borderRadius: "9999px", textTransform: "uppercase", letterSpacing: "0.05em", background: isIncome ? "#dcfce7" : "#fee2e2", color: isIncome ? "#166534" : "#991b1b" }}>
                {transactionData.type}
              </span>
            </div>

            {/* Parsed details text */}
            <div style={{ zIndex: 10, marginTop: "auto" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                Transaction Value
              </span>
              <h3 style={{ fontSize: "30px", fontWeight: 900, color: "#111827", letterSpacing: "-0.025em", lineHeight: 1, margin: 0 }}>
                ₦{Number(transactionData.amount).toLocaleString()}
              </h3>
              
              <div style={{ height: "1px", background: "#f3f4f6", margin: "16px 0", width: "100%" }} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Description
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#111827", lineHeight: 1.25, display: "block" }}>
                    {transactionData.description}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: "#9ca3af", letterSpacing: "0.05em", textTransform: "uppercase", display: "block", marginBottom: "4px" }}>
                    Category
                  </span>
                  <span style={{ fontSize: "14px", fontWeight: 800, color: "#14532d", lineHeight: 1.25, display: "block" }}>
                    {transactionData.category}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Info Tip Card */}
          <div style={{ background: "#eff6ff", borderRadius: "16px", padding: "20px", marginTop: "24px", textAlign: "left", display: "flex", gap: "16px", border: "1px solid #dbeafe" }}>
            <div style={{ width: 36, height: 36, borderRadius: "8px", background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: "#14532d" }}>
              <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h4 style={{ fontSize: "14px", fontWeight: 700, color: "#14532d", lineHeight: 1, marginBottom: "8px", marginTop: "4px" }}>
                Trade PIN Required
              </h4>
              <p style={{ color: "#4b5563", fontSize: "12px", lineHeight: 1.5, margin: 0 }}>
                To commit this transaction to your secure ledger, you must verify your Trade PIN in the next step.
              </p>
            </div>
          </div>

        </div>

        {/* 5. Fixed Primary Action Button at Bottom */}
        <div style={{ padding: "20px", background: "linear-gradient(to top, #f8f9ff 70%, transparent)", position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 30 }}>
          <button
            onClick={() => onNavigate('pulse_trade_pin', { transactionData })}
            style={{ width: "100%", backgroundColor: "#052e16", color: "#ffffff", fontWeight: 800, padding: "16px 24px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", cursor: "pointer", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", transition: "all 0.2s", fontSize: "14px", letterSpacing: "0.025em", border: "none" }}
          >
            <span>Confirm &amp; Save</span>
            <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

      </section>
    </div>
  );
}

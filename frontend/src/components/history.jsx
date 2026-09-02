import { useState, useMemo } from "react";
import AppShell from "./layout/AppShell";
import Header from "./home/Header";
import NavigationBar from "./home/NavigationBar";

const historyTabs = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "week", label: "This Week" },
];

function ItemIcon({ icon }) {
  const paths = {
    bag: (
      <>
        <path d="M10 13h12v10H10V13Z" />
        <path d="M13 13v-2a3 3 0 0 1 6 0v2" />
      </>
    ),
    truck: (
      <>
        <path d="M6 11h12v8H6z" />
        <path d="M18 14h4l2 3v2h-6z" />
        <circle cx="10" cy="21" r="1.5" />
        <circle cx="20" cy="21" r="1.5" />
      </>
    ),
    receipt: (
      <>
        <path d="M9 6h12v18l-2-1.2-2 1.2-2-1.2-2 1.2-2-1.2L9 24V6Z" />
        <path d="M12 11h6M12 15h6M12 19h4" />
      </>
    ),
    box: (
      <>
        <path d="M8 10h16v13H8z" />
        <path d="M8 10l2-4h12l2 4M12 15h8" />
      </>
    ),
    bolt: <path d="M16 4 8 17h7l-3 9 9-14h-7l2-8Z" />,
  };
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      {paths[icon] || paths.bag}
    </svg>
  );
}

function TransactionCard({ item }) {
  // Extract just the time part for meta, unless it's older than today, then we show date + time
  let displayMeta = item.meta;
  if (item.rawDate) {
    displayMeta = item.rawDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <button className="history-card" type="button">
      <span className={`history-icon ${item.type}`}>
        <ItemIcon icon={item.icon} />
      </span>
      <span className="history-details">
        <strong>{item.title}</strong>
        <small>{displayMeta}</small>
      </span>
      <span className={`history-money ${item.type}`}>
        <strong>{item.amount}</strong>
        <em>{item.type.toUpperCase()}</em>
      </span>
    </button>
  );
}

export default function History({
  onNavigate,
  balance,
  transactionsList,
  businessName,
}) {
  const [activePeriod, setActivePeriod] = useState("today");

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    const now = new Date();
    // Start of today
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of yesterday
    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    
    // Start of "this week" (we'll define it as the last 7 days excluding today/yesterday)
    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - 7);

    const groups = {
      today: [],
      yesterday: [],
      week: [],
      older: []
    };

    if (!transactionsList) return groups;

    transactionsList.forEach((tx) => {
      const txDate = tx.rawDate || new Date();
      
      if (txDate >= startOfToday) {
        groups.today.push(tx);
      } else if (txDate >= startOfYesterday && txDate < startOfToday) {
        groups.yesterday.push(tx);
      } else if (txDate >= startOfWeek && txDate < startOfYesterday) {
        groups.week.push(tx);
      } else {
        groups.older.push(tx);
      }
    });

    return groups;
  }, [transactionsList]);

  const visibleTransactions = groupedTransactions[activePeriod] || [];

  const balanceLabel = {
    today: "NET BALANCE TODAY",
    yesterday: "NET BALANCE YESTERDAY",
    week: "NET BALANCE THIS WEEK",
  }[activePeriod];

  // Calculate balance for the active period
  const periodBalance = visibleTransactions.reduce((acc, curr) => {
    // Strip everything except numbers from amount string, then parse
    const rawNumStr = curr.amount.replace(/[^0-9.-]+/g, "");
    const amountVal = parseFloat(rawNumStr) || 0;
    return curr.isPositive ? acc + amountVal : acc - amountVal;
  }, 0);


  return (
    <AppShell
      active="history"
      onNavigate={onNavigate}
      businessName={businessName}
      title="Transaction History"
      subtitle="Every sale and expense, logged"
    >
      <main className="history-page">
        <Header businessName={businessName} onNavigate={onNavigate} />
          <div className="history-tabs">
            {historyTabs.map((tab) => (
              <button
                key={tab.key}
                className={activePeriod === tab.key ? "active" : ""}
                type="button"
                onClick={() => setActivePeriod(tab.key)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <section className="history-balance">
            <span>{balanceLabel}</span>
            <strong>₦{periodBalance.toLocaleString()}.00</strong>
          </section>
          
          {visibleTransactions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#888" }}>
              <p>No transactions found for {activePeriod}.</p>
            </div>
          ) : (
            <section className="history-list">
              {visibleTransactions.map((item) => (
                <TransactionCard item={item} key={item.id || item.title} />
              ))}
            </section>
          )}

          {activePeriod === "today" && groupedTransactions.yesterday.length > 0 && (
            <>
              <div className="history-divider">
                <span>YESTERDAY</span>
              </div>
              <section className="history-list yesterday">
                {groupedTransactions.yesterday.map((item) => (
                  <TransactionCard item={item} key={item.id || item.title} />
                ))}
              </section>
            </>
          )}
          
          <div style={{ height: "100px" }}></div>
          <NavigationBar onNavigate={onNavigate} currentPage="history" />
      </main>
    </AppShell>
  );
}

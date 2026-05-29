export default function Homepage({ onNavigate, businessName, balance, moneyIn, moneyOut, transactionsList }) {
  
  const getTransactionIcon = (iconName) => {
    switch (iconName) {
      case 'bag':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
        );
      case 'receipt':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="2" y="5" width="20" height="14" rx="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <path d="M6 14h.01M10 14h.01" />
          </svg>
        );
      case 'bolt':
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcfa] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-[#f8f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4 pb-24">
        
        {/* Header Nav */}
        <header className="flex justify-between items-center px-5 py-4 bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('welcome')}>
            {/* Storefront/Market Icon */}
            <svg 
              className="w-5 h-5 text-gray-900" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="font-extrabold text-gray-900 text-[15.5px] tracking-tight">
              {businessName || 'Mama Ngozi Provisions'}
            </span>
          </div>

          {/* User Profile / Avatar Icon */}
          <button 
            onClick={() => onNavigate('profile')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100/80 transition-colors cursor-pointer"
            aria-label="Profile"
          >
            <svg 
              className="w-6 h-6" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
        </header>

        {/* Dashboard Title Section */}
        <section className="px-5 pt-2 pb-4 text-left">
          <h1 className="text-[28px] font-extrabold text-gray-950 tracking-tight leading-none font-sans">
            MarketPulse AI
          </h1>
          <p className="text-[13.5px] font-medium text-gray-400 mt-1">
            Real-time trading insights
          </p>
        </section>

        {/* 3 Metric Cards Side-by-Side */}
        <section className="px-5 grid grid-cols-3 gap-2.5">
          {/* Card 1: Money In */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.02)] border-l-[3.5px] border-emerald-700 p-3 text-left flex flex-col justify-between min-h-[92px]">
            <div>
              <span className="text-[8.5px] font-bold text-gray-400 tracking-wider uppercase">
                Money In
              </span>
              <h2 className="text-[15px] font-extrabold text-gray-900 mt-1 tracking-tight leading-none">
                ₦{moneyIn.toLocaleString()}
              </h2>
            </div>
            <div className="flex items-center gap-0.5 text-[9.5px] font-bold text-emerald-600 mt-2">
              <span>↗</span>
              <span>+12%</span>
            </div>
          </div>

          {/* Card 2: Money Out */}
          <div className="bg-white rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.02)] border-l-[3.5px] border-red-600 p-3 text-left flex flex-col justify-between min-h-[92px]">
            <div>
              <span className="text-[8.5px] font-bold text-gray-400 tracking-wider uppercase">
                Money Out
              </span>
              <h2 className="text-[15px] font-extrabold text-red-600 mt-1 tracking-tight leading-none">
                ₦{moneyOut.toLocaleString()}
              </h2>
            </div>
            <div className="flex items-center gap-0.5 text-[9.5px] font-bold text-red-500 mt-2">
              <span>↘</span>
              <span>-5%</span>
            </div>
          </div>

          {/* Card 3: Net Profit */}
          <div className="bg-[#eff5ff] rounded-2xl shadow-[0_4px_16px_rgba(0,0,0,0.02)] border-l-[3.5px] border-[#0c2a5c] p-3 text-left flex flex-col justify-between min-h-[92px]">
            <div>
              <span className="text-[8.5px] font-bold text-gray-400 tracking-wider uppercase font-sans">
                Net Profit
              </span>
              <h2 className="text-[15px] font-extrabold text-gray-900 mt-1 tracking-tight leading-none">
                ₦{balance.toLocaleString()}
              </h2>
            </div>
            <div className="flex items-center gap-1 text-[9.5px] font-bold text-gray-500 mt-2">
              {/* Stable Chart Icon */}
              <svg className="w-3 h-3 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="17" x2="9" y2="9" />
                <line x1="15" y1="17" x2="15" y2="13" />
              </svg>
              <span>Stable</span>
            </div>
          </div>
        </section>

        {/* Large Market Open Banner */}
        <section className="px-5 mt-5">
          <div className="bg-[#052e16] rounded-2xl p-5 text-left relative overflow-hidden shadow-md flex flex-col justify-between min-h-[135px]">
            
            {/* Background Chart Overlay */}
            <div className="absolute inset-0 opacity-15 pointer-events-none flex items-end">
              <svg className="w-full h-[60%] text-white" viewBox="0 0 100 50" preserveAspectRatio="none">
                <path 
                  d="M0,45 Q15,20 30,35 T60,15 T90,30 L100,20 L100,50 L0,50 Z" 
                  fill="currentColor"
                />
                <path 
                  d="M0,45 Q15,20 30,35 T60,15 T90,30 L100,20" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                />
              </svg>
            </div>

            {/* Pill Badge */}
            <div className="inline-flex self-start bg-[#d1fae5] text-[#065f46] text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider select-none z-10">
              Market Open
            </div>

            {/* Banner Main Text */}
            <div className="mt-4 z-10">
              <h3 className="text-white text-[21px] font-bold tracking-tight">
                Daily Pulse: Strong Buy
              </h3>
            </div>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="px-5 mt-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Recent Activity
            </h3>
            <button 
              onClick={() => onNavigate('history')}
              className="text-[13px] font-bold text-[#052e16] hover:underline cursor-pointer transition-all bg-transparent border-0"
            >
              View All
            </button>
          </div>

          {/* Activity List */}
          <div className="flex flex-col gap-3">
            {transactionsList.map((item) => (
              <div 
                key={item.id} 
                className="bg-white rounded-2xl p-4 flex items-center justify-between border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-shadow duration-150"
              >
                <div className="flex items-center gap-3.5">
                  {/* Icon Circle */}
                  <div className={`w-11 h-11 rounded-full ${item.iconBg || 'bg-gray-100'} ${item.iconColor || 'text-gray-800'} flex items-center justify-center flex-shrink-0`}>
                    {getTransactionIcon(item.icon)}
                  </div>
                  {/* Title & Time */}
                  <div className="text-left">
                    <h4 className="text-[13.5px] font-extrabold text-gray-900 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-[11px] font-medium text-gray-400 mt-0.5">
                      {item.meta}
                    </p>
                  </div>
                </div>

                {/* Amount */}
                <div className={`text-[14.5px] font-black ${item.isPositive ? 'text-emerald-700' : 'text-red-600'} tracking-tight`}>
                  {item.amount}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Voice Microphone Action Button */}
        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
          <button 
            onClick={() => onNavigate('listeng')}
            className="w-16 h-16 rounded-full bg-[#052e16] hover:bg-[#073d1e] active:scale-95 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer border-[4px] border-[#f8f9ff]"
            aria-label="Start Voice Recording"
          >
            {/* Microphone Icon */}
            <svg 
              className="w-6.5 h-6.5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
              <line x1="12" y1="19" x2="12" y2="22" />
            </svg>
          </button>
        </div>

        {/* Bottom Tab Navigation Bar */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-150 py-2.5 px-4 flex justify-between items-center z-30 rounded-t-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
          {/* Nav Item: Home */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1 flex-1 cursor-pointer"
          >
            <div className="bg-[#052e16] text-white px-5 py-1.5 rounded-full flex items-center justify-center transform scale-105 shadow-sm">
              {/* Home Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold text-[#052e16] tracking-wider uppercase">
              Home
            </span>
          </button>

          {/* Nav Item: Pulse */}
          <button 
            onClick={() => onNavigate('weekly_pulse')}
            className="flex flex-col items-center gap-1.5 flex-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Pulse"
          >
            {/* Sound Wave / Pulse Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M12 2v20M17 5v14M22 9v6M7 5v14M2 9v6" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Pulse
            </span>
          </button>

          {/* Spacer to give room for FAB */}
          <div className="w-14 flex-shrink-0" />

          {/* Nav Item: History */}
          <button 
            onClick={() => onNavigate('history')}
            className="flex flex-col items-center gap-1.5 flex-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="History"
          >
            {/* History Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <polyline points="3 3 3 8 8 8" />
              <line x1="12" y1="7" x2="12" y2="12" />
              <line x1="12" y1="12" x2="16" y2="14" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              History
            </span>
          </button>

          {/* Nav Item: Credit */}
          <button 
            onClick={() => onNavigate('credit')}
            className="flex flex-col items-center gap-1.5 flex-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
            aria-label="Credit"
          >
            {/* Cash / Credit Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
              <path d="M6 14h.01M10 14h.01" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Credit
            </span>
          </button>
        </nav>

      </div>
    </div>
  );
}

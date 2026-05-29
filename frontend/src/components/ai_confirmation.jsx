export default function AIConfirmation({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#eef1f7] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-[#f8f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4 pb-28">
        
        {/* 1. Top Navigation Bar */}
        <header className="flex justify-between items-center px-5 py-4 bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => onNavigate('home')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-900 cursor-pointer"
            aria-label="Go back"
          >
            {/* Simple Back Arrow */}
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          
          <h1 className="font-extrabold text-gray-950 text-xl tracking-tight font-sans">
            AI Confirmation
          </h1>
          
          {/* User Profile Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120" 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 px-5 flex flex-col justify-start">
          
          {/* Introduction Text */}
          <div className="pt-2 pb-5 text-left">
            <h2 className="text-gray-500 text-sm font-medium leading-relaxed font-sans">
              Confirm the transaction details parsed by Gemini 1.5 Flash.
            </h2>
          </div>

          {/* Transaction Confirmation Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col min-h-[220px] text-left">
            
            {/* Card Watermark */}
            <svg className="absolute right-4 bottom-4 w-28 h-28 text-[#f8fafc] pointer-events-none" viewBox="0 0 100 100" fill="currentColor">
              {/* Dot grid pattern */}
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
            <div className="flex items-center justify-between mb-6 z-10">
              <div className="w-12 h-12 rounded-xl bg-[#dcfce7] text-[#166534] flex items-center justify-center">
                {/* Box icon */}
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 8v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8" />
                  <path d="M21 8l-2-4H5L3 8" />
                  <path d="M10 12h4" />
                </svg>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                INCOME (SALE)
              </span>
            </div>

            {/* Parsed details text */}
            <div className="z-10 mt-auto">
              <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase block">
                Transaction Value
              </span>
              <h3 className="text-3xl font-black text-gray-950 tracking-tight leading-none mt-1 font-sans">
                ₦15,000
              </h3>
              
              <div className="h-[1px] bg-gray-100 my-4" />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[9.5px] font-bold text-gray-400 tracking-wider uppercase block">
                    Description
                  </span>
                  <span className="text-[13.5px] font-extrabold text-gray-950 leading-tight block mt-1 font-sans">
                    2 bags of garri
                  </span>
                </div>
                <div>
                  <span className="text-[9.5px] font-bold text-gray-400 tracking-wider uppercase block">
                    Category
                  </span>
                  <span className="text-[13.5px] font-extrabold text-[#052e16] leading-tight block mt-1 font-sans">
                    Dry Goods
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Info Tip Card */}
          <div className="bg-[#eff6ff] rounded-2xl p-5 mt-6 text-left flex gap-4 border border-[#dbeafe]/50">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center flex-shrink-0 text-[#052e16]">
              {/* Shield key icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <div>
              <h4 className="text-[13.5px] font-bold text-[#052e16] leading-none mb-1 font-sans">
                Trade PIN Required
              </h4>
              <p className="text-gray-600 text-[12px] leading-normal font-sans">
                To commit this transaction to your secure ledger, you must verify your Trade PIN in the next step.
              </p>
            </div>
          </div>

        </div>

        {/* 5. Fixed Primary Action Button at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff] to-transparent sticky-bottom z-30">
          <button
            onClick={() => onNavigate('otpVerification')}
            className="w-full bg-[#052e16] hover:bg-[#084221] active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 text-sm tracking-wide"
          >
            <span>Confirm &amp; Save</span>
            {/* Arrow icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>

      </div>
    </div>
  );
}

import { useEffect } from 'react';

export default function Analysing({ onNavigate }) {
  // Simulate parsing complete after 4 seconds and auto-redirect to Weekly Pulse insights
  useEffect(() => {
    const timer = setTimeout(() => {
      onNavigate('ai_confirmation');
    }, 3000); // 3 seconds simulation

    return () => clearTimeout(timer);
  }, [onNavigate]);

  return (
    <div className="min-h-screen bg-[#fcfcfa] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-[#f8f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4 pb-24">
        
        {/* Soft Background Depth Circles */}
        <div className="absolute top-12 left-6 w-36 h-36 bg-[#052e16]/3 rounded-full filter blur-2xl pointer-events-none z-0" />
        <div className="absolute top-1/3 right-4 w-44 h-44 bg-blue-500/3 rounded-full filter blur-3xl pointer-events-none z-0" />
        <div className="absolute bottom-32 left-10 w-40 h-40 bg-emerald-500/4 rounded-full filter blur-2xl pointer-events-none z-0" />

        {/* Header Nav */}
        <header className="flex justify-between items-center px-5 py-4 z-10 bg-transparent">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('home')}>
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
            <div className="text-left">
              <span className="font-extrabold text-gray-900 text-[15.5px] leading-tight block">
                Mama Ngozi
              </span>
              <span className="font-extrabold text-gray-900 text-[15.5px] leading-tight block -mt-1">
                Provisions
              </span>
            </div>
          </div>

          {/* User Profile Outline Icon */}
          <button 
            onClick={() => onNavigate('welcome')}
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-100/50 transition-colors cursor-pointer"
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

        {/* Central Content Column */}
        <div className="flex-grow flex flex-col items-center justify-center px-6 text-center z-10 mt-6">
          
          {/* Central Analysis Animation (Progress Ring) */}
          <div className="relative w-44 h-44 flex items-center justify-center mb-8">
            
            {/* Spinning/pulsating glow behind ring */}
            <div className="absolute inset-2 bg-emerald-500/5 rounded-full animate-ping duration-1000 opacity-60" />
            
            {/* SVG Progress Ring */}
            <svg className="w-full h-full transform -rotate-90 origin-center" viewBox="0 0 120 120">
              {/* Outer thin light gray boundary circle */}
              <circle 
                cx="60" 
                cy="60" 
                r="48" 
                stroke="#e2e8f0" 
                strokeWidth="1.5" 
                fill="none" 
              />
              {/* Thick Forest Green Progress Arc (25% complete) */}
              <circle 
                cx="60" 
                cy="60" 
                r="48" 
                stroke="#052e16" 
                strokeWidth="4.5" 
                fill="none" 
                strokeDasharray="301.6" 
                strokeDashoffset="226.2" // 301.6 * (1 - 0.25)
                strokeLinecap="round"
                className="animate-pulse"
              />
            </svg>
            
            {/* AI Spark Icon Cluster (Centered inside Ring) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg 
                className="w-12 h-12 text-[#052e16] animate-pulse" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.8" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {/* Main Sparkle */}
                <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
                <path d="m5.5 5.5 3 3M15.5 15.5 3 3M5.5 18.5l3-3M15.5 8.5l3-3" strokeWidth="0" />
                {/* Secondary inner spark icons (classic 4-point star shape) */}
                <path d="M12 7c0 2.76 2.24 5 5 5-2.76 0-5 2.24-5 5 0-2.76-2.24-5-5-5 2.24 0 5-2.24 5-5Z" fill="currentColor" stroke="none" />
                <path d="m19 5-1 1.5L16.5 5 18 4Z" fill="currentColor" stroke="none" />
                <path d="m6 19-0.8 1.2L4 19l1.2-0.8Z" fill="currentColor" stroke="none" />
              </svg>
            </div>
          </div>

          {/* Status Headline */}
          <h2 className="text-[26px] font-black text-[#052e16] tracking-tight leading-tight px-4">
            Analyzing your<br />speech...
          </h2>
          
          {/* Status Subtitle */}
          <p className="text-[14.5px] font-medium text-gray-500 mt-3 px-8 leading-relaxed">
            Gemini is sorting your trade details into your ledger.
          </p>

          {/* Skeleton Loading Cards */}
          <div className="w-full flex flex-col gap-3 mt-10 px-4">
            {/* Top Long Skeleton Card */}
            <div className="w-full h-14 bg-[#eff3ff]/70 border border-gray-100 rounded-2xl relative overflow-hidden flex items-center p-4">
              {/* Green left accent border indicator */}
              <div className="absolute left-0 top-0 bottom-0 w-[4.5px] bg-[#052e16]/30 rounded-l-2xl" />
              {/* Shimmer gradient overlay */}
              <div className="w-full h-4 bg-gray-200/50 rounded-lg animate-pulse" />
            </div>

            {/* Bottom Shorter Skeleton Card */}
            <div className="w-2/3 h-14 bg-[#eff3ff]/40 border border-gray-50/50 rounded-2xl mx-auto relative overflow-hidden flex items-center justify-center p-4">
              <div className="w-full h-4 bg-gray-200/40 rounded-lg animate-pulse" />
            </div>
          </div>

        </div>

        {/* Bottom Tab Navigation Bar */}
        <nav className="absolute bottom-0 inset-x-0 bg-white border-t border-gray-150 py-2.5 px-4 flex justify-between items-center z-30 rounded-t-3xl shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
          {/* Nav Item: Home */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1.5 flex-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {/* Home Icon */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <span className="text-[10px] font-bold tracking-wider uppercase">
              Home
            </span>
          </button>

          {/* Nav Item: Pulse (ACTIVE) */}
          <button className="flex flex-col items-center gap-1.5 flex-1 cursor-pointer">
            <div className="bg-[#052e16] text-white px-5 py-1.5 rounded-full flex items-center justify-center transform scale-105 shadow-sm">
              {/* Active Pulse Microphone Icon */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
                <line x1="12" y1="19" x2="12" y2="22" />
              </svg>
            </div>
            <span className="text-[10px] font-extrabold text-[#052e16] tracking-wider uppercase">
              Pulse
            </span>
          </button>

          {/* Nav Item: History */}
          <button 
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1.5 flex-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
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
            onClick={() => onNavigate('home')}
            className="flex flex-col items-center gap-1.5 flex-1 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            {/* Credit Icon */}
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

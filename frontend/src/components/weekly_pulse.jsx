import { useState, useEffect } from 'react';

export default function WeeklyPulse({ onNavigate }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(88); // 1:28 is 88 seconds
  const totalDuration = 252; // 4:12 is 252 seconds

  // Handle play/pause progress emulation
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev < totalDuration ? prev + 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    const minutes = Math.floor(secs / 60);
    const seconds = secs % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Equalizer heights for the visualizer waveform (total 18 bars)
  const waveformHeights = [
    18, 32, 44, 24, 40, 28, 36, 14, 42, 34, 45, 26, 38, 16, 36, 12, 38, 30
  ];

  return (
    <div className="min-h-screen bg-[#fcfcfa] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-[#f8f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4 pb-24">
        
        {/* Header Nav */}
        <header className="flex justify-between items-center px-5 py-4 bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-30">
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

        {/* Screen Header */}
        <section className="px-5 pt-2 pb-4 text-left">
          <h1 className="text-[28px] font-extrabold text-gray-950 tracking-tight leading-none">
            Weekly Pulse
          </h1>
          <p className="text-[13.5px] font-medium text-gray-400 mt-2">
            Real-time performance audio-summary and insights.
          </p>
        </section>

        {/* Card 1: AI Audio Player Card */}
        <section className="px-5 mt-2">
          <div className="bg-white rounded-3xl p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-5">
            
            {/* Header Row */}
            <div className="flex items-center gap-4">
              {/* Green Play/Pause Button */}
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-14 h-14 rounded-full bg-[#052e16] hover:bg-[#073d1e] active:scale-95 text-white flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                aria-label={isPlaying ? "Pause audio digest" : "Play audio digest"}
              >
                {isPlaying ? (
                  /* Pause Icon */
                  <svg className="w-5.5 h-5.5 fill-white text-white" viewBox="0 0 24 24">
                    <rect x="6" y="4" width="4" height="16" />
                    <rect x="14" y="4" width="4" height="16" />
                  </svg>
                ) : (
                  /* Play Triangle Icon */
                  <svg className="w-5.5 h-5.5 fill-white text-white translate-x-[1.5px]" viewBox="0 0 24 24">
                    <polygon points="5 3 19 12 5 21" />
                  </svg>
                )}
              </button>

              <div className="text-left">
                <h3 className="text-[16px] font-extrabold text-gray-900 leading-snug">
                  Listen to Weekly Summary
                </h3>
                <span className="text-[11.5px] font-medium text-gray-400 block mt-0.5">
                  Duration: 4:12 • AI Generated
                </span>
              </div>
            </div>

            {/* Stylized Audio Waveform Visualizer */}
            <div className="h-14 flex items-end justify-between px-1 gap-[3px]">
              {waveformHeights.map((height, i) => {
                // Highlight active waveform bars depending on progress
                const isPlayed = i / waveformHeights.length < progress / totalDuration;
                return (
                  <div 
                    key={i} 
                    className={`w-[7px] rounded-full transition-all duration-300 ${
                      isPlayed 
                        ? 'bg-[#052e16]' 
                        : 'bg-gray-200'
                    } ${
                      isPlaying && isPlayed ? 'animate-pulse' : ''
                    }`}
                    style={{ 
                      height: `${height}px`,
                    }}
                  />
                );
              })}
            </div>

            {/* Progress Slider Bar */}
            <div className="flex flex-col gap-2">
              {/* Progress track */}
              <div 
                className="w-full h-[5px] bg-slate-100 rounded-full overflow-hidden cursor-pointer relative"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  const newProgress = Math.floor((clickX / rect.width) * totalDuration);
                  setProgress(newProgress);
                }}
              >
                {/* Active progress segment */}
                <div 
                  className="h-full bg-[#052e16] rounded-full"
                  style={{ width: `${(progress / totalDuration) * 100}%` }}
                />
              </div>

              {/* Time Labels */}
              <div className="flex justify-between items-center text-[11px] font-bold text-gray-400">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(totalDuration)}</span>
              </div>
            </div>

          </div>
        </section>

        {/* Card 2: Market Intelligence Card */}
        <section className="px-5 mt-4">
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-gray-100 border-l-[6px] border-l-[#052e16] p-4 text-left flex flex-col gap-2 relative overflow-hidden">
            <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase select-none">
              Market Intelligence
            </span>
            <div className="flex items-center gap-3.5 mt-1">
              {/* Light Green Trend Icon */}
              <div className="w-10 h-10 rounded-full bg-[#d1fae5] text-[#065f46] flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
                  <polyline points="17 6 23 6 23 12" />
                </svg>
              </div>
              <h4 className="text-[15.5px] font-extrabold text-gray-900 leading-snug">
                Top Moving Item: Spaghetti (+20%)
              </h4>
            </div>
          </div>
        </section>

        {/* Card 3: AI Smart Advice Banner */}
        <section className="px-5 mt-4">
          <div className="bg-[#052e16] rounded-2xl p-5 text-left relative overflow-hidden shadow-md flex flex-col gap-3 min-h-[145px]">
            {/* Sparkle Vector Pattern in Corner */}
            <div className="absolute top-2 right-2 text-white/5 pointer-events-none select-none">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c0 5.523 4.477 10 10 10-5.523 0-10 4.477-10 10-5.523 0-10-4.477-10-10 5.523 0 10-4.477 10-10z" />
              </svg>
            </div>

            {/* Header Row */}
            <div className="flex items-center gap-2 text-[#d1fae5] z-10">
              {/* Lightbulb Icon */}
              <svg className="w-5 h-5 text-[#d1fae5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .4 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
                <line x1="9" y1="18" x2="15" y2="18" />
                <line x1="10" y1="22" x2="14" y2="22" />
              </svg>
              <span className="text-[11.5px] font-extrabold tracking-widest uppercase">
                AI Smart Advice
              </span>
            </div>

            {/* Body Recommendation Text */}
            <p className="text-[13px] font-medium text-emerald-100/90 leading-relaxed z-10 mt-1">
              Inventory levels for Spaghetti are low while demand is surging. We recommend increasing your order by 15% this Wednesday to capture weekend sales and avoid stockouts.
            </p>
          </div>
        </section>

        {/* 6. Document Action Button */}
        <section className="px-5 mt-5">
          <button className="w-full bg-[#0d0d0d] hover:bg-black active:scale-[0.98] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 text-[13.5px] tracking-wide">
            {/* File/Document Icon */}
            <svg 
              className="w-4.5 h-4.5 text-white" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Download Bank-Ready Statement (PDF)</span>
          </button>
        </section>

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

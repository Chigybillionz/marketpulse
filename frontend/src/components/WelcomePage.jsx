import { useState } from 'react';

export default function WelcomePage({ onNavigate }) {
  const [businessName, setBusinessName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [language, setLanguage] = useState('English');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-[#fcfcfa] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-white sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4">
        
        {/* 1. Top Navigation */}
        <header className="flex justify-between items-center px-5 py-4 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-50">
          <div className="flex items-center gap-2">
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
            <span className="font-bold text-gray-900 text-lg tracking-tight">MarketPulse AI</span>
          </div>
          
          {/* Language Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-800 hover:text-gray-900 transition-colors py-1 px-2 rounded-lg hover:bg-gray-100/50 cursor-pointer"
            >
              {/* Globe Icon */}
              <svg 
                className="w-4 h-4 text-gray-700" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span>{language}</span>
              {/* Chevron Down */}
              <svg 
                className={`w-3.5 h-3.5 text-gray-600 transition-transform duration-200 ${showLanguageDropdown ? 'rotate-180' : ''}`} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-1 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
                {['English', 'Yoruba', 'Hausa', 'Igbo'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setShowLanguageDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* 2. Hero Section */}
        <div className="bg-gradient-to-b from-[#e3ecf0] to-[#f4f7f6] pt-8 pb-16 px-6 relative flex flex-col items-center">
          
          {/* Smartphone mockup overlay */}
          <div className="w-[190px] h-[260px] bg-[#d9e4e8] rounded-[32px] p-2 shadow-inner border-[3px] border-[#c4d4db] flex flex-col overflow-hidden relative opacity-95">
            {/* Phone Screen Container */}
            <div className="w-full h-full rounded-[24px] overflow-hidden relative flex flex-col items-center justify-between py-5 px-3">
              {/* Blurred Nigerian provisions market photo as phone screen background */}
              <div 
                className="absolute inset-0 bg-cover bg-center filter blur-[1px] scale-105"
                style={{ 
                  backgroundImage: `url('https://images.unsplash.com/photo-1607344645866-009c320c5ab8?auto=format&fit=crop&q=80&w=600')`
                }}
              />
              <div className="absolute inset-0 bg-black/10" />

              {/* Internal phone header */}
              <div className="w-full flex justify-between items-center z-10 px-1 opacity-70">
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                <span className="text-[7px] font-bold text-white tracking-widest uppercase">WELCOME SCREEN</span>
                <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
              </div>

              {/* Vault/Wallet Circle Logo overlay */}
              <div className="w-16 h-16 rounded-full bg-[#052e16] flex items-center justify-center shadow-lg border border-[#ffffff1b] z-10 transform hover:scale-105 transition-transform duration-300">
                {/* Vault / Wallet Icon */}
                <svg 
                  className="w-8 h-8 text-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                  <path d="M3 10h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
                  <circle cx="16" cy="16" r="1.5" />
                  <path d="M12 16h2" />
                </svg>
              </div>

              {/* Bottom Phone Button mockup */}
              <div className="w-6 h-6 rounded-full border border-white/40 z-10" />
            </div>
          </div>

          {/* Heading overlay below phone mockup */}
          <div className="text-center mt-6 z-10 max-w-sm">
            <h2 className="text-[25px] font-extrabold text-[#052e16] tracking-tight leading-tight">
              Welcome Back
            </h2>
            <p className="text-[13px] font-normal text-gray-600 mt-2 px-6 leading-relaxed">
              Securely access your market trading account and manage your provisions.
            </p>
          </div>
        </div>

        {/* 3. Input Card */}
        <div className="px-6 -mt-8 relative z-20 flex-grow">
          <div className="bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 flex flex-col gap-5">
            
            {/* Business Name Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="business-name" className="text-xs font-bold text-gray-700 tracking-wide">
                Business Name
              </label>
              <input
                id="business-name"
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., Mama Ngozi Provisions"
                className="w-full bg-[#f3f6ff] text-[14.5px] font-medium text-gray-800 placeholder-gray-400 rounded-xl px-4 py-3.5 border-b-2 border-transparent focus:border-[#052e16] focus:bg-white focus:outline-none transition-all duration-200"
              />
            </div>

            {/* Phone Number Field */}
            <div className="flex flex-col gap-1.5 text-left">
              <label htmlFor="phone-number" className="text-xs font-bold text-gray-700 tracking-wide">
                Phone Number
              </label>
              <div className="flex items-center bg-[#f3f6ff] rounded-xl border-b-2 border-transparent focus-within:border-[#052e16] focus-within:bg-white transition-all duration-200">
                <span className="text-[14.5px] font-bold text-gray-800 px-4 select-none">
                  +234
                </span>
                <div className="h-6 w-[1.5px] bg-gray-300" />
                <input
                  id="phone-number"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="803 000 0000"
                  className="w-full bg-transparent text-[14.5px] font-medium text-gray-800 placeholder-gray-400 rounded-r-xl px-4 py-3.5 focus:outline-none"
                />
              </div>
              <span className="text-[11px] font-medium text-gray-400 mt-0.5">
                We'll send a verification code via SMS.
              </span>
            </div>

            {/* Primary CTA Button */}
            <button 
              onClick={() => onNavigate('otp')}
              className="w-full bg-[#052e16] hover:bg-[#073d1e] active:scale-[0.98] text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 text-[14.5px] tracking-wide mt-1"
            >
              <span>Send OTP code</span>
              {/* Right Arrow Icon */}
              <svg 
                className="w-4 h-4" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>

            {/* OR CONTINUE WITH Divider */}
            <div className="flex items-center justify-between my-1">
              <div className="h-[1px] bg-gray-200 flex-grow" />
              <span className="text-[11px] font-extrabold text-gray-400 px-3 tracking-wider select-none uppercase">
                Or Continue With
              </span>
              <div className="h-[1px] bg-gray-200 flex-grow" />
            </div>

            {/* Alternative Logins */}
            <div className="grid grid-cols-2 gap-3.5">
              {/* Passkey Button */}
              <button className="flex items-center justify-center gap-2 border border-gray-900 hover:bg-gray-50 active:scale-[0.97] rounded-xl py-3 px-4 text-xs font-bold text-gray-900 cursor-pointer transition-all duration-150">
                {/* Person Key / Passkey Icon */}
                <svg 
                  className="w-4 h-4 text-gray-900" 
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
                <span>Passkey</span>
              </button>

              {/* Scan QR Button */}
              <button className="flex items-center justify-center gap-2 border border-gray-900 hover:bg-gray-50 active:scale-[0.97] rounded-xl py-3 px-4 text-xs font-bold text-gray-900 cursor-pointer transition-all duration-150">
                {/* QR Code Icon */}
                <svg 
                  className="w-4 h-4 text-gray-900" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <path d="M7 17h.01M17 7h.01M17 17h.01" />
                </svg>
                <span>Scan QR</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Footer */}
        <footer className="py-8 px-6 flex flex-col items-center gap-4 text-center mt-auto">
          <a href="#help" className="text-[13px] font-bold text-[#052e16] hover:underline transition-all">
            Need help accessing your account?
          </a>
          <div className="flex items-center gap-4 text-[13px] font-medium text-gray-400 select-none">
            <a href="#privacy" className="hover:text-gray-600 hover:underline transition-all">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="#terms" className="hover:text-gray-600 hover:underline transition-all">
              Terms of Service
            </a>
          </div>
        </footer>

      </div>
    </div>
  );
}

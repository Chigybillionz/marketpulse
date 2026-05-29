import { useState } from 'react';

const LANGUAGES = [
  {
    id: 'en',
    label: 'English',
    subLabel: 'Default System Language'
  },
  {
    id: 'pidgin',
    label: 'Pidgin English',
    subLabel: 'Common Market Language'
  },
  {
    id: 'yo',
    label: 'Yoruba',
    subLabel: 'Èdè Yorùbá'
  },
  {
    id: 'ig',
    label: 'Igbo',
    subLabel: 'Asụsụ Igbo'
  },
  {
    id: 'ha',
    label: 'Hausa',
    subLabel: 'Harshen Hausa'
  }
];

export default function LanguageSetting({ onNavigate }) {
  const [selectedId, setSelectedId] = useState('en');

  return (
    <div className="min-h-screen bg-[#eef1f7] flex justify-center items-center p-0 sm:p-4 font-sans text-gray-800 antialiased selection:bg-[#052e16] selection:text-white">
      {/* Mobile Screen Container Mockup */}
      <div className="w-full max-w-[430px] min-h-[850px] bg-[#f8f9ff] sm:rounded-[40px] sm:shadow-2xl overflow-hidden border border-gray-100 flex flex-col relative sm:my-4 pb-28">
        
        {/* 1. Top Navigation Bar */}
        <header className="flex justify-between items-center px-5 py-4 bg-[#f8f9ff]/95 backdrop-blur-md sticky top-0 z-30">
          <button 
            onClick={() => onNavigate('profile')}
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
            Language
          </h1>
          
          {/* User Profile Avatar */}
          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200">
            <img 
              src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=120" 
              alt="User profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 px-5 flex flex-col">
          
          {/* 2. Introduction Text */}
          <p className="text-gray-500 text-sm font-medium leading-relaxed mt-2 mb-6">
            Choose your preferred language for trading and notifications.
          </p>

          {/* 3. Language Selection Card (Main List) */}
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden mb-6">
            {LANGUAGES.map((lang) => {
              const isSelected = selectedId === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedId(lang.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150 cursor-pointer ${
                    isSelected ? 'bg-gray-50/40' : 'hover:bg-gray-50/20'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className="font-extrabold text-gray-950 text-base font-sans">
                      {lang.label}
                    </span>
                    <span className="text-xs font-medium text-gray-400 mt-0.5 leading-none">
                      {lang.subLabel}
                    </span>
                  </div>

                  {/* Radio Button */}
                  <div className="flex items-center justify-center">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full border-[2px] border-black flex items-center justify-center">
                        {/* Selected Blue-Green/Teal dot matching the reference image */}
                        <div className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border-[1.5px] border-gray-400" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* 4. Localized Support Feature Card */}
          <div 
            className="rounded-2xl p-5 relative overflow-hidden bg-[#052e16] text-white shadow-md border border-[#ffffff0a] mb-8"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px)',
              backgroundSize: '14px 14px'
            }}
          >
            <h3 className="font-extrabold text-white text-base font-sans mb-1">
              Localized Support
            </h3>
            <p className="text-emerald-200/90 text-[12.5px] font-medium leading-relaxed">
              Mama Ngozi Provisions now supports local languages to help you trade with more confidence and clarity.
            </p>
          </div>

        </div>

        {/* 5. Fixed Primary Action Button at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-5 py-6 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff] to-transparent sticky-bottom z-30">
          <button
            onClick={() => onNavigate('profile')}
            className="w-full bg-[#052e16] hover:bg-[#084221] active:scale-[0.98] text-white font-extrabold py-4 px-6 rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md hover:shadow-lg transition-all duration-200 text-sm tracking-wide"
          >
            <span>Set Language</span>
          </button>
        </div>

      </div>
    </div>
  );
}

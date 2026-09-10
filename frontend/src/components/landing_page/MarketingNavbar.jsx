import { useState, useRef, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MarketingNavbar({ onNavigate, activeTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef(null);
  const navigate = useNavigate();
  const { language, setLanguage, t, supportedLanguages } = useLanguage();

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path === 'landing' ? '/' : `/${path}`);
    }
  };

  const handleSignup = () => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate("signup");
    } else {
      navigate("/signup");
    }
  };

  const handleLogin = () => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate("login");
    } else {
      navigate("/login");
    }
  };

  const tabs = [
    { id: 'features', label: t('landing_nav_features') || 'Features' },
    { id: 'how-it-works', label: t('landing_nav_how_it_works') || 'How it Works' },
    { id: 'pricing', label: t('landing_nav_pricing') || 'Pricing' }
  ];

  // Close language menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
    <nav className="fixed top-0 left-0 w-full px-4 sm:px-6 lg:px-12 py-4 md:py-6 z-50 bg-[#F9FAFB]/90 backdrop-blur-md border-b border-gray-200/50 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 md:gap-3 cursor-pointer"
          onClick={() => handleNavClick('landing')}
        >
          <img src="/mylogo.png" alt="MarketPulse AI logo" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
          <span className="text-xl md:text-2xl font-bold tracking-tight text-[#064E3B]">MarketPulse AI</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`${
                activeTab === tab.id 
                  ? "text-gray-900 border-b-2 border-[#064E3B] pb-1 cursor-default" 
                  : "hover:text-gray-900 transition-colors pb-1"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop Buttons & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            
            {/* Language Toggle */}
            <div className="relative" ref={langMenuRef}>
              <button 
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#064E3B] transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <Globe size={18} />
                <span className="hidden lg:inline">{language}</span>
              </button>
              
              {isLangOpen && (
                <div className="absolute top-full mt-2 right-0 bg-white border border-gray-100 shadow-lg rounded-xl py-2 min-w-[120px] z-50 animate-in slide-in-from-top-2">
                  {supportedLanguages.map(lang => (
                    <button
                      key={lang}
                      onClick={() => { setLanguage(lang); setIsLangOpen(false); }}
                      className={`w-full text-left px-4 py-2 text-sm font-semibold hover:bg-gray-50 ${language === lang ? 'text-[#064E3B] bg-green-50/50' : 'text-gray-700'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={handleLogin} className="text-sm font-bold text-gray-800 hover:text-[#064E3B] transition-colors ml-2">{t('landing_nav_login') || 'Login'}</button>
            <button onClick={handleSignup} className="bg-[#064E3B] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#043d2e] transition-colors">
              {t('landing_nav_get_started') || 'Get Started'}
            </button>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2 overflow-y-auto max-h-[80vh]">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => handleNavClick(tab.id)}
              className={`text-left text-base font-semibold px-4 py-3 rounded-xl ${
                activeTab === tab.id ? "bg-green-50 text-[#064E3B]" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
          
          <div className="h-[1px] w-full bg-gray-100 my-1"></div>
          
          {/* Mobile Language Selection */}
          <div className="px-4 py-2">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Language</p>
            <div className="grid grid-cols-2 gap-2">
              {supportedLanguages.map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`text-left text-sm font-semibold px-3 py-2 rounded-lg ${language === lang ? 'bg-green-50 text-[#064E3B]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[1px] w-full bg-gray-100 my-1"></div>
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleLogin} 
              className="text-center text-base font-bold text-gray-800 px-4 py-3 hover:bg-gray-50 rounded-xl"
            >
              {t('landing_nav_login') || 'Login'}
            </button>
            <button 
              onClick={handleSignup} 
              className="text-center text-base font-bold text-white bg-[#064E3B] px-4 py-3 hover:bg-[#043d2e] rounded-xl"
            >
              {t('landing_nav_get_started') || 'Get Started'}
            </button>
          </div>
        </div>
      )}
    </nav>
    <div className="h-[73px] md:h-[89px] w-full shrink-0"></div>
    </>
  );
}

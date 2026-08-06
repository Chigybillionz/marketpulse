import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MarketingNavbar({ onNavigate, activeTab }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleNavClick = (path) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path === 'landing' ? '/' : `/${path}`);
    }
  };

  const handleGetStarted = () => {
    setIsMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate("login");
    } else {
      navigate("/login");
    }
  };

  const tabs = [
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How it Works' },
    { id: 'pricing', label: 'Pricing' }
  ];

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-12 py-6 max-w-7xl mx-auto relative z-50">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => handleNavClick('landing')}
        >
          <span className="text-xl md:text-2xl font-bold tracking-tight text-[#064E3B]">MarketPulse AI</span>
        </div>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => handleNavClick(tab.id === 'pricing' ? 'landing' : tab.id)}
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
        <div className="flex items-center gap-4 md:gap-6">
          <button onClick={handleGetStarted} className="hidden sm:block text-sm font-bold text-gray-800 hover:text-[#064E3B] transition-colors">Login</button>
          <button onClick={handleGetStarted} className="bg-[#064E3B] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#043d2e] transition-colors">
            Get Started
          </button>
          
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
        <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 flex flex-col gap-4 md:hidden animate-in slide-in-from-top-2">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={() => handleNavClick(tab.id === 'pricing' ? 'landing' : tab.id)}
              className={`text-left text-base font-semibold px-4 py-3 rounded-xl ${
                activeTab === tab.id ? "bg-green-50 text-[#064E3B]" : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
          <div className="h-[1px] w-full bg-gray-100 my-1"></div>
          <button 
            onClick={handleGetStarted} 
            className="text-center text-base font-bold text-gray-800 px-4 py-3 sm:hidden hover:bg-gray-50 rounded-xl"
          >
            Login
          </button>
        </div>
      )}
    </nav>
  );
}

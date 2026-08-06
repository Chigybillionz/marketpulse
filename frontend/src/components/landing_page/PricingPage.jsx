import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingNavbar from './MarketingNavbar';

export default function PricingPage({ onNavigate }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("login");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 w-full overflow-x-hidden flex flex-col">
      {/* Sticky Navbar */}
      <MarketingNavbar onNavigate={onNavigate} activeTab="pricing" />

      {/* Hero Header */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-16 md:pt-24 pb-12 md:pb-16 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#064E3B] tracking-tight mb-6">
          Simple, Transparent Pricing
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          Choose the perfect plan for your business needs. Upgrade, downgrade, or cancel anytime.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto flex-1">
        <div className="grid md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 items-stretch pt-8">
          
          {/* Free Plan */}
          <div className="bg-white rounded-2xl md:rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-3xl font-bold text-[#064E3B] mb-2 text-center">Free</h3>
            <p className="text-gray-500 text-sm font-medium text-center mb-8">
              For small traders getting started.
            </p>
            
            <div className="text-center mb-10">
               <span className="text-5xl font-black text-[#064E3B]">$0</span>
               <span className="text-gray-500 font-medium">/mo</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Basic voice entry (up to 50/mo)</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Standard reporting dashboard</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Email support</span>
               </li>
            </ul>

            <button onClick={handleGetStarted} className="w-full bg-[#EBF3FF] text-[#064E3B] hover:bg-[#dce9fa] py-3.5 rounded-xl font-bold transition-colors">
               Start for Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-white rounded-2xl md:rounded-[2rem] p-8 md:p-10 border-4 border-[#064E3B] shadow-xl relative flex flex-col md:-translate-y-4 z-10">
            {/* Badge */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md">
               Most Popular
            </div>

            <h3 className="text-3xl font-bold text-[#064E3B] mb-2 text-center">Pro</h3>
            <p className="text-gray-500 text-sm font-medium text-center mb-8">
              For growing businesses needing more power.
            </p>
            
            <div className="text-center mb-10">
               <span className="text-5xl font-black text-[#064E3B]">$29</span>
               <span className="text-gray-500 font-medium">/mo</span>
            </div>

            <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Unlimited voice entry</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Advanced AI analytics & forecasting</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Priority chat support</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Export to popular accounting software</span>
               </li>
            </ul>

            <button onClick={handleGetStarted} className="w-full bg-[#064E3B] text-white hover:bg-[#043d2e] py-3.5 rounded-xl font-bold transition-colors shadow-lg">
               Get Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white rounded-2xl md:rounded-[2rem] p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col hover:shadow-md transition-shadow">
            <h3 className="text-3xl font-bold text-[#064E3B] mb-2 text-center">Enterprise</h3>
            <p className="text-gray-500 text-sm font-medium text-center mb-8">
              For large cooperatives & organizations.
            </p>
            
            <div className="text-center mb-10">
               <span className="text-4xl font-black text-[#064E3B] leading-[1.1]">Custom</span>
               <div className="text-transparent font-medium mt-1">/mo</div> {/* Spacer to keep alignment */}
            </div>

            <ul className="space-y-4 mb-10 flex-1">
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Everything in Pro</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Dedicated account manager</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">Custom API integration</span>
               </li>
               <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#064E3B] shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-gray-700">On-premise deployment options</span>
               </li>
            </ul>

            <button onClick={handleGetStarted} className="w-full bg-[#EBF3FF] text-[#064E3B] hover:bg-[#dce9fa] py-3.5 rounded-xl font-bold transition-colors">
               Contact Sales
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white pt-10 pb-10 mt-auto">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <span className="text-lg md:text-xl font-extrabold text-[#064E3B]">MarketPulse AI</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-bold text-gray-500">
               <a href="#" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
               <a href="#" className="hover:text-gray-900 transition-colors">Terms of Service</a>
               <a href="#" className="hover:text-gray-900 transition-colors">Help Center</a>
            </div>

            <div className="text-sm font-semibold text-gray-400">
               © 2024 MarketPulse AI. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

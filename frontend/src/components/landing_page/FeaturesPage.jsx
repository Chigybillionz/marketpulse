import React from 'react';
import { Mic, BarChart2, Lock, Wallet, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingNavbar from './MarketingNavbar';

export default function FeaturesPage({ onNavigate }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("signup");
    } else {
      navigate("/signup");
    }
  };

  const handleNavClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path === 'landing' ? '/' : `/${path}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans text-gray-900 w-full overflow-x-hidden">
      {/* Navbar */}
      <MarketingNavbar onNavigate={onNavigate} activeTab="features" />

      {/* Hero Header */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-16 pb-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#111827] tracking-tight mb-6">
          Effortless Financial Control.
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed mb-10 max-w-2xl mx-auto">
          MarketPulse AI transforms bookkeeping from a chore into a simple conversation. Speak your transactions, and let our intelligent engine handle the rest with real-time insights and bank-grade security.
        </p>
        <button onClick={handleGetStarted} className="bg-[#064E3B] text-white px-8 py-3.5 rounded-xl font-bold inline-flex items-center justify-center gap-3 hover:bg-[#043d2e] transition-colors shadow-lg shadow-green-900/20">
          <Mic size={18} /> Try Voice Bookkeeping
        </button>
      </section>

      {/* Features Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#064E3B] flex items-center justify-center mb-6">
              <Mic size={22} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Voice-First Input</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              Just say "Spent $45 on supplies at Home Depot." Our AI instantly categorizes the expense, extracts the merchant, and logs the transaction. No typing required.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#064E3B] flex items-center justify-center mb-6">
              <BarChart2 size={22} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Insights</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              Instantly view your cash flow, upcoming liabilities, and revenue trends on intuitive, responsive metric cards designed for quick comprehension.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-[#064E3B] flex items-center justify-center mb-6">
              <Wallet size={22} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Smart Debt Mgmt</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium">
              Track accounts payable and receivable effortlessly. Get automated reminders for overdue invoices and strategically plan your debt repayments.
            </p>
          </div>
        </div>

        {/* Large Card */}
        <div className="bg-[#EEF2F6] rounded-[2rem] p-8 md:p-12 border border-blue-50/50 flex flex-col lg:flex-row gap-10 items-center overflow-hidden">
           <div className="flex-1 space-y-6 z-10">
              <div className="w-12 h-12 rounded-full bg-[#064E3B] text-white flex items-center justify-center">
                <Lock size={22} />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900">Bank-Grade Security</h3>
              <p className="text-gray-700 leading-relaxed font-medium max-w-lg">
                Your financial data is protected with 256-bit encryption, rigorous compliance standards, and continuous monitoring. We prioritize your privacy and security above all else, ensuring your business information remains strictly confidential.
              </p>
           </div>
           
           {/* Mock Image Area */}
           <div className="flex-1 w-full bg-white/60 backdrop-blur rounded-2xl border border-white/40 shadow-xl overflow-hidden aspect-[4/3] sm:aspect-video lg:aspect-[4/3] flex flex-col translate-x-0 lg:translate-x-8 mt-8 lg:mt-0 relative group">
              <div className="flex items-center gap-2 p-3 border-b border-white/50 bg-white/40">
                 <div className="w-3 h-3 rounded-full bg-red-400"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                 <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 p-4 relative overflow-hidden bg-slate-900 flex items-center justify-center">
                 {/* Decorative Security Graphic */}
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.4)_0,transparent_100%)]"></div>
                 
                 <div className="relative z-10 w-full max-w-sm">
                    <div className="w-16 h-16 mx-auto bg-green-500/20 rounded-2xl flex items-center justify-center border border-green-500/30 mb-8 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                       <Lock size={32} className="text-green-400" />
                    </div>
                    
                    {/* Fake Network Nodes */}
                    <div className="relative w-full h-32">
                       <svg className="absolute inset-0 w-full h-full text-green-500/20" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <path d="M10,50 Q25,20 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="1"/>
                          <path d="M20,80 Q50,90 80,80" fill="none" stroke="currentColor" strokeWidth="1"/>
                          <path d="M30,20 Q60,30 70,10" fill="none" stroke="currentColor" strokeWidth="1"/>
                       </svg>
                       <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
                       <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-green-400 rounded-full shadow-[0_0_15px_#4ade80]"></div>
                       <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
                       <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-green-400 rounded-full shadow-[0_0_10px_#4ade80]"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-[#EBF3FF] py-20 md:py-24 text-center px-4 sm:px-6">
         <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Ready to simplify your finances?</h2>
         <p className="text-gray-600 font-medium mb-10 max-w-lg mx-auto">
            Join thousands of micro-entrepreneurs who have reclaimed their time with MarketPulse AI.
         </p>
         <button onClick={handleGetStarted} className="bg-[#064E3B] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#043d2e] transition-colors shadow-lg">
            Start Your Free Trial
         </button>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white pt-10 pb-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <span className="text-lg md:text-xl font-extrabold text-[#064E3B]">MarketPulse AI</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-bold text-gray-500">
               <button onClick={() => handleNavClick('privacy_policy')} className="hover:text-gray-900 transition-colors">Privacy Policy</button>
               <button onClick={() => handleNavClick('terms_of_service')} className="hover:text-gray-900 transition-colors">Terms of Service</button>
               <button onClick={() => handleNavClick('faqs')} className="hover:text-gray-900 transition-colors">Help Center</button>
            </div>

            <div className="text-sm font-semibold text-gray-400">
               © 2024 MarketPulse AI. All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

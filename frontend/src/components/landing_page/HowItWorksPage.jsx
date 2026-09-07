import { Mic, Bot, LineChart, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingNavbar from './MarketingNavbar';

export default function HowItWorksPage({ onNavigate }) {
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
      <MarketingNavbar onNavigate={onNavigate} activeTab="how-it-works" />

      {/* Hero Header */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-16 pb-20 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#064E3B] tracking-tight mb-6">
          From Voice to Value in Seconds
        </h1>
        <p className="text-base md:text-lg text-gray-600 font-medium leading-relaxed max-w-2xl mx-auto">
          MarketPulse AI simplifies your bookkeeping. Just tell us about your transactions, and our AI handles the categorization, tracking, and insights automatically.
        </p>
      </section>

      {/* Steps Grid */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-24 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 items-start">
          
          {/* Step 1: Speak */}
          <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-[#064E3B] flex items-center justify-center mb-8 relative z-10">
              <Mic size={24} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">1. Speak</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium mb-12 relative z-10">
              Simply tap the microphone and naturally describe your transaction. "Just paid $50 for office supplies at Staples."
            </p>
            
            <div className="mt-auto pt-6 border-t border-gray-100 relative z-10">
               <div className="bg-[#EBF3FF] rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#064E3B] text-white flex items-center justify-center shadow-lg shadow-green-900/20 shrink-0">
                     <Mic size={18} />
                  </div>
                  <div className="flex-1 h-3 bg-blue-200/50 rounded-full overflow-hidden flex items-center">
                     <div className="h-full bg-[#064E3B] w-[60%] rounded-full"></div>
                  </div>
               </div>
            </div>
          </div>

          {/* Step 2: AI Processes */}
          <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-[#064E3B] flex items-center justify-center mb-8 relative z-10">
              <Bot size={24} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">2. AI Processes</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium mb-12 relative z-10">
              Our advanced AI interprets your words, extracts the merchant, amount, and automatically categorizes it accurately.
            </p>
            
            <div className="mt-auto pt-6 relative z-10 space-y-3">
               <div className="bg-white border border-gray-100 rounded-lg p-3 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Merchant</span>
                  <span className="text-sm font-bold text-gray-900">Staples</span>
               </div>
               <div className="bg-white border border-gray-100 rounded-lg p-3 flex justify-between items-center shadow-sm">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</span>
                  <span className="text-xs font-bold text-[#064E3B] bg-green-50 px-3 py-1 rounded-full">Office Supplies</span>
               </div>
            </div>
          </div>

          {/* Step 3: Insights Generated */}
          <div className="bg-gradient-to-b from-white to-gray-50/50 rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="w-12 h-12 rounded-xl bg-blue-100/50 text-[#064E3B] flex items-center justify-center mb-8 relative z-10">
              <LineChart size={24} />
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-4 relative z-10">3. Insights Generated</h3>
            <p className="text-gray-600 text-sm leading-relaxed font-medium mb-12 relative z-10">
              Your dashboard updates instantly. View real-time cash flow, expense breakdowns, and actionable financial health metrics.
            </p>
            
            <div className="mt-auto pt-6 relative z-10">
               <div className="bg-[#EBF3FF] rounded-xl p-6 border border-blue-100 shadow-inner flex flex-col justify-end h-28 relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-200">
                     <div className="h-full w-1/3 bg-red-500"></div>
                  </div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Expenses</span>
                     <span className="text-3xl font-black text-red-500 tracking-tight">-$50.00</span>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pb-24 max-w-5xl mx-auto">
         <div className="bg-[#EBF3FF] rounded-[2.5rem] py-20 px-8 text-center border border-blue-100 shadow-sm">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">Ready to streamline your finances?</h2>
            <p className="text-gray-600 font-medium mb-10 max-w-lg mx-auto leading-relaxed">
               Join thousands of micro-entrepreneurs who are saving hours every week with MarketPulse AI.
            </p>
            <button onClick={handleGetStarted} className="bg-[#064E3B] text-white px-8 py-3.5 rounded-xl font-bold inline-flex items-center gap-2 hover:bg-[#043d2e] transition-colors shadow-lg">
               Start for Free <ArrowRight size={18} strokeWidth={2.5} />
            </button>
         </div>
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

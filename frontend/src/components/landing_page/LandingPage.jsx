import React from 'react';
import { Mic, BarChart2, Lock, Wallet, Play, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingNavbar from './MarketingNavbar';

export default function LandingPage({ onNavigate }) {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    // Navigate to the onboarding/login flow
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
      <MarketingNavbar onNavigate={onNavigate} activeTab="landing" />

      {/* Hero Section */}
      <section className="w-full px-4 sm:px-6 lg:px-12 pt-12 md:pt-20 pb-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
        <div className="space-y-6 md:space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5E7EB]/60 border border-gray-200 text-xs md:text-sm font-semibold text-gray-700 shadow-sm w-fit">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
            Trusted by 5,000+ Nigerian Traders
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-[#111827]">
            Your Market Business,<br/>
            <span className="text-[#064E3B]">Perfectly Balanced.</span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 max-w-lg leading-relaxed font-medium">
            Speak your sales, expenses, and debts. We track it all instantly, so you always know your true profit. Voice-first bookkeeping built for the hustle.
          </p>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
            <button onClick={handleGetStarted} className="w-full sm:w-auto bg-[#064E3B] text-white px-7 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#043d2e] transition-colors shadow-lg shadow-green-900/20">
              Get Started <ArrowRight size={18} strokeWidth={2.5} />
            </button>
            <button className="w-full sm:w-auto bg-white border border-gray-200 text-gray-800 px-7 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <Play size={18} className="text-gray-500" fill="currentColor" /> Watch Demo
            </button>
          </div>
        </div>

        {/* Hero Image/Mockup Placeholder */}
        <div className="relative rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl border border-gray-200 bg-white aspect-[4/3] md:aspect-[16/11] flex flex-col mt-8 lg:mt-0 lg:translate-x-4">
           {/* Mock UI Header */}
           <div className="border-b border-gray-100 p-3 md:p-4 flex items-center justify-between bg-white z-10">
              <div className="flex items-center gap-3">
                 <div className="w-24 md:w-32 h-4 bg-gray-200 rounded-full"></div>
                 <div className="hidden sm:block w-16 h-4 bg-gray-100 rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
           </div>
           
           {/* Mock UI Body */}
           <div className="flex-1 bg-gray-50 relative overflow-hidden">
              {/* Fallback Image if user wants to replace it later */}
              <div className="absolute inset-0 bg-cover bg-center opacity-80 mix-blend-multiply" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=2070&auto=format&fit=crop')" }}></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/40 to-transparent"></div>

              <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end pb-8">
                  <div className="space-y-4 w-full">
                      <div className="max-w-[70%] space-y-2 mb-6">
                        <div className="h-6 md:h-8 w-3/4 bg-white/90 rounded-lg backdrop-blur-sm"></div>
                        <div className="h-4 w-1/2 bg-white/80 rounded-lg backdrop-blur-sm"></div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 w-full justify-between items-end">
                        {/* Floating Mock Stats Card */}
                        <div className="bg-white/95 backdrop-blur p-3 md:p-4 rounded-xl md:rounded-2xl shadow-xl border border-white/20 w-[180px] md:w-[220px] flex items-center gap-3 md:gap-4">
                           <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-100/80 flex items-center justify-center text-green-600">
                              <BarChart2 size={20} className="md:w-6 md:h-6" />
                           </div>
                           <div>
                              <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider">Today's Profit</p>
                              <p className="text-lg md:text-2xl font-black text-gray-900">₦45,200</p>
                           </div>
                        </div>

                        {/* Floating Action Button */}
                        <div className="hidden sm:flex bg-green-500 p-4 rounded-2xl shadow-lg shadow-green-500/30 text-white items-center justify-center">
                            <Mic size={24} />
                        </div>
                      </div>
                  </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
            <h2 className="text-3xl md:text-[2.5rem] font-extrabold text-gray-900 mb-6 leading-tight">Built for Speed and Clarity</h2>
            <p className="text-base md:text-lg text-gray-500 font-medium">Skip the complicated spreadsheets. Our tools are designed to work the way you do.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="bg-[#F9FAFB] rounded-3xl p-8 md:p-10 border border-gray-100 flex flex-col sm:flex-row gap-8 items-start hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              <div className="flex-1">
                 <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center mb-6">
                   <Mic size={28} />
                 </div>
                 <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Voice-First Bookkeeping</h3>
                 <p className="text-gray-500 leading-relaxed font-medium">
                   Just say "I sold 5 bags of rice for 100k" or "Paid 5k for transport." MarketPulse AI understands natural language, categorizes the entry, and updates your ledger instantly.
                 </p>
              </div>
              <div className="w-full sm:w-48 aspect-square rounded-3xl bg-blue-50/50 border border-blue-100 flex items-center justify-center relative overflow-hidden flex-shrink-0 mt-6 sm:mt-0 self-center sm:self-start">
                  <div className="w-16 h-16 rounded-full bg-[#064E3B] text-white flex items-center justify-center shadow-xl relative z-10 animate-bounce">
                      <Mic size={28} />
                  </div>
                  <p className="absolute bottom-6 text-xs font-bold text-blue-900/60 z-10 tracking-widest uppercase">Listening...</p>
                  {/* Ripple effect circles */}
                  <div className="absolute w-28 h-28 rounded-full border-2 border-blue-200/50 scale-150"></div>
                  <div className="absolute w-40 h-40 rounded-full border-2 border-blue-200/30 scale-150"></div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-[#F9FAFB] rounded-3xl p-8 md:p-10 border border-gray-100 flex flex-col gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
               <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
                 <BarChart2 size={28} />
               </div>
               <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Real-time AI Insights</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    Get instant summaries of your daily, weekly, or monthly performance. Know exactly what's selling and where your money is going.
                  </p>
               </div>
               <div className="mt-auto h-36 rounded-2xl bg-white border border-gray-100 p-5 shadow-sm relative overflow-hidden flex items-end">
                  {/* Mock Chart */}
                  <div className="flex items-end gap-3 w-full h-full opacity-70">
                      <div className="w-1/6 bg-indigo-100 rounded-t flex-shrink-0 h-1/3"></div>
                      <div className="w-1/6 bg-indigo-200 rounded-t flex-shrink-0 h-1/2"></div>
                      <div className="w-1/6 bg-indigo-300 rounded-t flex-shrink-0 h-2/5"></div>
                      <div className="w-1/6 bg-indigo-400 rounded-t flex-shrink-0 h-3/4"></div>
                      <div className="w-1/6 bg-indigo-500 rounded-t flex-shrink-0 h-full"></div>
                      <div className="w-1/6 bg-indigo-600 rounded-t flex-shrink-0 h-[85%]"></div>
                  </div>
               </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-[#F9FAFB] rounded-3xl p-8 md:p-10 border border-gray-100 flex flex-col gap-6 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
               <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
                 <Lock size={28} />
               </div>
               <div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Bank-Grade Security</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    Your financial data is protected with 256-bit encryption. Offline-first capabilities ensure you can record transactions even without internet access.
                  </p>
               </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-[#F9FAFB] rounded-3xl p-8 md:p-10 border border-gray-100 flex flex-col sm:flex-row gap-8 items-start hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
               <div className="flex-1">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mb-6">
                    <Wallet size={28} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Smart Debt Management</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">
                    Never forget who owes you or who you owe. Voice-log debts and let the AI generate polite WhatsApp reminders for your customers.
                  </p>
               </div>
               {/* Mock Debt Cards */}
               <div className="w-full sm:w-60 space-y-3 mt-6 sm:mt-0 flex-shrink-0 self-center">
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center"><ArrowDown size={16} strokeWidth={3}/></div>
                        <span className="text-sm font-bold text-gray-800">Mama Ngozi</span>
                     </div>
                     <span className="text-sm font-black text-red-600">-₦15,000</span>
                  </div>
                  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center"><ArrowUp size={16} strokeWidth={3}/></div>
                        <span className="text-sm font-bold text-gray-800">Chinedu</span>
                     </div>
                     <span className="text-sm font-black text-green-600">+₦8,500</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 md:py-32">
         <div className="bg-[#064E3B] rounded-[2.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(white_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>
            <div className="relative z-10">
               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight">Join the Future of Market Trading Today</h2>
               <p className="text-green-100 max-w-2xl mx-auto mb-10 md:mb-12 text-base md:text-lg font-medium leading-relaxed">
                  Stop stressing over lost receipts and confused ledgers. Let your voice do the bookkeeping while you focus on growing your business.
               </p>
               <button onClick={handleGetStarted} className="bg-white text-[#064E3B] px-8 py-4 md:px-10 md:py-5 rounded-2xl font-black text-base md:text-lg flex items-center gap-3 mx-auto hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl">
                  Create Free Account <ArrowRight size={22} strokeWidth={2.5} />
               </button>
               <p className="mt-6 text-sm font-semibold text-green-200/80">No credit card required. 14-day free trial.</p>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white pt-10 pb-10">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
               <img src="/mylogo.png" alt="MarketPulse AI logo" className="w-6 h-6 md:w-7 md:h-7 rounded-full grayscale opacity-70 object-cover" />
               <span className="text-lg md:text-xl font-bold text-gray-800">MarketPulse AI</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm font-bold text-gray-500">
               <button onClick={() => handleNavClick('privacy_policy')} className="hover:text-gray-900 transition-colors">Privacy Policy</button>
               <button onClick={() => handleNavClick('terms_of_service')} className="hover:text-gray-900 transition-colors">Terms of Service</button>
               <button onClick={() => handleNavClick('faqs')} className="hover:text-gray-900 transition-colors">Help Center</button>
            </div>

            <div className="text-sm font-semibold text-gray-400">
               © 2024 MarketPulse AI, All rights reserved.
            </div>
         </div>
      </footer>
    </div>
  );
}

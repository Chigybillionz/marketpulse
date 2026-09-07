import { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MarketingNavbar from './MarketingNavbar';

export default function PricingPage({ onNavigate }) {
  const navigate = useNavigate();
  const [activePlan, setActivePlan] = useState('Pro');

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

  const plans = [
    {
      id: 'Free',
      title: 'Free',
      subtitle: 'For small traders getting started.',
      price: '$0',
      period: '/mo',
      features: [
        'Basic voice entry (up to 50/mo)',
        'Standard reporting dashboard',
        'Email support'
      ],
      buttonText: 'Start for Free'
    },
    {
      id: 'Pro',
      title: 'Pro',
      subtitle: 'For growing businesses needing more power.',
      price: '$29',
      period: '/mo',
      badge: 'Most Popular',
      features: [
        'Unlimited voice entry',
        'Advanced AI analytics & forecasting',
        'Priority chat support',
        'Export to popular accounting software'
      ],
      buttonText: 'Get Pro'
    },
    {
      id: 'Enterprise',
      title: 'Enterprise',
      subtitle: 'For large cooperatives & organizations.',
      price: 'Custom',
      period: '/mo',
      isCustom: true,
      features: [
        'Everything in Pro',
        'Dedicated account manager',
        'Custom API integration',
        'On-premise deployment options'
      ],
      buttonText: 'Contact Sales'
    }
  ];

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
          
          {plans.map((plan) => {
            const isActive = activePlan === plan.id;

            return (
              <div 
                key={plan.id}
                onClick={() => setActivePlan(plan.id)}
                className={`cursor-pointer bg-white rounded-2xl md:rounded-[2rem] p-8 md:p-10 flex flex-col transition-all duration-300 ${
                  isActive 
                    ? 'border-4 border-[#064E3B] shadow-xl md:-translate-y-4 z-10 relative' 
                    : 'border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 opacity-90 hover:opacity-100'
                }`}
              >
                {/* Badge for Pro plan */}
                {plan.badge && (
                  <div className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-xs font-bold uppercase tracking-widest py-1.5 px-4 rounded-full shadow-md transition-colors ${
                    isActive ? 'bg-orange-500' : 'bg-gray-400'
                  }`}>
                     {plan.badge}
                  </div>
                )}

                <h3 className={`text-3xl font-bold mb-2 text-center transition-colors ${isActive ? 'text-[#064E3B]' : 'text-gray-800'}`}>
                  {plan.title}
                </h3>
                <p className="text-gray-500 text-sm font-medium text-center mb-8 h-10">
                  {plan.subtitle}
                </p>
                
                <div className="text-center mb-10 h-16 flex items-center justify-center">
                   {plan.isCustom ? (
                     <div className="flex flex-col items-center justify-center">
                        <span className={`text-4xl font-black leading-[1.1] ${isActive ? 'text-[#064E3B]' : 'text-gray-800'}`}>
                          {plan.price}
                        </span>
                        <div className="text-transparent font-medium mt-1">/mo</div>
                     </div>
                   ) : (
                     <div>
                        <span className={`text-5xl font-black ${isActive ? 'text-[#064E3B]' : 'text-gray-800'}`}>
                          {plan.price}
                        </span>
                        <span className="text-gray-500 font-medium">{plan.period}</span>
                     </div>
                   )}
                </div>

                <ul className="space-y-4 mb-10 flex-1">
                   {plan.features.map((feature, index) => (
                     <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${isActive ? 'text-[#064E3B]' : 'text-gray-400'}`} />
                        <span className={`text-sm font-medium transition-colors ${isActive ? 'text-gray-800' : 'text-gray-500'}`}>
                          {feature}
                        </span>
                     </li>
                   ))}
                </ul>

                <button 
                  onClick={(e) => {
                    e.stopPropagation(); // prevent clicking button from also triggering card click
                    handleGetStarted();
                  }} 
                  className={`w-full py-3.5 rounded-xl font-bold transition-all ${
                    isActive 
                      ? 'bg-[#064E3B] text-white hover:bg-[#043d2e] shadow-lg' 
                      : 'bg-[#EBF3FF] text-[#064E3B] hover:bg-[#dce9fa]'
                  }`}
                >
                   {plan.buttonText}
                </button>
              </div>
            );
          })}

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white pt-10 pb-10 mt-auto">
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

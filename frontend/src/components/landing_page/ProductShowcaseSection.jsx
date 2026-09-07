import React from 'react';
import { Mic, BarChart2, Lock, Wallet } from 'lucide-react';

// Icon mapping - use Mic instead of Microphone

export default function ProductShowcaseSection() {
  const features = [
    {
      icon: Mic,
      title: 'Voice-First Input',
      description:
        'Just say "I sold 5 bags of rice for 100k" — no typing, no forms. Our AI understands natural language.',
      color: 'bg-green-100 text-green-600',
      highlight: 'Supports Nigerian English, Pidgin, and market lingo',
    },
    {
      icon: BarChart2,
      title: 'Real-time Analytics',
      description:
        'See your profit, expenses, and trends instantly. Daily, weekly, monthly — your data, your pace.',
      color: 'bg-blue-100 text-blue-600',
      highlight: '7-day trend visualization',
    },
    {
      icon: Lock,
      title: 'Bank-Grade Security',
      description:
        '256-bit encryption protects your data. Offline-first design means you can record even without internet.',
      color: 'bg-red-100 text-red-500',
      highlight: 'Works offline, syncs when connected',
    },
    {
      icon: Wallet,
      title: 'Smart Debt Management',
      description:
        'Track who owes you and who you owe. Generate polite WhatsApp reminders automatically.',
      color: 'bg-purple-100 text-purple-600',
      highlight: 'WhatsApp reminder integration',
    },
  ];

  return (
    <section
      data-reveal="fade-up"
      className="bg-white py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Mic size={14} />
            Core Features
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Everything You Need to
            <br />
            <span className="text-[#064E3B]">Run Your Market Business</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
            Four powerful tools that work together to give you complete control
            over your finances.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group bg-[#F9FAFB] rounded-3xl p-6 md:p-8 border border-gray-100 hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300 hover:-translate-y-1"
              style={{
                animation: 'fadeInUp 0.5s ease-out forwards',
                animationDelay: `${index * 100}ms`,
                opacity: 0,
              }}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}
              >
                <feature.icon size={28} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed font-medium">
                  {feature.description}
                </p>

                {/* Highlight */}
                <div className="mt-4 flex items-start gap-2">
                  <svg
                    className="w-4 h-4 text-[#064E3B] flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-semibold text-green-700">
                    {feature.highlight}
                  </span>
                </div>
              </div>

              {/* Decorative element */}
              <div
                className={`w-full h-1 rounded-full ${feature.color} mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
              />
            </div>
          ))}
        </div>

        {/* Product screenshot mockup */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-100"
          style={{
            animation: 'fadeInUp 0.5s ease-out 500ms forwards',
            opacity: 0,
          }}
        >
          {/* Background decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-blue-50/20 pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-100/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-blue-100/20 rounded-full blur-3xl" />

          <div className="relative z-10 bg-white rounded-2xl p-4 md:p-6 lg:p-8">
            {/* Mock UI Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#064E3B] flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">MarketPulse</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200" />
                <div className="w-6 h-6 rounded-full bg-gray-200" />
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Total Balance */}
              <div className="bg-[#064E3B] rounded-xl p-4 text-white">
                <p className="text-xs font-semibold text-green-200 uppercase tracking-wider mb-1">
                  Total Balance
                </p>
                <p className="text-2xl font-extrabold">₦4,892,500</p>
                <p className="text-xs text-green-200 mt-1">+12.4% this month</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#F9FAFB] rounded-xl p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Income
                  </p>
                  <p className="text-sm font-extrabold text-green-600">₦245k</p>
                </div>
                <div className="bg-[#F9FAFB] rounded-xl p-3">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">
                    Expenses
                  </p>
                  <p className="text-sm font-extrabold text-red-500">₦89k</p>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Sold Garri (5 bags)</p>
                    <p className="text-xs text-gray-500">Today, 2:30 PM</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-green-600">+₦150,000</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Transport to Lagos</p>
                    <p className="text-xs text-gray-500">Today, 11:15 AM</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-red-500">-₦8,500</p>
              </div>

              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Wallet size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Chinedu (Credit Sale)</p>
                    <p className="text-xs text-gray-500">Due: Fri, Mar 13</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-blue-600">₦25,000</p>
              </div>
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-l-2 border-green-200 rounded-tl-3xl" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-r-2 border-blue-200 rounded-br-3xl" />
        </div>
      </div>

      {/* Add animation styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}

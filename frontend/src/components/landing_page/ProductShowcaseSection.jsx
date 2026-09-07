/**
 * ProductShowcaseSection — strong product reveal (Phase 2).
 *
 * Feature cards enter as a staggered grid, then the dashboard mockup
 * scales in as the "hero artifact": the balance counts up and recent
 * transactions appear row by row. One in-view flag drives everything;
 * animations run once and rest.
 */

import { Mic, BarChart2, Lock, Wallet } from 'lucide-react';
import useInView from './useInView';
import { AnimatedCounter } from './motionPrimitives';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const staged = (visible, delay, extraTransform = 'translateY(18px)') => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : extraTransform,
  transition: visible ? `opacity 650ms ${MP_EASE} ${delay}ms, transform 650ms ${MP_EASE} ${delay}ms` : 'none',
});

export default function ProductShowcaseSection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.15 });

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
      ref={sectionRef}
      data-reveal="fade-up"
      className="bg-white py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div
            data-reveal="data-entrance"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700"
          >
            <Mic size={14} />
            Core Features
          </div>
          <h2
            data-reveal="data-entrance"
            data-reveal-delay="80"
            className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            Everything You Need to
            <br />
            <span className="text-[#064E3B]">Run Your Market Business</span>
          </h2>
          <p
            data-reveal="data-entrance"
            data-reveal-delay="160"
            className="text-base font-medium text-gray-600 md:text-lg"
          >
            Four powerful tools that work together to give you complete control
            over your finances.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="mb-16 grid gap-6 md:grid-cols-2 lg:gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-gray-100 bg-[#F9FAFB] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/50 md:p-8"
              style={staged(sectionInView, index * 110)}
            >
              {/* Icon */}
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.color} transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110`}
              >
                <feature.icon size={28} />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
                  {feature.title}
                </h3>
                <p className="font-medium leading-relaxed text-gray-600">
                  {feature.description}
                </p>

                {/* Highlight */}
                <div className="mt-4 flex items-start gap-2">
                  <svg
                    className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#064E3B]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    aria-hidden="true"
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
                className={`mt-6 h-1 w-full rounded-full ${feature.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                aria-hidden="true"
              />
            </div>
          ))}
        </div>

        {/* Product dashboard mockup — the product reveal */}
        <div
          className="relative overflow-hidden rounded-3xl border border-gray-100 shadow-2xl"
          style={staged(sectionInView, 350, 'translateY(30px) scale(0.97)')}
        >
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-green-50/20 via-transparent to-blue-50/20" />
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-green-100/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-blue-100/20 blur-3xl" />

          <div className="relative z-10 rounded-2xl bg-white p-4 md:p-6 lg:p-8">
            {/* Mock UI Header */}
            <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#064E3B]">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">MarketPulse</p>
                  <p className="text-xs text-gray-500">Dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-2" aria-hidden="true">
                <div className="h-6 w-6 rounded-full bg-gray-200" />
                <div className="h-6 w-6 rounded-full bg-gray-200" />
              </div>
            </div>

            {/* Mock Dashboard Content */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              {/* Total Balance — counts up on reveal */}
              <div className="rounded-xl bg-[#064E3B] p-4 text-white">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-green-200">
                  Total Balance
                </p>
                <p className="text-2xl font-extrabold">
                  <AnimatedCounter value={4892500} prefix="₦" />
                </p>
                <p className="mt-1 text-xs text-green-200">+12.4% this month</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-[#F9FAFB] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Income
                  </p>
                  <p className="text-sm font-extrabold text-green-600">
                    <AnimatedCounter value={245} prefix="₦" suffix="k" />
                  </p>
                </div>
                <div className="rounded-xl bg-[#F9FAFB] p-3">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                    Expenses
                  </p>
                  <p className="text-sm font-extrabold text-red-500">
                    <AnimatedCounter value={89} prefix="₦" suffix="k" />
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Transactions — rows appear one by one */}
            <div className="space-y-2">
              {[
                {
                  icon: (
                    <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconClass: 'bg-green-100',
                  title: 'Sold Garri (5 bags)',
                  meta: 'Today, 2:30 PM',
                  amount: '+₦150,000',
                  amountClass: 'text-green-600',
                },
                {
                  icon: (
                    <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ),
                  iconClass: 'bg-red-100',
                  title: 'Transport to Lagos',
                  meta: 'Today, 11:15 AM',
                  amount: '-₦8,500',
                  amountClass: 'text-red-500',
                },
                {
                  icon: <Wallet size={16} className="text-blue-600" />,
                  iconClass: 'bg-blue-100',
                  title: 'Chinedu (Credit Sale)',
                  meta: 'Due: Fri, Mar 13',
                  amount: '₦25,000',
                  amountClass: 'text-blue-600',
                },
              ].map((row, index) => (
                <div
                  key={row.title}
                  className="flex items-center justify-between py-2"
                  style={staged(sectionInView, 600 + index * 140)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${row.iconClass}`}>
                      {row.icon}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{row.title}</p>
                      <p className="text-xs text-gray-500">{row.meta}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-bold ${row.amountClass}`}>{row.amount}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative corner elements */}
          <div className="pointer-events-none absolute right-4 top-4 h-16 w-16 rounded-tl-3xl border-l-2 border-t-2 border-green-200" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-4 left-4 h-16 w-16 rounded-br-3xl border-b-2 border-r-2 border-blue-200" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Sparkles, ArrowRight, Truck, Package, Users, ShieldCheck, Zap } from 'lucide-react';
import useInView from './useInView';
import { AnimatedCounter } from './motionPrimitives';
import { useLanguage } from '../../i18n/LanguageContext';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const staged = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'translateY(16px)',
  transition: visible ? `opacity 600ms ${MP_EASE} ${delay}ms, transform 600ms ${MP_EASE} ${delay}ms` : 'none',
});

export default function IntelligenceSection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.15 });
  const { t } = useLanguage();
  const [hoveredDay, setHoveredDay] = useState(null);

  const dailyTrend = [
    { day: 'Mon', revenue: 320000, expenses: 240000, profit: 80000, label: '₦80k net' },
    { day: 'Tue', revenue: 380000, expenses: 220000, profit: 160000, label: '₦160k net' },
    { day: 'Wed', revenue: 350000, expenses: 210000, profit: 140000, label: '₦140k net' },
    { day: 'Thu', revenue: 420000, expenses: 260000, profit: 160000, label: '₦160k net' },
    { day: 'Fri', revenue: 490000, expenses: 280000, profit: 210000, label: '₦210k net' },
    { day: 'Sat', revenue: 580000, expenses: 310000, profit: 270000, label: '₦270k net' },
    { day: 'Sun', revenue: 300000, expenses: 190000, profit: 110000, label: '₦110k net' },
  ];

  const productVolume = [
    { day: 'M', units: 140, rev: '₦70k' },
    { day: 'T', units: 190, rev: '₦95k' },
    { day: 'W', units: 175, rev: '₦87k' },
    { day: 'T', units: 220, rev: '₦110k' },
    { day: 'F', units: 250, rev: '₦125k' },
    { day: 'S', units: 310, rev: '₦155k' },
    { day: 'S', units: 284, rev: '₦142k' },
  ];

  const expenses = [
    {
      category: 'Market Transport & Delivery',
      amount: 48700,
      percentage: 25,
      icon: Truck,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      barColor: 'bg-emerald-600',
    },
    {
      category: 'Wholesale Restock (Ijebu Depot)',
      amount: 42300,
      percentage: 22,
      icon: Package,
      color: 'bg-blue-50 text-blue-700 border-blue-100',
      barColor: 'bg-blue-600',
    },
    {
      category: 'Stall Hands & Offloaders',
      amount: 35800,
      percentage: 18,
      icon: Users,
      color: 'bg-amber-50 text-amber-700 border-amber-100',
      barColor: 'bg-amber-600',
    },
    {
      category: 'Security & Stall Levies',
      amount: 28900,
      percentage: 15,
      icon: ShieldCheck,
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      barColor: 'bg-slate-600',
    },
    {
      category: 'Generator Fuel & Sundries',
      amount: 41300,
      percentage: 20,
      icon: Zap,
      color: 'bg-rose-50 text-rose-700 border-rose-100',
      barColor: 'bg-rose-600',
    },
  ];

  return (
    <section
      ref={sectionRef}
      data-reveal="fade-up"
      className="relative bg-[#FBF6EF] py-20 md:py-28 text-gray-900 border-t border-gray-200/60"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div
            data-reveal="data-entrance"
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-800 shadow-sm"
          >
            <Sparkles size={13} className="text-emerald-600" />
            <span>Real-time Merchant Intelligence</span>
          </div>

          <h2
            data-reveal="data-entrance"
            data-reveal-delay="80"
            className="mb-6 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl lg:text-5xl font-['Inter_Tight',sans-serif]"
          >
            Clear Ledger Insights.
            <br />
            <span className="text-emerald-800 font-semibold">Zero Spreadsheet Headaches.</span>
          </h2>

          <p
            data-reveal="data-entrance"
            data-reveal-delay="160"
            className="text-base font-normal leading-relaxed text-gray-600 md:text-lg max-w-2xl mx-auto"
          >
            Stockpile converts spoken market sales into structured financial telemetry—tracking product turnover, daily profit margins, and operating expenses automatically.
          </p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-8 items-start">
          {/* Left Column (5 Cols): Product Velocity & Expense Matrix */}
          <div className="lg:col-span-6 space-y-7">
            {/* Card 1: Top Velocity Product */}
            <div
              className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-7 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_12px_24px_-8px_rgba(0,0,0,0.03)] transition-all hover:border-gray-300"
              style={staged(sectionInView, 80)}
            >
              <div className="flex items-start justify-between pb-5 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    <TrendingUp size={14} className="text-emerald-600" />
                    <span>Top Volume Item</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight font-['Inter_Tight',sans-serif]">
                    Garri (50kg bags — Ijebu White)
                  </h3>
                </div>
                <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
                  +15.2% velocity
                </span>
              </div>

              {/* Metric stats */}
              <div className="grid grid-cols-2 gap-6 my-6">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Units Sold Today</p>
                  <p className="mt-1 text-2xl md:text-3xl font-bold text-gray-900 font-['Inter_Tight',sans-serif]">
                    <AnimatedCounter value={284} suffix=" bags" />
                  </p>
                  <p className="mt-1 text-xs text-emerald-600 font-medium">92% of target reached</p>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-500">Revenue Today</p>
                  <p className="mt-1 text-2xl md:text-3xl font-bold text-emerald-800 font-['Inter_Tight',sans-serif]">
                    ₦142,000
                  </p>
                  <p className="mt-1 text-xs text-gray-500 font-medium">Avg. ₦500 / bag</p>
                </div>
              </div>

              {/* 7-Day Micro Trend Sparkline */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between mb-3 text-xs text-gray-500 font-medium">
                  <span>7-Day Sales Volume</span>
                  <span className="text-gray-400">Peak on Saturday (310 bags)</span>
                </div>
                <div className="flex h-20 items-end gap-2.5 pt-2" aria-label="7-day sales chart">
                  {productVolume.map((pv, idx) => {
                    const heightPercent = Math.round((pv.units / 320) * 100);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group relative">
                        {/* Tooltip on hover */}
                        <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] px-1.5 py-0.5 rounded pointer-events-none whitespace-nowrap z-20 font-medium shadow-md">
                          {pv.units} bags • {pv.rev}
                        </div>
                        {/* Bar */}
                        <div className="w-full bg-gray-100 rounded-t h-16 flex items-end overflow-hidden">
                          <div
                            className="w-full bg-emerald-600 rounded-t transition-all duration-700 group-hover:bg-emerald-500"
                            style={{
                              height: sectionInView ? `${heightPercent}%` : '0%',
                              transitionDelay: `${150 + idx * 60}ms`,
                            }}
                          />
                        </div>
                        {/* Day label */}
                        <span className="text-[11px] font-semibold text-gray-500">{pv.day}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card 2: Operating Expense Breakdown */}
            <div
              className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-7 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.04),0_12px_24px_-8px_rgba(0,0,0,0.03)] transition-all hover:border-gray-300"
              style={staged(sectionInView, 180)}
            >
              <div className="flex items-center justify-between pb-5 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                    <TrendingDown size={14} className="text-rose-500" />
                    <span>Operating Expenses</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 tracking-tight font-['Inter_Tight',sans-serif]">
                    This Week's Outflows
                  </h3>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 font-medium block">Total Logged</span>
                  <span className="text-lg font-bold text-rose-700 font-['Inter_Tight',sans-serif]">₦197,000</span>
                </div>
              </div>

              {/* Expense Rows with Clean Progress Meters */}
              <div className="mt-5 space-y-4">
                {expenses.map((exp, idx) => {
                  const Icon = exp.icon;
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-md border ${exp.color}`}>
                            <Icon size={13} />
                          </div>
                          <span className="font-semibold text-gray-800">{exp.category}</span>
                        </div>
                        <div className="flex items-center gap-2.5 font-['Inter_Tight',sans-serif]">
                          <span className="font-bold text-gray-900">₦{exp.amount.toLocaleString()}</span>
                          <span className="text-gray-400 font-medium text-[11px] w-8 text-right">
                            {exp.percentage}%
                          </span>
                        </div>
                      </div>
                      {/* Slim progress bar track */}
                      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${exp.barColor} rounded-full transition-all duration-700`}
                          style={{
                            width: sectionInView ? `${exp.percentage * 3.5}%` : '0%',
                            transitionDelay: `${250 + idx * 70}ms`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): Weekly Ledger Audit Card */}
          <div className="lg:col-span-6">
            <div
              className="rounded-2xl border border-gray-200/80 bg-white p-6 md:p-8 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.05),0_16px_32px_-8px_rgba(0,0,0,0.04)]"
              style={staged(sectionInView, 240)}
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-6 border-b border-gray-100">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Weekly Ledger Audit</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-['Inter_Tight',sans-serif]">
                    Week Ending Nov 16, 2026
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">Compiled from 127 verified voice trade notes</p>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 border border-emerald-200">
                  +23.9% Net Margin
                </div>
              </div>

              {/* 4-KPI Grid */}
              <div className="grid grid-cols-2 gap-3.5 my-6">
                <div className="rounded-xl border border-gray-100 bg-[#FBF6EF]/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Gross Revenue</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 font-['Inter_Tight',sans-serif]">
                    <AnimatedCounter value={2840000} prefix="₦" />
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-emerald-700">+12% vs prior week</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-emerald-50/40 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Net Take-Home</p>
                  <p className="mt-1 text-2xl font-bold text-emerald-900 font-['Inter_Tight',sans-serif]">
                    <AnimatedCounter value={680000} prefix="₦" />
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-emerald-700">All expenses cleared</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#FBF6EF]/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Transactions Logged</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 font-['Inter_Tight',sans-serif]">
                    <AnimatedCounter value={127} suffix=" entries" />
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-gray-500">82 cash • 45 transfer</p>
                </div>

                <div className="rounded-xl border border-gray-100 bg-[#FBF6EF]/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">Avg. Basket Size</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900 font-['Inter_Tight',sans-serif]">
                    ₦22,362
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-emerald-700">+8% basket expansion</p>
                </div>
              </div>

              {/* Daily Performance Breakdown (Dual Bar Meter) */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/70 p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-700">Daily Cash In vs Out</span>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="h-2 w-2 rounded-full bg-emerald-600" />
                      Sales
                    </span>
                    <span className="flex items-center gap-1.5 text-gray-600">
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      Cost
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {dailyTrend.map((item, idx) => {
                    const maxScale = 600000;
                    const revW = Math.round((item.revenue / maxScale) * 100);
                    const expW = Math.round((item.expenses / maxScale) * 100);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-3 text-xs"
                        onMouseEnter={() => setHoveredDay(item.day)}
                        onMouseLeave={() => setHoveredDay(null)}
                      >
                        <span className="w-8 font-semibold text-gray-500">{item.day}</span>
                        <div className="flex-1 flex flex-col gap-1">
                          {/* Revenue row */}
                          <div className="h-2 w-full bg-gray-200/60 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                              style={{
                                width: sectionInView ? `${revW}%` : '0%',
                                transitionDelay: `${200 + idx * 50}ms`,
                              }}
                            />
                          </div>
                          {/* Expense row */}
                          <div className="h-2 w-full bg-gray-200/60 rounded-full overflow-hidden flex">
                            <div
                              className="h-full bg-rose-500/80 rounded-full transition-all duration-700"
                              style={{
                                width: sectionInView ? `${expW}%` : '0%',
                                transitionDelay: `${250 + idx * 50}ms`,
                              }}
                            />
                          </div>
                        </div>
                        <span className="w-20 text-right font-bold text-emerald-800 font-['Inter_Tight',sans-serif]">
                          +{item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Link Button */}
              <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500 font-medium">Automatic cloud backup enabled</span>
                <button
                  type="button"
                  onClick={() => {
                    const token = localStorage.getItem('token');
                    window.location.assign(token ? '/home' : '/signup');
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-black hover:gap-3 shadow-sm"
                >
                  <span>Open Full Financial Ledger</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

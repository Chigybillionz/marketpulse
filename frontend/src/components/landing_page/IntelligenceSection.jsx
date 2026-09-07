import React, { useState } from 'react';
import { BarChart2, TrendingUp, TrendingDown, Lightbulb, Calendar, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

// Animated counter component
function AnimatedCounter({ value, suffix = '', duration = 1500 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startValue + (endValue - startValue) * eased);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration]);

  return (
    <span className="tabular-nums">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

// Mini chart component
function MiniChart({ data, colorClass, height = 60 }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-16 md:h-20">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-full rounded-t transition-all duration-700 ${colorClass}`}
          style={{
            height: `${(value / max) * 100}%`,
            animation: `growBar 0.5s ease-out ${i * 50}ms forwards`,
            transformOrigin: 'bottom',
          }}
        />
      ))}
    </div>
  );
}

export default function IntelligenceSection() {
  const [animationStarted, setAnimationStarted] = useState(false);

  // Trigger animations when section comes into view
  useEffect(() => {
    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAnimationStarted(true);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.3,
    });

    const section = document.querySelector('[data-intelligence-section]');
    if (section) {
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  const revenueData = [320000, 380000, 350000, 420000, 480000, 520000, 580000];
  const expenseData = [280000, 250000, 290000, 260000, 240000, 220000, 200000];
  const profitData = [40000, 130000, 60000, 160000, 240000, 300000, 380000];

  return (
    <section
      data-reveal="fade-up"
      data-intelligence-section
      className="bg-[#F9FAFB] py-16 md:py-24"
    >
      <style>{`
        @keyframes growBar {
          0% { transform: scaleY(0.3); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Lightbulb size={14} />
            AI Intelligence
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Real-time Insights,
            <br />
            <span className="text-[#064E3B]">Actionable Intelligence</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
            Know exactly what's selling, where your money is going, and what tomorrow looks like
            for your business.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Insights cards */}
          <div className="space-y-6">
            {/* Top performing product */}
            <div
              className={`bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transition: 'all 0.6s ease-out' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                    <TrendingUp size={16} className="text-green-600" />
                    Top Product
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    Garri (50g packs)
                  </h3>
                </div>
                <div className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                  +15.2%
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 my-6">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Units Sold Today</p>
                  <p className={`text-2xl md:text-3xl font-extrabold mt-1 ${animationStarted ? '' : 'opacity-0'}`}>
                    <AnimatedCounter value={284} suffix=" units" />
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Revenue Today</p>
                  <p className="text-2xl md:text-3xl font-extrabold mt-1 text-green-600">
                    ₦142,000
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 font-medium mb-2">7-Day Trend</p>
                <MiniChart
                  data={revenueData}
                  colorClass="bg-gradient-to-t from-green-400 to-green-500"
                />
              </div>
            </div>

            {/* Expense breakdown */}
            <div
              className={`bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transition: 'all 0.6s ease-out', transitionDelay: '100ms' }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                    <TrendingDown size={16} className="text-red-500" />
                    Top Expenses
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    This Week
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { category: 'Transportation', amount: 48700, percentage: 24, color: 'bg-red-400' },
                  { category: 'Inventory Restock', amount: 42300, percentage: 21, color: 'bg-orange-400' },
                  { category: 'Staff Salaries', amount: 35800, percentage: 18, color: 'bg-yellow-400' },
                  { category: 'Market Fees', amount: 28900, percentage: 14, color: 'bg-blue-400' },
                  { category: 'Other', amount: 41300, percentage: 23, color: 'bg-gray-400' },
                ].map((item, index) => (
                  <div
                    key={item.category}
                    className={`flex items-center justify-between py-3 border-b border-gray-50 last:border-0 ${
                      animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}
                    style={{ transition: 'all 0.4s ease-out', transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${item.color}`} />
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-gray-900">₦{item.amount.toLocaleString()}</span>
                      <span className={`text-xs font-semibold ${item.percentage > 20 ? 'text-red-500' : 'text-green-600'}`}>
                        {item.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Total Expenses</span>
                  <span className="text-lg font-extrabold text-red-600">
                    ₦197,000
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Weekly pulse preview */}
          <div
            className={`bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
              animationStarted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transition: 'all 0.6s ease-out', transitionDelay: '200ms' }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                  <Calendar size={16} className="text-blue-600" />
                  Weekly Summary
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Week 3, 2026
                </h3>
              </div>
              <div className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold">
                +17.6%
              </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#F9FAFB] rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Total Revenue</p>
                <p className="text-xl font-extrabold text-gray-900">
                  <AnimatedCounter value={2840000} suffix="" />
                </p>
                <p className="text-xs text-green-600 font-semibold mt-1">+12% vs last week</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Net Profit</p>
                <p className="text-xl font-extrabold text-gray-900">
                  <AnimatedCounter value={680000} suffix="" />
                </p>
                <p className="text-xs text-green-600 font-semibold mt-1">+23% vs last week</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Transactions</p>
                <p className="text-xl font-extrabold text-gray-900">
                  <AnimatedCounter value={127} suffix="" />
                </p>
                <p className="text-xs text-gray-500 font-semibold mt-1">82 income, 45 expense</p>
              </div>
              <div className="bg-[#F9FAFB] rounded-2xl p-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Avg. Transaction</p>
                <p className="text-xl font-extrabold text-gray-900">
                  ₦22,362
                </p>
                <p className="text-xs text-green-600 font-semibold mt-1">+8% vs last week</p>
              </div>
            </div>

            {/* Trend chart */}
            <div className="bg-[#F9FAFB] rounded-2xl p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-700">Daily Profit Trend</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-500">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="text-xs text-gray-500">Expenses</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { day: 'Mon', revenue: 320, expense: 280 },
                  { day: 'Tue', revenue: 380, expense: 250 },
                  { day: 'Wed', revenue: 350, expense: 290 },
                  { day: 'Thu', revenue: 420, expense: 260 },
                  { day: 'Fri', revenue: 480, expense: 240 },
                  { day: 'Sat', revenue: 520, expense: 220 },
                  { day: 'Sun', revenue: 580, expense: 200 },
                ].map((day, index) => (
                  <div key={day.day} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-500 w-8">{day.day}</span>
                    <div className="flex-1 flex items-end gap-1">
                      <div
                        className="flex-1 bg-green-400/70 rounded-t transition-all duration-500"
                        style={{
                          height: `${(day.revenue / 580) * 100}%`,
                          animation: `growBar 0.4s ease-out ${index * 100 + 300}ms forwards`,
                          transformOrigin: 'bottom',
                        }}
                      />
                      <div
                        className="flex-1 bg-red-400/70 rounded-t transition-all duration-500"
                        style={{
                          height: `${(day.expense / 290) * 100}%`,
                          animation: `growBar 0.4s ease-out ${index * 100 + 400}ms forwards`,
                          transformOrigin: 'bottom',
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-green-600 w-16 text-right">
                      ₦{((day.revenue - day.expense) / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              className="mt-6 w-full bg-[#064E3B] text-white px-6 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-[#043d2e] transition-colors shadow-lg shadow-green-900/20 hover:shadow-xl"
            >
              View Full Analytics
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

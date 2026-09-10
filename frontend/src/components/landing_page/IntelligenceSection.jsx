/**
 * IntelligenceSection — analytical, chart-led rhythm (Phase 2).
 *
 * All reveal timing is driven by one in-view flag (useInView), so the
 * staged entrance, counters and chart bars all fire together the first
 * time the section enters the viewport — and never re-run.
 * Chart bars animate with transform: scaleY (no layout thrash).
 */

import { TrendingUp, TrendingDown, Lightbulb, Calendar, ArrowRight } from 'lucide-react';
import useInView from './useInView';
import { AnimatedCounter } from './motionPrimitives';
import { useLanguage } from '../../i18n/LanguageContext';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const staged = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'translateY(18px)',
  transition: visible ? `opacity 600ms ${MP_EASE} ${delay}ms, transform 600ms ${MP_EASE} ${delay}ms` : 'none',
});

// Mini chart component — bars grow from the bottom via scaleY.
function MiniChart({ data, colorClass, active }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-16 items-end gap-1 md:h-20" aria-hidden="true">
      {data.map((value, i) => (
        <div
          key={i}
          className={`w-full rounded-t ${colorClass}`}
          style={{
            height: `${(value / max) * 100}%`,
            transform: active ? 'scaleY(1)' : 'scaleY(0)',
            transformOrigin: 'bottom',
            transition: `transform 700ms ${MP_EASE} ${300 + i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default function IntelligenceSection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.15 });
  const { t } = useLanguage();

  const revenueData = [320000, 380000, 350000, 420000, 480000, 520000, 580000];

  return (
    <section
      ref={sectionRef}
      data-reveal="fade-up"
      className="bg-[#F9FAFB] py-16 md:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="mx-auto mb-16 max-w-3xl text-center md:mb-20">
          <div
            data-reveal="data-entrance"
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700"
          >
            <Lightbulb size={14} />
            {t('landing_intel_title1') || 'AI Intelligence'}
          </div>
          <h2
            data-reveal="data-entrance"
            data-reveal-delay="80"
            className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            {t('landing_intel_title2') || 'Real-time Insights,'}
            <br />
            <span className="text-[#064E3B]">{t('landing_intel_title3') || 'Actionable Intelligence'}</span>
          </h2>
          <p
            data-reveal="data-entrance"
            data-reveal-delay="160"
            className="text-base font-medium text-gray-600 md:text-lg"
          >
            {t('landing_intel_subtitle') || "Know exactly what's selling, where your money is going, and what tomorrow looks like for your business."}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left - Insights cards */}
          <div className="space-y-6">
            {/* Top performing product */}
            <div
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-8"
              style={staged(sectionInView, 100)}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <TrendingUp size={16} className="text-green-600" />
                    Top Product
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                    Garri (50g packs)
                  </h3>
                </div>
                <div className="rounded-full bg-green-100 px-3 py-1.5 text-xs font-bold text-green-700">
                  +15.2%
                </div>
              </div>

              <div className="my-6 grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Units Sold Today</p>
                  <p className="mt-1 text-2xl font-extrabold md:text-3xl">
                    <AnimatedCounter value={284} suffix=" units" />
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Revenue Today</p>
                  <p className="mt-1 text-2xl font-extrabold text-green-600 md:text-3xl">
                    ₦142,000
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="mb-2 text-xs font-medium text-gray-400">7-Day Trend</p>
                <MiniChart data={revenueData} colorClass="bg-gradient-to-t from-green-400 to-green-500" active={sectionInView} />
              </div>
            </div>

            {/* Expense breakdown */}
            <div
              className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-8"
              style={staged(sectionInView, 220)}
            >
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <TrendingDown size={16} className="text-red-500" />
                    Top Expenses
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
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
                    className="flex items-center justify-between border-b border-gray-50 py-3 last:border-0"
                    style={staged(sectionInView, 320 + index * 60)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
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

              <div className="mt-6 border-t border-gray-100 pt-4">
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
            className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg md:p-8"
            style={staged(sectionInView, 320)}
          >
            <div className="mb-6 flex items-start justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-500">
                  <Calendar size={16} className="text-blue-600" />
                  Weekly Summary
                </div>
                <h3 className="text-xl font-bold text-gray-900 md:text-2xl">
                  Week 3, 2026
                </h3>
              </div>
              <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                +17.6%
              </div>
            </div>

            {/* KPI Cards */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Total Revenue</p>
                <p className="text-xl font-extrabold text-gray-900">
                  <AnimatedCounter value={2840000} prefix="₦" />
                </p>
                <p className="mt-1 text-xs font-semibold text-green-600">+12% vs last week</p>
              </div>
              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Net Profit</p>
                <p className="text-xl font-extrabold text-gray-900">
                  <AnimatedCounter value={680000} prefix="₦" />
                </p>
                <p className="mt-1 text-xs font-semibold text-green-600">+23% vs last week</p>
              </div>
              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Transactions</p>
                <p className="text-xl font-extrabold text-gray-900">
                  <AnimatedCounter value={127} />
                </p>
                <p className="mt-1 text-xs font-semibold text-gray-500">82 income, 45 expense</p>
              </div>
              <div className="rounded-2xl bg-[#F9FAFB] p-4">
                <p className="mb-2 text-xs font-medium text-gray-500">Avg. Transaction</p>
                <p className="text-xl font-extrabold text-gray-900">₦22,362</p>
                <p className="mt-1 text-xs font-semibold text-green-600">+8% vs last week</p>
              </div>
            </div>

            {/* Trend chart */}
            <div className="rounded-2xl bg-[#F9FAFB] p-4 md:p-6">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Daily Profit Trend</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    <span className="text-xs text-gray-500">Revenue</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                    <span className="text-xs text-gray-500">Expenses</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3" aria-hidden="true">
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
                    <span className="w-8 text-xs font-semibold text-gray-500">{day.day}</span>
                    <div className="flex h-7 flex-1 items-end gap-1">
                      <div
                        className="flex-1 rounded-t bg-green-400/70"
                        style={{
                          height: `${(day.revenue / 580) * 100}%`,
                          transform: sectionInView ? 'scaleY(1)' : 'scaleY(0)',
                          transformOrigin: 'bottom',
                          transition: `transform 600ms ${MP_EASE} ${400 + index * 90}ms`,
                        }}
                      />
                      <div
                        className="flex-1 rounded-t bg-red-400/70"
                        style={{
                          height: `${(day.expense / 290) * 100}%`,
                          transform: sectionInView ? 'scaleY(1)' : 'scaleY(0)',
                          transformOrigin: 'bottom',
                          transition: `transform 600ms ${MP_EASE} ${470 + index * 90}ms`,
                        }}
                      />
                    </div>
                    <span className="w-16 text-right text-xs font-bold text-green-600">
                      ₦{((day.revenue - day.expense) / 1000).toFixed(1)}k
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action button */}
            <button
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#064E3B] px-6 py-4 font-bold text-white shadow-lg shadow-green-900/20 transition-colors hover:bg-[#043d2e]"
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

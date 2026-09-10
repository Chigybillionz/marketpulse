/**
 * WeeklyPulseSection — data-storytelling rhythm (Phase 2).
 *
 * The week builds like a story: summary KPIs count up, then each day's
 * revenue/expense bars sweep in horizontally (scaleX, no layout
 * animation), then the insights land. Everything fires once, driven by
 * a single in-view flag, and rests in its final state.
 */

import { BarChart2, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import useInView from './useInView';
import { AnimatedCounter } from './motionPrimitives';
import { useLanguage } from '../../i18n/LanguageContext';

const MP_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';

const staged = (visible, delay) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? 'none' : 'translateY(18px)',
  transition: visible ? `opacity 600ms ${MP_EASE} ${delay}ms, transform 600ms ${MP_EASE} ${delay}ms` : 'none',
});

export default function WeeklyPulseSection() {
  const [sectionRef, sectionInView] = useInView({ threshold: 0.15 });
  const { t } = useLanguage();

  const weeklyData = [
    { day: 'Monday', revenue: 127800, expenses: 84500, profit: 43300, topProduct: 'Garri', transactions: 18 },
    { day: 'Tuesday', revenue: 156200, expenses: 92400, profit: 63800, topProduct: 'Rice', transactions: 23 },
    { day: 'Wednesday', revenue: 142500, expenses: 78900, profit: 63600, topProduct: 'Indomie', transactions: 21 },
    { day: 'Thursday', revenue: 189300, expenses: 112000, profit: 77300, topProduct: 'Garri', transactions: 28 },
    { day: 'Friday', revenue: 234500, expenses: 98700, profit: 135800, topProduct: 'Rice', transactions: 35 },
    { day: 'Saturday', revenue: 287600, expenses: 124500, profit: 163100, topProduct: 'Vegetables', transactions: 42 },
    { day: 'Sunday', revenue: 198200, expenses: 87600, profit: 110600, topProduct: 'Fish', transactions: 29 },
  ];

  const totalRevenue = weeklyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = weeklyData.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalTransactions = weeklyData.reduce((sum, d) => sum + d.transactions, 0);
  const avgDailyProfit = totalProfit / 7;

  const maxRevenue = Math.max(...weeklyData.map((d) => d.revenue));
  const maxExpenses = Math.max(...weeklyData.map((d) => d.expenses));
  const maxProfit = Math.max(...weeklyData.map((d) => d.profit));
  const minProfit = Math.min(...weeklyData.map((d) => d.profit));

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
            className="mb-6 inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple-700"
          >
            <Calendar size={14} />
            {t('landing_weekly_title1') || 'Weekly Pulse'}
          </div>
          <h2
            data-reveal="data-entrance"
            data-reveal-delay="80"
            className="mb-6 text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl"
          >
            {t('landing_weekly_title2') || 'Your Week at a'}
            <br />
            <span className="text-[#064E3B]">{t('landing_weekly_title3') || 'Glance'}</span>
          </h2>
          <p
            data-reveal="data-entrance"
            data-reveal-delay="160"
            className="text-base font-medium text-gray-600 md:text-lg"
          >
            {t('landing_weekly_subtitle') || 'Understand your business rhythm. See which days are your goldmine, what sells best, and where your money goes.'}
          </p>
        </div>

        {/* Summary Cards — count up when the section enters */}
        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          <div
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
            style={staged(sectionInView, 0)}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
              <TrendingUp size={16} className="text-green-600" />
              Total Revenue
            </div>
            <p className="text-2xl font-extrabold text-gray-900 md:text-3xl">
              <AnimatedCounter value={totalRevenue} prefix="₦" />
            </p>
            <p className="mt-1 text-xs font-semibold text-green-600">
              +12.4% vs last week
            </p>
          </div>

          <div
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
            style={staged(sectionInView, 100)}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
              <TrendingDown size={16} className="text-red-500" />
              Total Expenses
            </div>
            <p className="text-2xl font-extrabold text-gray-900 md:text-3xl">
              <AnimatedCounter value={totalExpenses} prefix="₦" />
            </p>
            <p className="mt-1 text-xs font-semibold text-red-500">
              +3.2% vs last week
            </p>
          </div>

          <div
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
            style={staged(sectionInView, 200)}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
              <BarChart2 size={16} className="text-blue-600" />
              Net Profit
            </div>
            <p className="text-2xl font-extrabold text-gray-900 md:text-3xl">
              <AnimatedCounter value={totalProfit} prefix="₦" />
            </p>
            <p className="mt-1 text-xs font-semibold text-green-600">
              +18.7% vs last week
            </p>
          </div>

          <div
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm md:p-6"
            style={staged(sectionInView, 300)}
          >
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-500">
              <Calendar size={16} className="text-purple-600" />
              Transactions
            </div>
            <p className="text-2xl font-extrabold text-gray-900 md:text-3xl">
              <AnimatedCounter value={totalTransactions} />
            </p>
            <p className="mt-1 text-xs font-semibold text-gray-500">
              42 credit, 85 cash
            </p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div
          className="mb-12 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm md:p-8"
          style={staged(sectionInView, 400)}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Daily Profit Breakdown</h3>
              <p className="text-sm text-gray-500">Week 3, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-green-400" />
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded-sm bg-red-400" />
                <span className="text-xs text-gray-500">Expenses</span>
              </div>
            </div>
          </div>

          {/* Bar chart — revenue then expenses sweep across, day by day */}
          <div className="space-y-4" aria-hidden="true">
            {weeklyData.map((day, index) => (
              <div key={day.day} className="flex items-center gap-4">
                <div className="w-16 text-sm font-semibold text-gray-600">
                  {day.day.slice(0, 3)}
                </div>

                {/* Revenue bar */}
                <div className="flex-1">
                  <div
                    className="h-5 rounded-r-md bg-green-400/80"
                    style={{
                      width: `${(day.revenue / maxRevenue) * 100}%`,
                      transform: sectionInView ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: `transform 650ms ${MP_EASE} ${500 + index * 90}ms`,
                    }}
                  />
                </div>

                {/* Expenses bar */}
                <div className="flex-1">
                  <div
                    className="h-5 rounded-r-md bg-red-400/80"
                    style={{
                      width: `${(day.expenses / maxExpenses) * 100}%`,
                      transform: sectionInView ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                      transition: `transform 650ms ${MP_EASE} ${570 + index * 90}ms`,
                    }}
                  />
                </div>

                {/* Profit */}
                <div className="w-20 text-right">
                  <p
                    className={`text-sm font-bold ${
                      day.profit > 0 ? 'text-green-600' : 'text-red-500'
                    }`}
                    style={{
                      opacity: sectionInView ? 1 : 0,
                      transition: `opacity 400ms ease ${700 + index * 90}ms`,
                    }}
                  >
                    ₦{(day.profit / 1000).toFixed(1)}k
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="grid gap-6 md:grid-cols-3">
          <div
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6"
            style={staged(sectionInView, 700)}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-green-100">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Best Day</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Saturday</span> earned{' '}
                <span className="font-semibold text-green-600">
                  ₦{(maxProfit / 1000).toFixed(1)}k
                </span>
                <br />
                <span className="text-xs text-gray-500">
                  {((maxProfit / totalProfit) * 100).toFixed(0)}% of weekly profit
                </span>
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6"
            style={staged(sectionInView, 820)}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-red-100">
              <TrendingDown size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Slowest Day</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Monday</span> with{' '}
                <span className="font-semibold text-red-500">
                  ₦{(minProfit / 1000).toFixed(1)}k
                </span>{' '}
                profit
                <br />
                <span className="text-xs text-gray-500">
                  Consider Monday promotions
                </span>
              </p>
            </div>
          </div>

          <div
            className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-6 md:col-span-2 lg:col-span-1"
            style={staged(sectionInView, 940)}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="mb-2 font-bold text-gray-900">Weekly Average</h3>
              <p className="text-sm text-gray-600">
                Average daily profit of{' '}
                <span className="font-semibold text-blue-600">
                  ₦{(avgDailyProfit / 1000).toFixed(1)}k
                </span>
                <br />
                <span className="text-xs text-gray-500">
                  {totalTransactions} transactions across {weeklyData.length} days
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

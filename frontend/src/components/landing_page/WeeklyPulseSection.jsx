import React from 'react';
import { BarChart2, TrendingUp, TrendingDown, Calendar, ArrowRight } from 'lucide-react';

export default function WeeklyPulseSection() {
  const weeklyData = [
    {
      day: 'Monday',
      revenue: 127800,
      expenses: 84500,
      profit: 43300,
      topProduct: 'Garri',
      transactions: 18,
    },
    {
      day: 'Tuesday',
      revenue: 156200,
      expenses: 92400,
      profit: 63800,
      topProduct: 'Rice',
      transactions: 23,
    },
    {
      day: 'Wednesday',
      revenue: 142500,
      expenses: 78900,
      profit: 63600,
      topProduct: 'Indomie',
      transactions: 21,
    },
    {
      day: 'Thursday',
      revenue: 189300,
      expenses: 112000,
      profit: 77300,
      topProduct: 'Garri',
      transactions: 28,
    },
    {
      day: 'Friday',
      revenue: 234500,
      expenses: 98700,
      profit: 135800,
      topProduct: 'Rice',
      transactions: 35,
    },
    {
      day: 'Saturday',
      revenue: 287600,
      expenses: 124500,
      profit: 163100,
      topProduct: 'Vegetables',
      transactions: 42,
    },
    {
      day: 'Sunday',
      revenue: 198200,
      expenses: 87600,
      profit: 110600,
      topProduct: 'Fish',
      transactions: 29,
    },
  ];

  const totalRevenue = weeklyData.reduce((sum, d) => sum + d.revenue, 0);
  const totalExpenses = weeklyData.reduce((sum, d) => sum + d.expenses, 0);
  const totalProfit = totalRevenue - totalExpenses;
  const totalTransactions = weeklyData.reduce((sum, d) => sum + d.transactions, 0);
  const avgDailyProfit = totalProfit / 7;

  const maxProfit = Math.max(...weeklyData.map((d) => d.profit));
  const minProfit = Math.min(...weeklyData.map((d) => d.profit));

  return (
    <section
      data-reveal="fade-up"
      className="bg-[#F9FAFB] py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-6">
            <Calendar size={14} />
            Weekly Pulse
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
            Your Week at a
            <br />
            <span className="text-[#064E3B]">Glance</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 font-medium">
            Understand your business rhythm. See which days are your goldmine,
            what sells best, and where your money goes.
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          <div
            className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm"
            style={{
              animation: 'fadeInUp 0.5s ease-out forwards',
              animationDelay: '0ms',
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
              <TrendingUp size={16} className="text-green-600" />
              Total Revenue
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ₦{totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 font-semibold mt-1">
              +12.4% vs last week
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm"
            style={{
              animation: 'fadeInUp 0.5s ease-out 100ms forwards',
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
              <TrendingDown size={16} className="text-red-500" />
              Total Expenses
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ₦{totalExpenses.toLocaleString()}
            </p>
            <p className="text-xs text-red-500 font-semibold mt-1">
              +3.2% vs last week
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm"
            style={{
              animation: 'fadeInUp 0.5s ease-out 200ms forwards',
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
              <BarChart2 size={16} className="text-blue-600" />
              Net Profit
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
              ₦{totalProfit.toLocaleString()}
            </p>
            <p className="text-xs text-green-600 font-semibold mt-1">
              +18.7% vs last week
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm"
            style={{
              animation: 'fadeInUp 0.5s ease-out 300ms forwards',
              opacity: 0,
            }}
          >
            <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mb-3">
              <Calendar size={16} className="text-purple-600" />
              Transactions
            </div>
            <p className="text-2xl md:text-3xl font-extrabold text-gray-900">
              {totalTransactions}
            </p>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              42 credit, 85 cash
            </p>
          </div>
        </div>

        {/* Weekly Chart */}
        <div
          className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-sm mb-12"
          style={{
            animation: 'fadeInUp 0.5s ease-out 400ms forwards',
            opacity: 0,
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Daily Profit Breakdown</h3>
              <p className="text-sm text-gray-500">Week 3, 2026</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-green-400" />
                <span className="text-xs text-gray-500">Revenue</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm bg-red-400" />
                <span className="text-xs text-gray-500">Expenses</span>
              </div>
            </div>
          </div>

          {/* Bar chart */}
          <div className="space-y-4">
            {weeklyData.map((day, index) => (
              <div
                key={day.day}
                className="flex items-center gap-4"
                style={{
                  animation: 'fadeInUp 0.4s ease-out forwards',
                  animationDelay: `${index * 80 + 500}ms`,
                  opacity: 0,
                }}
              >
                <div className="w-16 text-sm font-semibold text-gray-600">
                  {day.day.slice(0, 3)}
                </div>

                {/* Revenue bar */}
                <div className="flex-1 flex items-end gap-1">
                  <div
                    className="flex-1 bg-green-400/80 rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(day.revenue / 288000) * 100}%`,
                      animation: `growBar 0.5s ease-out ${index * 80 + 600}ms forwards`,
                      transformOrigin: 'bottom',
                      opacity: 0,
                    }}
                  />
                </div>

                {/* Expenses bar */}
                <div className="flex-1 flex items-end gap-1">
                  <div
                    className="flex-1 bg-red-400/80 rounded-t-sm transition-all duration-500"
                    style={{
                      height: `${(day.expenses / 125000) * 100}%`,
                      animation: `growBar 0.5s ease-out ${index * 80 + 700}ms forwards`,
                      transformOrigin: 'bottom',
                      opacity: 0,
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
                      animation: `fadeInUp 0.3s ease-out ${index * 80 + 800}ms forwards`,
                      opacity: 0,
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
        <div className="grid md:grid-cols-3 gap-6">
          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4"
            style={{
              animation: 'fadeInUp 0.5s ease-out 0.9s forwards',
              opacity: 0,
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
              <TrendingUp size={24} className="text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Best Day</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Saturday</span> earned{' '}
                <span className="font-semibold text-green-600">
                  ₦{(maxProfit / 1000).toFixed(1)}k
                </span>
                <br />
                <span className="text-gray-500 text-xs">
                  {(maxProfit / totalProfit * 100).toFixed(0)}% of weekly profit
                </span>
              </p>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4"
            style={{
              animation: 'fadeInUp 0.5s ease-out 1.1s forwards',
              opacity: 0,
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <TrendingDown size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Slowest Day</h3>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Monday</span> with{' '}
                <span className="font-semibold text-red-500">
                  ₦{(minProfit / 1000).toFixed(1)}k
                </span>{' '}
                profit
                <br />
                <span className="text-gray-500 text-xs">
                  Consider Monday promotions
                </span>
              </p>
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4 md:col-span-2"
            style={{
              animation: 'fadeInUp 0.5s ease-out 1.3s forwards',
              opacity: 0,
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <Calendar size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Weekly Average</h3>
              <p className="text-sm text-gray-600">
                Average daily profit of{' '}
                <span className="font-semibold text-blue-600">
                  ₦{(avgDailyProfit / 1000).toFixed(1)}k
                </span>
                <br />
                <span className="text-gray-500 text-xs">
                  {totalTransactions} transactions across {weeklyData.length} days
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Add animation styles */}
        <style>{`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(15px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes growBar {
            0% {
              height: 0;
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    </section>
  );
}

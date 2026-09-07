import React from 'react';

export default function MarketStorySection() {
  return (
    <section
      data-reveal="fade-up"
      className="bg-[#F9FAFB] py-16 md:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Story content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider">
              The Story
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
              Built for the
              <span className="text-[#064E3B]"> Market Hustle</span>
            </h2>
            <div className="absolute left-0 top-20 w-12 h-1 bg-[#064E3B] hidden md:block" />
            <div className="pl-4 md:pl-0">
              <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium">
                MarketPulse started with a simple observation: market traders are incredible
                at what they do, but their bookkeeping often holds them back. Spreadsheets
                are tedious. Paper receipts get lost. And by the end of the week, it's hard
                to remember where every naira went.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed font-medium mt-4">
                We built MarketPulse to change that. Speak naturally, like you're telling a
                friend about your day. Our AI understands context, categorizes transactions,
                and gives you real-time insights about your business health — all without
                touching a spreadsheet.
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[#064E3B]">5,000+</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Active Traders</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[#064E3B]">50K+</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Transactions Logged</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[#064E3B]">98%</p>
                <p className="text-sm text-gray-500 font-medium mt-1">Accuracy Rate</p>
              </div>
            </div>
          </div>

          {/* Right - Visual element */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-100 shadow-lg">
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Avg. Daily Profit</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">₦45,200</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.264 4.264a1 1 0 01-1.414 0L8 10.414l-4.264-4.264a1 1 0 010-1.414l5-5a1 1 0 011.414 0L11 8.586 14.586 5 16 7.414 13.414 7 12 8.586 10.586 7 12 7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-green-600">+12.4%</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Weekly Trend</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">+23.5%</p>
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.264 4.264a1 1 0 01-1.414 0L8 10.414l-4.264-4.264a1 1 0 010-1.414l5-5a1 1 0 011.414 0L11 8.586 14.586 5 16 7.414 13.414 7 12 8.586 10.586 7 12 7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-green-600">Strong</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v4" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Debts Collected</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">₦185K</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">This month</p>
                </div>

                {/* Card 4 */}
                <div className="bg-[#F9FAFB] rounded-2xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Time Saved</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">2.5hrs</p>
                  <p className="text-xs text-gray-500 font-medium mt-1">Per week avg.</p>
                </div>
              </div>
            </div>

            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-green-100 rounded-full -z-10 opacity-50" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-blue-100 rounded-full -z-10 opacity-40" />
          </div>
        </div>
      </div>
    </section>
  );
}

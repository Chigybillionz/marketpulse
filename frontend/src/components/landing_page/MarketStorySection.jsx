/**
 * MarketStorySection — calm, editorial reveal rhythm (Phase 2).
 * Content and copy are unchanged; the stats now count up once the
 * section enters the viewport, and the visual card slides in calmly.
 */

import { AnimatedCounter } from './motionPrimitives';
import { useLanguage } from '../../i18n/LanguageContext';

export default function MarketStorySection() {
  const { t } = useLanguage();
  return (
    <section data-reveal="story-reveal" className="bg-[#F9FAFB] py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-16">
          {/* Left - Story content */}
          <div className="relative space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-green-700">
              {t('landing_story_title1') || 'The Story'}
            </div>
            <h2 className="text-3xl font-extrabold leading-tight text-gray-900 md:text-4xl lg:text-5xl">
              {t('landing_story_title2') || 'Built for the'}
              <span className="text-[#064E3B]"> {t('landing_story_title3') || 'Market Hustle'}</span>
            </h2>
            {/* Accent rule (positioned relative to this container) */}
            <div
              aria-hidden="true"
              className="absolute left-0 top-20 hidden h-1 w-12 bg-[#064E3B] md:block"
            />
            <div className="pl-4 md:pl-0">
              <p className="text-base font-medium leading-relaxed text-gray-600 md:text-lg">
                {t('landing_story_p1') || "MarketPulse started with a simple observation: market traders are incredible at what they do, but their bookkeeping often holds them back. Spreadsheets are tedious. Paper receipts get lost. And by the end of the week, it's hard to remember where every naira went."}
              </p>
              <p className="mt-4 text-base font-medium leading-relaxed text-gray-600 md:text-lg">
                {t('landing_story_p2') || "We built MarketPulse to change that. Speak naturally, like you're telling a friend about your day. Our AI understands context, categorizes transactions, and gives you real-time insights about your business health — all without touching a spreadsheet."}
              </p>
            </div>

            {/* Stats row — count up once, in view */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div>
                <p className="text-3xl font-extrabold text-[#064E3B] md:text-4xl">
                  <AnimatedCounter value={5000} suffix="+" />
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">Active Traders</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#064E3B] md:text-4xl">
                  <AnimatedCounter value={50} suffix="K+" />
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">Transactions Logged</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-[#064E3B] md:text-4xl">
                  <AnimatedCounter value={98} suffix="%" />
                </p>
                <p className="mt-1 text-sm font-medium text-gray-500">Accuracy Rate</p>
              </div>
            </div>
          </div>

          {/* Right - Visual element (calm slide-in from the right) */}
          <div
            data-reveal="slide-in-right"
            data-reveal-delay="120"
            className="relative"
          >
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-lg md:p-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Card 1 */}
                <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                      <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">Avg. Daily Profit</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">₦45,200</p>
                  <div className="mt-1 flex items-center gap-1">
                    <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.264 4.264a1 1 0 01-1.414 0L8 10.414l-4.264-4.264a1 1 0 010-1.414l5-5a1 1 0 011.414 0L11 8.586 14.586 5 16 7.414 13.414 7 12 8.586 10.586 7 12 7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-green-600">+12.4%</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">Weekly Trend</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">+23.5%</p>
                  <div className="mt-1 flex items-center gap-1">
                    <svg className="h-3 w-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.264 4.264a1 1 0 01-1.414 0L8 10.414l-4.264-4.264a1 1 0 010-1.414l5-5a1 1 0 011.414 0L11 8.586 14.586 5 16 7.414 13.414 7 12 8.586 10.586 7 12 7z" clipRule="evenodd" />
                    </svg>
                    <span className="text-xs font-bold text-green-600">Strong</span>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                      <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">Debts Collected</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">₦185K</p>
                  <p className="mt-1 text-xs font-semibold text-green-600">This month</p>
                </div>

                {/* Card 4 */}
                <div className="rounded-2xl border border-gray-100 bg-[#F9FAFB] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
                      <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-500">Time Saved</p>
                    </div>
                  </div>
                  <p className="text-xl font-extrabold text-gray-900">2.5hrs</p>
                  <p className="mt-1 text-xs font-medium text-gray-500">Per week avg.</p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div
              aria-hidden="true"
              className="absolute -bottom-4 -right-4 -z-10 h-24 w-24 rounded-full bg-green-100 opacity-50"
            />
            <div
              aria-hidden="true"
              className="absolute -left-4 -top-4 -z-10 h-16 w-16 rounded-full bg-blue-100 opacity-40"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

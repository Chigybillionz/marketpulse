import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function FinalCTA({ onNavigate }) {
  const { t } = useLanguage();
  const handleGetStarted = () => {
    if (onNavigate) {
      onNavigate("signup");
    } else if (window.navigate) {
      window.navigate("/signup");
    }
  };

  const navigate = window.navigate;

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-20 md:py-32">
      <div
        data-reveal="scale-in"
        className="bg-[#064E3B] rounded-[2.5rem] p-10 md:p-20 text-center text-white relative overflow-hidden shadow-2xl group"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="absolute top-0 right-0 w-64 h-64 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10" data-reveal-stagger data-reveal-step="110">
          {/* Kicker */}
          <div
            data-reveal="cta-entrance"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-green-200 text-xs font-bold uppercase tracking-wider mb-8">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            {t('landing_cta_start_trial') || 'Start Your Free Trial'}
          </div>

          <h2
            data-reveal="cta-entrance"
            className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-6 md:mb-8 tracking-tight">
            {t('landing_cta_title1') || 'Join the Future of'}
            <br />
            {t('landing_cta_title2') || 'Market Trading Today'}
          </h2>

          <p
            data-reveal="cta-entrance"
            className="text-green-100 max-w-2xl mx-auto mb-10 md:mb-12 text-base md:text-lg font-medium leading-relaxed">
            {t('landing_cta_subtitle') || 'Stop stressing over lost receipts and confused ledgers. Let your voice do the bookkeeping while you focus on growing your business.'}
          </p>

          {/* CTA Buttons */}
          <div
            data-reveal="cta-entrance"
            className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={handleGetStarted}
              className="bg-white text-[#064E3B] px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center gap-3 mx-auto hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group-hover:animate-pulse-hover"
            >
              {t('landing_cta_create_account') || 'Create Free Account'}
              <ArrowRight size={22} strokeWidth={2.5} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="text-white border border-white/30 px-8 py-4 md:px-10 md:py-5 rounded-2xl font-bold text-base md:text-lg flex items-center gap-3 mx-auto hover:bg-white/10 transition-all duration-300"
              onClick={() => {
                if (onNavigate) onNavigate("features");
                else navigate("/features");
              }}
            >
              {t('landing_cta_learn_more') || 'Learn More'}
            </button>
          </div>

          {/* Trust indicators */}
          <div
            data-reveal="cta-entrance"
            className="flex flex-wrap items-center justify-center gap-8 mt-10 md:mt-12">
            <div className="flex items-center gap-2 text-green-200/80 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              No credit card required
            </div>
            <div className="flex items-center gap-2 text-green-200/80 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              14-day free trial
            </div>
            <div className="flex items-center gap-2 text-green-200/80 text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              Cancel anytime
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

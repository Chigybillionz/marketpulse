import React from 'react';
import { useLanguage } from '../../i18n/LanguageContext';

export default function Footer({ onNavigate }) {
  const { t } = useLanguage();

  const handleNavClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (typeof window !== 'undefined' && window.navigate) {
      window.navigate(path === 'landing' ? '/' : `/${path}`);
    }
  };

  const scrollToSection = (sectionId, routeFallback) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      handleNavClick(routeFallback);
    }
  };

  // Safe translation helper: never renders raw translation keys
  const getCopy = (key, fallback) => {
    const val = t(key);
    if (!val || val === key || val.startsWith('landing_') || val.startsWith('LANDING_')) {
      return fallback;
    }
    return val;
  };

  return (
    <footer
      data-reveal="fade-in"
      className="border-t border-gray-200 bg-[#FAFAFA] text-gray-700 pt-14 pb-12 font-sans"
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 lg:gap-10 mb-12">
          {/* Brand & Mission Column (spans full width on mobile, 2 cols on desktop) */}
          <div className="col-span-2 md:col-span-2 flex flex-col items-start pr-0 md:pr-4">
            <div
              className="flex items-center gap-3 mb-4 cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              role="button"
              tabIndex={0}
            >
              <img
                src="/stockpile-logo-transparent.png"
                alt="Stockpile Logo"
                className="h-8 md:h-9 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-sm">
              {getCopy(
                'landing_footer_desc',
                'Voice-first bookkeeping, sales ledger, and debtor management built for fast-moving shops and traders across Africa.'
              )}
            </p>

            {/* Trust Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-800">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
                <span>🇳🇬</span> Made for African Commerce
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60">
                <span>⚡</span> 100% Offline-Ready
              </span>
            </div>
          </div>

          {/* Column 1: Product */}
          <div className="col-span-1 flex flex-col items-start">
            <h4 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">
              {getCopy('landing_footer_product', 'Product')}
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleNavClick('features')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_features', 'Features')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('how-it-works')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_how_it_works', 'How It Works')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('pricing')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_pricing', 'Pricing')}
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('voice-section', 'listeng')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                Voice Ledger
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('inventory-section', 'home')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                Stock & Inventory
              </button>
            </div>
          </div>

          {/* Column 2: Resources & Support */}
          <div className="col-span-1 flex flex-col items-start">
            <h4 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">
              {getCopy('landing_footer_resources', 'Resources')}
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleNavClick('faqs')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_faqs', 'FAQs & Help')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('contact_support')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_contact', 'Contact Support')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('market_category')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                Market Categories
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('debtors-section', 'credit')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                Debtor Tracker
              </button>
            </div>
          </div>

          {/* Column 3: Legal & Security */}
          <div className="col-span-1 flex flex-col items-start">
            <h4 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">
              Legal & Trust
            </h4>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => handleNavClick('privacy_policy')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_privacy', 'Privacy Policy')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('terms_of_service')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                {getCopy('landing_footer_terms', 'Terms of Service')}
              </button>
              <button
                type="button"
                onClick={() => handleNavClick('data_portability')}
                className="text-left text-sm font-medium text-gray-600 hover:text-emerald-800 transition-colors cursor-pointer py-0.5"
              >
                Data Export
              </button>
            </div>
          </div>

          {/* Column 4: Quick Action (spans full width on mobile, 1 col on desktop) */}
          <div className="col-span-2 md:col-span-1 flex flex-col items-start bg-white p-4 rounded-2xl border border-gray-200/70 shadow-xs">
            <h4 className="font-bold text-gray-900 mb-1.5 text-xs uppercase tracking-wider">
              {getCopy('landing_footer_connect', 'Get Started')}
            </h4>
            <p className="text-xs text-gray-500 mb-3.5 leading-relaxed">
              Take full control of your market trading in seconds.
            </p>
            <button
              type="button"
              onClick={() => handleNavClick('signup')}
              className="w-full bg-[#064E3B] text-white px-3.5 py-2.5 rounded-xl text-xs font-bold hover:bg-[#043d2e] transition-colors shadow-xs cursor-pointer text-center"
            >
              {getCopy('landing_cta_create_account', 'Create Free Account')}
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('login')}
              className="w-full text-center text-xs font-semibold text-gray-700 hover:text-emerald-800 transition-colors py-2 cursor-pointer mt-1"
            >
              Sign In to Dashboard →
            </button>
          </div>
        </div>

        {/* Bottom Bar: Copyright, System Status, Social Icons */}
        <div className="border-t border-gray-200/80 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p className="font-medium text-center md:text-left">
            {getCopy('landing_footer_rights', '© 2026 Stockpile Technologies Ltd. All rights reserved.')}
          </p>

          <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems Normal</span>
          </div>

          <div className="flex items-center gap-5">
            {/* X / Twitter */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-800 transition-colors"
              aria-label="X (formerly Twitter)"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.228 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-800 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* WhatsApp */}
            <a
              href="https://whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-emerald-700 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

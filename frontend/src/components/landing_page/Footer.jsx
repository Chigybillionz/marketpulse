export default function Footer({ onNavigate }) {
  const navigate = window.navigate;

  const handleNavClick = (path) => {
    if (onNavigate) {
      onNavigate(path);
    } else if (navigate) {
      navigate(path === 'landing' ? '/' : `/${path}`);
    }
  };

  return (
    <footer
      data-reveal="fade-in"
      className="border-t border-gray-200 bg-white pt-10 pb-10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Main footer content */}
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand column */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/mylogo.png"
                alt="MarketPulse AI logo"
                className="w-8 h-8 md:w-10 md:h-10 rounded-full grayscale opacity-70 object-cover"
              />
              <span className="text-lg md:text-xl font-bold text-gray-800">
                MarketPulse AI
              </span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Voice-first bookkeeping for Nigerian market traders. Track your business
              in seconds, not hours.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Product
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => handleNavClick('features')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => handleNavClick('how-it-works')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <button
                onClick={() => handleNavClick('pricing')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </button>
              <button
                onClick={() => handleNavClick('faqs')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                FAQs
              </button>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => handleNavClick('contact_support')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Contact Support
              </button>
              <button
                onClick={() => handleNavClick('privacy_policy')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => handleNavClick('terms_of_service')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Terms of Service
              </button>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm uppercase tracking-wider">
              Connect
            </h4>
            <div className="space-y-3">
              <button
                onClick={() => handleNavClick('login')}
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Log In
              </button>
              <button
                onClick={() => handleNavClick('signup')}
                className="w-full bg-[#064E3B] text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-[#043d2e] transition-colors mt-2"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold text-gray-400">
            © 2024 MarketPulse AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.228 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.788.013 3.808.06 1.064.049 1.791.218 2.427.461a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.244.636.413 1.363.461 2.427.048 1.067.06 1.401.06 4.192v.08c0 2.69-.012 2.967-.06 4.025-.049 1.084-.218 1.787-.461 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.244-1.363.413-2.427.461-1.067.048-1.401.06-4.192.06h-.08c-2.69.012-2.967.06-4.025.06-1.084.049-1.787.218-2.427.461a4.902 4.902 0 01-1.772 1.153 4.902 4.902 0 01-1.153 1.772c-.244.636-.413 1.363-.461 2.427-.047 1.06-.06 1.401-.06 4.192v.08c0 2.69.013 2.967.06 4.025.047 1.084.217 1.787.461 2.427.367.645.65 1.314.877 1.938.053.12.079.246.079.375 0 .31-.026.56-.074.772-.048.212-.154.737-.228.948-.242.57-.484.793-.874.793H12.315zM5.106 6.33a1 1 0 111.414 0l.707.707a.5.5 0 01-.354.854.5.5 0 01-.854-.354l-.707-.707a1 1 0 111.414-1.414zM10.707 15.67a1 1 0 111.414 0l.707.707a.5.5 0 01-.354.854.5.5 0 01-.854-.354l-.707-.707a1 1 0 111.414-1.414zM16 13a3 3 0 11-6 0 3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 15.5v-7h2v7h-2zm0-8.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                <path d="M11.5 1.5h1c.276 0 .5.224.5.5v4c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-4c0-.276.224-.5.5-.5zm0 6h1c.276 0 .5.224.5.5v2c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-2c0-.276.224-.5.5-.5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

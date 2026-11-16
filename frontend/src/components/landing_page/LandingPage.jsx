import React, { useLayoutEffect } from 'react';
import StockpileHero from './StockpileHero';
import ProductShowcaseSection from './ProductShowcaseSection';
import VoiceAISection from './VoiceAISection';
import MarketStorySection from './MarketStorySection';
import InventorySection from './InventorySection';
import IntelligenceSection from './IntelligenceSection';
import WeeklyPulseSection from './WeeklyPulseSection';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import { initScrollReveal } from './landingAnimations';

export default function LandingPage({ onNavigate }) {
  useLayoutEffect(() => initScrollReveal(), []);

  return (
    <div className="mp-motion min-h-screen w-full bg-[#FBF6EF] font-sans text-gray-900 overflow-x-hidden">
      {/* 1. Stockpile "on your terms" Hero */}
      <StockpileHero onNavigate={onNavigate} />

      {/* 2. Product Showcase */}
      <div id="product-showcase">
        <ProductShowcaseSection />
      </div>

      {/* 3. Live Voice AI & Bookkeeping Section */}
      <div id="voice-section">
        <VoiceAISection onNavigate={onNavigate} />
      </div>

      {/* 4. Market Hustle Story */}
      <MarketStorySection />

      {/* 5. Inventory Management Section */}
      <div id="inventory-section">
        <InventorySection />
      </div>

      {/* 6. Financial Intelligence Section */}
      <IntelligenceSection />

      {/* 7. Debtors Tracking & Weekly Pulse */}
      <div id="debtors-section">
        <WeeklyPulseSection />
      </div>

      {/* 8. Final CTA */}
      <FinalCTA onNavigate={onNavigate} />

      {/* 9. Product & Resources Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

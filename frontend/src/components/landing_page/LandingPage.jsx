import { useLayoutEffect } from 'react';
import MarketingNavbar from './MarketingNavbar';
import HeroSection from './HeroSection';
import MarketStorySection from './MarketStorySection';
import VoiceAISection from './VoiceAISection';
import IntelligenceSection from './IntelligenceSection';
import InventorySection from './InventorySection';
import WeeklyPulseSection from './WeeklyPulseSection';
import ProductShowcaseSection from './ProductShowcaseSection';
import FinalCTA from './FinalCTA';
import Footer from './Footer';
import { initScrollReveal } from './landingAnimations';

export default function LandingPage({ onNavigate }) {
  // Initialize scroll reveal animations before first paint (avoids a
  // flash of visible content), and disconnect the observer on unmount.
  useLayoutEffect(() => initScrollReveal(), []);

  return (
    <div className="mp-motion min-h-screen w-full overflow-x-hidden bg-[#F9FAFB] font-sans text-gray-900">
      {/* Navbar */}
      <MarketingNavbar onNavigate={onNavigate} activeTab="landing" />

      {/* Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Product Showcase Section */}
      <ProductShowcaseSection />

      {/* Market Story Section */}
      <MarketStorySection />

      {/* Voice AI Section */}
      <VoiceAISection onNavigate={onNavigate} />

      {/* Intelligence Section */}
      <IntelligenceSection />

      {/* Inventory Section */}
      <InventorySection />

      {/* Weekly Pulse Section */}
      <WeeklyPulseSection />

      {/* Final CTA */}
      <FinalCTA onNavigate={onNavigate} />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}

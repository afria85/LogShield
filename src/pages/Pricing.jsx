// src/pages/Pricing.jsx - FIXED VERSION
import { useEffect } from 'react';
import Pricing from '../components/Pricing';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function PricingPage({ onUpgrade }) {
  useEffect(() => {
    analytics.trackPageView('/pricing');
    analytics.trackEvent('pricing_page_view');
  }, []);

  useSEO({
    title: 'Pricing & Plans | LogShield',
    description: 'Choose the right plan for your log sanitization needs. Free tier available, with Pro and Team plans for advanced features.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/pricing'
  });

  return (
    <div className="container py-12">
      <div className="max-w-6xl mx-auto">
        <Pricing onUpgrade={onUpgrade} />
      </div>
    </div>
  );
}
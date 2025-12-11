// src/pages/App.jsx - FIXED VERSION
import { useEffect } from 'react';
import Sanitizer from '../components/Sanitizer';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function AppPage({ license }) {
  useEffect(() => {
    analytics.trackPageView('/app');
    analytics.trackEvent('app_open', {
      tier: license?.tier || 'free',
    });
  }, [license]);

  useSEO({
    title: 'Sanitizer Tool | LogShield',
    description: 'Sanitize your logs in real-time with our client-side sanitizer tool. Remove API keys, PII, and sensitive data securely.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/app'
  });

  const handleSanitizeComplete = (stats) => {
    analytics.trackSanitize(
      license?.tier || 'free',
      stats?.totalReplacements || 0,
      stats?.fileSize,
      stats?.duration
    );
  };

  const handleUpgrade = () => {
    analytics.trackUpgradeClick('pro', 'app_page');
    window.location.href = '/pricing';
  };

  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <Sanitizer
          license={license}
          onUpgrade={handleUpgrade}
          onSanitizeComplete={handleSanitizeComplete}
        />
      </div>
    </div>
  );
}
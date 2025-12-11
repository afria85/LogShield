// src/pages/App.jsx - Sanitizer Tool Page
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sanitizer from '../components/Sanitizer';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';
import { licenseManager } from '../lib/license';

export default function AppPage({ license }) {
  const navigate = useNavigate();

  useEffect(() => {
    analytics.trackPageView('/app');
    analytics.trackEvent('app_open', {
      tier: license?.tier || 'free',
    });
  }, [license]);

  useSEO({
    title: 'Log Sanitizer Tool | LogShield',
    description: 'Sanitize your logs in real-time with our client-side tool. Remove API keys, PII, and sensitive data securely - nothing leaves your browser.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/app'
  });

  const handleSanitizeComplete = (stats) => {
    analytics.trackSanitize(
      license?.tier || 'free',
      stats?.totalReplacements || 0,
      stats?.fileSize,
      stats?.processingTime
    );
    licenseManager.trackUsage();
  };

  const handleUpgrade = () => {
    analytics.trackUpgradeClick('pro', 'app_page');
    navigate('/pricing');
  };

  return (
    <div className="min-h-screen">
      <Sanitizer
        license={license}
        onUpgrade={handleUpgrade}
        onSanitizeComplete={handleSanitizeComplete}
      />
    </div>
  );
}

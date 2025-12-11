// src/pages/Home.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO'; // Import hook

export default function HomePage({ onUpgrade }) {
  const navigate = useNavigate();

  useSEO({
    title: 'Privacy-First Log Sanitizer',
    description: 'Sanitize logs client-side to remove API keys, PII, and sensitive data. 100% private, no data leaves your browser.',
    keywords: 'log sanitizer, privacy tool, API key remover, PII removal, developer tools, log security',
    url: 'https://logshield.dev',
    type: 'website'
  });

  useEffect(() => {
    // Track home page view
    analytics.trackPageView('/');
    
    // Track feature impression
    analytics.trackEvent('home_page_view', {
      section: 'hero',
    });
  }, []);

  const handleGetStarted = () => {
    analytics.trackEvent('get_started_click', { source: 'home_hero' });
    navigate('/app');
  };

  return (
    <div className="space-y-16 pb-16">
      <Hero onGetStarted={handleGetStarted} />
      <Features />
      <Pricing onUpgrade={onUpgrade} />
    </div>
  );
}
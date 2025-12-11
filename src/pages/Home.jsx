// src/pages/Home.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function HomePage({ onUpgrade }) {
  const navigate = useNavigate();

  useSEO({
    title: 'LogShield - Privacy-First Log Sanitizer for Developers',
    description: 'Remove API keys, tokens, credentials, and PII from logs instantly. 100% client-side processing - your data never leaves your browser.',
    keywords: 'log sanitizer, privacy tool, API key remover, PII removal, developer tools, log security, GDPR compliant',
    url: 'https://logshield.dev',
    type: 'website'
  });

  useEffect(() => {
    analytics.trackPageView('/');
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

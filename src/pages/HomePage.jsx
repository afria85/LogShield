// src/pages/HomePage.jsx
import { useSEO } from '../hooks/useSEO';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';

export default function HomePage({ onUpgrade }) {
  useSEO({
    title: 'LogShield - Privacy-First Log Sanitizer for Developers',
    description: 'Remove API keys, tokens, credentials, and PII from logs instantly. 100% client-side processing. No data leaves your browser.',
  });

  return (
    <div className="min-h-screen">
      <Hero />
      <Features />
      <Pricing onUpgrade={onUpgrade} />
    </div>
  );
}

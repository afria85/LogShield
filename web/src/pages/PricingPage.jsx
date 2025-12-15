// src/pages/PricingPage.jsx
// This page uses the Pricing component - NO DUPLICATE CODE
import { useSEO } from '../hooks/useSEO';
import Pricing from '../components/Pricing';

export default function PricingPage({ onUpgrade }) {
  useSEO({
    title: 'Pricing - LogShield',
    description: 'Simple, transparent pricing for log sanitization. Free tier available. Pro and Team plans for professionals.',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-up">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Start free, upgrade when you need more. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Pricing Component */}
      <Pricing onUpgrade={onUpgrade} />
    </div>
  );
}

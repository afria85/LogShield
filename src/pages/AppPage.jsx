// src/pages/AppPage.jsx
// The main sanitizer application page
import { useSEO } from '../hooks/useSEO';
import Sanitizer from '../components/Sanitizer';

export default function AppPage() {
  useSEO({
    title: 'Sanitizer - LogShield',
    description: 'Remove API keys, tokens, passwords, and PII from your logs. 100% browser-based, privacy-first.',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Log Sanitizer
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Paste your logs below to remove sensitive data instantly
          </p>
        </div>

        {/* Sanitizer component */}
        <Sanitizer />
      </div>
    </div>
  );
}

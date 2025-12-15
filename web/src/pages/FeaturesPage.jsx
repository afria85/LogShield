// src/pages/FeaturesPage.jsx
import { useSEO } from '../hooks/useSEO';
import Features from '../components/Features';
import { 
  Shield, 
  Zap, 
  Lock, 
  Code2, 
  Globe, 
  FileText,
  ArrowRight,
  CheckCircle,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FeaturesPage() {
  useSEO({
    title: 'Features - LogShield',
    description: 'Discover all the powerful features of LogShield: 70+ detection patterns, 100% client-side processing, instant results, and more.',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            Feature Overview
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Built for Security-Conscious
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Developers
            </span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Everything you need to sanitize logs quickly, securely, and with complete privacy.
          </p>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/25 transition-all duration-300 hover:-translate-y-0.5 animate-fade-in-up"
            style={{ animationDelay: '300ms' }}
          >
            Try It Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Features component */}
      <Features />

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Secure Your Logs?
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Start sanitizing logs in seconds. No signup required for the free tier.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-600 font-semibold hover:bg-blue-50 transition-all duration-300 hover:-translate-y-0.5"
            >
              Start Sanitizing — Free
            </Link>
            <Link
              to="/pricing"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 border border-white/20 transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

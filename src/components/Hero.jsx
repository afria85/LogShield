// src/components/Hero.jsx
import { useNavigate } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Lock, 
  ArrowRight, 
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function Hero({ onTryFree }) {
  const navigate = useNavigate();

  const features = [
    '100% Client-Side Processing',
    'No Data Leaves Your Browser',
    '70+ Built-in Patterns',
    'Works Offline'
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Privacy-First Log Sanitization</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Remove Secrets from Logs
            <span className="block mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Instantly & Securely
            </span>
          </h1>

          {/* Subheading */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-8 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            Strip API keys, passwords, tokens, and PII from your logs before sharing. 
            100% browser-based — your data never leaves your device.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            {features.map((feature, index) => (
              <div 
                key={feature}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            <button
              onClick={() => navigate('/app')}
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              <Shield className="w-5 h-5" />
              Start Sanitizing — Free
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
            
            <button
              onClick={() => {
                const demoSection = document.getElementById('demo');
                if (demoSection) {
                  demoSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <Play className="w-5 h-5" />
              See Demo
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400 animate-fade-in-up" style={{ animationDelay: '500ms' }}>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span>No signup required</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Free tier: 20 sanitizations/month</span>
            </div>
            <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>SOC 2 compliant</span>
            </div>
          </div>
        </div>

        {/* Demo preview */}
        <div id="demo" className="mt-16 sm:mt-24 animate-fade-in-up" style={{ animationDelay: '600ms' }}>
          <div className="relative max-w-4xl mx-auto">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-2xl transform scale-105" />
            
            {/* Demo card */}
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
              {/* Browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-emerald-400" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="max-w-md mx-auto px-4 py-1.5 rounded-md bg-white dark:bg-slate-800 text-xs text-slate-400 text-center">
                    logshield.dev/app
                  </div>
                </div>
              </div>

              {/* Demo content */}
              <div className="p-6 sm:p-8">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Before */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
                        BEFORE
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Contains secrets</span>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                      <code>
                        <span className="text-slate-500">{"{"}</span>
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">"api_key"</span>: <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 rounded">"sk_live_abc123xyz"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">"email"</span>: <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 rounded">"john@example.com"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">"password"</span>: <span className="text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-1 rounded">"secret123!"</span>
                        <br />
                        <span className="text-slate-500">{"}"}</span>
                      </code>
                    </div>
                  </div>

                  {/* After */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">
                        AFTER
                      </span>
                      <span className="text-sm text-slate-500 dark:text-slate-400">Safe to share</span>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 font-mono text-sm text-slate-700 dark:text-slate-300 overflow-x-auto">
                      <code>
                        <span className="text-slate-500">{"{"}</span>
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">"api_key"</span>: <span className="text-emerald-600 dark:text-emerald-400">"[API_KEY_REDACTED]"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">"email"</span>: <span className="text-emerald-600 dark:text-emerald-400">"[EMAIL_REDACTED]"</span>,
                        <br />
                        &nbsp;&nbsp;<span className="text-blue-600 dark:text-blue-400">"password"</span>: <span className="text-emerald-600 dark:text-emerald-400">"[PASSWORD_REDACTED]"</span>
                        <br />
                        <span className="text-slate-500">{"}"}</span>
                      </code>
                    </div>
                  </div>
                </div>

                {/* Stats bar */}
                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-slate-600 dark:text-slate-300">3 secrets found</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-slate-600 dark:text-slate-300">100% redacted</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                    <span className="text-slate-600 dark:text-slate-300">0.02s processing</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

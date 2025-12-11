// src/components/Hero.jsx
import { Shield, Zap, Lock, ArrowRight, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';

export default function Hero({ onGetStarted }) {
  const features = [
    '100% Client-side Processing',
    '70+ Detection Patterns',
    'No Data Leaves Your Browser',
    'Free to Start'
  ];

  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl animate-float animation-delay-2000" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>Privacy-First Log Sanitization</span>
          </div>

          {/* Main heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
            Protect Your Logs from{' '}
            <span className="text-gradient-animated">
              Sensitive Data Leaks
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto animate-slide-up animation-delay-100">
            Remove API keys, tokens, credentials, emails, and PII from your logs 
            instantly. Everything runs in your browser — your data never leaves your device.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 animate-slide-up animation-delay-200">
            {features.map((feature, index) => (
              <div
                key={feature}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-200 dark:border-slate-700"
              >
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up animation-delay-300">
            <Button
              onClick={onGetStarted}
              size="lg"
              className="group w-full sm:w-auto"
            >
              <Zap className="h-5 w-5 mr-2" />
              Start Sanitizing Free
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <Lock className="h-5 w-5 mr-2" />
              See How It Works
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 pt-12 border-t border-gray-200 dark:border-slate-700 animate-fade-in animation-delay-500">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Trusted by developers worldwide
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8">
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">SOC 2 Ready</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Lock className="h-5 w-5" />
                <span className="text-sm font-medium">GDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
                <Zap className="h-5 w-5" />
                <span className="text-sm font-medium">Zero Server Storage</span>
              </div>
            </div>
          </div>
        </div>

        {/* Code preview mockup */}
        <div className="mt-16 max-w-4xl mx-auto animate-slide-up animation-delay-400">
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-25 dark:opacity-40" />
            
            {/* Terminal window */}
            <div className="relative bg-gray-900 dark:bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-gray-800 dark:border-slate-800">
              {/* Terminal header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-gray-800 dark:bg-slate-900 border-b border-gray-700 dark:border-slate-800">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">sanitize-logs.js</span>
              </div>
              
              {/* Terminal content */}
              <div className="p-6 font-mono text-sm">
                <div className="text-gray-500 mb-2">// Before sanitization</div>
                <div className="text-red-400 mb-4">
                  <span className="text-gray-500">API_KEY=</span>
                  <span className="bg-red-500/20 px-1 rounded">sk_live_4eC39HqLyjWDarjtT1zdp7dc</span>
                </div>
                <div className="text-red-400 mb-4">
                  <span className="text-gray-500">User: </span>
                  <span className="bg-red-500/20 px-1 rounded">john.doe@company.com</span>
                </div>
                
                <div className="border-t border-gray-700 my-4" />
                
                <div className="text-gray-500 mb-2">// After sanitization</div>
                <div className="text-green-400 mb-2">
                  <span className="text-gray-500">API_KEY=</span>
                  <span className="bg-green-500/20 px-1 rounded">[STRIPE_KEY_REDACTED]</span>
                </div>
                <div className="text-green-400">
                  <span className="text-gray-500">User: </span>
                  <span className="bg-green-500/20 px-1 rounded">[EMAIL_REDACTED]</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

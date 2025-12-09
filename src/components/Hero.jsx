// src/components/Hero.jsx
import { Shield, Sparkles, Lock, Zap, Github, ArrowRight } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';

export default function Hero({ onGetStarted }) {
  const features = [
    {
      icon: Lock,
      title: '100% Client-Side',
      description: 'Your data never leaves your browser'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Sanitize logs in milliseconds'
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Detection',
      description: 'Detects unknown secrets using entropy analysis'
    }
  ];

  const stats = [
    { value: '70+', label: 'Security Patterns' },
    { value: '100%', label: 'Privacy First' },
    { value: '<2s', label: 'Load Time' },
    { value: '0', label: 'Data Transfer' }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      {/* Content */}
      <div className="container relative py-20 md:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm">
              <Shield className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Trusted by 10,000+ developers
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Remove Secrets
                </span>
                <br />
                <span className="text-gray-900">
                  From Logs Instantly
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 max-w-2xl">
                Privacy-first log sanitizer that strips API keys, tokens, emails, and PII 
                from your logs before sharing. Works 100% in your browser.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg shadow-blue-500/50"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Start Sanitizing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.open('https://github.com/afria85/LogShield', '_blank')}
                className="border-2"
              >
                <Github className="mr-2 h-5 w-5" />
                View on GitHub
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, i) => (
              <Card
                key={i}
                className="p-6 bg-white/80 backdrop-blur-sm border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-500">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Demo Preview */}
            <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span>example.log</span>
                </div>
                <pre className="text-sm text-gray-300 font-mono leading-relaxed">
                  <span className="text-gray-500">// Before</span>
                  <br />
                  <span className="text-red-400">AWS_KEY=AKIAIOSFODNN7EXAMPLE</span>
                  <br />
                  <span className="text-yellow-400">user@email.com logged in</span>
                  <br />
                  <br />
                  <span className="text-gray-500">// After</span>
                  <br />
                  <span className="text-green-400">AWS_KEY=[AWS_KEY_REDACTED]</span>
                  <br />
                  <span className="text-green-400">[EMAIL_REDACTED] logged in</span>
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
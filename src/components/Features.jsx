// src/components/Features.jsx
import { 
  Shield, Zap, Lock, Eye, Code, Download, 
  RefreshCw, BarChart3, Globe, Cpu, FileText, Sparkles 
} from 'lucide-react';
import { Card } from './ui/Card';

export default function Features() {
  const features = [
    {
      icon: Lock,
      title: '100% Client-Side',
      description: 'All processing happens in your browser. Your sensitive data never touches our servers.',
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Sanitize logs in milliseconds. No waiting, no queues, no rate limits for paid plans.',
      color: 'text-amber-600 dark:text-amber-400',
      bg: 'bg-amber-100 dark:bg-amber-900/30'
    },
    {
      icon: Shield,
      title: '70+ Detection Patterns',
      description: 'AWS keys, JWT tokens, API secrets, emails, IPs, credit cards, and more.',
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      icon: Sparkles,
      title: 'AI Entropy Detection',
      description: 'Advanced algorithm detects unknown secrets based on randomness patterns.',
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      icon: Eye,
      title: 'Real-time Preview',
      description: 'See what will be redacted before processing. Full control over categories.',
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-100 dark:bg-cyan-900/30'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Supports JSON, plain text, and log formats. Export in multiple formats.',
      color: 'text-rose-600 dark:text-rose-400',
      bg: 'bg-rose-100 dark:bg-rose-900/30'
    },
    {
      icon: Download,
      title: 'Export Options',
      description: 'Download sanitized logs as TXT, JSON, or copy directly to clipboard.',
      color: 'text-indigo-600 dark:text-indigo-400',
      bg: 'bg-indigo-100 dark:bg-indigo-900/30'
    },
    {
      icon: BarChart3,
      title: 'Detailed Statistics',
      description: 'See exactly what was redacted with comprehensive statistics and breakdowns.',
      color: 'text-teal-600 dark:text-teal-400',
      bg: 'bg-teal-100 dark:bg-teal-900/30'
    },
    {
      icon: Globe,
      title: 'Works Offline',
      description: 'No internet required after loading. Perfect for air-gapped environments.',
      color: 'text-orange-600 dark:text-orange-400',
      bg: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ];

  const comparisonData = [
    { feature: 'Processing Location', logshield: 'Your Browser', others: 'Their Servers' },
    { feature: 'Data Storage', logshield: 'Never Stored', others: 'Often Stored' },
    { feature: 'Internet Required', logshield: 'After Load: No', others: 'Always' },
    { feature: 'Privacy Guarantee', logshield: '100%', others: 'Varies' },
    { feature: 'GDPR Compliance', logshield: 'Built-in', others: 'Depends' }
  ];

  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
            <Cpu className="h-4 w-4" />
            <span>Powerful Features</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to{' '}
            <span className="gradient-text">Protect Your Logs</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Built by developers, for developers. Secure, fast, and privacy-first.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.title} 
                hover
                className="p-6 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Comparison section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why LogShield?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              See how we compare to other log sanitization tools
            </p>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-slate-800/50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">
                      Feature
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 dark:text-white">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-blue-600" />
                        LogShield
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                      Others
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                  {comparisonData.map((row) => (
                    <tr key={row.feature} className="hover:bg-gray-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                        {row.feature}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          {row.logshield}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {row.others}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* How it works */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Three simple steps to secure your logs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: FileText,
                title: 'Paste Your Logs',
                description: 'Paste your logs or upload a file. Supports JSON, plain text, and common log formats.'
              },
              {
                step: '02',
                icon: RefreshCw,
                title: 'Auto-Detect & Sanitize',
                description: 'Our 70+ patterns automatically detect and redact sensitive data in milliseconds.'
              },
              {
                step: '03',
                icon: Download,
                title: 'Copy or Export',
                description: 'Copy the sanitized output or download it. Share safely without exposing secrets.'
              }
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="relative">
                  {/* Connector line */}
                  {index < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-blue-200 to-transparent dark:from-blue-800" />
                  )}
                  
                  <Card className="p-6 text-center relative">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg mb-4">
                      {item.step}
                    </div>
                    
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                    </div>
                    
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {item.title}
                    </h4>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

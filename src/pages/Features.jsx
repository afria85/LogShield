// src/pages/Features.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, Lock, Zap, ArrowLeft, ArrowRight, CheckCircle, 
  Rocket, Clock, Users, Code, Globe, Cpu
} from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function FeaturesPage() {
  useEffect(() => {
    analytics.trackPageView('/features');
  }, []);

  useSEO({
    title: 'Features | LogShield',
    description: 'Explore LogShield features: 70+ detection patterns, AI-powered entropy detection, 100% client-side processing, and enterprise-grade security.',
    url: 'https://logshield.dev/features'
  });

  const features = [
    {
      category: "Core Security",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          title: "70+ Detection Patterns",
          description: "Comprehensive detection for AWS, GCP, Azure, Stripe, MongoDB, PostgreSQL, JWT, OAuth, and more.",
          live: true,
          highlights: ["Auto-updated patterns", "CVE monitoring", "Zero false positives"]
        },
        {
          title: "AI Entropy Detection",
          description: "Machine learning identifies unknown secrets and high-entropy strings that regex can't catch.",
          live: true,
          highlights: ["98.7% accuracy", "Anomaly scoring", "Adaptive learning"]
        },
        {
          title: "Real-time Processing",
          description: "Optimized engine scans 10MB logs in under 500ms with intelligent caching.",
          live: true,
          highlights: ["WebAssembly powered", "Parallel processing", "20ms/10KB"]
        },
        {
          title: "Custom Patterns",
          description: "Create and save your own regex patterns. Sync across devices with Pro plan.",
          live: false,
          highlights: ["Visual editor", "Pattern testing", "Cloud sync"]
        }
      ]
    },
    {
      category: "Privacy & Compliance",
      icon: Lock,
      color: "from-green-500 to-emerald-500",
      items: [
        {
          title: "100% Client-Side",
          description: "Zero data transmission. Your logs never leave your browser. We physically cannot see your data.",
          live: true,
          highlights: ["No network calls", "Browser isolation", "Zero-knowledge"]
        },
        {
          title: "GDPR & CCPA Ready",
          description: "Enterprise compliance built-in. Generate audit logs for regulatory requirements.",
          live: true,
          highlights: ["GDPR compliant", "HIPAA ready", "Audit logging"]
        },
        {
          title: "End-to-End Encryption",
          description: "AES-256 encryption for team sharing. Keys never leave your device.",
          live: true,
          highlights: ["AES-256", "Zero knowledge", "Secure sharing"]
        }
      ]
    },
    {
      category: "Integration",
      icon: Code,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          title: "REST API",
          description: "Full API access for CI/CD pipelines. Native GitHub Actions and GitLab CI support.",
          live: true,
          highlights: ["1000 req/min", "Webhooks", "OpenAPI spec"]
        },
        {
          title: "VS Code Extension",
          description: "Right-click to sanitize in editor. Preview changes before committing.",
          live: false,
          highlights: ["Editor integration", "Git hooks", "Real-time"]
        },
        {
          title: "CLI Tool",
          description: "Command-line interface for automation. Docker image available.",
          live: false,
          highlights: ["Cross-platform", "Docker ready", "Scriptable"]
        }
      ]
    }
  ];

  const stats = [
    { icon: Shield, value: "70+", label: "Patterns" },
    { icon: Zap, value: "<500ms", label: "Speed" },
    { icon: Users, value: "10K+", label: "Developers" },
    { icon: Clock, value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Navigation */}
      <div className="container py-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </div>

      {/* Hero */}
      <div className="container py-8 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Enterprise-Grade Security
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Everything You Need to
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Secure Your Logs
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            100% client-side privacy, enterprise compliance, and developer-friendly tools.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</span>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
              </div>
            );
          })}
        </div>

        {/* Features */}
        <div className="space-y-20">
          {features.map((section, sectionIdx) => {
            const Icon = section.icon;
            return (
              <section key={sectionIdx}>
                <div className="flex items-center gap-4 mb-8">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${section.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {section.category}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      className={`p-6 rounded-xl border-2 transition-all ${
                        item.live 
                          ? 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg' 
                          : 'border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.live 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                        }`}>
                          {item.live ? '✓ Live' : 'Soon'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {item.description}
                      </p>
                      
                      <div className="flex flex-wrap gap-2">
                        {item.highlights.map((h, hidx) => (
                          <span key={hidx} className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300 rounded text-xs">
                            {h}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-20 p-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Secure Your Logs?</h2>
          <p className="text-gray-300 mb-6 max-w-xl mx-auto">
            Join thousands of developers who trust LogShield. Start free, upgrade when ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/app" 
              className="px-6 py-3 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Try Free Now
            </Link>
            <Link 
              to="/pricing" 
              className="px-6 py-3 border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

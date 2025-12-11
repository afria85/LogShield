// src/pages/Features.jsx - COMPLETE FIXED VERSION
import { useEffect } from 'react';
import { Shield, Lock, FileText, Zap, Cpu, Database, Cloud, Code, ArrowLeft, ArrowRight, CheckCircle, Rocket, Clock, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function FeaturesPage() {
  useEffect(() => {
    analytics.trackPageView('/features');
    analytics.trackEvent('features_page_view');
  }, []);

  useSEO({
    title: 'Features | LogShield',
    description: 'Explore the advanced features of LogShield: 70+ detection patterns, AI-powered entropy detection, 100% client-side processing, and more.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/features'
  });

  const features = [
    {
      category: "??? Core Security Engine",
      icon: Shield,
      color: "from-blue-500 to-cyan-500",
      items: [
        {
          title: "70+ Detection Patterns",
          description: "Comprehensive detection for AWS, GCP, Azure, Stripe, MongoDB, PostgreSQL, Redis, Docker, JWT, OAuth tokens, and more. Updated weekly with new CVEs.",
          stats: "Updated: 2 hours ago",
          live: true,
          highlights: ["Real-time pattern matching", "Weekly updates", "CVE monitoring"]
        },
        {
          title: "AI-Powered Entropy Detection",
          description: "Advanced machine learning identifies unknown secrets and high-entropy strings that traditional regex patterns can't detect.",
          stats: "Accuracy: 98.7%",
          live: true,
          highlights: ["ML-based detection", "Anomaly scoring", "Adaptive learning"]
        },
        {
          title: "Real-time Pattern Engine",
          description: "Optimized WebAssembly engine scans 10MB logs in under 500ms with intelligent regex caching and parallel processing.",
          stats: "Speed: 20ms/10KB",
          live: true,
          highlights: ["WASM powered", "Regex caching", "Parallel processing"]
        },
        {
          title: "Custom Pattern Builder",
          description: "Drag-and-drop regex builder with live preview. Save custom patterns to your account and sync across devices.",
          stats: "Launching: Next week",
          live: false,
          highlights: ["Visual regex editor", "Pattern testing", "Cloud sync"]
        }
      ]
    },
    {
      category: "?? Privacy & Compliance",
      icon: Lock,
      color: "from-green-500 to-emerald-500",
      items: [
        {
          title: "100% Client-Side Processing",
          description: "Zero data transmission. Your logs never leave your browser. We physically cannot see what you sanitize.",
          stats: "Data stays local",
          live: true,
          highlights: ["No network calls", "Browser isolation", "Zero-knowledge"]
        },
        {
          title: "GDPR, CCPA, HIPAA Ready",
          description: "Enterprise compliance built-in. Generate audit logs and compliance reports for regulatory requirements.",
          stats: "Compliance: Certified",
          live: true,
          highlights: ["GDPR compliant", "HIPAA ready", "Audit logging"]
        },
        {
          title: "Military-Grade Encryption",
          description: "End-to-end encryption for team sharing with zero-knowledge architecture. Keys never leave your device.",
          stats: "AES-256 + SHA-512",
          live: true,
          highlights: ["E2E encryption", "Zero knowledge", "Key management"]
        },
        {
          title: "Data Retention Controls",
          description: "Automatic deletion of processed logs after configurable time periods. Complete control over data lifecycle.",
          stats: "Configurable: 1min - 24h",
          live: false,
          highlights: ["Auto-cleanup", "Custom retention", "Data lifecycle"]
        }
      ]
    },
    {
      category: "? Performance & Integration",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
      items: [
        {
          title: "Batch Processing API",
          description: "REST API for CI/CD pipelines. Native integrations with GitHub Actions, GitLab CI, Jenkins, and CircleCI.",
          stats: "API Rate: 1000 req/min",
          live: true,
          highlights: ["REST API", "Webhooks", "Rate limiting"]
        },
        {
          title: "VS Code Extension",
          description: "Right-click to sanitize directly in editor. Preview changes before committing to prevent secret leaks.",
          stats: "VS Code: Available",
          live: false,
          highlights: ["Editor integration", "Real-time preview", "Git hooks"]
        },
        {
          title: "CLI Tool & Docker Image",
          description: "Command-line interface for automation. Docker image for isolated processing in CI/CD environments.",
          stats: "CLI: v1.2.0",
          live: false,
          highlights: ["Cross-platform CLI", "Docker support", "CI/CD ready"]
        },
        {
          title: "Slack/Teams Integration",
          description: "Sanitize logs directly in Slack/Teams. Auto-detect and redact secrets in channel messages.",
          stats: "Beta testing",
          live: false,
          highlights: ["Chat integration", "Real-time detection", "Team collaboration"]
        }
      ]
    }
  ];

  const stats = [
    { icon: Shield, value: "70+", label: "Detection Patterns" },
    { icon: Zap, value: "<500ms", label: "Processing Speed" },
    { icon: Users, value: "10K+", label: "Developers Trust Us" },
    { icon: Clock, value: "99.9%", label: "Uptime SLA" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/20">
      {/* Navigation */}
      <div className="container mx-auto px-4 py-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium group"
          onClick={() => analytics.trackEvent('navigation', { from: 'features', to: 'home' })}
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to LogShield
        </Link>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
            <Rocket className="h-4 w-4" />
            Enterprise-Grade Security
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
              Everything You Need
            </span>
            <br />
            to Secure Your Logs
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Comprehensive log security with 100% client-side privacy, enterprise compliance, 
            and developer-friendly integrations.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Grid */}
        <div className="space-y-24">
          {features.map((section, sectionIdx) => {
            const Icon = section.icon;
            return (
              <section 
                key={sectionIdx} 
                id={section.category.toLowerCase().replace(/\s+/g, '-')}
                className="scroll-mt-24"
              >
                <div className="flex items-center gap-4 mb-10">
                  <div className={`p-4 rounded-2xl bg-gradient-to-br ${section.color} shadow-lg`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{section.category}</h2>
                    <p className="text-gray-500 mt-2">Complete toolset for professional log security</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {section.items.map((item, itemIdx) => (
                    <div 
                      key={itemIdx} 
                      className={`group p-7 rounded-2xl border-2 transition-all duration-300 ${
                        item.live 
                          ? 'border-blue-200 bg-white hover:border-blue-300 hover:shadow-xl' 
                          : 'border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-5">
                        <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${
                          item.live 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {item.live ? (
                            <>
                              <CheckCircle className="h-3 w-3" />
                              LIVE
                            </>
                          ) : 'COMING SOON'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-5 leading-relaxed">{item.description}</p>
                      
                      {item.highlights && (
                        <div className="mb-5">
                          <div className="flex flex-wrap gap-2">
                            {item.highlights.map((highlight, idx) => (
                              <span 
                                key={idx} 
                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                              >
                                {highlight}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-5 border-t border-gray-100">
                        <div className="flex items-center gap-2 text-gray-500">
                          <span className="text-sm font-medium">{item.stats}</span>
                        </div>
                        
                        {item.live ? (
                          <Link 
                            to="/app" 
                            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm group/link"
                            onClick={() => analytics.trackEvent('feature_try_now', { feature: item.title })}
                          >
                            Try now
                            <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                          </Link>
                        ) : (
                          <button className="text-gray-400 font-medium text-sm cursor-not-allowed">
                            Coming Soon
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-10 rounded-2xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Secure Your Logs?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Join thousands of developers and teams who trust LogShield for their sensitive data.
              Start free, upgrade when you need more.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/app" 
                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => analytics.trackEvent('cta_click', { cta: 'start_free_features' })}
              >
                ?? Start Free Today
              </Link>
              <Link 
                to="/pricing" 
                className="px-8 py-4 bg-transparent border-2 border-white/30 text-white font-bold rounded-lg hover:bg-white/10 transition-all hover:border-white"
                onClick={() => analytics.trackEvent('cta_click', { cta: 'view_plans_features' })}
              >
                View Enterprise Plans
              </Link>
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              No credit card required ? 14-day free trial ? Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
// src/pages/Documentation.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, MessageCircle, ArrowLeft, Terminal, Code, 
  FileText, Zap, Shield, Lock, Download, Search, 
  ChevronRight, ExternalLink, Copy, Check,
  Folder, GitBranch, Settings, Database, Cpu
} from 'lucide-react';
import { analytics } from '../lib/analytics';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (analytics.trackPageView) {
      analytics.trackPageView('/docs');
    }
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    {
      id: 'getting-started',
      title: '?? Getting Started',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Getting Started with LogShield</h1>
          <p className="text-gray-700">
            Welcome to LogShield! This guide will help you get started with our privacy-first log sanitizer.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">Quick Start</h2>
          <ol className="list-decimal pl-6 space-y-2 text-gray-700">
            <li>Visit the web app at app.logshield.dev</li>
            <li>Paste your log content or upload a file</li>
            <li>Select detection patterns (or use defaults)</li>
            <li>Click "Sanitize" to process</li>
            <li>Copy or download the sanitized output</li>
          </ol>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Terminal className="h-4 w-4" />
                <span className="text-sm font-medium">CLI Installation</span>
              </div>
              <button
                onClick={() => copyToClipboard('# Install via npm\nnpm install -g @logshield/cli\n\n# Or using yarn\nyarn global add @logshield/cli\n\n# Verify installation\nlogshield --version')}
                className="text-sm text-gray-400 hover:text-white"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code># Install via npm<br />npm install -g @logshield/cli<br /><br /># Or using yarn<br />yarn global add @logshield/cli<br /><br /># Verify installation<br />logshield --version</code>
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: '?? API Reference',
      icon: Code,
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">API Reference</h1>
          <p className="text-gray-700">
            LogShield provides a comprehensive REST API for programmatic access.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">Authentication</h2>
          <p className="text-gray-700">
            All API requests require an API key in the Authorization header.
          </p>
          
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4">
            <pre className="text-sm overflow-x-auto">
              <code>export LOGSHIELD_API_KEY="your_api_key_here"<br /><br /># Or in curl<br />curl -H "Authorization: Bearer $LOGSHIELD_API_KEY" \<br />  https://api.logshield.dev/v1/sanitize</code>
            </pre>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Endpoint</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Method</th>
                  <th className="border border-gray-200 px-4 py-3 text-left text-sm font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['/v1/sanitize', 'POST', 'Sanitize log content'],
                  ['/v1/patterns', 'GET', 'List available patterns'],
                  ['/v1/health', 'GET', 'Service health check'],
                  ['/v1/usage', 'GET', 'Get usage statistics']
                ].map(([endpoint, method, desc], idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{endpoint}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{method}</td>
                    <td className="border border-gray-200 px-4 py-3 text-sm text-gray-700">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'patterns',
      title: '??? Detection Patterns',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900">Detection Patterns</h1>
          <p className="text-gray-700">
            LogShield includes 70+ built-in patterns for detecting sensitive information.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 mt-8">Pattern Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'API Keys', description: 'AWS, GCP, Azure, Stripe, etc.' },
              { title: 'Credentials', description: 'Passwords, tokens, secrets' },
              { title: 'PII', description: 'Emails, phone numbers, SSN' },
              { title: 'Database', description: 'Connection strings, queries' },
              { title: 'Cloud', description: 'Cloud service configurations' },
              { title: 'Payment', description: 'Credit cards, payment tokens' }
            ].map((category, idx) => (
              <div key={idx} className="p-4 bg-white border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{category.title}</h4>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Documentation</h3>
                    <p className="text-sm text-gray-500">v2.1.0</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between group ${
                          activeSection === section.id
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border border-blue-200 shadow-sm'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span className="font-medium">{section.title}</span>
                        </div>
                        <ChevronRight className={`h-4 w-4 transition-transform ${
                          activeSection === section.id ? 'rotate-90' : 'group-hover:translate-x-1'
                        }`} />
                      </button>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="space-y-3">
                    <Link 
                      to="/app" 
                      className="flex items-center justify-between text-blue-600 hover:text-blue-700 text-sm font-medium group/link"
                    >
                      <span>Try Live Demo</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                    <a 
                      href="https://github.com/afria85/LogShield" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between text-gray-700 hover:text-gray-900 text-sm font-medium group/link"
                    >
                      <span>GitHub Repository</span>
                      <ExternalLink className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                    <Link 
                      to="/pricing" 
                      className="flex items-center justify-between text-gray-700 hover:text-gray-900 text-sm font-medium group/link"
                    >
                      <span>Pricing & Plans</span>
                      <ChevronRight className="h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mt-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl text-white">
                <h4 className="font-semibold mb-4">Quick Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">API Endpoints</span>
                    <span className="font-medium">12+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Patterns</span>
                    <span className="font-medium">70+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-300">Uptime</span>
                    <span className="font-medium text-green-400">99.9%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="p-8">
                {sections.find(s => s.id === activeSection)?.content}
              </div>

              {/* Next Steps */}
              <div className="p-8 bg-gray-50 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4">Next Steps</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Link 
                    to="/app" 
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group/card"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Terminal className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Try Demo</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Test LogShield with sample logs
                    </p>
                  </Link>
                  
                  <Link 
                    to="/features" 
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group/card"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <Zap className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">All Features</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Explore complete feature set
                    </p>
                  </Link>
                  
                  <a 
                    href="mailto:support@logshield.dev" 
                    className="p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group/card"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <MessageCircle className="h-5 w-5 text-blue-600" />
                      </div>
                      <h4 className="font-semibold text-gray-900">Get Help</h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      Contact our support team
                    </p>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
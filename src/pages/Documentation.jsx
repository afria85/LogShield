// src/pages/Documentation.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, ArrowLeft, Terminal, Code, Shield, Zap,
  ChevronRight, Copy, Check, ExternalLink
} from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    analytics.trackPageView('/docs');
  }, []);

  useSEO({
    title: 'Documentation | LogShield',
    description: 'Complete guide to using LogShield - getting started, API reference, detection patterns, and integration guides.',
    url: 'https://logshield.dev/docs'
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sections = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: Zap,
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Getting Started</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to LogShield! Get started in under 60 seconds.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Quick Start</h2>
          <ol className="list-decimal pl-6 space-y-3 text-gray-700 dark:text-gray-300">
            <li>Go to the <Link to="/app" className="text-blue-600 hover:underline">Sanitizer Tool</Link></li>
            <li>Paste your log content or drag & drop a file</li>
            <li>Select detection patterns (or use defaults)</li>
            <li>Click "Sanitize Now"</li>
            <li>Copy or download the sanitized output</li>
          </ol>
          
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-blue-800 dark:text-blue-300 text-sm">
              <strong>Privacy Note:</strong> All processing happens in your browser. Your logs never leave your device.
            </p>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">CLI Installation</h2>
          <div className="bg-gray-900 rounded-lg p-4 relative">
            <button
              onClick={() => copyToClipboard('npm install -g @logshield/cli')}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
            <pre className="text-sm text-gray-100 overflow-x-auto">
              <code>npm install -g @logshield/cli</code>
            </pre>
          </div>
        </div>
      )
    },
    {
      id: 'patterns',
      title: 'Detection Patterns',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Detection Patterns</h1>
          <p className="text-gray-600 dark:text-gray-400">
            LogShield includes 70+ patterns for detecting sensitive information.
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Pattern Categories</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              { title: '🔑 Credentials', items: ['AWS Keys', 'GCP Keys', 'Azure Keys', 'Stripe Keys', 'GitHub Tokens'] },
              { title: '🔐 Auth Tokens', items: ['JWT', 'OAuth', 'Bearer Tokens', 'API Keys', 'Session IDs'] },
              { title: '👤 Personal Info', items: ['Emails', 'Phone Numbers', 'SSN', 'Credit Cards', 'Addresses'] },
              { title: '💾 Database', items: ['MongoDB URI', 'PostgreSQL URI', 'MySQL URI', 'Redis URL', 'Connection Strings'] }
            ].map((cat, idx) => (
              <div key={idx} className="p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{cat.title}</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {cat.items.map((item, iidx) => (
                    <li key={iidx}>• {item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Free vs Pro Patterns</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="border border-gray-200 dark:border-slate-600 px-4 py-2 text-left">Tier</th>
                  <th className="border border-gray-200 dark:border-slate-600 px-4 py-2 text-left">Patterns</th>
                  <th className="border border-gray-200 dark:border-slate-600 px-4 py-2 text-left">AI Detection</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">Free</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">10 basic patterns</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">❌</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">Pro</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">70+ patterns</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">✅</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      id: 'api',
      title: 'API Reference',
      icon: Code,
      content: (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Reference</h1>
          <p className="text-gray-600 dark:text-gray-400">
            REST API for programmatic access (Pro plan required).
          </p>
          
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Authentication</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <pre className="text-sm text-gray-100 overflow-x-auto">
              <code>{`curl -X POST https://api.logshield.dev/v1/sanitize \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "your log content here"}'`}</code>
            </pre>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-8">Endpoints</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="border border-gray-200 dark:border-slate-600 px-4 py-2 text-left">Endpoint</th>
                  <th className="border border-gray-200 dark:border-slate-600 px-4 py-2 text-left">Method</th>
                  <th className="border border-gray-200 dark:border-slate-600 px-4 py-2 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 dark:text-gray-300">
                <tr>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2 font-mono text-sm">/v1/sanitize</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">POST</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">Sanitize log content</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2 font-mono text-sm">/v1/patterns</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">GET</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">List available patterns</td>
                </tr>
                <tr>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2 font-mono text-sm">/v1/usage</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">GET</td>
                  <td className="border border-gray-200 dark:border-slate-600 px-4 py-2">Get usage statistics</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-8">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 font-medium mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">Docs</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">v3.0.0</p>
                </div>
              </div>
              
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center gap-3 ${
                        activeSection === section.id
                          ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{section.title}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                <Link to="/app" className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-medium">
                  Try Live Demo <ExternalLink className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-8">
              {sections.find(s => s.id === activeSection)?.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

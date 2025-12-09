// src/components/Features.jsx
import { 
  Lock, Zap, Globe, Code, Shield, Download, 
  Brain, Layers, GitBranch, FileCode 
} from 'lucide-react';
import { Card } from './ui/Card';

export default function Features() {
  const features = [
    {
      icon: Lock,
      title: '100% Client-Side Processing',
      description: 'Your logs never leave your browser. All sanitization happens locally with zero data transfer.',
      color: 'blue'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Process thousands of lines in milliseconds with optimized pattern matching algorithms.',
      color: 'yellow'
    },
    {
      icon: Brain,
      title: 'AI-Powered Detection',
      description: 'Advanced entropy analysis detects unknown secrets and high-risk patterns automatically.',
      color: 'purple'
    },
    {
      icon: Shield,
      title: '70+ Security Patterns',
      description: 'Comprehensive coverage for AWS, GCP, Azure, API keys, tokens, emails, PII, and more.',
      color: 'green'
    },
    {
      icon: Download,
      title: 'Multiple Export Formats',
      description: 'Export sanitized logs as plain text, JSON, CSV, or PDF with detailed reports.',
      color: 'pink'
    },
    {
      icon: Layers,
      title: 'Batch Processing',
      description: 'Sanitize multiple files at once with drag-and-drop support for efficient workflows.',
      color: 'indigo'
    },
    {
      icon: Code,
      title: 'Custom Patterns',
      description: 'Add your own regex patterns for company-specific secrets or internal conventions.',
      color: 'orange'
    },
    {
      icon: Globe,
      title: 'No Installation Required',
      description: 'Works instantly in any modern browser. No downloads, no setup, no hassle.',
      color: 'teal'
    }
  ];

  const colorSchemes = {
    blue: 'from-blue-500 to-cyan-500',
    yellow: 'from-yellow-500 to-orange-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    pink: 'from-pink-500 to-rose-500',
    indigo: 'from-indigo-500 to-blue-500',
    orange: 'from-orange-500 to-red-500',
    teal: 'from-teal-500 to-cyan-500'
  };

  return (
    <div className="py-20 bg-white">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Enterprise-Grade Security,
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Developer-Friendly Experience
            </span>
          </h2>
          <p className="text-xl text-gray-600">
            Built by developers for developers. LogShield combines powerful security features 
            with an intuitive interface.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card
                key={i}
                className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colorSchemes[feature.color]} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </Card>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              1M+
            </div>
            <div className="text-gray-600">Logs Sanitized</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
              70+
            </div>
            <div className="text-gray-600">Security Patterns</div>
          </div>
          <div>
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              99.9%
            </div>
            <div className="text-gray-600">Uptime</div>
          </div>
        </div>

        {/* Trusted By */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-8">Trusted by developers at</p>
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-50">
            <div className="text-2xl font-bold text-gray-700">GitHub</div>
            <div className="text-2xl font-bold text-gray-700">GitLab</div>
            <div className="text-2xl font-bold text-gray-700">Vercel</div>
            <div className="text-2xl font-bold text-gray-700">Netlify</div>
            <div className="text-2xl font-bold text-gray-700">AWS</div>
          </div>
        </div>
      </div>
    </div>
  );
}

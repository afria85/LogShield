// src/pages/About.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Target, Heart, Globe, Shield, Users, Zap } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function AboutPage() {
  useEffect(() => {
    analytics.trackPageView('/about');
  }, []);

  useSEO({
    title: 'About Us | LogShield',
    description: 'Learn about LogShield - our mission to protect developer privacy and the story behind the privacy-first log sanitizer.',
    url: 'https://logshield.dev/about'
  });

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description: 'Make log sanitization accessible, secure, and developer-friendly for everyone.'
    },
    {
      icon: Heart,
      title: 'Our Values',
      description: 'Privacy first, transparency, community-driven development, and open source commitment.'
    },
    {
      icon: Globe,
      title: 'Our Vision',
      description: 'A world where no sensitive data is accidentally exposed in logs, ever.'
    }
  ];

  const stats = [
    { value: '100%', label: 'Client-Side Processing' },
    { value: '70+', label: 'Security Patterns' },
    { value: '10K+', label: 'Developers Trust Us' },
    { value: '0', label: 'Data We Store' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About LogShield
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Privacy-first log sanitization for developers worldwide
            </p>
          </div>

          {/* Story */}
          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                LogShield was born from a simple observation: developers need to share logs for debugging, 
                but those logs often contain sensitive data that shouldn't be exposed.
              </p>
              <p>
                After seeing countless incidents where API keys, tokens, and credentials were 
                accidentally leaked in GitHub issues, Stack Overflow posts, and support tickets, 
                we knew there had to be a better way.
              </p>
              <p>
                We built LogShield to be the tool we wished existed: fast, private, and 
                comprehensive. No complex setup, no data upload required - just paste and sanitize.
              </p>
              <p>
                Today, LogShield helps thousands of developers protect their sensitive data while 
                maintaining their debugging workflow. And because all processing happens in your 
                browser, we literally cannot see your data even if we wanted to.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="p-8 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              What Drives Us
            </h2>
            <div className="space-y-6">
              {values.map((value, idx) => {
                const Icon = value.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg h-fit">
                      <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {value.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
            <p className="text-blue-100 mb-6">
              Connect with developers, share feedback, and help shape the future of LogShield
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="https://github.com/afria85/LogShield" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                ⭐ Star on GitHub
              </a>
              <a 
                href="mailto:hello@logshield.dev" 
                className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

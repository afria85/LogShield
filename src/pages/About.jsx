// src/pages/About.jsx
import { Users, Target, Heart, Globe, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO'; // Import hook

export default function AboutPage() {
  useEffect(() => {
    analytics.trackPageView('/about');
  }, []);

  useSEO({
    title: 'About Us | LogShield',
    description: 'Learn about LogShield, our mission to protect developer privacy, and the team behind the privacy-first log sanitizer.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/about'
});

  const values = [
    {
      icon: Target,
      title: 'Mission',
      description: 'To make log sanitization accessible, secure, and developer-friendly.',
    },
    {
      icon: Heart,
      title: 'Values',
      description: 'Privacy first, open source, community-driven, and transparent.',
    },
    {
      icon: Globe,
      title: 'Vision',
      description: 'A world where no sensitive data is accidentally exposed in logs.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="container py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About LogShield
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Privacy-first log sanitization for developers worldwide
          </p>

          <div className="prose prose-lg max-w-none">
            <div className="p-8 bg-white rounded-xl border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                LogShield was born from a simple need: developers need to share logs for debugging, 
                but those logs often contain sensitive data that shouldn't be exposed.
              </p>
              <p className="text-gray-600 mb-4">
                After seeing countless incidents where API keys, tokens, and credentials were 
                accidentally leaked in GitHub issues, Stack Overflow posts, and support tickets, 
                we knew there had to be a better way.
              </p>
              <p className="text-gray-600">
                We built LogShield to be the tool we wished existed: fast, private, and 
                comprehensive. No complex setup, no data upload, just paste and sanitize.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-sm text-gray-600">Client-Side Processing</div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">70+</div>
                <div className="text-sm text-gray-600">Security Patterns</div>
              </div>
              <div className="p-6 bg-white rounded-xl border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
                <div className="text-sm text-gray-600">Developers Trust Us</div>
              </div>
            </div>

            <div className="p-8 bg-white rounded-xl border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Values</h2>
              <div className="space-y-4">
                {values.map((value, idx) => {
                  const Icon = value.icon;
                  return (
                    <div key={idx}>
                      <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        {value.title}
                      </h3>
                      <p className="text-gray-600 ml-7">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Join Our Community</h2>
              <p className="text-blue-100 mb-6">
                Connect with other developers, share feedback, and help shape the future of LogShield
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="https://github.com/afria85/LogShield" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                  GitHub
                </a>
                <a href="mailto:hello@logshield.dev" className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
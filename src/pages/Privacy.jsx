// src/pages/Privacy.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function PrivacyPage() {
  useEffect(() => {
    analytics.trackPageView('/privacy');
  }, []);

  useSEO({
    title: 'Privacy Policy | LogShield',
    description: 'LogShield Privacy Policy - Learn how we protect your data with 100% client-side processing.',
    url: 'https://logshield.dev/privacy'
  });

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

        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Last updated: December 11, 2025
          </p>

          {/* Key Points */}
          <div className="grid md:grid-cols-2 gap-4 mb-12">
            {[
              { icon: Shield, title: '100% Client-Side', desc: 'Your logs never leave your browser' },
              { icon: Lock, title: 'Zero Data Storage', desc: 'We cannot access your log content' },
              { icon: Eye, title: 'No Tracking Cookies', desc: 'We use privacy-friendly analytics' },
              { icon: Trash2, title: 'Your Data, Your Control', desc: 'Nothing stored, nothing to delete' }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Policy Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 space-y-8">
              
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Our Privacy Commitment</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  LogShield is built with privacy as the foundation, not an afterthought. All log sanitization 
                  processing happens entirely in your web browser. Your log data is never transmitted to our 
                  servers, stored in any database, or accessible to anyone at LogShield.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Information We Collect</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  <strong>Log Content:</strong> We do NOT collect, store, or process your log content. 
                  All sanitization happens client-side in your browser.
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  <strong>Account Information:</strong> If you create a paid account, we collect your email 
                  address and payment information through our payment processor (Gumroad).
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <strong>Usage Analytics:</strong> We use Plausible Analytics, a privacy-friendly analytics 
                  service that does not use cookies or collect personal data. We only see aggregate page views 
                  and feature usage.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. How We Use Information</h2>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                  <li>To provide and maintain our service</li>
                  <li>To process payments and manage subscriptions</li>
                  <li>To send important service updates (only if you opt-in)</li>
                  <li>To improve our product based on aggregate usage patterns</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Data Sharing</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We do not sell, trade, or share your personal information with third parties except:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                  <li>Payment processing through Gumroad (for paid subscriptions)</li>
                  <li>When required by law or to protect our rights</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Cookies</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We use minimal, essential cookies only for:
                </p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                  <li>Storing your theme preference (light/dark mode)</li>
                  <li>License validation for paid accounts</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  We do NOT use tracking cookies, advertising cookies, or third-party analytics cookies.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Your Rights (GDPR/CCPA)</h2>
                <p className="text-gray-600 dark:text-gray-400">You have the right to:</p>
                <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2 mt-2">
                  <li>Access your personal data</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and associated data</li>
                  <li>Export your data</li>
                  <li>Opt-out of marketing communications</li>
                </ul>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Contact us at <a href="mailto:privacy@logshield.dev" className="text-blue-600 dark:text-blue-400 hover:underline">privacy@logshield.dev</a> to exercise these rights.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Security</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We implement industry-standard security measures. However, since your log data never 
                  reaches our servers, the primary security benefit is that there's nothing to breach.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Changes to This Policy</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  We may update this policy from time to time. We will notify you of any changes by 
                  posting the new policy on this page and updating the "Last updated" date.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Contact Us</h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Questions about this policy? Contact us at{' '}
                  <a href="mailto:privacy@logshield.dev" className="text-blue-600 dark:text-blue-400 hover:underline">
                    privacy@logshield.dev
                  </a>
                </p>
              </section>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

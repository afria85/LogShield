// src/pages/PrivacyPage.jsx
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Lock, Eye, Server } from 'lucide-react';

export default function PrivacyPage() {
  useSEO({
    title: 'Privacy Policy - LogShield',
    description: 'LogShield Privacy Policy. Learn how we protect your data and respect your privacy.',
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Back button */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <article className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 sm:p-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Privacy Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Last updated: December 12, 2025
          </p>

          {/* Key highlights */}
          <div className="grid sm:grid-cols-2 gap-4 mb-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">100% Client-Side</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Your logs never leave your browser</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">No Data Collection</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">We can't see what you sanitize</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Server className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">No Server Storage</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Zero server-side processing</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-500 mt-0.5" />
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">GDPR Compliant</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Full privacy compliance</p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Introduction</h2>
            <p>
              LogShield ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy 
              explains how we handle information when you use our log sanitization service at logshield.dev.
            </p>

            <h2>2. Information We Don't Collect</h2>
            <p>
              <strong>LogShield is designed to be privacy-first.</strong> We do not collect, store, or 
              transmit the log data you paste into our tool. All sanitization processing happens entirely 
              in your web browser using JavaScript. Your data never leaves your device.
            </p>

            <h2>3. Information We Do Collect</h2>
            <p>We collect minimal information necessary to operate the service:</p>
            <ul>
              <li><strong>Analytics:</strong> We use Plausible Analytics, a privacy-focused analytics service 
              that doesn't use cookies and doesn't track personal data. We collect aggregate page views and 
              basic feature usage to improve our service.</li>
              <li><strong>Payment Information:</strong> If you upgrade to a paid plan, payment processing is 
              handled by Gumroad. We do not store your payment card details.</li>
              <li><strong>License Keys:</strong> For paid users, we store license keys locally in your browser 
              to validate your subscription.</li>
            </ul>

            <h2>4. How We Use Information</h2>
            <p>The limited information we collect is used to:</p>
            <ul>
              <li>Improve the service and user experience</li>
              <li>Process payments for premium features</li>
              <li>Provide customer support</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>5. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li><strong>Plausible Analytics:</strong> Privacy-focused web analytics</li>
              <li><strong>Gumroad:</strong> Payment processing</li>
              <li><strong>Vercel:</strong> Website hosting</li>
            </ul>

            <h2>6. Data Security</h2>
            <p>
              Since your log data is processed entirely in your browser and never transmitted to our servers, 
              there is no risk of server-side data breaches affecting your sanitized logs. Our website uses 
              HTTPS encryption for all connections.
            </p>

            <h2>7. Your Rights</h2>
            <p>Under GDPR and other privacy regulations, you have the right to:</p>
            <ul>
              <li>Access any personal data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt out of analytics (we respect Do Not Track)</li>
              <li>Request a copy of your data</li>
            </ul>

            <h2>8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <ul>
              <li>Email: privacy@logshield.dev</li>
              <li>General inquiries: hello@logshield.dev</li>
            </ul>

            <h2>9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

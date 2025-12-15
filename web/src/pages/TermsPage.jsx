// src/pages/TermsPage.jsx
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  useSEO({
    title: 'Terms of Service - LogShield',
    description: 'LogShield Terms of Service. Read our terms and conditions for using the service.',
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
            Terms of Service
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Last updated: December 12, 2025
          </p>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using LogShield ("Service"), you agree to be bound by these Terms of Service. 
              If you disagree with any part of these terms, you may not access the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
              LogShield provides a browser-based tool for sanitizing sensitive data from log files. 
              The Service processes data entirely within your web browser and does not transmit your 
              log data to our servers.
            </p>

            <h2>3. User Accounts and Subscriptions</h2>
            <p>
              Some features require a paid subscription. By purchasing a subscription, you agree to:
            </p>
            <ul>
              <li>Pay all fees associated with your chosen plan</li>
              <li>Provide accurate billing information</li>
              <li>Not share your license key with unauthorized users</li>
            </ul>

            <h2>4. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to reverse engineer or extract source code</li>
              <li>Distribute or share your license key</li>
              <li>Use automated tools to abuse the Service</li>
              <li>Interfere with the proper functioning of the Service</li>
            </ul>

            <h2>5. Intellectual Property</h2>
            <p>
              The Service and its original content, features, and functionality are owned by LogShield 
              and are protected by international copyright, trademark, patent, trade secret, and other 
              intellectual property laws.
            </p>

            <h2>6. Disclaimer of Warranties</h2>
            <p>
              The Service is provided "AS IS" without warranties of any kind. We do not guarantee that:
            </p>
            <ul>
              <li>The Service will be uninterrupted or error-free</li>
              <li>All sensitive data will be detected and removed</li>
              <li>The sanitized output will be suitable for your specific use case</li>
            </ul>
            <p>
              <strong>You are responsible for reviewing sanitized output before sharing.</strong>
            </p>

            <h2>7. Limitation of Liability</h2>
            <p>
              In no event shall LogShield be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
              or other intangible losses.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. We will provide notice of significant 
              changes by posting the new terms on this page.
            </p>

            <h2>9. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of Germany, 
              without regard to its conflict of law provisions.
            </p>

            <h2>10. Contact</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <ul>
              <li>Email: legal@logshield.dev</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}

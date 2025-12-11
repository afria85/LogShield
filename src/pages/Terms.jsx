// src/pages/Terms.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function TermsPage() {
  useEffect(() => {
    analytics.trackPageView('/terms');
  }, []);

  useSEO({
    title: 'Terms of Service | LogShield',
    description: 'LogShield Terms of Service - Read our terms and conditions for using the log sanitizer service.',
    url: 'https://logshield.dev/terms'
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
            Terms of Service
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Last updated: December 11, 2025
          </p>

          <div className="p-6 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 space-y-8">
            
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">1. Agreement to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                By accessing or using LogShield ("the Service"), you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">2. Description of Service</h2>
              <p className="text-gray-600 dark:text-gray-400">
                LogShield is a client-side log sanitization tool that helps developers remove sensitive 
                information from log files. All processing occurs in your web browser; we do not receive, 
                store, or process your log content.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">3. User Accounts</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Some features require a paid subscription. When creating an account, you agree to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">4. Acceptable Use</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-600 dark:text-gray-400 space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to reverse engineer, decompile, or disassemble the Service</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Share your subscription with unauthorized users</li>
                <li>Use automated systems to access the Service without permission</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">5. Subscriptions and Payments</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                <strong>Billing:</strong> Paid subscriptions are billed in advance on a monthly or annual basis 
                through our payment processor (Gumroad).
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                <strong>Cancellation:</strong> You may cancel your subscription at any time. Your access will 
                continue until the end of the current billing period.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                <strong>Refunds:</strong> We offer a 30-day money-back guarantee for new subscriptions. 
                Contact us at billing@logshield.dev for refund requests.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">6. Intellectual Property</h2>
              <p className="text-gray-600 dark:text-gray-400">
                The Service, including its original content, features, and functionality, is owned by LogShield 
                and is protected by international copyright, trademark, and other intellectual property laws. 
                Your log content remains yours; we make no claim to it.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">7. Disclaimer of Warranties</h2>
              <p className="text-gray-600 dark:text-gray-400">
                THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT GUARANTEE THAT 
                THE SERVICE WILL DETECT ALL SENSITIVE INFORMATION IN YOUR LOGS. YOU ARE RESPONSIBLE FOR 
                VERIFYING THE OUTPUT AND ENSURING IT MEETS YOUR SECURITY REQUIREMENTS.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">8. Limitation of Liability</h2>
              <p className="text-gray-600 dark:text-gray-400">
                IN NO EVENT SHALL LOGSHIELD BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, 
                OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, OR GOODWILL, 
                ARISING FROM YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">9. Changes to Terms</h2>
              <p className="text-gray-600 dark:text-gray-400">
                We reserve the right to modify these terms at any time. We will provide notice of significant 
                changes by posting the updated terms on this page. Your continued use of the Service after 
                changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">10. Governing Law</h2>
              <p className="text-gray-600 dark:text-gray-400">
                These terms shall be governed by and construed in accordance with applicable laws, without 
                regard to conflict of law principles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">11. Contact</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Questions about these Terms? Contact us at{' '}
                <a href="mailto:legal@logshield.dev" className="text-blue-600 dark:text-blue-400 hover:underline">
                  legal@logshield.dev
                </a>
              </p>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}

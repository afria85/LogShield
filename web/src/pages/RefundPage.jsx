// src/pages/RefundPage.jsx
import { useSEO } from '../hooks/useSEO';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Mail } from 'lucide-react';

export default function RefundPage() {
  useSEO({
    title: 'Refund Policy - LogShield',
    description: 'LogShield Refund Policy. Learn about our 14-day money-back guarantee.',
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
            Refund Policy
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">
            Last updated: December 12, 2025
          </p>

          {/* Highlight box */}
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 text-lg">
                  14-Day Money-Back Guarantee
                </h3>
                <p className="text-emerald-700 dark:text-emerald-300 mt-1">
                  Not satisfied? Get a full refund within 14 days of purchase, no questions asked.
                </p>
              </div>
            </div>
          </div>

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <h2>Our Commitment</h2>
            <p>
              We want you to be completely satisfied with LogShield. If our product doesn't meet your 
              expectations, we'll make it right.
            </p>

            <h2>Monthly & Annual Subscriptions</h2>
            <p>
              For monthly and annual subscription plans:
            </p>
            <ul>
              <li>Request a refund within 14 days of your initial purchase</li>
              <li>Full refund, no questions asked</li>
              <li>Subscription will be immediately cancelled</li>
              <li>Access continues until the end of the current billing period</li>
            </ul>

            <h2>Lifetime Deals</h2>
            <p>
              For Lifetime Deal purchases:
            </p>
            <ul>
              <li>Request a refund within 14 days of purchase</li>
              <li>Full refund, no questions asked</li>
              <li>After 14 days, no refunds are available for Lifetime Deals</li>
            </ul>

            <h2>How to Request a Refund</h2>
            <p>
              To request a refund, please email us at:
            </p>
            <div className="not-prose my-6">
              <a
                href="mailto:support@logshield.dev?subject=Refund Request"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                <Mail className="w-5 h-5" />
                support@logshield.dev
              </a>
            </div>
            <p>
              Please include:
            </p>
            <ul>
              <li>Your email address used for purchase</li>
              <li>Order/license number (if available)</li>
              <li>Reason for refund (optional, helps us improve)</li>
            </ul>

            <h2>Processing Time</h2>
            <p>
              Refunds are typically processed within 5-7 business days. Depending on your payment method 
              and bank, it may take an additional few days for the funds to appear in your account.
            </p>

            <h2>Chargebacks</h2>
            <p>
              We kindly ask that you contact us before initiating a chargeback with your bank. 
              Chargebacks incur fees and administrative overhead that we'd like to avoid. We're committed 
              to resolving any issues directly and fairly.
            </p>

            <h2>Exceptions</h2>
            <p>
              Refunds may not be available if:
            </p>
            <ul>
              <li>The refund request is made after the 14-day period</li>
              <li>There's evidence of fraud or abuse</li>
              <li>The license key has been shared with unauthorized users</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              Questions about our refund policy? We're here to help:
            </p>
            <ul>
              <li>Support: support@logshield.dev</li>
              <li>General: hello@logshield.dev</li>
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}

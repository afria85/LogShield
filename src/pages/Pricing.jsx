// src/pages/Pricing.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, Zap, Shield, Users, Infinity } from 'lucide-react';
import { analytics } from '../lib/analytics';
import { useSEO } from '../hooks/useSEO';

export default function PricingPage({ onUpgrade }) {
  useEffect(() => {
    analytics.trackPageView('/pricing');
  }, []);

  useSEO({
    title: 'Pricing & Plans | LogShield',
    description: 'Choose the right plan for your log sanitization needs. Free tier available, with Starter, Pro, and Team plans for advanced features.',
    image: 'https://logshield.dev/og-image.png',
    url: 'https://logshield.dev/pricing'
  });

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for personal projects',
      icon: Shield,
      color: 'gray',
      features: [
        '10 basic patterns',
        '1,000 daily sanitizations',
        '200KB file limit',
        'Copy to clipboard',
        'Community support'
      ],
      cta: 'Get Started',
      popular: false
    },
    {
      name: 'Starter',
      price: '$7',
      period: '/month',
      description: 'For individual developers',
      icon: Zap,
      color: 'blue',
      features: [
        '30+ patterns',
        '5,000 daily sanitizations',
        '500KB file limit',
        'TXT & CSV export',
        'Email support',
        'Basic analytics'
      ],
      cta: 'Start Trial',
      popular: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For professional developers',
      icon: Shield,
      color: 'purple',
      features: [
        '70+ patterns',
        '50,000 daily sanitizations',
        '5MB file limit',
        'All export formats',
        'AI entropy detection',
        'Priority support',
        'API access',
        'Custom patterns'
      ],
      cta: 'Start Trial',
      popular: true
    },
    {
      name: 'Team',
      price: '$79',
      period: '/month',
      description: 'For teams & organizations',
      icon: Users,
      color: 'green',
      features: [
        'Everything in Pro',
        'Unlimited sanitizations',
        'Unlimited file size',
        'Team management',
        'SSO integration',
        'Audit logs',
        'Dedicated support',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const handlePlanClick = (planName) => {
    analytics.trackEvent('plan_click', { plan: planName.toLowerCase() });
    if (onUpgrade) {
      onUpgrade(planName.toLowerCase());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container py-12">
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 mb-8 group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-16">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            return (
              <div 
                key={idx}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-purple-500 bg-white dark:bg-slate-800 shadow-xl scale-105' 
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium rounded-full">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`inline-flex p-3 rounded-xl mb-4 ${
                    plan.color === 'purple' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    plan.color === 'green' ? 'bg-green-100 dark:bg-green-900/30' :
                    'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      plan.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                      plan.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                      plan.color === 'green' ? 'text-green-600 dark:text-green-400' :
                      'text-gray-600 dark:text-gray-400'
                    }`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    {plan.description}
                  </p>
                  
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      {plan.period}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, fidx) => (
                    <li key={fidx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-300">
                      <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handlePlanClick(plan.name)}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            );
          })}
        </div>

        {/* Lifetime Deal */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="p-8 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-white/20 rounded-xl">
                  <Infinity className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">Lifetime Deal</h3>
                  <p className="text-white/80">Pay once, use forever. Limited availability.</p>
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <div className="text-4xl font-bold mb-2">$199</div>
                <button 
                  onClick={() => handlePlanClick('lifetime')}
                  className="px-6 py-3 bg-white text-orange-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Get Lifetime Access
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              {
                q: 'Can I try before I buy?',
                a: 'Yes! Our free tier is fully functional with 10 patterns. You can also start a 14-day free trial of any paid plan.'
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards, PayPal, and bank transfers through our payment partner Gumroad.'
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Absolutely. No contracts, no commitments. Cancel with one click and you won\'t be charged again.'
              },
              {
                q: 'Is my data safe?',
                a: '100% safe. All processing happens in your browser. We never see, store, or transmit your log data.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="group p-4 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
                <summary className="font-medium text-gray-900 dark:text-white cursor-pointer list-none flex items-center justify-between">
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* Trust Signals */}
        <div className="text-center mt-12 text-sm text-gray-500 dark:text-gray-400">
          <p>🔒 Secure payments via Gumroad • 💳 No credit card required for free tier • ↩️ 30-day money-back guarantee</p>
        </div>
      </div>
    </div>
  );
}

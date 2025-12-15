// src/components/Pricing.jsx
// Pricing page with correct pricing, smooth animations, and consistent UI

import { useState } from 'react';
import { 
  Check, X, Sparkles, Star, Crown, Users, Building2, 
  Gift, Lock, CreditCard, MessageCircle, Zap, ArrowRight,
  Clock, Terminal, Code2
} from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

// ============================================
// PRICING STRUCTURE (Final - Dec 2025)
// ============================================
// Free:    $0        | 20/mo    | 5K chars    | 10 patterns
// Starter: $9/mo     | 200/mo   | 25K chars   | 40+ patterns
// Pro:     $15/mo    | 1000/mo  | 100K chars  | 70+ patterns
// Team:    $39/mo    | 5000/mo  | Unlimited   | All patterns
// LTD:     $199      | Pro features forever

const PLANS = [
  {
    name: 'Free',
    price: 0,
    period: 'forever',
    description: 'Perfect for trying out LogShield',
    icon: Sparkles,
    color: 'slate',
    features: [
      '20 sanitizations/month',
      '5,000 characters/sanitization',
      '10 basic patterns',
      'Copy to clipboard'
    ],
    limitations: [
      'No export options',
      'No AI entropy detection'
    ],
    cta: 'Get Started',
    tier: 'free',
    popular: false
  },
  {
    name: 'Starter',
    price: 9,
    annualPrice: 79,
    period: '/month',
    description: 'For individual developers',
    icon: Star,
    color: 'blue',
    features: [
      '200 sanitizations/month',
      '25,000 characters/sanitization',
      '40+ detection patterns',
      'Export as TXT/CSV',
      'Batch upload support',
      'Email support'
    ],
    limitations: [],
    cta: 'Start Free Trial',
    tier: 'starter',
    popular: false
  },
  {
    name: 'Pro',
    price: 15,
    annualPrice: 129,
    period: '/month',
    description: 'For power users & teams',
    icon: Crown,
    color: 'purple',
    features: [
      '1,000 sanitizations/month',
      '100,000 characters/sanitization',
      '70+ detection patterns',
      'AI entropy detection',
      'All export formats',
      'Custom patterns (soon)',
      'CLI tool access (soon)',
      'Priority support'
    ],
    limitations: [],
    cta: 'Go Pro',
    tier: 'pro',
    popular: true
  },
  {
    name: 'Team',
    price: 39,
    annualPrice: 349,
    period: '/month',
    description: 'For organizations',
    icon: Users,
    color: 'emerald',
    features: [
      '5,000 sanitizations/month',
      'Unlimited characters',
      'All 70+ patterns',
      'Team dashboard',
      'SSO integration (soon)',
      'Audit logs',
      'Dedicated support',
      'SLA guarantee'
    ],
    limitations: [],
    cta: 'Contact Sales',
    tier: 'team',
    popular: false
  }
];

// ============================================
// ANIMATIONS (CSS-in-JS)
// ============================================
const styles = `
  @keyframes breathing-glow {
    0%, 100% { box-shadow: 0 0 20px 0 rgba(139, 92, 246, 0.3); }
    50% { box-shadow: 0 0 40px 5px rgba(139, 92, 246, 0.4); }
  }
  
  @keyframes rotate-border {
    0% { --angle: 0deg; }
    100% { --angle: 360deg; }
  }
  
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .pro-card {
    animation: breathing-glow 3s ease-in-out infinite;
    position: relative;
  }
  
  .pro-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: conic-gradient(from var(--angle, 0deg), #8b5cf6, #3b82f6, #8b5cf6);
    border-radius: 1rem;
    z-index: -1;
    animation: rotate-border 4s linear infinite;
  }
  
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }
  
  .ltd-shimmer {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    background-size: 200% 100%;
    animation: shimmer 2s linear infinite;
  }
  
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .card-hover:hover {
    transform: translateY(-4px);
  }
  
  .btn-glow:hover {
    box-shadow: 0 0 20px rgba(139, 92, 246, 0.4);
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.6s ease-out forwards;
    opacity: 0;
  }
  
  .animation-delay-100 { animation-delay: 0.1s; }
  .animation-delay-200 { animation-delay: 0.2s; }
  .animation-delay-300 { animation-delay: 0.3s; }
  .animation-delay-400 { animation-delay: 0.4s; }
`;

export default function Pricing({ onUpgrade, license }) {
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const currentTier = license?.tier || 'free';

  const handleUpgrade = (tier) => {
    if (onUpgrade) {
      onUpgrade(tier);
    } else {
      // Default: open Gumroad checkout
      window.open(`https://logshield.gumroad.com/l/${tier}`, '_blank');
    }
  };

  const getPrice = (plan) => {
    if (plan.price === 0) return '$0';
    if (billingPeriod === 'annual' && plan.annualPrice) {
      return `$${plan.annualPrice}`;
    }
    return `$${plan.price}`;
  };

  const getPeriod = (plan) => {
    if (plan.price === 0) return 'forever';
    return billingPeriod === 'annual' ? '/year' : '/month';
  };

  const getSavings = (plan) => {
    if (!plan.annualPrice || plan.price === 0) return null;
    const monthlyTotal = plan.price * 12;
    const savings = Math.round((1 - plan.annualPrice / monthlyTotal) * 100);
    return savings > 0 ? `Save ${savings}%` : null;
  };

  return (
    <section id="pricing" className="py-16 lg:py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Inject animations */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-12 animate-fade-in-up">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300">
            <Star className="h-3 w-3 mr-1" />
            Simple Pricing
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            Start free, upgrade when you need more. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                billingPeriod === 'monthly'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annual')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                billingPeriod === 'annual'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="px-1.5 py-0.5 text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded">
                Save 25%+
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentTier === plan.tier;
            const isPro = plan.tier === 'pro';
            const savings = billingPeriod === 'annual' ? getSavings(plan) : null;
            
            return (
              <Card 
                key={plan.name}
                className={`relative p-6 flex flex-col card-hover animate-fade-in-up animation-delay-${(index + 1) * 100} ${
                  isPro 
                    ? 'pro-card bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 text-white border-0' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg px-3 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  isPro 
                    ? 'bg-gradient-to-br from-purple-500 to-blue-500' 
                    : plan.color === 'slate' ? 'bg-slate-100 dark:bg-slate-700'
                    : plan.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50'
                    : plan.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/50'
                    : 'bg-purple-100 dark:bg-purple-900/50'
                }`}>
                  <Icon className={`h-6 w-6 ${
                    isPro 
                      ? 'text-white' 
                      : plan.color === 'slate' ? 'text-slate-600 dark:text-slate-400'
                      : plan.color === 'blue' ? 'text-blue-600 dark:text-blue-400'
                      : plan.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-purple-600 dark:text-purple-400'
                  }`} />
                </div>

                {/* Plan Name & Price */}
                <h3 className={`text-xl font-bold mb-1 ${isPro ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${isPro ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                    {getPrice(plan)}
                  </span>
                  <span className={`text-sm ${isPro ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                    {getPeriod(plan)}
                  </span>
                </div>

                {/* Savings Badge */}
                {savings && (
                  <Badge className="w-fit mb-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400">
                    {savings}
                  </Badge>
                )}
                
                <p className={`text-sm mb-6 ${isPro ? 'text-slate-300' : 'text-slate-600 dark:text-slate-400'}`}>
                  {plan.description}
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        isPro ? 'text-purple-400' : 'text-emerald-500 dark:text-emerald-400'
                      }`} />
                      <span className={`text-sm ${isPro ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                  {plan.limitations?.map((limitation) => (
                    <li key={limitation} className="flex items-start gap-2">
                      <X className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                        isPro ? 'text-slate-500' : 'text-slate-400 dark:text-slate-500'
                      }`} />
                      <span className={`text-sm ${isPro ? 'text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => !isCurrentPlan && handleUpgrade(plan.tier)}
                  disabled={isCurrentPlan}
                  className={`w-full transition-all duration-300 ${
                    isPro 
                      ? 'bg-white text-slate-900 hover:bg-slate-100 btn-glow' 
                      : isCurrentPlan
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                  }`}
                >
                  {isCurrentPlan ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    <>
                      {plan.cta}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Lifetime Deal Section */}
        <div className="max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-500">
          <Card className="relative overflow-hidden p-8 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-amber-900/20 border-amber-200 dark:border-amber-800">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-200/30 to-orange-200/30 dark:from-amber-500/10 dark:to-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-500/10 dark:to-amber-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Gift className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Lifetime Deal
                    </h3>
                    <Badge className="ltd-shimmer bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                      Early Bird
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    One-time payment, lifetime access to Pro features
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    $199
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    <span className="line-through">$228/year</span>
                    <span className="text-emerald-600 dark:text-emerald-400 ml-2">Save forever</span>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleUpgrade('lifetime')}
                  size="lg"
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Lifetime Access
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* LTD Benefits */}
            <div className="relative z-10 mt-6 pt-6 border-t border-amber-200 dark:border-amber-800 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Check, text: 'All Pro features' },
                { icon: Clock, text: 'Lifetime updates' },
                { icon: Zap, text: 'Priority support' },
                { icon: Lock, text: 'No recurring fees' }
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <Icon className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  {text}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Trust Signals */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto mb-12">
          {[
            { icon: Lock, title: '100% Private', description: 'All processing happens in your browser. Your logs never leave your device.', color: 'blue' },
            { icon: CreditCard, title: 'Cancel Anytime', description: 'No contracts, no commitments. Cancel your subscription whenever you want.', color: 'emerald' },
            { icon: MessageCircle, title: 'Real Support', description: 'Get help from a real human developer, not a chatbot.', color: 'purple' }
          ].map((signal) => (
            <Card key={signal.title} className="p-6 text-center card-hover bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-4 ${
                signal.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/50'
                : signal.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/50'
                : 'bg-purple-100 dark:bg-purple-900/50'
              }`}>
                <signal.icon className={`h-6 w-6 ${
                  signal.color === 'blue' ? 'text-blue-600 dark:text-blue-400'
                  : signal.color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-purple-600 dark:text-purple-400'
                }`} />
              </div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{signal.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {signal.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-2">
            Need more volume or custom deployment?
          </p>
          <a 
            href="mailto:hello@logshield.dev?subject=Enterprise%20Inquiry" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Contact us for Enterprise pricing
          </a>
        </div>
      </div>
    </section>
  );
}

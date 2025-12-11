// src/components/Pricing.jsx
import { Check, Zap, Star, Users, Crown } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export default function Pricing({ onUpgrade, license }) {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for trying out LogShield',
      icon: Zap,
      color: 'text-gray-600 dark:text-gray-400',
      bg: 'bg-gray-100 dark:bg-slate-700',
      features: [
        '10 sanitizations/month',
        '10,000 characters/sanitization',
        '10 basic patterns',
        'Copy to clipboard',
        'Community support'
      ],
      limitations: [
        'No export options',
        'No AI detection',
        'No priority support'
      ],
      cta: 'Current Plan',
      tier: 'free',
      popular: false
    },
    {
      name: 'Starter',
      price: '$7',
      period: '/month',
      description: 'For individual developers',
      icon: Star,
      color: 'text-blue-600 dark:text-blue-400',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      features: [
        '100 sanitizations/month',
        '50,000 characters/sanitization',
        '40+ patterns',
        'Export as TXT/JSON',
        'Email support',
        'Usage analytics'
      ],
      limitations: [],
      cta: 'Get Started',
      tier: 'starter',
      popular: false
    },
    {
      name: 'Pro',
      price: '$19',
      period: '/month',
      description: 'For power users & teams',
      icon: Crown,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      features: [
        'Unlimited sanitizations',
        '500,000 characters/sanitization',
        '70+ patterns',
        'AI entropy detection',
        'All export formats',
        'Priority email support',
        'Custom patterns (coming soon)',
        'API access (coming soon)'
      ],
      limitations: [],
      cta: 'Go Pro',
      tier: 'pro',
      popular: true
    },
    {
      name: 'Team',
      price: '$79',
      period: '/month',
      description: 'For organizations',
      icon: Users,
      color: 'text-green-600 dark:text-green-400',
      bg: 'bg-green-100 dark:bg-green-900/30',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Team dashboard',
        'SSO integration (coming soon)',
        'Audit logs',
        'Dedicated support',
        'Custom branding',
        'SLA guarantee'
      ],
      limitations: [],
      cta: 'Contact Sales',
      tier: 'team',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 lg:py-32">
      <div className="container">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge variant="primary" className="mb-6">
            <Star className="h-3 w-3 mr-1" />
            Simple Pricing
          </Badge>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Choose Your{' '}
            <span className="gradient-text">Plan</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Start free, upgrade when you need more. No hidden fees.
          </p>
        </div>

        {/* Pricing grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon;
            const isCurrentPlan = license?.tier === plan.tier;
            
            return (
              <Card 
                key={plan.name}
                className={`relative p-6 flex flex-col ${
                  plan.popular 
                    ? 'ring-2 ring-purple-500 dark:ring-purple-400' 
                    : ''
                }`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="secondary" className="shadow-lg">
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Plan icon */}
                <div className={`w-12 h-12 rounded-xl ${plan.bg} flex items-center justify-center mb-4`}>
                  <Icon className={`h-6 w-6 ${plan.color}`} />
                </div>

                {/* Plan name & price */}
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {plan.name}
                </h3>
                
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-3xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {plan.period}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  {plan.description}
                </p>

                {/* Features list */}
                <ul className="space-y-3 mb-6 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  onClick={() => !isCurrentPlan && onUpgrade(plan.tier)}
                  disabled={isCurrentPlan}
                  variant={plan.popular ? 'primary' : 'outline'}
                  className="w-full"
                >
                  {isCurrentPlan ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Current Plan
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </Card>
            );
          })}
        </div>

        {/* Lifetime deal */}
        <div className="mt-12 max-w-3xl mx-auto">
          <Card className="p-8 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
                  <Crown className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Lifetime Deal
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    One-time payment, lifetime access to Pro features
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white">
                    $199
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 line-through">
                    $228/year
                  </div>
                </div>
                
                <Button
                  onClick={() => onUpgrade('lifetime')}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                >
                  Get Lifetime Access
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* FAQ or trust signals */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            All plans include secure, client-side processing. Your data never leaves your browser.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              Cancel anytime
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              No credit card for free tier
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-4 w-4 text-green-500" />
              14-day money-back guarantee
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

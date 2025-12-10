// src/components/Pricing.jsx
import { Check, Zap, Crown, Users, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export default function Pricing({ onUpgrade, license }) {
  const plans = [
    {
      name: 'Free',
      tier: 'free',
      icon: Zap,
      price: 0,
      period: 'forever',
      description: 'Perfect for trying out LogShield',
      features: [
        '3,000 characters/session',
        '5 uses per month',
        '10 basic patterns',
        'Client-side only',
        'Community support'
      ],
      limitations: [
        'No AI detection',
        'No export features',
        'Watermark on output'
      ],
      cta: 'Current Plan',
      popular: false,
      color: 'gray'
    },
    {
      name: 'Starter',
      tier: 'starter',
      icon: Sparkles,
      price: 7,
      period: 'month',
      description: 'For individual developers',
      features: [
        '10,000 characters/session',
        '50 uses per month',
        '30+ patterns',
        'PDF/CSV export',
        'Remove watermark',
        'Email support'
      ],
      limitations: [
        'No AI detection',
        'No API access'
      ],
      cta: 'Get Started',
      popular: false,
      color: 'blue'
    },
    {
      name: 'Pro',
      tier: 'pro',
      icon: Crown,
      price: 19,
      period: 'month',
      description: 'For professional developers',
      features: [
        'Unlimited characters',
        'Unlimited uses',
        '70+ advanced patterns',
        'AI entropy detection',
        'Batch processing',
        'All export formats',
        'Custom patterns',
        'Priority support'
      ],
      limitations: [],
      cta: 'Upgrade to Pro',
      popular: true,
      color: 'purple',
      badge: 'Most Popular'
    },
    {
      name: 'Team',
      tier: 'team',
      icon: Users,
      price: 79,
      period: 'month',
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        '5 team seats',
        'Shared pattern library',
        'Usage analytics',
        'REST API access',
        'SSO (Google/GitHub)',
        'Team billing',
        'Dedicated support'
      ],
      limitations: [],
      cta: 'Get Team Plan',
      popular: false,
      color: 'green'
    }
  ];

  const lifetime = {
    name: 'Lifetime Deal',
    tier: 'lifetime',
    icon: Crown,
    price: 199,
    period: 'one-time',
    description: 'Pay once, use forever',
    features: [
      'Everything in Team',
      'Lifetime access',
      'All future updates',
      'White-label option',
      'Self-hosted version',
      'No recurring fees',
      'Priority features',
      'VIP support'
    ],
    cta: 'Get Lifetime Access',
    popular: false,
    color: 'yellow',
    badge: 'Limited Time'
  };

  const colorSchemes = {
    gray: {
      badge: 'bg-gray-100 text-gray-800',
      button: 'bg-gray-600 hover:bg-gray-700',
      border: 'border-gray-200',
      icon: 'text-gray-600'
    },
    blue: {
      badge: 'bg-blue-100 text-blue-800',
      button: 'bg-blue-600 hover:bg-blue-700',
      border: 'border-blue-200',
      icon: 'text-blue-600'
    },
    purple: {
      badge: 'bg-purple-100 text-purple-800',
      button: 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700',
      border: 'border-purple-200',
      icon: 'text-purple-600'
    },
    green: {
      badge: 'bg-green-100 text-green-800',
      button: 'bg-green-600 hover:bg-green-700',
      border: 'border-green-200',
      icon: 'text-green-600'
    },
    yellow: {
      badge: 'bg-yellow-100 text-yellow-800',
      button: 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700',
      border: 'border-yellow-200',
      icon: 'text-yellow-600'
    }
  };

  const isCurrentPlan = (tier) => license && license.tier === tier;

  return (
    <div className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="container">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-blue-100 text-blue-800">
            Pricing Plans
          </Badge>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h2>
          
          <p className="text-xl text-gray-600">
            Start free, upgrade anytime. No credit card required for free tier.
          </p>
        </div>

        {/* Regular Plans */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {plans.map((plan) => {
            const colors = colorSchemes[plan.color];
            const Icon = plan.icon;
            
            return (
              <Card
                key={plan.tier}
                className={`relative p-6 ${
                  plan.popular
                    ? 'ring-2 ring-purple-500 shadow-xl scale-105'
                    : 'shadow-md hover:shadow-lg'
                } transition-all duration-300`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className={colors.badge}>
                      {plan.badge}
                    </Badge>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Icon & Name */}
                  <div className="space-y-2">
                    <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${colors.icon === 'text-gray-600' ? 'from-gray-100 to-gray-200' : colors.icon === 'text-blue-600' ? 'from-blue-100 to-blue-200' : colors.icon === 'text-purple-600' ? 'from-purple-100 to-purple-200' : 'from-green-100 to-green-200'}`}>
                      <Icon className={`h-6 w-6 ${colors.icon}`} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600">
                      /{plan.period}
                    </span>
                  </div>

                  {/* CTA */}
                  <Button
                    onClick={() => isCurrentPlan(plan.tier) ? null : onUpgrade(plan.tier)}
                    disabled={isCurrentPlan(plan.tier)}
                    className={`w-full ${
                      isCurrentPlan(plan.tier)
                        ? 'bg-gray-200 text-gray-700 cursor-not-allowed'
                        : colors.button
                    }`}
                  >
                    {isCurrentPlan(plan.tier) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Current Plan
                      </>
                    ) : (
                      plan.cta
                    )}
                  </Button>

                  {/* Features */}
                  <div className="space-y-3 pt-4 border-t">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">
                          {feature}
                        </span>
                      </div>
                    ))}
                    
                    {plan.limitations.length > 0 && (
                      <>
                        <div className="border-t pt-3 mt-3">
                          {plan.limitations.map((limitation, i) => (
                            <div key={i} className="flex items-start gap-3 opacity-50">
                              <span className="text-sm text-gray-500">
                                {limitation}
                              </span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Lifetime Deal */}
        <Card className="p-8 bg-gradient-to-r from-yellow-50 via-orange-50 to-yellow-50 border-2 border-yellow-200">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-3 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500">
                  <lifetime.icon className="h-8 w-8 text-white" />
                </div>
                
                <div>
                  {lifetime.badge && (
                    <Badge className="mb-1 bg-yellow-100 text-yellow-800">
                      {lifetime.badge} - Save $420/year
                    </Badge>
                  )}
                  <h3 className="text-3xl font-bold text-gray-900">
                    {lifetime.name}
                  </h3>
                </div>
              </div>

              <p className="text-xl text-gray-700">
                {lifetime.description}
              </p>

              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  ${lifetime.price}
                </span>
                <span className="text-gray-600 text-lg">
                  {lifetime.period}
                </span>
              </div>

              <Button
                onClick={() => onUpgrade(lifetime.tier)}
                size="lg"
                className="w-full md:w-auto bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
              >
                <Crown className="mr-2 h-5 w-5" />
                {lifetime.cta}
              </Button>

              <p className="text-sm text-gray-600">
                🎉 Limited time offer - Regular price $499
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {lifetime.features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-3 bg-white rounded-lg border border-yellow-200"
                >
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* FAQ or Comparison */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4">
            Have questions? <a href="mailto:hello@logshield.dev" className="text-blue-600 hover:underline">Contact us</a>
          </p>
          <p className="text-sm text-gray-500">
            All plans include 14-day money-back guarantee ? Secure payment via Paddle
          </p>
        </div>
      </div>
    </div>
  );
}
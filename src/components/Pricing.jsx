// src/components/Pricing.jsx
// Last updated: December 2025
//
// ==========================================
// PRICING STRUCTURE (Final)
// ==========================================
// Free:      $0       | 20/mo    | 5K chars    | 10 patterns
// Starter:   $9/mo    | 200/mo   | 25K chars   | 40+ patterns
// Pro:       $15/mo   | 1000/mo  | 100K chars  | 70+ patterns
// Team:      $39/mo   | 5000/mo  | Unlimited   | All patterns
// LTD:       $199     | 1000/mo  | 100K chars  | Pro features
//
// Annual: Starter $79, Pro $129, Team $349
// LTD Incremental: $199 → $249 → $279 → $299 (500 cap)
// ==========================================

import React, { useState } from 'react'
import { 
  Check, X, Sparkles, Star, Zap, Crown, Users, Building2, 
  Clock, Terminal, Code2, FileJson, Gift, Lock, CreditCard, 
  MessageCircle, ArrowRight, Infinity
} from 'lucide-react'

// ==========================================
// Animation Styles (CSS-in-JS)
// ==========================================
const animationStyles = `
  /* Breathing glow for Pro card */
  @keyframes breathing-glow {
    0%, 100% {
      box-shadow: 
        0 0 20px rgba(139, 92, 246, 0.2),
        0 0 40px rgba(59, 130, 246, 0.1),
        0 25px 50px -12px rgba(0, 0, 0, 0.15);
    }
    50% {
      box-shadow: 
        0 0 30px rgba(139, 92, 246, 0.3),
        0 0 60px rgba(59, 130, 246, 0.2),
        0 25px 50px -12px rgba(0, 0, 0, 0.2);
    }
  }

  /* Rotating border gradient */
  @property --angle {
    syntax: '<angle>';
    initial-value: 0deg;
    inherits: false;
  }

  @keyframes rotate-border {
    0% { --angle: 0deg; }
    100% { --angle: 360deg; }
  }

  /* Shimmer effect for LTD badge */
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }

  /* Fade in up */
  @keyframes fade-in-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* Scale in */
  @keyframes scale-in {
    0% {
      opacity: 0;
      transform: scale(0.95);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Pro card special styling */
  .pro-card {
    position: relative;
    animation: breathing-glow 3s ease-in-out infinite;
  }

  .pro-card::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 1.1rem;
    padding: 2px;
    background: conic-gradient(
      from var(--angle),
      #3b82f6,
      #8b5cf6,
      #ec4899,
      #8b5cf6,
      #3b82f6
    );
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: rotate-border 4s linear infinite;
  }

  /* LTD shimmer badge */
  .ltd-shimmer {
    background: linear-gradient(
      90deg,
      #f59e0b 0%,
      #fbbf24 25%,
      #f59e0b 50%,
      #fbbf24 75%,
      #f59e0b 100%
    );
    background-size: 200% auto;
    animation: shimmer 3s linear infinite;
  }

  /* Staggered animations */
  .animate-fade-in-up {
    animation: fade-in-up 0.5s ease-out forwards;
  }

  .animation-delay-100 { animation-delay: 0.1s; opacity: 0; }
  .animation-delay-200 { animation-delay: 0.2s; opacity: 0; }
  .animation-delay-300 { animation-delay: 0.3s; opacity: 0; }
  .animation-delay-400 { animation-delay: 0.4s; opacity: 0; }

  /* Smooth hover transitions */
  .card-hover {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .card-hover:hover {
    transform: translateY(-4px);
  }

  /* Button hover effect */
  .btn-glow:hover {
    box-shadow: 0 0 20px rgba(59, 130, 246, 0.4);
  }
`

const Pricing = ({ onUpgrade }) => {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out LogShield',
      icon: Sparkles,
      iconColor: 'text-slate-500 dark:text-slate-400',
      iconBg: 'bg-slate-100 dark:bg-slate-700',
      price: { monthly: 0, annual: 0 },
      highlight: false,
      cta: 'Get Started Free',
      ctaStyle: 'secondary',
      tier: 'free',
      features: [
        { text: '20 sanitizations/month', included: true },
        { text: '5,000 characters/sanitization', included: true },
        { text: '10 basic patterns', included: true },
        { text: 'Copy to clipboard', included: true },
        { text: 'Single file upload', included: true },
        { text: '100% client-side processing', included: true },
        { text: 'Export options', included: false },
        { text: 'Custom patterns', included: false },
      ],
      limits: { sanitizations: '20/mo', characters: '5K', patterns: '10' }
    },
    {
      name: 'Starter',
      description: 'For individual developers',
      icon: Star,
      iconColor: 'text-blue-500 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      price: { monthly: 9, annual: 79 },
      highlight: false,
      cta: 'Start with Starter',
      ctaStyle: 'secondary',
      tier: 'starter',
      features: [
        { text: '200 sanitizations/month', included: true },
        { text: '25,000 characters/sanitization', included: true },
        { text: '40+ detection patterns', included: true },
        { text: 'Export as TXT/JSON', included: true },
        { text: 'Email support', included: true },
        { text: 'Usage analytics', included: true },
        { text: 'Custom patterns', included: false },
        { text: 'CLI tool', included: false },
      ],
      limits: { sanitizations: '200/mo', characters: '25K', patterns: '40+' }
    },
    {
      name: 'Pro',
      description: 'For power users & freelancers',
      icon: Crown,
      iconColor: 'text-purple-400',
      iconBg: 'bg-purple-500/20',
      price: { monthly: 15, annual: 129 },
      highlight: true,
      badge: 'Most Popular',
      cta: 'Go Pro',
      ctaStyle: 'primary',
      tier: 'pro',
      features: [
        { text: '1,000 sanitizations/month', included: true },
        { text: '100,000 characters/sanitization', included: true },
        { text: '70+ detection patterns', included: true },
        { text: 'AI entropy detection', included: true },
        { text: 'All export formats', included: true },
        { text: 'Priority email support', included: true },
        { text: 'Custom patterns', included: true, comingSoon: true },
        { text: 'CLI tool', included: true, comingSoon: true },
      ],
      limits: { sanitizations: '1K/mo', characters: '100K', patterns: '70+' }
    },
    {
      name: 'Team',
      description: 'For teams & organizations',
      icon: Users,
      iconColor: 'text-emerald-500 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/30',
      price: { monthly: 39, annual: 349 },
      highlight: false,
      cta: 'Start Team Trial',
      ctaStyle: 'secondary',
      tier: 'team',
      features: [
        { text: '5,000 sanitizations/month', included: true },
        { text: 'Unlimited characters', included: true },
        { text: 'All detection patterns', included: true },
        { text: 'Everything in Pro', included: true },
        { text: 'Up to 5 team seats', included: true },
        { text: 'Dedicated support', included: true },
        { text: 'Team dashboard', included: true, comingSoon: true },
        { text: 'SSO integration', included: true, comingSoon: true },
      ],
      limits: { sanitizations: '5K/mo', characters: 'Unlimited', patterns: 'All' }
    },
  ]

  const getPrice = (plan) => {
    if (plan.price.monthly === 0) return 'Free'
    const price = isAnnual ? plan.price.annual : plan.price.monthly
    return `$${price}`
  }

  const getPeriod = (plan) => {
    if (plan.price.monthly === 0) return 'forever'
    return isAnnual ? '/year' : '/month'
  }

  const getSavings = (plan) => {
    if (plan.price.monthly === 0) return null
    const annualMonthly = plan.price.annual / 12
    return Math.round((1 - annualMonthly / plan.price.monthly) * 100)
  }

  const getMonthlyEquivalent = (plan) => {
    if (plan.price.monthly === 0 || !isAnnual) return null
    return Math.round(plan.price.annual / 12)
  }

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      <style>{animationStyles}</style>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Simple Pricing
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Plan
            </span>
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-3 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-full transition-colors duration-300">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                !isAnnual
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                isAnnual
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Annual
              <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Save 20%+
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {plans.map((plan, index) => {
            const Icon = plan.icon
            const savings = getSavings(plan)
            const monthlyEquiv = getMonthlyEquivalent(plan)

            return (
              <div
                key={plan.name}
                className={`
                  animate-fade-in-up animation-delay-${(index + 1) * 100}
                  ${plan.highlight ? 'pro-card' : ''}
                `}
              >
                <div
                  className={`
                    relative h-full rounded-2xl p-6 transition-all duration-300 card-hover
                    ${plan.highlight
                      ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 text-white'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl'
                    }
                  `}
                >
                  {/* Popular Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg">
                        <Zap className="w-3 h-3" />
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-4">
                    <div className={`inline-flex p-2.5 rounded-xl mb-3 ${plan.iconBg} transition-colors duration-300`}>
                      <Icon className={`w-6 h-6 ${plan.iconColor}`} />
                    </div>
                    <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                      {plan.name}
                    </h3>
                    <p className={`text-sm ${plan.highlight ? 'text-slate-300' : 'text-slate-500 dark:text-slate-400'}`}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {getPrice(plan)}
                      </span>
                      <span className={`text-sm ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {getPeriod(plan)}
                      </span>
                    </div>
                    {isAnnual && savings && (
                      <p className={`text-sm mt-1 ${plan.highlight ? 'text-emerald-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                        ${monthlyEquiv}/mo &middot; Save {savings}%
                      </p>
                    )}
                  </div>

                  {/* Quick Limits */}
                  <div className={`
                    grid grid-cols-3 gap-1 mb-4 p-2.5 rounded-lg transition-colors duration-300
                    ${plan.highlight ? 'bg-white/5' : 'bg-slate-50 dark:bg-slate-700/50'}
                  `}>
                    <div className="text-center">
                      <div className={`text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Uses</div>
                      <div className={`text-xs font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {plan.limits.sanitizations}
                      </div>
                    </div>
                    <div className="text-center border-x border-slate-200/20 dark:border-slate-600/30">
                      <div className={`text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Chars</div>
                      <div className={`text-xs font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {plan.limits.characters}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className={`text-xs ${plan.highlight ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>Patterns</div>
                      <div className={`text-xs font-bold ${plan.highlight ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {plan.limits.patterns}
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => onUpgrade?.(plan.tier)}
                    className={`
                      w-full py-2.5 px-4 rounded-xl font-semibold text-sm mb-4 
                      transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]
                      ${plan.ctaStyle === 'primary'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25 btn-glow'
                        : plan.highlight
                          ? 'bg-white text-slate-900 hover:bg-slate-100'
                          : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                      }
                    `}
                  >
                    {plan.cta}
                  </button>

                  {/* Features List */}
                  <ul className="space-y-2">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        {feature.included ? (
                          <Check className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-emerald-400' : 'text-emerald-500'}`} />
                        ) : (
                          <X className={`w-4 h-4 flex-shrink-0 mt-0.5 ${plan.highlight ? 'text-slate-600' : 'text-slate-300 dark:text-slate-600'}`} />
                        )}
                        <span className={`text-xs ${
                          feature.included
                            ? plan.highlight ? 'text-slate-200' : 'text-slate-700 dark:text-slate-300'
                            : plan.highlight ? 'text-slate-500' : 'text-slate-400 dark:text-slate-500'
                        }`}>
                          {feature.text}
                          {feature.comingSoon && (
                            <span className={`
                              ml-1.5 inline-flex items-center gap-0.5 text-xs px-1.5 py-0.5 rounded
                              ${plan.highlight 
                                ? 'bg-amber-500/20 text-amber-300' 
                                : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'}
                            `}>
                              <Clock className="w-2.5 h-2.5" />
                              Soon
                            </span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        {/* Coming Soon Features */}
        <div className="mb-8 animate-fade-in-up animation-delay-400">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 lg:p-8 border border-blue-100 dark:border-blue-800 transition-colors duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <h3 className="font-semibold text-slate-900 dark:text-white">Coming Soon to Pro & Team</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                  We're actively building these features. Pro & Team subscribers will get them automatically when released.
                </p>
                <div className="flex flex-wrap gap-3">
                  <FeatureBadge icon={Terminal} text="CLI Tool" eta="Q1 2026" />
                  <FeatureBadge icon={FileJson} text="Batch Processing" eta="Q1 2026" />
                  <FeatureBadge icon={Code2} text="Custom Patterns" eta="Q1 2026" />
                </div>
              </div>
              <div className="lg:text-right">
                <a 
                  href="#roadmap" 
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-300"
                >
                  View full roadmap
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Lifetime Deal */}
        <div className="mb-12 animate-fade-in-up animation-delay-400">
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 lg:p-8 border border-amber-200 dark:border-amber-800 transition-colors duration-300">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-200/30 dark:from-amber-500/10 dark:to-orange-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-200/30 to-yellow-200/30 dark:from-amber-500/10 dark:to-yellow-500/10 rounded-full blur-3xl" />
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Gift className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Lifetime Deal</h3>
                    <span className="ltd-shimmer inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold text-white">
                      <Sparkles className="w-3 h-3" />
                      Limited
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">
                    One-time payment, lifetime access to Pro features. Only 500 slots available.
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-slate-900 dark:text-white">$199</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400 line-through">$299</span>
                  </div>
                  <div className="text-sm text-amber-600 dark:text-amber-400 font-medium">
                    Early bird price
                  </div>
                </div>
                
                <button
                  onClick={() => onUpgrade?.('lifetime')}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Get Lifetime Access
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* LTD Benefits */}
            <div className="relative mt-6 pt-6 border-t border-amber-200 dark:border-amber-800 grid sm:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">1,000 sanitizations/mo</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">100K characters</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">All Pro features</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span className="text-sm text-slate-700 dark:text-slate-300">Lifetime updates</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Signals */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <TrustSignal 
            icon={Lock}
            iconBg="bg-blue-100 dark:bg-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            title="100% Private"
            description="All processing happens in your browser. Your logs never leave your device."
          />
          <TrustSignal 
            icon={CreditCard}
            iconBg="bg-emerald-100 dark:bg-emerald-900/30"
            iconColor="text-emerald-600 dark:text-emerald-400"
            title="Cancel Anytime"
            description="No contracts, no commitments. Cancel your subscription whenever you want."
          />
          <TrustSignal 
            icon={MessageCircle}
            iconBg="bg-purple-100 dark:bg-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            title="Real Support"
            description="Get help from a real human developer, not a chatbot."
          />
        </div>

        {/* Enterprise Callout */}
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400 mb-3">
            Need more volume or custom deployment?
          </p>
          <a 
            href="mailto:enterprise@logshield.dev?subject=Enterprise Inquiry" 
            className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-300"
          >
            <Building2 className="w-4 h-4" />
            Contact us for Enterprise pricing
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

// ==========================================
// Helper Components
// ==========================================

const FeatureBadge = ({ icon: Icon, text, eta }) => (
  <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-800 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors duration-300">
    <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{text}</span>
    <span className="text-xs text-slate-400 dark:text-slate-500">{eta}</span>
  </div>
)

const TrustSignal = ({ icon: Icon, iconBg, iconColor, title, description }) => (
  <div className="text-center p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600">
    <div className="flex justify-center mb-4">
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center transition-colors duration-300`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
    </div>
    <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{title}</h4>
    <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>
)

export default Pricing

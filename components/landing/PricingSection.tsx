'use client'

import React, { useState } from 'react'
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export const PricingSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [isAnnual, setIsAnnual] = useState(true)

  const plans = [
    {
      name: 'Starter Depot',
      tagline: 'Ideal for single-facility operations beginning inventory recovery',
      priceMonthly: '₹4,999',
      priceAnnual: '₹3,999',
      period: '/ month',
      popular: false,
      features: [
        'Up to 500 active SKU tracking',
        'Single warehouse location',
        'Automated 0–100 Risk Engine',
        'Standard B2B Buyer Matching',
        'CSV batch import with validation',
        'Email notifications & alerts',
      ],
      cta: 'Start 14-Day Trial',
    },
    {
      name: 'Growth Multi-Hub',
      tagline: 'For expanding distributors & multi-depot manufacturing facilities',
      priceMonthly: '₹14,999',
      priceAnnual: '₹11,999',
      period: '/ month',
      popular: true,
      features: [
        'Up to 5,000 active SKU tracking',
        'Up to 5 warehouse locations',
        'Auditable multi-signal risk index',
        'Priority counterparty buyer matching',
        'Recovery Center (Sell/Transfer/Discount)',
        'Grounded AI Assistant chat',
        'Immutable movement audit loggers',
      ],
      cta: 'Start Growth Trial',
    },
    {
      name: 'Enterprise Custom',
      tagline: 'Tailored for enterprise OEMs, large supply networks & corporate ERPs',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      period: '',
      popular: false,
      features: [
        'Unlimited SKUs & multi-tenant orgs',
        'Direct SAP, Oracle & ERP connectors',
        'Private B2B buyer liquidity pool',
        'Dedicated account liquidation broker',
        'Custom Scope-3 sustainability reports',
        '99.9% SLA & 24/7 dedicated engineering',
      ],
      cta: 'Contact Enterprise Sales',
    },
  ]

  return (
    <section id="pricing" className="py-24 px-6 bg-zinc-50/60 dark:bg-zinc-900/30 border-y border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Predictable SaaS Pricing</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Simple tiers that pay for themselves on lot one.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            One successful surplus liquidation recovers multiple years of platform subscription value.
          </p>

          {/* Billing Switch */}
          <div className="pt-4 flex items-center justify-center gap-3 text-xs font-semibold">
            <span className={!isAnnual ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>Monthly</span>
            <button
              type="button"
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative h-6 w-12 rounded-full bg-zinc-200 dark:bg-zinc-800 p-0.5 transition-colors focus:outline-none"
            >
              <div
                className={`h-5 w-5 rounded-full bg-[#0D9488] shadow-sm transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={isAnnual ? 'text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
              Annual <span className="text-[#0D9488] font-bold">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`rounded-3xl border p-8 flex flex-col justify-between transition-all ${
                p.popular
                  ? 'border-[#0D9488] bg-white dark:bg-zinc-950 shadow-xl ring-2 ring-[#0D9488]/30 relative'
                  : 'border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 shadow-xs'
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0D9488] px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Most Popular
                </div>
              )}

              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{p.name}</h3>
                <p className="text-xs text-zinc-500 mt-1 min-h-[32px]">{p.tagline}</p>

                <div className="mt-6 mb-6">
                  <span className="text-3xl sm:text-4xl font-black font-mono text-zinc-900 dark:text-zinc-100">
                    {isAnnual ? p.priceAnnual : p.priceMonthly}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-[#0D9488] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={onGetStarted}
                className={`mt-8 w-full rounded-full py-3 text-xs font-bold transition-all shadow-sm ${
                  p.popular
                    ? 'bg-[#0D9488] hover:bg-[#0F9D8D] text-white shadow-teal-600/20'
                    : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100'
                }`}
              >
                {p.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

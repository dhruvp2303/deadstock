'use client'

import React, { useState } from 'react'
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Building2,
  ShoppingBag,
  Percent,
  Truck,
  RotateCcw,
  Zap,
  HelpCircle,
} from 'lucide-react'

export const PricingSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [roleMode, setRoleMode] = useState<'seller' | 'buyer'>('seller')
  const [isAnnual, setIsAnnual] = useState(true)
  const [dealValuation, setDealValuation] = useState<number>(300000)

  // Deal Economics Formula (Official DeadStock Model)
  const sellerFeePercent = 1.0 // 1%
  const buyerFeePercent = 0.5 // 0.5%
  const listingCommitmentFee = 299 // ₹299
  const rawSellerFee = Math.round(dealValuation * (sellerFeePercent / 100))
  const netSellerFee = Math.max(0, rawSellerFee - listingCommitmentFee)
  const rawBuyerFee = Math.round(dealValuation * (buyerFeePercent / 100))
  const totalPlatformRev = rawSellerFee + rawBuyerFee
  const netSellerRecovery = dealValuation - netSellerFee

  const sellerPlans = [
    {
      name: 'Seller Free',
      tagline: 'Basic discovery & risk evaluation for single warehouse testing',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      period: '/ month',
      popular: false,
      badge: 'ZERO RISK DISCOVERY',
      features: [
        'Up to 100 active SKU tracking',
        'Basic AI risk decay scoring',
        '3 active marketplace listings',
        'Standard B2B buyer matching',
        'Standard transaction fee (1.0%)',
        'Community email support',
      ],
      cta: 'Start for Free',
    },
    {
      name: 'Seller Business',
      tagline: 'For active distributors, factories & multi-depot inventory managers',
      priceMonthly: '₹999',
      priceAnnual: '₹799',
      period: '/ month',
      popular: true,
      badge: 'MOST POPULAR FOR SELLERS',
      features: [
        'Unlimited active SKU tracking',
        'Real-time AI risk analysis engine',
        'Unlimited marketplace lot listings',
        '100% Listing fee credit on deal closing',
        'Priority high-compatibility buyer matching',
        'Bulk CSV & ERP inventory importer',
        'Lower transaction fee (0.75%)',
        'Full B2B Deal Room & Escrow access',
      ],
      cta: 'Start Business Plan',
    },
    {
      name: 'Seller Enterprise',
      tagline: 'Custom infrastructure for large enterprise OEMs & multi-plant supply chains',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      period: '',
      popular: false,
      badge: 'ENTERPRISE OEMS',
      features: [
        'Multi-company & multi-warehouse network',
        'Direct SAP, Tally & Oracle ERP sync',
        'Custom transaction fee caps for large lots',
        'Dedicated liquidation deal broker',
        'Custom Scope-3 circular emission audits',
        '24/7 dedicated account engineering & SLA',
      ],
      cta: 'Contact Enterprise Sales',
    },
  ]

  const buyerPlans = [
    {
      name: 'Buyer Free',
      tagline: 'Search, discover & source verified surplus lots without barrier',
      priceMonthly: '₹0',
      priceAnnual: '₹0',
      period: '/ month',
      popular: false,
      badge: 'FREE FOREVER',
      features: [
        'Full surplus catalog browsing',
        'Search by product, SKU, location, specs',
        'Submit direct B2B buyer offers',
        'Basic deal matching notifications',
        'Standard buyer platform fee (0.5%)',
      ],
      cta: 'Start Sourcing Free',
    },
    {
      name: 'Buyer Pro',
      tagline: 'For industrial procurement managers looking for priority discount lots',
      priceMonthly: '₹499',
      priceAnnual: '₹399',
      period: '/ month',
      popular: true,
      badge: 'FOR PROCUREMENT TEAMS',
      features: [
        'AI Visual Product Search (Image-to-Stock)',
        'Custom sourcing requirements broadcasts',
        'Instant alerts on matching surplus stock',
        'AI price intelligence & market benchmark',
        'Reduced buyer platform fee (0.25%)',
        'Priority counter-proposal negotiations',
        'Verified Buyer Credibility Badge',
      ],
      cta: 'Get Buyer Pro',
    },
    {
      name: 'Enterprise Sourcing',
      tagline: 'Tailored for enterprise procurement desks & contract manufacturers',
      priceMonthly: 'Custom',
      priceAnnual: 'Custom',
      period: '',
      popular: false,
      badge: 'STRATEGIC CONTRACTS',
      features: [
        'Multi-user corporate procurement team',
        'Automated BOM (Bill of Materials) bulk matching',
        'Dedicated surplus sourcing manager',
        'Consolidated monthly corporate billing',
        'Third-party material testing & QC reports',
      ],
      cta: 'Contact Procurement Desk',
    },
  ]

  const plans = roleMode === 'seller' ? sellerPlans : buyerPlans

  return (
    <section id="pricing" className="py-24 px-6 bg-zinc-50/60 dark:bg-zinc-900/30 border-y border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>DeadStock Revenue & Subscription Model</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-tight">
            Fair, low-take pricing that pays for itself on deal one.
          </h2>

          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Keep discovery free. Make sellers commit a small anti-spam deposit. Charge low success fees only when a deal creates value.
          </p>

          {/* Toggle: Seller vs Buyer */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <div className="inline-flex rounded-full p-1 bg-zinc-200/70 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700">
              <button
                type="button"
                onClick={() => setRoleMode('seller')}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  roleMode === 'seller'
                    ? 'bg-[#0D9488] text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Seller Recovery Plans</span>
              </button>
              <button
                type="button"
                onClick={() => setRoleMode('buyer')}
                className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold transition-all ${
                  roleMode === 'buyer'
                    ? 'bg-[#0D9488] text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Buyer Sourcing Plans</span>
              </button>
            </div>
          </div>
        </div>

        {/* 1. Subscription Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-3xl border p-7 flex flex-col justify-between transition-all bg-white dark:bg-zinc-950 ${
                plan.popular
                  ? 'border-[#0D9488] shadow-2xl ring-2 ring-[#0D9488]/20 relative scale-[1.02]'
                  : 'border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#0D9488] px-3.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm whitespace-nowrap shrink-0">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{plan.name}</h3>
                  <p className="text-xs text-zinc-500 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
                      {isAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-xs text-zinc-400">{plan.period}</span>
                  </div>
                  {isAnnual && plan.priceAnnual !== '₹0' && plan.priceAnnual !== 'Custom' && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">
                      Billed annually (Save 20%)
                    </span>
                  )}
                </div>

                <ul className="space-y-2.5 pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-zinc-600 dark:text-zinc-300">
                      <Check className="h-4 w-4 text-[#0D9488] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onGetStarted}
                  className={`w-full rounded-full py-2.5 text-xs font-bold transition-all ${
                    plan.popular
                      ? 'bg-[#0D9488] hover:bg-[#0F9D8D] text-white shadow-md hover:shadow-teal-500/20'
                      : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* 2. Interactive Revenue & Deal Economics Calculator (Section 2 & 13) */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  Interactive Deal Room Economics Calculator
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                  LOW-FEE B2B MODEL
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                See exactly how low transaction fees, anti-spam listing credits, and value recovery work in practice.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500">Sample Deal:</span>
              <span suppressHydrationWarning className="font-mono text-base font-bold text-[#0D9488]">
                ₹{dealValuation.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-zinc-500 font-semibold">
              <span>₹50,000 Lot</span>
              <span>₹3,00,000 Standard Deal</span>
              <span>₹20,00,000 Multi-Truck Deal</span>
            </div>
            <input
              type="range"
              min={50000}
              max={2000000}
              step={25000}
              value={dealValuation}
              onChange={(e) => setDealValuation(Number(e.target.value))}
              className="w-full accent-[#0D9488] cursor-pointer h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg"
            />
          </div>

          {/* 4-Column Live Metric Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Seller Net Recovery</span>
              <span suppressHydrationWarning className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                ₹{netSellerRecovery.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-zinc-500 block">Agreed deal minus 1% net fee</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Listing Commitment Credit</span>
              <span suppressHydrationWarning className="text-xl font-black font-mono text-emerald-600 block">
                -₹{listingCommitmentFee}
              </span>
              <span className="text-[10px] text-emerald-600 block font-medium">100% credited on deal close</span>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-zinc-400 block">Buyer Platform Fee (0.5%)</span>
              <span suppressHydrationWarning className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-100 block">
                +₹{rawBuyerFee.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-zinc-500 block">Includes escrow & deal room</span>
            </div>

            <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-950/20 p-4 space-y-1">
              <span className="text-[10px] font-bold uppercase text-[#0D9488] block">DeadStock Platform Revenue</span>
              <span suppressHydrationWarning className="text-xl font-black font-mono text-[#0D9488] block">
                ₹{totalPlatformRev.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-zinc-500 block">~1.5% combined value take</span>
            </div>
          </div>
        </div>

        {/* 3. Optional Premium Services Menu (Section 4, 7, 8) */}
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Optional Premium Marketplace Services
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Pay only for additional visibility, logistics fulfillment, or physical on-site inspections.
              </p>
            </div>
            <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-3 py-1 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
              OPTIONAL ADD-ONS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Featured Listing Boost</span>
                <span className="font-mono font-bold text-[#0D9488]">₹199–₹999</span>
              </div>
              <p className="text-[11px] text-zinc-500">Top-of-catalog placement & badge for 3x buyer impressions.</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Priority Buyer Match</span>
                <span className="font-mono font-bold text-[#0D9488]">₹299+</span>
              </div>
              <p className="text-[11px] text-zinc-500">Direct algorithmic outreach to top 10 manufacturing buyers.</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">On-Site QC Inspection</span>
                <span className="font-mono font-bold text-[#0D9488]">₹499+</span>
              </div>
              <p className="text-[11px] text-zinc-500">Third-party warehouse count, packaging & batch verification.</p>
            </div>

            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/30 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-zinc-900 dark:text-zinc-100">DeadStock Freight</span>
                <span className="font-mono font-bold text-[#0D9488]">Margin Fee</span>
              </div>
              <p className="text-[11px] text-zinc-500">Insured multi-modal freight transport with GPS telemetry.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

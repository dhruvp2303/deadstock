'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Check } from 'lucide-react'

const PLANS = [
  {
    name: 'Basic',
    desc: 'Suitable for small businesses and individual sellers.',
    priceMonthly: '₹0',
    priceYearly: '₹0',
    subtitle: '/Month',
    features: [
      'Up to 50 listings',
      'Standard buyer matching',
      'Email support',
      'CSV import',
      'Basic analytics',
    ],
    notIncluded: ['Priority placement', 'Dedicated account manager', 'Custom logistics'],
    cta: 'Get Started Free',
    dark: false,
  },
  {
    name: 'Pro Plan',
    desc: 'Ideal for Growing Businesses. Designed for frequent shippers and mid-sized sellers.',
    priceMonthly: '₹4,999',
    priceYearly: '₹3,999',
    subtitle: '/Month',
    features: [
      'Unlimited listings',
      'AI-powered buyer matching',
      'Up to 50 shipments/month',
      'Real-time tracking with alerts',
      'Dedicated account manager',
      '24/7 Customer Assistance',
    ],
    notIncluded: ['Custom logistics solutions'],
    cta: 'Unlock Pro Plan',
    dark: true,
    popular: true,
  },
  {
    name: 'Enterprise',
    desc: 'Large-Scale Operations. Comprehensive solutions for high-volume shippers.',
    priceMonthly: 'Custom',
    priceYearly: 'Custom',
    subtitle: '',
    features: [
      'Unlimited shipments',
      'Real-time tracking with alerts',
      'Custom logistics solutions',
      'Priority support and analytics',
      'White-label option',
      'ERP & SAP integration',
    ],
    notIncluded: [],
    cta: 'Contact Sales',
    dark: false,
  },
]

export const DSPricing: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [yearly, setYearly] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="pricing" ref={sectionRef} className="py-20 sm:py-28 px-6 bg-[#F8FAFC] scroll-mt-28 border-t border-gray-100">
      <div className="max-w-[1360px] mx-auto space-y-14">

        {/* Header + toggle */}
        <div className={`text-center max-w-2xl mx-auto space-y-4 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-2 block">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B1E2D] tracking-tight">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            No hidden commissions. Scale your inventory recovery with predictable plans.
          </p>

          {/* Monthly/Yearly toggle pill */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-gray-200/70 border border-gray-300">
              <button
                type="button"
                onClick={() => setYearly(false)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${!yearly ? 'bg-white shadow-sm text-[#0B1E2D]' : 'text-gray-500 hover:text-black'}`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setYearly(true)}
                className={`px-5 py-2 rounded-full text-xs font-bold transition-all ${yearly ? 'bg-white shadow-sm text-[#0B1E2D]' : 'text-gray-500 hover:text-black'}`}
              >
                Yearly <span className="text-emerald-600 text-xs font-extrabold ml-1">-20%</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Pricing Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {PLANS.map((plan, i) => (
            <div
              key={plan.name}
              className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 shadow-md ${
                plan.dark
                  ? 'bg-[#0B1E2D] text-white shadow-2xl ring-2 ring-blue-500/50'
                  : 'bg-white text-[#0B1E2D] border border-gray-200 hover:shadow-xl'
              }`}
              style={{
                transitionDelay: `${i * 80}ms`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              <div>
                {plan.popular ? (
                  <div className="mb-4">
                    <span className="px-3.5 py-1 rounded-full text-[10px] font-black tracking-widest bg-blue-600 text-white uppercase shadow-sm">
                      Most Popular
                    </span>
                  </div>
                ) : (
                  <div className="h-6 mb-4" />
                )}

                <h3 className={`text-2xl font-black mb-1.5 ${plan.dark ? 'text-white' : 'text-[#0B1E2D]'}`}>
                  {plan.name}
                </h3>
                <p className={`text-xs leading-relaxed mb-6 min-h-[36px] ${plan.dark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {plan.desc}
                </p>

                <div className={`pb-6 mb-6 border-b flex items-baseline gap-1 ${plan.dark ? 'border-white/10' : 'border-gray-100'}`}>
                  <span className={`text-4xl sm:text-5xl font-black tracking-tight ${plan.dark ? 'text-white' : 'text-[#0B1E2D]'}`}>
                    {yearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  {plan.subtitle && (
                    <span className={`text-xs font-semibold ${plan.dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      {plan.subtitle}
                    </span>
                  )}
                </div>

                <div>
                  <p className={`text-[10px] font-bold tracking-widest uppercase mb-4 ${plan.dark ? 'text-gray-400' : 'text-gray-400'}`}>
                    Key Features:
                  </p>
                  <ul className="space-y-3 mb-4">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-xs sm:text-sm">
                        <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.dark ? 'text-teal-400' : 'text-blue-600'}`} />
                        <span className={plan.dark ? 'text-gray-200' : 'text-gray-700'}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={onGetStarted}
                className={`mt-8 w-full rounded-full py-3.5 text-xs sm:text-sm font-bold transition-all shadow-md hover:scale-105 ${
                  plan.dark
                    ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-blue-500/30'
                    : 'bg-[#0A0A0A] text-white hover:bg-[#1E293B]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export const PricingSection = DSPricing
export default DSPricing


'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Factory,
  Cpu,
  Car,
  ShoppingBag,
  Truck,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

export const IndustriesSection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [selectedIndustry, setSelectedIndustry] = useState(0)

  const verticals = [
    {
      id: 0,
      title: 'Precision Manufacturing',
      icon: Factory,
      tagline: 'Raw polymers, custom fasteners, stampings, and tooling leftovers',
      benefits: [
        'Recover value from unallocated raw polymers, resin batches, and alloy sheets',
        'Match custom batch runs with regional tier-2 subcontractors',
        'Eliminate factory floor pallet congestion without distressed auction prices',
      ],
      caseStudy: 'Precision Engineering Firm recovered ₹14.8L in stranded polymer stock within 9 days.',
    },
    {
      id: 1,
      title: 'Electronics & PCB',
      icon: Cpu,
      tagline: 'SMD components, microcontroller boards, connectors, and passives',
      benefits: [
        'Protect against rapid obsolescence when firmware specs deprecate',
        'Liquidate full reel lots with verified date codes and ESD handling proof',
        'Connect with IoT and prototyping labs seeking genuine surplus ICs',
      ],
      caseStudy: 'Electronics OEM matched 1,200 microcontroller sub-assemblies at 90% book valuation.',
    },
    {
      id: 2,
      title: 'Automotive Components',
      icon: Car,
      tagline: 'Machined parts, wiring harnesses, gaskets, and chassis hardware',
      benefits: [
        'Offload excess OEM assembly batches following seasonal model changeovers',
        'Maintain multi-tier warehouse balance across regional depot hubs',
        'Ensure compliant trace logs with immutable movement reference IDs',
      ],
      caseStudy: 'Auto Component Vendor cleared 8,200 high-tensile fasteners to Pune assemblers.',
    },
    {
      id: 3,
      title: 'Wholesale & Industrial Supply',
      icon: Truck,
      tagline: 'Standard MRO supplies, safety gear, bearings, and hydraulic lines',
      benefits: [
        'Move slow-turning bulk catalog items to high-demand geographic markets',
        'Avoid distributor return penalties with peer-to-peer B2B matching',
        'Automated batch upload via CSV with row-by-row data sanitization',
      ],
      caseStudy: 'Distributor improved recovery margin by 34% compared to traditional brokers.',
    },
    {
      id: 4,
      title: 'Packaging & Cartons',
      icon: ShoppingBag,
      tagline: 'Corrugated boxes, bubble wraps, strapping, and custom containers',
      benefits: [
        'Liquidate bulk seasonal overruns occupying high warehouse cubic volume',
        'Flash sale lots to regional e-commerce fulfillment centers',
        'Divert corrugated material from premature recycling shredders',
      ],
      caseStudy: 'Packaging Hub transferred 12,000 cartons to logistics centers in 72 hours.',
    },
  ]

  const current = verticals[selectedIndustry]
  const CurrentIcon = current.icon

  return (
    <section id="industries" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
          <Factory className="h-3.5 w-3.5" />
          <span>Industry Solutions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Tailored across industrial verticals
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          From high-tech PCB controllers to heavy manufacturing surplus, DeadStock adapts to your sector's specific turnover dynamics.
        </p>
      </div>

      {/* Vertical Selector Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {verticals.map((v, idx) => {
          const Icon = v.icon
          const isSelected = selectedIndustry === idx
          return (
            <button
              key={v.title}
              type="button"
              onClick={() => setSelectedIndustry(idx)}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-md ring-1 ring-zinc-400'
                  : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{v.title}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Vertical Detail View */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-4">
            <div className="h-12 w-12 rounded-2xl bg-teal-500/10 text-[#0D9488] flex items-center justify-center">
              <CurrentIcon className="h-6 w-6" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              {current.title}
            </h3>
            <p className="text-xs sm:text-sm text-zinc-500 font-medium">
              {current.tagline}
            </p>

            <ul className="space-y-3 pt-2 text-xs sm:text-sm text-zinc-700 dark:text-zinc-300">
              {current.benefits.map((b) => (
                <li key={b} className="flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-[#0D9488] shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
              >
                <span>Recover {current.title} Inventory</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-teal-500/20 bg-teal-50/40 dark:bg-teal-950/20 p-6 space-y-3 shadow-inner">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D9488] block">
                Representative Case Study
              </span>
              <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                "{current.caseStudy}"
              </p>
              <div className="pt-2 border-t border-teal-500/20 text-xs text-zinc-500 flex items-center justify-between">
                <span>Verified Match Outcome</span>
                <span className="font-mono font-bold text-[#0D9488]">Zero Landfill Loss</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

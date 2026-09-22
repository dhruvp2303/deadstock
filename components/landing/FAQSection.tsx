'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle } from 'lucide-react'

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      q: 'What is DeadStock?',
      a: 'DeadStock is an AI-powered B2B inventory recovery and surplus matching platform. When inventory slows or stops moving, DeadStock calculates financial exposure, finds verified business buyers, dynamically prices lots, and executes liquidation before stock becomes a total loss.',
    },
    {
      q: 'How does DeadStock detect dead inventory?',
      a: 'We use an auditable multi-signal risk index (0–100) combining Supply Velocity Decay (35%), Inventory Aging (25%), Forward Demand Trend (20%), and Component Obsolescence/Shelf-life milestones (20%). This produces plain-English explanations tailored to each specific SKU.',
    },
    {
      q: 'How does buyer matching work?',
      a: 'DeadStock evaluates compatibility between your at-risk inventory lot and buyer profiles across 5 weighted dimensions: Product Compatibility (30%), Quantity Fit (25%), Industry Sector (20%), Geographic Proximity (15%), and Price Alignment (10%).',
    },
    {
      q: 'Can I import my existing inventory via CSV or Excel?',
      a: 'Yes. DeadStock includes a 3-step CSV import engine that parses your file, performs row-by-row validation, highlights formatting issues, and automatically runs the AI risk analysis in the background upon confirmation.',
    },
    {
      q: 'What recovery channels does DeadStock recommend?',
      a: 'The Recovery Center simultaneously compares 5 options: Sell to Matched B2B Buyer, Transfer to Another Branch Depot, Discount Flash Sale on Public Catalog, Return to Supplier, or Circular Material Recycling.',
    },
    {
      q: 'Does DeadStock support multiple warehouses and branch depots?',
      a: 'Yes. DeadStock is built with enterprise multi-location support. You can track stock across separate depots (e.g. Ahmedabad, Surat, Bengaluru, Pune) and evaluate inter-branch inventory transfers.',
    },
    {
      q: 'How does the B2B surplus marketplace work?',
      a: 'Sellers can list batches with verified condition grades and asking prices. Buyers can browse, filter by warehouse location/price, and submit custom quantity/price bids. Sellers can accept, counter, or decline in real time.',
    },
    {
      q: 'Is DeadStock suitable for manufacturing and component suppliers?',
      a: 'Absolutely. DeadStock is tailored specifically for discrete manufacturing, PCB & electronics, automotive components, polymer moldings, and industrial supplies where MOQs and long lead times frequently generate excess inventory.',
    },
    {
      q: 'How does the AI assistant work and is my data private?',
      a: 'DeadStock AI answers operational questions by querying your company’s active inventory and transaction databases. It uses strict multi-tenant isolation and never shares your proprietary data with external parties.',
    },
    {
      q: 'How is recovered value and sustainability calculated?',
      a: 'Recovered value represents the exact capital preserved through executed transactions. Sustainability metrics track units diverted from scrap and calculate landfill tonnage avoided using Scope-3 circular economy guidelines.',
    },
  ]

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
      <div className="text-center mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Everything you need to know
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500">
          Have additional questions about enterprise integrations? Our technical team is available 24/7.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx
          return (
            <div
              key={faq.q}
              className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-2xs transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(idx)}
                className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-zinc-900 dark:text-zinc-100 hover:text-[#0D9488] transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`h-4 w-4 text-zinc-400 shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#0D9488]' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-zinc-100 dark:border-zinc-900 px-5 pb-5 pt-3"
                  >
                    <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </section>
  )
}

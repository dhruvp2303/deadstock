'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react'

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
      a: 'DeadStock AI answers operational questions by querying your company\'s active inventory and transaction databases. It uses strict multi-tenant isolation and never shares your proprietary data with external parties.',
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
    <section
      id="faq"
      className="relative py-28 px-6 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A1628] via-[#0B1D35] to-[#0A1628]" />
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-blue-600/6 rounded-full blur-[140px]" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-xs font-semibold text-blue-400"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Frequently Asked Questions</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white"
          >
            Everything you need to know
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-xs sm:text-sm text-slate-400"
          >
            Have additional questions about enterprise integrations? Our technical team is available 24/7.
          </motion.p>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04 }}
                className={`rounded-2xl border overflow-hidden transition-all duration-300 ${
                  isOpen
                    ? 'border-blue-500/40 bg-gradient-to-b from-blue-500/6 to-[#0D2244]/80 shadow-[0_8px_24px_rgba(37,99,235,0.1)]'
                    : 'border-white/8 bg-[#0D2244]/60 hover:border-white/15'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare
                      className={`h-4 w-4 shrink-0 transition-colors ${isOpen ? 'text-blue-400' : 'text-slate-500'}`}
                    />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                      className="border-t border-blue-500/15 px-5 pb-5 pt-3 ml-[28px]"
                    >
                      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

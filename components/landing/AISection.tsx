'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  Send,
  BrainCircuit,
  Building2,
  AlertTriangle,
  CheckCircle2,
  DollarSign,
  Layers3,
} from 'lucide-react'

export const AISection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [selectedPrompt, setSelectedPrompt] = useState<number>(0)

  const promptConversations = [
    {
      prompt: 'Which inventory vertical has the highest dead-stock risk right now?',
      response: 'Based on your active warehouse data, Electronics & Controls carries the highest risk at ₹6.4L (94% Critical Risk). The primary driver is component obsolescence on SKU PCB-401 with over 5.8 months of supply buffer remaining.',
      highlight: 'Electronics & Controls • SKU: PCB-401 • ₹6.4L Exposure',
      suggestedAction: 'Match with IoT & Instrument Manufacturers in Bengaluru',
    },
    {
      prompt: 'Find active B2B buyers for our 4,500 units of Polymer Connectors (PC2048)',
      response: 'I discovered 3 verified counterparties. Top match: ElectroTech Industries in Ahmedabad (93% compatibility) with immediate purchasing requirement for 3,000 units at ₹36.50/unit (₹1.65L deal value).',
      highlight: 'ElectroTech Industries (93% Match) • ₹1.65L Liquidation Deal',
      suggestedAction: 'Dispatch Direct Offer with 1-Click Execution',
    },
    {
      prompt: 'What is our circular sustainability impact if we liquidate surplus cabling?',
      response: 'Liquidating 3,500 units of Industrial Shielded Cable (CAB-902) will avoid 3.2 tons of landfill scrap and preserve ₹4.41L in working capital, contributing directly to your Scope-3 circular recovery rating.',
      highlight: '3.2 Tons Waste Avoided • Scope-3 Certified • ₹4.41L Capital Saved',
      suggestedAction: 'Route to Pune Manufacturing Cluster',
    },
  ]

  const current = promptConversations[selectedPrompt]

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left Column: Context */}
        <div className="lg:col-span-5 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
            <BrainCircuit className="h-3.5 w-3.5" />
            <span>Grounded Enterprise Intelligence</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Ask DeadStock what to recover next.
          </h2>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Unlike generic chatbots, DeadStock's AI assistant is strictly grounded in your actual inventory quantities, holding durations, warehouse locations, and buyer matching databases.
          </p>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block">
              Try Interactive Queries
            </span>
            {promptConversations.map((item, idx) => (
              <button
                key={item.prompt}
                type="button"
                onClick={() => setSelectedPrompt(idx)}
                className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                  selectedPrompt === idx
                    ? 'border-[#0D9488] bg-teal-50/50 dark:bg-teal-950/40 font-semibold text-zinc-900 dark:text-zinc-100 shadow-2xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                }`}
              >
                "{item.prompt}"
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Interactive Chat Interface View */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-[#0D9488] flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">DeadStock AI Assistant</h4>
                  <span className="text-[10px] text-zinc-400 font-mono">Grounded across 5 SKUs & 3 Buyer Records</span>
                </div>
              </div>

              <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-mono font-bold text-emerald-600">
                Grounded Mode Active
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="space-y-4">
              {/* User Query Bubble */}
              <div className="flex justify-end">
                <div className="max-w-md rounded-2xl rounded-tr-xs bg-zinc-900 dark:bg-zinc-100 px-4 py-3 text-xs text-white dark:text-zinc-900 font-medium shadow-xs">
                  {current.prompt}
                </div>
              </div>

              {/* AI Response Bubble */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.prompt}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col gap-3"
                >
                  <div className="max-w-lg rounded-2xl rounded-tl-xs border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed shadow-inner">
                    <p>{current.response}</p>

                    <div className="mt-3 p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-teal-500/20 text-[11px] font-mono font-bold text-[#0D9488] dark:text-[#14B8A6]">
                      {current.highlight}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-500/20 text-xs">
                    <span className="text-zinc-600 dark:text-zinc-400 text-[11px]">
                      Recommended Action: <strong>{current.suggestedAction}</strong>
                    </span>
                    <button
                      type="button"
                      onClick={onGetStarted}
                      className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-3.5 py-1 text-[11px] font-bold text-white shadow-xs shrink-0"
                    >
                      Execute
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Mock input bar */}
            <div className="relative pt-2">
              <input
                type="text"
                disabled
                placeholder="Ask about inventory aging, buyers, or recovery..."
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-3 pl-4 pr-10 text-xs text-zinc-400 cursor-not-allowed"
              />
              <div className="absolute right-3 top-5 text-zinc-400">
                <Send className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit,
  TrendingDown,
  Users,
  DollarSign,
  Recycle,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react'

export const FeatureShowcase: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState<'risk' | 'demand' | 'matching' | 'pricing' | 'recovery'>('risk')

  return (
    <section id="features" className="py-24 px-6 bg-zinc-50/60 dark:bg-zinc-900/30 border-y border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Deep Platform Intelligence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Engineered for enterprise surplus recovery
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Explore the core technology pillars that turn idle warehouse inventory into liquid working capital.
          </p>
        </div>

        {/* Feature Tab Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'risk', label: 'AI Risk Engine', icon: BrainCircuit },
            { id: 'demand', label: 'Demand Prediction', icon: TrendingDown },
            { id: 'matching', label: 'Buyer Matching', icon: Users },
            { id: 'pricing', label: 'Smart Pricing', icon: DollarSign },
            { id: 'recovery', label: 'Recovery Center', icon: Recycle },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0D9488] text-white shadow-md shadow-teal-600/20'
                    : 'bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Feature Station View */}
        <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-xl">
          <AnimatePresence mode="wait">
            {activeTab === 'risk' && (
              <motion.div
                key="risk"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <span className="rounded-md bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                    CRITICAL RISK DETECTION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Auditable 0–100 Mathematical Risk Index
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    DeadStock continuously computes an explainable multi-signal risk index factoring supply velocity, batch aging, demand decay, and obsolescence milestones.
                  </p>
                  <ul className="space-y-2 text-xs text-zinc-600 dark:text-zinc-400">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                      <span>Supply Velocity Weight (35%) — detects early consumption drop-offs</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                      <span>Aging Decay Curve (25%) — tracks warehouse storage holding cost creep</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                      <span>Plain-English Reasoning — generated dynamically from real SKU numbers</span>
                    </li>
                  </ul>
                </div>

                <div className="lg:col-span-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-mono font-bold text-zinc-400">SKU: PC2048</span>
                      <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">Plastic Connector 20mm</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-black font-mono text-rose-600">87%</span>
                      <span className="block text-[10px] text-zinc-400 font-bold uppercase">Critical Band</span>
                    </div>
                  </div>

                  {/* Visual Risk Gauge */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-zinc-500">
                      <span>Low (0-30%)</span>
                      <span>Medium (31-60%)</span>
                      <span>High (61-80%)</span>
                      <span className="font-bold text-rose-600">Critical (81-100%)</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden flex">
                      <div className="w-[30%] bg-emerald-500 opacity-30" />
                      <div className="w-[30%] bg-yellow-500 opacity-30" />
                      <div className="w-[20%] bg-amber-500 opacity-30" />
                      <div className="w-[20%] bg-rose-500 relative">
                        <div className="absolute right-2 top-0 bottom-0 w-1 bg-white rounded-full animate-ping" />
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-white dark:bg-zinc-950 p-3.5 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-zinc-100 block mb-1">Generated Explanation:</strong>
                    "Stock is 4.1x expected demand with 11 months aging. Velocity decreased 62% over the last quarter. Liquidation action recommended."
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'demand' && (
              <motion.div
                key="demand"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <span className="rounded-md bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    DEMAND DECAY PREDICTION
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Current Stock vs Forward Run-rate
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Compare warehouse lot sizes against actual monthly depletion to discover months-of-supply overhangs before capital locks permanently.
                  </p>
                  <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <span className="text-xs font-mono font-bold text-[#0D9488]">30+ Months of Stock Remaining</span>
                    <p className="text-xs text-zinc-500 mt-1">
                      At current run-rate of 150 units/month, 4,500 units will incur ₹48,000 in compound storage before standard depletion.
                    </p>
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-5">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Current Warehouse Stock</span>
                      <span className="font-mono font-bold">4,500 Units (₹1.8L)</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-rose-500 w-[90%]" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      <span>Expected Monthly Demand</span>
                      <span className="font-mono font-bold">1,100 Units</span>
                    </div>
                    <div className="h-4 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[24%]" />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 flex justify-between">
                    <span>Overhang Ratio: <strong className="text-amber-600 font-mono">4.1x Normal</strong></span>
                    <span>Depletion Horizon: <strong className="text-rose-600 font-mono">30.2 Months</strong></span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'matching' && (
              <motion.div
                key="matching"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <span className="rounded-md bg-teal-500/10 px-2.5 py-1 text-xs font-bold text-[#0D9488] dark:text-[#14B8A6] border border-teal-500/20">
                    B2B MATCHING ENGINE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Ranked Counterparty Scoring
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Our multi-factor matching engine evaluates Product Compatibility (30%), Quantity Fit (25%), Industry Match (20%), Location Proximity (15%), and Price Alignment (10%).
                  </p>
                  <button
                    type="button"
                    onClick={onGetStarted}
                    className="inline-flex items-center gap-2 rounded-full bg-[#0D9488] px-5 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    <span>Connect with Matched Buyers</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="lg:col-span-6 space-y-3">
                  {[
                    { name: 'ElectroTech Industries', match: 93, units: 3000, city: 'Ahmedabad', val: '₹1.65L', color: 'emerald' },
                    { name: 'Nova Components Ltd.', match: 87, units: 2500, city: 'Bengaluru', val: '₹1.42L', color: 'teal' },
                    { name: 'Apex Controls & Drives', match: 79, units: 4000, city: 'Pune', val: '₹1.80L', color: 'indigo' },
                  ].map((buyer) => (
                    <div
                      key={buyer.name}
                      className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 flex items-center justify-between shadow-2xs hover:border-[#0D9488] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-teal-500/10 text-[#0D9488] flex items-center justify-center font-bold font-mono text-xs">
                          {buyer.match}%
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{buyer.name}</h4>
                          <span className="text-[11px] text-zinc-400 font-mono">{buyer.city} • Sourcing: {buyer.units.toLocaleString()} units</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#0D9488] dark:text-[#14B8A6]">{buyer.val}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'pricing' && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    SMART PRICING MATRIX
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Dynamic Recovery Range Estimates
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Avoid false-precision guesses. Smart pricing produces a data-driven range based on original manufacturing cost, current velocity, buyer demand urgency, and lot condition.
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                      <span className="text-zinc-400 block text-[11px]">Original Unit Cost</span>
                      <span className="font-mono font-bold text-base text-zinc-900 dark:text-zinc-100">₹40.00</span>
                    </div>
                    <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/20">
                      <span className="text-teal-700 dark:text-teal-400 block text-[11px] font-semibold">Recommended Point Price</span>
                      <span className="font-mono font-bold text-base text-[#0D9488] dark:text-[#14B8A6]">₹36.50 / unit</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">Preserved Capital Range</span>
                    <span className="font-mono text-sm font-bold text-[#0D9488]">₹1.45L – ₹1.72L</span>
                  </div>

                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Quick Liquidation (2-4 days)</span>
                      <span className="font-mono font-semibold">₹32.00 / unit (80% recovery)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-teal-600 dark:text-teal-400 font-bold">Optimal B2B Match (7-14 days)</span>
                      <span className="font-mono font-bold text-[#0D9488]">₹36.50 / unit (92% recovery)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-zinc-500">Targeted Private Bid (30 days)</span>
                      <span className="font-mono font-semibold">₹38.20 / unit (95% recovery)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'recovery' && (
              <motion.div
                key="recovery"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
              >
                <div className="lg:col-span-6 space-y-4">
                  <span className="rounded-md bg-indigo-500/10 px-2.5 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                    RECOVERY CENTER
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    Side-by-Side Multi-Channel Execution
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Compare 5 strategic recovery avenues simultaneously. DeadStock models the financial return and operational timeline for each option.
                  </p>
                  <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                    <li>• <strong>Sell</strong> — Liquidate directly to matched manufacturing buyer</li>
                    <li>• <strong>Transfer</strong> — Relocate to active branch warehouse depot</li>
                    <li>• <strong>Discount</strong> — Flash sale on public surplus catalog</li>
                    <li>• <strong>Return</strong> — Supplier restock under agreed vendor terms</li>
                    <li>• <strong>Recycle</strong> — Certified circular material reclamation</li>
                  </ul>
                </div>

                <div className="lg:col-span-6 space-y-2.5">
                  {[
                    { title: 'Sell (B2B Match)', recovery: '₹1.65L (92%)', time: '7-14 days', recommended: true },
                    { title: 'Transfer (Ahmedabad Depot)', recovery: '₹1.53L (85%)', time: '3-5 days', recommended: false },
                    { title: 'Discount Flash Sale', recovery: '₹1.35L (75%)', time: '2-4 days', recommended: false },
                    { title: 'Circular Scrap Recycle', recovery: '₹63,000 (35%)', time: '1-3 days', recommended: false },
                  ].map((chan) => (
                    <div
                      key={chan.title}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between text-xs ${
                        chan.recommended
                          ? 'border-[#0D9488] bg-teal-50/50 dark:bg-teal-950/30'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{chan.title}</span>
                        {chan.recommended && (
                          <span className="rounded bg-teal-500/15 px-2 py-0.2 text-[10px] font-bold text-[#0D9488]">
                            AI Best Match
                          </span>
                        )}
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{chan.recovery}</span>
                        <span className="text-[10px] text-zinc-400">{chan.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

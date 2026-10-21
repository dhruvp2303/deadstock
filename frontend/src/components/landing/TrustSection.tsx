'use client'

import React from 'react'
import { ShieldCheck, Lock, Factory, Cpu, Car, ShoppingBag, Truck, Wrench, PackageCheck } from 'lucide-react'

export const TrustSection: React.FC = () => {
  const industries = [
    { name: 'Precision Manufacturing', icon: Factory },
    { name: 'Electronics & PCB', icon: Cpu },
    { name: 'Automotive Components', icon: Car },
    { name: 'Industrial Supplies', icon: Wrench },
    { name: 'Wholesale Logistics', icon: Truck },
    { name: 'Packaging Materials', icon: PackageCheck },
  ]

  return (
    <section className="border-y border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Tag */}
        <div className="text-center space-y-1">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#0D9488] dark:text-[#14B8A6]">
            Engineered For Modern Supply Chains
          </p>
          <h3 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-zinc-100">
            Built for enterprise operations that can't afford inventory waste
          </h3>
        </div>

        {/* Industry Capabilities Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {industries.map((ind) => {
            const Icon = ind.icon
            return (
              <div
                key={ind.name}
                className="flex flex-col items-center justify-center text-center p-3.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-950 shadow-2xs hover:border-[#0D9488]/40 transition-colors"
              >
                <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-[#0D9488] flex items-center justify-center mb-2">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">{ind.name}</span>
              </div>
            )
          })}
        </div>

        {/* Metric Strip (Clearly labeled as illustrative prototype data) */}
        <div className="pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <span className="block text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              ₹42.8Cr+
            </span>
            <span className="text-xs text-zinc-500 font-medium mt-0.5 block">Surplus Analyzed</span>
            <span className="text-[10px] text-zinc-400 font-mono">(Simulated Benchmark)</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black font-mono text-[#0D9488] dark:text-[#14B8A6]">
              93.4%
            </span>
            <span className="text-xs text-zinc-500 font-medium mt-0.5 block">Match Confidence</span>
            <span className="text-[10px] text-zinc-400 font-mono">(Multi-Factor Algorithm)</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              8.4 Days
            </span>
            <span className="text-xs text-zinc-500 font-medium mt-0.5 block">Avg. Liquidation Cycle</span>
            <span className="text-[10px] text-zinc-400 font-mono">(3.2x Traditional Brokerage)</span>
          </div>
          <div>
            <span className="block text-2xl sm:text-3xl font-black font-mono text-teal-600 dark:text-teal-400">
              14.8 Tons
            </span>
            <span className="text-xs text-zinc-500 font-medium mt-0.5 block">Solid Waste Avoided</span>
            <span className="text-[10px] text-zinc-400 font-mono">(Scope-3 Circular Standard)</span>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import { Recycle, ShieldCheck, TreePine, Award, ArrowUpRight } from 'lucide-react'

export const SustainabilitySection: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <section className="py-24 px-6 bg-zinc-100/50 dark:bg-zinc-900/40 border-y border-zinc-200/80 dark:border-zinc-800/80">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
            <Recycle className="h-3.5 w-3.5" />
            <span>Circular Economy Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
            Recover value. Reduce waste.
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
            Every lot matched on DeadStock is an industrial asset kept in the productive economic cycle instead of entering the landfill scrap stream.
          </p>
        </div>

        {/* 4 Impact Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Inventory Recovered</span>
            <span className="block text-3xl font-black font-mono text-[#0D9488] dark:text-[#14B8A6]">
              ₹6.8Cr
            </span>
            <span className="text-xs text-zinc-500 block">Working capital unlocked from idle lots</span>
            <span className="text-[10px] text-zinc-400 font-mono block">(Illustrative Benchmark)</span>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Units Reused</span>
            <span className="block text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              82,400
            </span>
            <span className="text-xs text-zinc-500 block">Industrial parts redistributed to manufacturing</span>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono block">+18% Monthly Growth</span>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Solid Waste Avoided</span>
            <span className="block text-3xl font-black font-mono text-teal-600 dark:text-teal-400">
              14.2 Tons
            </span>
            <span className="text-xs text-zinc-500 block">Diverted from industrial scrap dumps</span>
            <span className="text-[10px] text-teal-600 font-semibold font-mono block">Scope-3 Certified Standard</span>
          </div>

          <div className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Circular Factor</span>
            <span className="block text-3xl font-black font-mono text-zinc-900 dark:text-zinc-100">
              88.4%
            </span>
            <span className="text-xs text-zinc-500 block">Average lot recovery vs total loss</span>
            <span className="text-[10px] text-indigo-600 font-semibold font-mono block">Audited Multi-Channel Output</span>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingDown,
  XCircle,
  BarChart2,
  Clock,
  AlertTriangle,
  Flame,
  Layers,
  ArrowDownRight,
} from 'lucide-react'

export const ProblemSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<number>(0)

  const problems = [
    {
      id: 0,
      icon: TrendingDown,
      tag: 'Velocity Stagnation',
      title: 'Slow-Moving Stranded Stock',
      description: 'Inventory sits on high-footprint warehouse racks as sales velocity gradually declines, steadily eroding cash reserves in compounding holding fees.',
      financialImpact: 'Average 18–24% annual carrying cost bleed',
      metric: '62% Velocity Drop',
      color: 'amber',
    },
    {
      id: 1,
      icon: XCircle,
      tag: 'Demand Disruption',
      title: 'Cancelled & Modified B2B Orders',
      description: 'Sudden buyer cancellations leave custom components or bulk batches stranded with zero local downstream demand and frozen operating capital.',
      financialImpact: '100% working capital locked in unallocated goods',
      metric: 'Zero Active Run-rate',
      color: 'rose',
    },
    {
      id: 2,
      icon: BarChart2,
      tag: 'Forecast Inaccuracy',
      title: 'Overstock Forecasting Errors',
      description: 'Procurement teams buy minimum order quantities based on optimistic projections, resulting in 4x to 10x normal months of inventory supply.',
      financialImpact: 'Inflated balance sheet liability & warehouse congestion',
      metric: '4.8x Buffer Overhang',
      color: 'indigo',
    },
    {
      id: 3,
      icon: Clock,
      tag: 'Technology Lifecycle',
      title: 'Component Obsolescence',
      description: 'Firmware deprecation, revised engineering specs, or regulatory updates make batches obsolete before standard distribution channels can liquidate them.',
      financialImpact: 'Rapid descent toward complete scrap write-off',
      metric: 'Imminent EOL Status',
      color: 'rose',
    },
  ]

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <AlertTriangle className="h-3.5 w-3.5" />
          <span>The Hidden Cost of Stagnation</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Inventory doesn't become dead stock overnight.
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
          It starts with a subtle dip in velocity, a delayed production cycle, or an inaccurate demand forecast. Without early intervention, recoverable value rapidly decays into landfill scrap.
        </p>
      </div>

      {/* Interactive Problem Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {problems.map((prob, idx) => {
          const Icon = prob.icon
          const isSelected = activeCard === idx
          return (
            <div
              key={prob.id}
              onClick={() => setActiveCard(idx)}
              className={`cursor-pointer rounded-3xl border p-6 transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-rose-500/80 bg-rose-50/20 dark:bg-rose-950/20 shadow-lg shadow-rose-500/5 ring-1 ring-rose-500/30'
                  : 'border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`h-10 w-10 rounded-2xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-rose-500 text-white shadow-sm'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
                    {prob.tag}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                  {prob.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {prob.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-850 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-400">Risk Signal:</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{prob.metric}</span>
                </div>
                <div className="text-[10px] text-zinc-500 leading-tight">
                  {prob.financialImpact}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

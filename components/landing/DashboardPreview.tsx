'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Warehouse,
  AlertTriangle,
  TrendingUp,
  Clock,
  Recycle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Maximize2,
} from 'lucide-react'

export const DashboardPreview: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null)

  return (
    <section className="py-24 px-6 bg-zinc-950 text-white relative overflow-hidden border-y border-zinc-800">
      {/* Background glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-14 relative z-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Real Application Experience</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            The actual workspace you get on day one.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400">
            No mockups or generic templates. DeadStock delivers a precision B2B operational dashboard built for inventory recovery.
          </p>
        </div>

        {/* 3D Perspective Container */}
        <div className="relative mx-auto max-w-5xl rounded-3xl border border-zinc-800 bg-zinc-900/90 p-4 sm:p-7 shadow-2xl backdrop-blur-xl transition-all duration-500 hover:border-teal-500/40">
          {/* Top Bar of the Mock UI */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="text-xs font-mono text-zinc-400">app.deadstock.io/dashboard</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold text-teal-400">
                SELLER_OPERATIONS
              </span>
            </div>
          </div>

          {/* Actual Dashboard Live Snippet Grid */}
          <div className="space-y-6 text-left">
            {/* 4 KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div
                onMouseEnter={() => setHoveredMetric('total')}
                onMouseLeave={() => setHoveredMetric(null)}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-zinc-700"
              >
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Total Tracked Inventory</span>
                  <Warehouse className="h-4 w-4 text-zinc-500" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-white">₹18.4L</div>
                <div className="mt-2 text-[11px] text-zinc-400 font-mono">5 SKUs across 2 depots</div>
              </div>

              <div
                onMouseEnter={() => setHoveredMetric('atRisk')}
                onMouseLeave={() => setHoveredMetric(null)}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-amber-500/40"
              >
                <div className="flex items-center justify-between text-xs text-amber-400">
                  <span>At-Risk Working Capital</span>
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-amber-400">₹15.2L</div>
                <div className="mt-2 text-[11px] text-zinc-400 font-mono">4 SKUs &gt;6mo velocity</div>
              </div>

              <div
                onMouseEnter={() => setHoveredMetric('recoverable')}
                onMouseLeave={() => setHoveredMetric(null)}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 transition-all hover:border-teal-500/40"
              >
                <div className="flex items-center justify-between text-xs text-teal-400">
                  <span>Recoverable Value</span>
                  <TrendingUp className="h-4 w-4 text-teal-400" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-teal-400">₹12.5L</div>
                <div className="mt-2 text-[11px] text-zinc-400 font-mono">Via B2B matched buyers</div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <div className="flex items-center justify-between text-xs text-indigo-400">
                  <span>Recovery Velocity</span>
                  <Clock className="h-4 w-4 text-indigo-400" />
                </div>
                <div className="mt-2 text-2xl font-bold font-mono text-white">8.4 Days</div>
                <div className="mt-2 text-[11px] text-emerald-400 font-medium">3.2x faster than brokerage</div>
              </div>
            </div>

            {/* Category Exposure + Sustainability Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Category Risk Exposure</h4>
                <div className="space-y-2.5 text-xs">
                  <div>
                    <div className="flex justify-between font-mono mb-1">
                      <span>Electronics & PCB (1 SKU)</span>
                      <span className="text-rose-400 font-bold">₹6.4L (94% Risk)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-850 overflow-hidden">
                      <div className="h-full bg-rose-500 w-[94%]" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between font-mono mb-1">
                      <span>Connectors & Moldings (1 SKU)</span>
                      <span className="text-rose-400 font-bold">₹1.8L (87% Risk)</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-zinc-850 overflow-hidden">
                      <div className="h-full bg-rose-500 w-[87%]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <Recycle className="h-4 w-4" />
                    <span>Circular Sustainability Index</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400 text-[11px]">Diverted from Scrap</span>
                      <span className="block text-base font-bold font-mono text-white mt-0.5">84,200 Units</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <span className="text-zinc-400 text-[11px]">Solid Waste Avoided</span>
                      <span className="block text-base font-bold font-mono text-white mt-0.5">14.8 Tons</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 p-2.5 rounded-xl bg-teal-500/10 border border-teal-500/30 text-xs text-teal-300 flex items-center justify-between">
                  <span>Scope-3 Certified Recovery Rate</span>
                  <span className="font-mono font-bold text-sm">88.4%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Overlay CTA */}
          <div className="mt-8 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-zinc-400">
              Complete multi-tenant isolation, immutable movement loggers, and CSV bulk importers included.
            </span>
            <button
              type="button"
              onClick={onGetStarted}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/30 transition-all shrink-0"
            >
              <span>Launch Live Workspace Free</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

import React from 'react'
import { ArrowRight, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

interface FinalCTAProps {
  onGetStarted: () => void
  onBrowseMarketplace: () => void
}

export const FinalCTA: React.FC<FinalCTAProps> = ({ onGetStarted, onBrowseMarketplace }) => {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-b from-zinc-900 to-zinc-950 text-white border-t border-zinc-800 text-center">
      {/* Ambient background particles & glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-teal-500/15 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10 space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-teal-400">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Launch Your Recovery Workspace</span>
        </div>

        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
          Don't let valuable inventory become dead stock.
        </h2>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Find the next buyer. Recover the value. Move inventory forward with India's premier B2B inventory recovery platform.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={onGetStarted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-teal-600/30 transition-all active:scale-[0.98]"
          >
            <span>Start Recovering Value Free</span>
            <ArrowRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onBrowseMarketplace}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-700 bg-zinc-800/80 px-7 py-3.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-all shadow-xs"
          >
            <span>Explore the Platform</span>
          </button>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>Instant CSV Import & Risk Analysis</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>Multi-Tenant Data Isolation</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-teal-400" />
            <span>Verified B2B Buyer Liquidity</span>
          </div>
        </div>
      </div>
    </section>
  )
}

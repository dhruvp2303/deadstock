'use client'

import React from 'react'
import { ArrowRight, Ship, ShieldCheck } from 'lucide-react'

export const DSCtaBanner: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => (
  <section className="px-4 sm:px-8 py-10 bg-white">
    <div
      className="max-w-[1400px] mx-auto relative rounded-3xl overflow-hidden shadow-2xl"
      style={{ minHeight: '340px' }}
    >
      {/* Ship photo background (Matching Image 2 Reference) */}
      <img
        src="https://images.unsplash.com/photo-1542314831-c6a4d272990a?w=1600&auto=format&fit=crop&q=85"
        alt="Container cargo ship sailing through turquoise ocean"
        className="absolute inset-0 w-full h-full object-cover"
        loading="lazy"
      />
      
      {/* Deep Ocean Blue Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(110deg, rgba(7, 30, 46, 0.95) 0%, rgba(10, 127, 168, 0.8) 60%, rgba(20, 184, 166, 0.6) 100%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 p-8 sm:p-14">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-200 text-xs font-mono font-bold tracking-wider uppercase">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Enterprise Liquidation & Escrow</span>
          </div>
          <h2
            className="font-black text-white leading-[0.95] tracking-tight uppercase"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', letterSpacing: '-0.03em' }}
          >
            Ready To Ship With<br />Confidence?
          </h2>
          <p className="text-white/80 text-sm sm:text-base max-w-xl">
            Join 3,450+ industrial manufacturers and verified buyers rescuing dead stock daily with automated crane staging and neutral bank escrow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 shrink-0">
          <button
            type="button"
            onClick={onGetStarted}
            className="btn-glass-amber text-xs sm:text-sm py-4 px-8 shadow-2xl flex items-center gap-2"
          >
            <span>START RECOVERY FREE</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  </section>
)

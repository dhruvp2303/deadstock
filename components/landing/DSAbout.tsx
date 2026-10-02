'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

export const DSAbout: React.FC<{ onGetStarted?: () => void }> = ({ onGetStarted }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.2 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about" ref={sectionRef} className="py-20 sm:py-28 px-6 bg-white">
      <div className="max-w-[1360px] mx-auto space-y-12">

        {/* ── Reference 5 About Us Section Header ── */}
        <div className="max-w-3xl">
          <span className="text-xs font-bold tracking-wider text-blue-600 uppercase mb-3 block">
            About us
          </span>
          <h2
            className="font-extrabold text-[#0B1E2D] leading-[1.12] tracking-tight mb-6"
            style={{ fontSize: 'clamp(2rem, 4.5vw, 3.4rem)', letterSpacing: '-0.025em' }}
          >
            We are the recovery network for stock that stopped moving, so it earns instead of aging.
          </h2>

          <button
            type="button"
            onClick={onGetStarted}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs sm:text-sm font-black tracking-wider uppercase shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
          >
            <span>LET&apos;S GET STARTED</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* ── Reference 5 Three Feature Showcase Cards ── */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-3 gap-5 transition-all duration-700 ${
            visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Card 1: Stat Highlight */}
          <div className="relative rounded-3xl overflow-hidden bg-[#0A1A2F] text-white p-7 flex flex-col justify-between min-h-[260px] shadow-lg">
            <div>
              <span className="text-4xl sm:text-5xl font-black tracking-tight text-white block">₹12Cr+</span>
              <p className="text-xs text-white/70 mt-2 font-medium">surplus value recovered for verified sellers</p>
            </div>
            <div className="pt-4 border-t border-white/10">
              <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider">Verified Network</span>
            </div>
          </div>

          {/* Card 2: Cargo Ship Photo */}
          <div className="relative rounded-3xl overflow-hidden min-h-[260px] group shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1520923642038-b4259acecbd7?w=700&auto=format&fit=crop&q=80"
              alt="Buyer network cargo transportation"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider text-white uppercase inline-block mb-1">
                BUYER NETWORK
              </span>
              <p className="text-xs font-semibold text-white/90">Cross-industry matching across 80+ sectors</p>
            </div>
          </div>

          {/* Card 3: Freight Transport Truck Photo */}
          <div className="relative rounded-3xl overflow-hidden min-h-[260px] group shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=700&auto=format&fit=crop&q=80"
              alt="Logistics container transfer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold tracking-wider text-white uppercase inline-block mb-1">
                TRANSFER
              </span>
              <p className="text-xs font-semibold text-white/90">Direct depot-to-warehouse escrow delivery</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


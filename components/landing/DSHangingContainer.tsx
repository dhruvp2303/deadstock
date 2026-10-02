'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  Cpu,
  Sparkles,
  TrendingDown,
  Scale,
  Anchor,
  Zap,
} from 'lucide-react'

export const DSHangingContainer: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.15 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="risk-detection"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#F8FAFC] pt-20 sm:pt-28 pb-20 border-b border-gray-200 scroll-mt-20"
    >
      {/* Industrial Realism Backdrop: Warehouse Automated Storage & Freight Logistics */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <img
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=80"
          alt="High-density automated warehouse racking and freight logistics"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-8 relative z-10">

        {/* Workflow Header Tag */}
        <div className="flex flex-col items-center text-center space-y-3 mb-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-700 text-xs font-mono font-bold tracking-wide uppercase">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Workflow 01 · Predictive Dead Stock Risk Diagnostics</span>
          </div>

          {/* Main Title (Inspired by Image 1) */}
          <h2
            className="font-black text-[#0A192F] leading-[0.92] select-none tracking-tight uppercase"
            style={{ fontSize: 'clamp(2.5rem, 6.5vw, 5.5rem)', letterSpacing: '-0.035em' }}
          >
            Detect Stuck Inventory<br />Before Value Decays
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Traditional ERPs alert you when stock is already written off. DeadStock calculates burn velocity, shelf-life half-life, and obsolescence vectors 6 months in advance.
          </p>
        </div>

        {/* Container + Crane Hanging Rig (Suspended Cargo Boxes in Air - Inspired by Image 1) */}
        <div className="relative w-full max-w-[760px] mx-auto mt-6 mb-12">

          {/* Crane Suspension Cable Geometry SVG */}
          <svg
            viewBox="0 0 700 130"
            className="w-full h-24 sm:h-32 mx-auto"
            style={{ display: 'block', overflow: 'visible' }}
          >
            {/* Top Gantry Hoist Cable Point */}
            <line x1="350" y1="0" x2="350" y2="40" stroke="#0F254B" strokeWidth="4.5" strokeLinecap="round" />
            {/* Triangular High-Tensile Steel Cables */}
            <line x1="350" y1="40" x2="80" y2="128" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="350" y1="40" x2="620" y2="128" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />
            <line x1="350" y1="40" x2="300" y2="128" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            <line x1="350" y1="40" x2="400" y2="128" stroke="#475569" strokeWidth="2" strokeDasharray="4 4" opacity="0.7" />
            {/* Central Heavy Duty Hook */}
            <circle cx="350" cy="40" r="8" fill="#F59E0B" stroke="#0F254B" strokeWidth="3" />
          </svg>

          {/* Suspended Red Container Card with Sway Animation (Live Physics Sway) */}
          <motion.div
            animate={{
              rotate: [-1.4, 1.4, -1.4],
              y: [-4, 4, -4],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            {/* Floating Glass Chip Left: Risk 87% */}
            <div
              className="absolute -left-2 sm:-left-16 top-1/2 -translate-y-1/2 z-20 glass-card bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/60 text-left transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
                <span className="h-2 w-2 rounded-full bg-[#DC2626] animate-pulse" />
                Risk Score: 87%
              </div>
              <div className="text-[11px] font-medium text-gray-700 mt-0.5 whitespace-nowrap">
                Velocity dropped 62% · 11 mo aging
              </div>
            </div>

            {/* Floating Glass Chip Right: Match Fit */}
            <div
              className="absolute -right-2 sm:-right-16 top-1/2 -translate-y-1/2 z-20 glass-card bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/60 text-left transition-all duration-300 hover:scale-105"
              style={{ boxShadow: '0 12px 32px rgba(0,0,0,0.1)' }}
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#16A34A]" />
                93% Buyer Compatibility
              </div>
              <div className="text-[11px] font-medium text-gray-700 mt-0.5 whitespace-nowrap">
                ElectroTech Industries · Direct Deal
              </div>
            </div>

            {/* Industrial Corrugated Shipping Container Box (Matching Image 1 Reference) */}
            <div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden p-8 sm:p-12 text-white shadow-2xl"
              style={{
                background: 'linear-gradient(145deg, #DE3E28 0%, #B91C1C 60%, #881337 100%)',
                boxShadow: '0 30px 70px -15px rgba(222, 62, 40, 0.5), 0 10px 25px rgba(0,0,0,0.25)',
                border: '3px solid rgba(255,255,255,0.3)',
              }}
            >
              {/* Corrugation vertical ridges */}
              <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between">
                {Array.from({ length: 22 }).map((_, i) => (
                  <div key={i} className="w-1.5 sm:w-2 h-full bg-black/40 border-r border-white/30" />
                ))}
              </div>

              {/* Container Content */}
              <div className="relative z-10 text-center space-y-3">
                <span className="text-[10px] font-mono tracking-widest text-amber-200 font-black uppercase bg-black/40 px-4 py-1 rounded-full border border-amber-400/30">
                  CONTAINER ID: DEADSTOCK-RECOVERY-884
                </span>
                <h3
                  className="font-black text-white uppercase tracking-wider select-none text-center"
                  style={{
                    fontSize: 'clamp(2.4rem, 6vw, 4.8rem)',
                    letterSpacing: '-0.02em',
                    textShadow: '0 6px 20px rgba(0,0,0,0.4)',
                  }}
                >
                  DEADSTOCK
                </h3>
                <p className="text-white/95 text-xs sm:text-sm font-semibold tracking-wide">
                  SKU PC2048 · Precision Polymer Connector 20mm · 4,500 units · ₹1,80,000 At-Risk
                </p>
              </div>

              {/* Corner Reinforcement Rivets */}
              <div className="absolute top-3 left-3 h-3 w-3 rounded-full bg-white/60 shadow-sm" />
              <div className="absolute top-3 right-3 h-3 w-3 rounded-full bg-white/60 shadow-sm" />
              <div className="absolute bottom-3 left-3 h-3 w-3 rounded-full bg-white/60 shadow-sm" />
              <div className="absolute bottom-3 right-3 h-3 w-3 rounded-full bg-white/60 shadow-sm" />
            </div>
          </motion.div>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-2">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold">
              <TrendingDown className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">Velocity Half-Life Index</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Monitors consumption deceleration in real time. Items dropping under 30% standard velocity trigger instant recovery alerts.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-2">
            <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
              <Scale className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">Carrying Cost Hemorrhage</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates daily warehouse rent, insurance, and capital opportunity cost so you know exactly when holding costs outweigh margin.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-gray-200/80 shadow-sm space-y-2">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Zap className="h-5 w-5" />
            </div>
            <h4 className="font-extrabold text-base text-slate-900">Automated Liquidation Trigger</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              One-click multi-channel dispatch to vetted buyers, intra-company depot transfers, or certified circular recyclers.
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}

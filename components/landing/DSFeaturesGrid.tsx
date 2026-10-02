'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  RotateCcw,
  Sparkles,
  TrendingUp,
  DollarSign,
  Truck,
  Tag,
  Recycle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  SlidersHorizontal,
  Clock,
  Zap,
  Ship,
  Plane,
  Building2,
  ArrowUpRight,
} from 'lucide-react'

interface FeaturesGridProps {
  onGetStarted: () => void
}

const RECOVERY_CHANNELS = [
  {
    id: 'sell',
    name: '1. Sell (B2B Match)',
    icon: DollarSign,
    salvageRate: '88% - 95%',
    speed: '7 - 14 Days',
    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    description: 'Algorithmically match and liquidate direct to verified manufacturing buyers with binding escrow.',
    bestFor: 'High-value components & standard engineering parts',
  },
  {
    id: 'transfer',
    name: '2. Transfer (Depot)',
    icon: Truck,
    salvageRate: '82% - 90%',
    speed: '3 - 5 Days',
    color: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    description: 'Rebalance surplus to Pune or Ahmedabad warehouse hubs experiencing regional stockouts.',
    bestFor: 'Active catalogue SKUs with uneven regional demand',
  },
  {
    id: 'discount',
    name: '3. Discount Flash',
    icon: Tag,
    salvageRate: '70% - 80%',
    speed: '2 - 4 Days',
    color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    description: 'Publish to DeadStock public marketplace at calibrated 25% discount for immediate liquidity.',
    bestFor: 'Bulk commodities, cartons, and generic fasteners',
  },
  {
    id: 'return',
    name: '4. Supplier Restock',
    icon: RotateCcw,
    salvageRate: '60% - 70%',
    speed: '14 - 21 Days',
    color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    description: 'Trigger original supplier buyback clauses under standard 30% restocking fee schedules.',
    bestFor: 'OEM sealed components under valid warranty',
  },
  {
    id: 'recycle',
    name: '5. Circular Recycle',
    icon: Recycle,
    salvageRate: '35% - 45%',
    speed: '1 - 2 Days',
    color: 'text-teal-400 bg-teal-500/10 border-teal-500/30',
    description: 'Reclaim raw polymers and metals via accredited circular recycling partners for Scope-3 carbon credits.',
    bestFor: 'Obsolete, damaged, or expired materials',
  },
]

const LOGISTICS_SOLUTIONS = [
  {
    title: 'Freight Forwarding & Port Berthing',
    category: 'Ocean & Maritime',
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d272990a?w=800&auto=format&fit=crop&q=80',
    badge: '48 Global Ports',
    desc: 'Full container load (FCL) and consolidated lot (LCL) bookings directly from manufacturing yards.',
  },
  {
    title: 'Continental Rail & Heavy Corridor',
    category: 'Freight Rail',
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e834?w=800&auto=format&fit=crop&q=80',
    badge: '1,200 km Daily Velocity',
    desc: 'High-speed inland container trains connecting industrial special economic zones (SEZs).',
  },
  {
    title: 'Warehouse Staging & Reach Stackers',
    category: 'Automated Depots',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
    badge: '14 Hubs',
    desc: 'Zero-manual touchpoint gantry cranes and hydraulic stackers loading container chassis.',
  },
]

export const DSFeaturesGrid: React.FC<FeaturesGridProps> = ({ onGetStarted }) => {
  const [activeChannel, setActiveChannel] = useState(RECOVERY_CHANNELS[0])
  const [speedValueSlider, setSpeedValueSlider] = useState(75)

  const simulatedTargetVal = Math.round(180000 * (0.5 + (speedValueSlider / 100) * 0.45))
  const simulatedDays = Math.max(1, Math.round(18 - (100 - speedValueSlider) * 0.16))

  return (
    <section id="recovery-center" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#0B1E2D] text-white scroll-mt-24 border-b border-white/10 relative overflow-hidden">
      {/* Visual Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1800&auto=format&fit=crop&q=80"
          alt="Container vessel"
          className="w-full h-full object-cover mix-blend-luminosity"
        />
      </div>

      <div className="max-w-[1400px] mx-auto space-y-20 relative z-10">

        {/* ── Block 1: Comprehensive Live Logistics Showcase (Inspired by Image 3: ShipNex) ── */}
        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono font-bold tracking-wider uppercase">
                <Ship className="h-3.5 w-3.5 text-teal-400" />
                <span>End-To-End Infrastructure</span>
              </div>
              <h2
                className="font-black text-white leading-[0.95] tracking-tight uppercase"
                style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)', letterSpacing: '-0.03em' }}
              >
                Comprehensive Live<br />Logistics Solutions
              </h2>
            </div>
            <p className="text-white/80 max-w-md text-sm sm:text-base leading-relaxed">
              Our integrated network handles every stage of your surplus supply chain — from automated crane de-staging to intermodal ocean and rail transit.
            </p>
          </div>

          {/* 3 Luxury Visual Solution Cards (Image 3 ShipNex Style) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LOGISTICS_SOLUTIONS.map((item, idx) => (
              <div
                key={idx}
                className="group relative rounded-3xl overflow-hidden bg-black/40 border border-white/20 p-6 flex flex-col justify-between h-[360px] shadow-2xl transition-all duration-300 hover:border-teal-400/60 hover:scale-[1.02]"
              >
                {/* Background Image with Zoom on Hover */}
                <img
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-50 group-hover:scale-105 transition-all duration-500"
                />

                <div className="relative z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                    {item.category}
                  </span>
                  <div className="h-8 w-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-teal-400 group-hover:text-black transition-colors">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="text-xs font-mono font-bold text-amber-300 block">{item.badge}</span>
                  <h4 className="text-xl font-black text-white leading-snug">{item.title}</h4>
                  <p className="text-xs text-white/80 leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Block 2: 5-Channel Strategy Center & Speed vs Recovery Slider ── */}
        <div className="space-y-10 pt-8 border-t border-white/15">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/30 backdrop-blur-md">
              <RotateCcw className="h-3.5 w-3.5 text-teal-400" />
              <span>Multi-Channel Capital Recovery Center</span>
            </div>
            <h3 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight uppercase">
              5 Channels. 100% Value Protection.
            </h3>
            <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
              Choose the exact velocity and salvage rate for your dormant cargo lot.
            </p>
          </div>

          {/* Interactive Channel Selector Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {RECOVERY_CHANNELS.map((channel) => {
              const Icon = channel.icon
              const isSelected = activeChannel.id === channel.id
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => setActiveChannel(channel)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between h-36 ${
                    isSelected
                      ? 'bg-teal-500/20 border-teal-400 text-white shadow-xl scale-[1.02]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <Icon className={`h-5 w-5 ${isSelected ? 'text-teal-300' : 'text-white/60'}`} />
                    <span className="text-[10px] font-mono font-bold text-amber-300">{channel.speed}</span>
                  </div>
                  <div>
                    <h5 className="font-extrabold text-sm text-white leading-snug">{channel.name}</h5>
                    <span className="text-[11px] font-mono text-teal-300 block mt-1">
                      {channel.salvageRate} Recovery
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Interactive Speed vs Capital Recovery Slider Box */}
          <div className="bg-black/40 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 sm:p-10 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block">
                  Fine-Tune Recovery Optimization
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-white">
                  Balance Liquidation Speed vs Maximum Yield
                </h4>
                <p className="text-xs sm:text-sm text-white/80">
                  Slide towards Flash Speed for 48-hour cash turnaround, or Maximum Yield for up to 95% original invoice salvage.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-mono text-white/80">
                  <span className="font-bold text-amber-300">⚡ Flash Liquidation (48 Hours)</span>
                  <span className="font-bold text-teal-300">💎 Maximum Valuation (95% Yield)</span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={100}
                  value={speedValueSlider}
                  onChange={(e) => setSpeedValueSlider(Number(e.target.value))}
                  className="w-full h-2.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/10 rounded-2xl p-6 border border-white/15 space-y-4 text-center">
              <span className="text-xs font-mono text-white/70 uppercase block">Projected Portfolio Return</span>
              <div className="text-3xl sm:text-4xl font-black font-mono text-emerald-300">
                ₹{(simulatedTargetVal / 100000).toFixed(2)} Lakhs
              </div>
              <div className="flex justify-center items-center gap-4 text-xs font-mono text-white/80">
                <span>⏱ {simulatedDays} Days Turnaround</span>
                <span>•</span>
                <span className="text-teal-300">100% Escrow Bound</span>
              </div>
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-primary w-full text-xs font-bold py-3 shadow-lg"
              >
                <span>Execute Recovery Strategy</span>
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}

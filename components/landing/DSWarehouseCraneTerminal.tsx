'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2,
  Truck,
  Ship,
  Plane,
  Radio,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Box,
  Layers,
  ArrowUpRight,
  Sliders,
  Sparkles,
} from 'lucide-react'

interface WarehouseCraneTerminalProps {
  onGetStarted: () => void
}

const TERMINAL_SECTORS = [
  {
    id: 'road',
    title: 'Road & Container Fleet',
    subtitle: 'Heavy-Duty Freight Trucks & Bay Loading',
    description: 'Direct dock-to-truck automated conveyor loading for urgent domestic factory redistributions.',
    icon: Truck,
    stat: '1,450+ Active Fleet Trucks',
    image: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&auto=format&fit=crop&q=80',
    cycle: '12 Min Turnaround',
  },
  {
    id: 'ocean',
    title: 'Ocean Gantry Cranes',
    subtitle: 'Container Ship Berth & STS Hoists',
    description: 'High-speed Ship-to-Shore (STS) gantry hoists loading multi-ton ISO containers onto maritime bulk carriers.',
    icon: Ship,
    stat: '48 Port Terminals',
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d272990a?w=1200&auto=format&fit=crop&q=80',
    cycle: '30 Containers / Hr',
  },
  {
    id: 'air',
    title: 'Express Air Freight',
    subtitle: 'Aeronautic Pallet Loaders',
    description: 'Climate-controlled high-security loading for perishable electronics and precision microchips.',
    icon: Plane,
    stat: 'Next-Flight Out Guarantee',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&auto=format&fit=crop&q=80',
    cycle: '4-Hour Airport Transfer',
  },
  {
    id: 'drone',
    title: 'Automated AGVs & Drones',
    subtitle: 'Autonomous Depot Micro-Shuttles',
    description: 'Automated Guided Vehicles (AGVs) transporting SKU batches between automated high-bay racking systems.',
    icon: Radio,
    stat: '100% Robotic Sorting',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80',
    cycle: '99.98% Accuracy',
  },
]

export const DSWarehouseCraneTerminal: React.FC<WarehouseCraneTerminalProps> = ({ onGetStarted }) => {
  const [activeSector, setActiveSector] = useState(TERMINAL_SECTORS[0])
  const [craneAction, setCraneAction] = useState<'loading' | 'unloading'>('loading')
  const [hoistPosition, setHoistPosition] = useState(0)

  // Simulation timer for warehouse crane hoist
  useEffect(() => {
    const timer = setInterval(() => {
      setCraneAction((prev) => (prev === 'loading' ? 'unloading' : 'loading'))
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section id="terminal" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#F0F5FA] text-[#0A192F] relative overflow-hidden border-b border-gray-200 scroll-mt-20">
      <div className="max-w-[1380px] mx-auto space-y-12">

        {/* Section Header (Inspired by Image 5: Logist) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0A7FA8]/10 text-[#0A7FA8] border border-[#0A7FA8]/20 text-xs font-mono font-bold tracking-wider uppercase">
            <Building2 className="h-3.5 w-3.5" />
            <span>Automated Operations & Depot Cranes</span>
          </div>
          <h2
            className="font-black text-[#0A192F] leading-[0.95] tracking-tight uppercase"
            style={{ fontSize: 'clamp(2.2rem, 5.2vw, 4.4rem)', letterSpacing: '-0.03em' }}
          >
            Safe & Reliable<br />Depot Solutions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            From automated warehouse gantry cranes to multi-modal truck and ship berthing, our coordinated infrastructure ensures dead stock is loaded, inspected, and moved without delay.
          </p>
        </div>

        {/* Interactive 4-Column Mode Selectors (Inspired by Image 5 Top Bar) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TERMINAL_SECTORS.map((sector) => {
            const Icon = sector.icon
            const isSelected = activeSector.id === sector.id
            return (
              <button
                key={sector.id}
                type="button"
                onClick={() => setActiveSector(sector)}
                className={`p-5 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between h-44 group cursor-pointer ${
                  isSelected
                    ? 'bg-[#0B3D5C] text-white border-[#0B3D5C] shadow-xl scale-[1.02]'
                    : 'bg-white text-slate-700 border-slate-200/90 hover:border-slate-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white/20 text-teal-300' : 'bg-slate-100 text-slate-700'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${isSelected ? 'bg-teal-400 text-[#0B3D5C]' : 'bg-slate-100 text-slate-500'}`}>
                    {sector.cycle}
                  </span>
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base leading-snug">{sector.title}</h4>
                  <p className={`text-xs mt-0.5 line-clamp-1 ${isSelected ? 'text-teal-100' : 'text-slate-500'}`}>
                    {sector.subtitle}
                  </p>
                </div>
                <div className="flex items-center justify-between text-[11px] font-mono font-bold pt-2 border-t border-white/10">
                  <span className={isSelected ? 'text-teal-200' : 'text-teal-600'}>{sector.stat}</span>
                  <ArrowUpRight className={`h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                </div>
              </button>
            )
          })}
        </div>

        {/* Dynamic Interactive Stage: Left Live Automated Crane & Warehouse Isometric Rig / Right Live Telemetry */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-10 shadow-xl">

          {/* Left: Animated Industrial Crane & Warehouse Depot Bay Rig (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-2xl overflow-hidden bg-[#0A1A2F] p-6 text-white border border-slate-800 shadow-2xl min-h-[360px] flex flex-col justify-between">
              {/* Background Real Logistics Image */}
              <img
                src={activeSector.image}
                alt={activeSector.title}
                className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
              />

              {/* Crane Gantry Girder Overhead */}
              <div className="relative z-10 border-b-2 border-amber-400/80 pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-amber-400 rotate-45" />
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase tracking-wider">
                    DEPOT GANTRY HOIST · SECTOR [{activeSector.id.toUpperCase()}]
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {craneAction === 'loading' ? 'HOISTING CRATE TO TRUCK' : 'UNLOADING LOT FROM BAY'}
                </div>
              </div>

              {/* Animated Mini Industry Crane Assembly */}
              <div className="relative z-10 my-6 flex flex-col items-center">
                {/* Horizontal Crane Rail Beam */}
                <div className="w-full h-3 bg-amber-500/80 rounded-xs flex items-center justify-center relative shadow-md">
                  {/* Moving Crane Trolley */}
                  <motion.div
                    animate={{
                      x: craneAction === 'loading' ? [ -80, 80 ] : [ 80, -80 ],
                    }}
                    transition={{ duration: 4, ease: 'easeInOut' }}
                    className="w-12 h-5 bg-amber-400 rounded-sm shadow-lg flex items-center justify-center border border-black/30"
                  >
                    <div className="w-6 h-1 bg-black/50 rounded-full" />
                  </motion.div>
                </div>

                {/* Animated Suspension Cables & Crate */}
                <motion.div
                  animate={{
                    y: craneAction === 'loading' ? [0, 20, 0] : [20, 0, 20],
                  }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  className="flex flex-col items-center mt-1"
                >
                  <div className="w-0.5 h-16 bg-amber-300/80 shadow-sm" />
                  
                  {/* Suspended Industrial Cargo Box */}
                  <div className="w-44 p-3 rounded-xl bg-gradient-to-r from-red-700 to-red-600 text-white shadow-xl border border-white/30 text-center space-y-1">
                    <span className="text-[9px] font-mono text-amber-200 font-bold block">
                      LOT #DS-884 · 4,500 UNITS
                    </span>
                    <span className="text-xs font-black uppercase block tracking-wider">
                      DEADSTOCK CARGO
                    </span>
                    <span className="text-[10px] text-white/80 font-mono block">
                      Valued at ₹6.4L
                    </span>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Warehouse Loading Bay Dock */}
              <div className="relative z-10 pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono text-teal-200">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-teal-400" />
                  Ahmedabad Automated Hub · Bay #03
                </span>
                <span className="text-amber-300 font-bold">Zero-Manual Touchpoint</span>
              </div>
            </div>
          </div>

          {/* Right: Technical Explanation & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 uppercase tracking-wide">
                {activeSector.title}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                {activeSector.subtitle}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {activeSector.description}
              </p>
            </div>

            {/* Benefit Checkpoints */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Instant Weighing & SKU Optical Tagging:</strong> Every pallet is digitized into our surplus catalog within 90 seconds.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>Direct Intermodal Transfers:</strong> Seamless shift from factory warehouse cranes directly to rail and container ships.</span>
              </div>
              <div className="flex items-start gap-2.5 text-xs text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0 mt-0.5" />
                <span><strong>100% Inspected & Sealed:</strong> End-to-end telemetry eliminates cargo damage or discrepancy disputes.</span>
              </div>
            </div>

            {/* Glass Button CTA */}
            <div className="pt-4">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-dark text-xs sm:text-sm py-3.5 px-7 flex items-center gap-2 shadow-lg"
              >
                <span>Request Depot Inspection & Pickup</span>
                <ArrowRight className="h-4 w-4 text-teal-400" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

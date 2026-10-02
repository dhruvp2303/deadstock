'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowUpRight,
  ShieldCheck,
  TrendingUp,
  Activity,
  Zap,
  RotateCcw,
  Ship,
  Train,
  Building2,
  Anchor,
  Box,
  Plane,
  Truck,
  Search,
  CheckCircle2,
  Layers,
  ArrowRight,
  Sliders,
  Play,
} from 'lucide-react'

interface HeroProps {
  onGetStarted: () => void
  onBrowseMarketplace: () => void
}

const FLEET_MODES = [
  {
    id: 'ocean',
    label: 'Ocean Freight',
    icon: Ship,
    tagline: 'Mega-Vessels & Port Gantry Terminals',
    desc: 'Bulk container lots routed across 48+ international deep-sea maritime ports.',
    stats: '2.4M TEU Capacity · 42 Global Ports',
    image: 'https://images.unsplash.com/photo-1542314831-c6a4d272990a?w=1800&auto=format&fit=crop&q=85',
  },
  {
    id: 'rail',
    label: 'Freight Rail',
    icon: Train,
    tagline: 'High-Volume Inland Heavy Rail Lines',
    desc: 'Direct industrial corridor rail freight linking manufacturing hubs & dry ports.',
    stats: '1,200 km Daily Transit · 99.4% On-Time',
    image: 'https://images.unsplash.com/photo-1519074069444-1ba4ea16e834?w=1800&auto=format&fit=crop&q=85',
  },
  {
    id: 'depot',
    label: 'Automated Cranes',
    icon: Building2,
    tagline: 'Smart Warehouse Gantry & Hoist Networks',
    desc: 'Automated crane stacking, live weight inspection, and zero-downtime container staging.',
    stats: '14 Automated Depots · 4.8 Min Cycle',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1800&auto=format&fit=crop&q=85',
  },
  {
    id: 'air',
    label: 'Air Cargo',
    icon: Plane,
    tagline: 'Urgent High-Value Component Airlifts',
    desc: 'Priority express freight for high-value obsolete chips, avionics & critical parts.',
    stats: 'Next-Day Global Flight Hubs',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&auto=format&fit=crop&q=85',
  },
]

export const DSHero: React.FC<HeroProps> = ({ onGetStarted, onBrowseMarketplace }) => {
  const [selectedFleet, setSelectedFleet] = useState(FLEET_MODES[0])
  const [trackingQuery, setTrackingQuery] = useState('')
  const [trackingResult, setTrackingResult] = useState<string | null>(null)
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingQuery.trim()) {
      setTrackingResult('Enter a Container ID (e.g. DS-4019 or SWIFT-992)')
      return
    }
    setTrackingResult(`Status: In Transit via ${selectedFleet.label} • Port Nhava Sheva • 93% Matched Buyer`)
  }

  return (
    <section
      id="home"
      className="relative min-h-[96vh] lg:min-h-screen overflow-hidden flex flex-col justify-between bg-[#061826] text-white pt-24 sm:pt-28 pb-12 select-none"
    >
      {/* ── Background Layer: Ultra-HD Vessel Imagery & Atmospheric Gradient ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={selectedFleet.id}
            src={selectedFleet.image}
            alt={selectedFleet.tagline}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.42, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="absolute inset-0 w-full h-full object-cover object-center mix-blend-luminosity"
            loading="eager"
          />
        </AnimatePresence>

        {/* Cinematic Ocean & Deep Navy Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 65% 25%, rgba(10, 127, 168, 0.35) 0%, rgba(7, 30, 46, 0.88) 55%, rgba(4, 18, 28, 0.98) 100%)',
          }}
        />

        {/* Subtle Industrial Grid */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute -top-32 right-1/4 w-[650px] h-[650px] bg-teal-500/15 rounded-full blur-[180px]" />
        <div className="absolute bottom-10 -left-20 w-[550px] h-[550px] bg-amber-500/12 rounded-full blur-[160px]" />
      </div>

      {/* ── Main Content Container ── */}
      <div className="relative z-10 max-w-[1440px] mx-auto w-full px-4 sm:px-8 py-6 sm:py-10 flex-1 flex flex-col justify-between">

        {/* Top Status & Live Operation Badges */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg text-xs font-semibold text-teal-200">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="font-mono text-white tracking-wider">GLOBAL INDUSTRIAL FREIGHT & LIQUIDATION</span>
            <span className="text-white/40">|</span>
            <span className="text-amber-300 font-bold">₹12.4Cr+ Dead Stock Rescued</span>
          </div>

          {/* Live Fleets Mode Pill Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-black/40 backdrop-blur-xl border border-white/15">
            {FLEET_MODES.map((mode) => {
              const Icon = mode.icon
              const isSelected = selectedFleet.id === mode.id
              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedFleet(mode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/30'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{mode.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Hero Grid: Left Typography & Quick Track / Right Live Crane & Hanging Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-14 items-center my-auto">

          {/* ── Left Column (7 cols) ── */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold tracking-widest uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Smart Solutions For Global Inventory & Transport</span>
              </div>

              <h1
                className="font-black text-white leading-[0.92] tracking-tight uppercase"
                style={{
                  fontSize: 'clamp(2.8rem, 6.8vw, 6.4rem)',
                  letterSpacing: '-0.035em',
                  textShadow: '0 10px 40px rgba(0,0,0,0.6)',
                }}
              >
                SMART CARGO.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-200 to-amber-300">
                  ZERO DEAD STOCK.
                </span>
              </h1>
            </div>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              We provide technology-driven industrial logistics that rescue dormant surplus, match high-velocity verified B2B buyers, and coordinate crane-loaded intermodal transport across sea, rail, and road.
            </p>

            {/* Quick Live Container / Parcel Tracking Lookup Bar */}
            <form onSubmit={handleTrack} className="max-w-xl">
              <div className="relative flex items-center p-1.5 rounded-full bg-white/10 backdrop-blur-2xl border border-white/25 shadow-2xl focus-within:border-teal-400 transition-all">
                <div className="pl-4 text-teal-300">
                  <Search className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  value={trackingQuery}
                  onChange={(e) => setTrackingQuery(e.target.value)}
                  placeholder="Track container ID or SKU (e.g., DS-4019, PC2048)..."
                  className="w-full bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder:text-white/50 focus:outline-hidden font-mono"
                />
                <button
                  type="submit"
                  className="btn-glass-amber text-xs font-extrabold py-2.5 px-5 shrink-0"
                >
                  <span>TRACK CARGO</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {trackingResult && (
                <div className="mt-2.5 px-4 py-2 rounded-xl bg-teal-950/80 border border-teal-500/40 text-teal-200 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{trackingResult}</span>
                </div>
              )}
            </form>

            {/* Glassmorphism Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-primary text-sm sm:text-base py-3.5 px-8 flex items-center gap-3 shadow-2xl group"
              >
                <span>Launch Recovery Engine</span>
                <span className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowUpRight className="h-4 w-4 text-white" />
                </span>
              </button>

              <button
                type="button"
                onClick={onBrowseMarketplace}
                className="btn-glass-secondary text-sm sm:text-base py-3.5 px-7 flex items-center gap-2"
              >
                <Box className="h-4 w-4 text-teal-300" />
                <span>Explore Live Marketplace</span>
              </button>

              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center gap-2 text-xs font-bold text-white/80 hover:text-white px-4 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                <div className="h-6 w-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Play className="h-3 w-3 text-amber-300 fill-amber-300 ml-0.5" />
                </div>
                <span>Watch Logistics Demo</span>
              </button>
            </div>

            {/* Industrial Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/15 text-xs text-white/75 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-teal-400" />
                <span>Bank-Grade Escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-400" />
                <span>8.4-Day Avg Velocity</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4 text-emerald-400" />
                <span>Zero Warehouse Spoilage</span>
              </div>
            </div>
          </div>

          {/* ── Right Column: Suspended Live Crane & Branded Container (5 cols) ── */}
          <div className="lg:col-span-5 relative flex flex-col items-center justify-center">

            {/* Gantry Crane Outer Rig Frame */}
            <div className="relative w-full max-w-[500px] bg-gradient-to-b from-[#0A2234]/95 to-[#061826]/98 border border-white/25 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">

              {/* Gantry Crane Top Steel Girder & Hoist Trolley */}
              <div className="relative w-full border-b-2 border-amber-400/80 pb-3 mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3.5 w-3.5 bg-amber-400 rotate-45 shadow-sm" />
                  <span className="text-[11px] font-mono font-black text-amber-400 tracking-wider uppercase">
                    HARBOR GANTRY HOIST · CRANE #04
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  ACTIVE HOIST
                </div>
              </div>

              {/* Crane Rigging & Steel Suspension Cables SVG */}
              <div className="relative w-full flex flex-col items-center">
                {/* Yellow Crane Trolley Block */}
                <div className="w-20 h-5 bg-gradient-to-r from-amber-500 to-amber-400 rounded-sm shadow-md flex items-center justify-center border border-amber-300/40">
                  <div className="w-10 h-1.5 bg-black/40 rounded-full" />
                </div>

                {/* Steel Cables SVG with High-Tension Spreader Bar */}
                <svg viewBox="0 0 360 80" className="w-full h-16 overflow-visible">
                  {/* Central Hoist Cable */}
                  <line x1="180" y1="0" x2="180" y2="40" stroke="#FBBF24" strokeWidth="3" />
                  {/* Spreader Bar */}
                  <line x1="30" y1="40" x2="330" y2="40" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
                  {/* Corner Sling Cables to Container Castings */}
                  <line x1="40" y1="40" x2="20" y2="80" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 2" />
                  <line x1="320" y1="40" x2="340" y2="80" stroke="#CBD5E1" strokeWidth="2.5" strokeDasharray="4 2" />
                  <line x1="180" y1="40" x2="120" y2="80" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
                  <line x1="180" y1="40" x2="240" y2="80" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="2 2" opacity="0.6" />
                  {/* Center Hook */}
                  <circle cx="180" cy="40" r="5" fill="#F59E0B" stroke="#0F254B" strokeWidth="2" />
                </svg>

                {/* ── Suspended Branded DeadStock Red/Orange Container (Live Physics Sway) ── */}
                <motion.div
                  animate={{
                    y: [-6, 6, -6],
                    rotate: [-1.2, 1.2, -1.2],
                  }}
                  transition={{
                    duration: 5.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="relative w-full"
                >
                  <div
                    className="relative rounded-2xl overflow-hidden p-6 text-white shadow-2xl border-2 border-white/40"
                    style={{
                      background: 'linear-gradient(145deg, #DE3E28 0%, #B91C1C 60%, #991B1B 100%)',
                      boxShadow: '0 30px 70px -15px rgba(222, 62, 40, 0.55), 0 0 35px rgba(222, 62, 40, 0.3)',
                    }}
                  >
                    {/* Realistic Corrugation Ridges */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none flex justify-between">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div key={i} className="w-2 h-full bg-black/50 border-r border-white/20" />
                      ))}
                    </div>

                    {/* Corner Castings */}
                    <div className="absolute top-2 left-2 h-3 w-3 rounded-xs bg-amber-400/90 shadow-sm border border-black/40" />
                    <div className="absolute top-2 right-2 h-3 w-3 rounded-xs bg-amber-400/90 shadow-sm border border-black/40" />
                    <div className="absolute bottom-2 left-2 h-3 w-3 rounded-xs bg-amber-400/90 shadow-sm border border-black/40" />
                    <div className="absolute bottom-2 right-2 h-3 w-3 rounded-xs bg-amber-400/90 shadow-sm border border-black/40" />

                    {/* Container Branding & Telemetry */}
                    <div className="relative z-10 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/20 pb-2">
                        <span className="text-[10px] font-mono tracking-widest text-amber-200 font-black uppercase">
                          CONTAINER ID: DEADSTOCK-4019
                        </span>
                        <span className="text-[10px] font-mono text-amber-300 font-extrabold bg-black/40 px-2 py-0.5 rounded border border-amber-400/30">
                          94% CRITICAL RISK RESCUED
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-2xl sm:text-3xl font-black tracking-tight text-white uppercase select-none">
                              DEADSTOCK
                            </h4>
                            <span className="text-xs font-mono font-bold bg-white text-red-600 px-1.5 py-0.5 rounded">
                              FREIGHT
                            </span>
                          </div>
                          <p className="text-xs text-amber-100 font-medium mt-0.5">
                            PCB Control Modules & Connectors (4,500 units)
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="block text-[10px] font-mono text-white/70 uppercase">Recovered Capital</span>
                          <span className="text-xl sm:text-2xl font-black font-mono text-emerald-300">
                            +₹6,40,000
                          </span>
                        </div>
                      </div>

                      {/* Live Counterparty Routing Match Box */}
                      <div className="bg-black/50 backdrop-blur-md rounded-xl p-2.5 border border-white/15 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-teal-300 shrink-0" />
                          <div>
                            <span className="font-bold text-white block">ElectroTech Industries</span>
                            <span className="text-[10px] text-teal-200/80">Ahmedabad Dry Port Depot · 93% Match</span>
                          </div>
                        </div>
                        <div className="px-2.5 py-1 rounded-full bg-emerald-500 text-white text-[10px] font-extrabold shadow-sm">
                          Escrow Funded
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Floating Live Telemetry Badges */}
                  <div className="absolute -top-3.5 -right-3.5 z-20 px-3.5 py-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-black shadow-2xl border border-white/50 flex items-center gap-1.5 animate-bounce">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>+₹12Cr+ Rescued Total</span>
                  </div>

                  <div className="absolute -bottom-3.5 -left-3.5 z-20 px-3.5 py-1.5 rounded-full bg-[#072433] text-teal-300 text-[11px] font-mono font-bold shadow-2xl border border-teal-400/50 flex items-center gap-1.5">
                    <RotateCcw className="h-3.5 w-3.5 text-teal-400" />
                    <span>Circular Recovery: 84% Salvage</span>
                  </div>
                </motion.div>
              </div>

              {/* Bottom Rig Status Bar */}
              <div className="mt-6 pt-3 border-t border-white/15 flex items-center justify-between text-[11px] font-mono text-white/80">
                <span className="flex items-center gap-1.5">
                  <Anchor className="h-3.5 w-3.5 text-teal-400" />
                  Port Nhava Sheva / Pune Corridor
                </span>
                <span className="text-amber-300 font-bold">100% Inspected & Sealed</span>
              </div>
            </div>

          </div>

        </div>

        {/* ── Bottom KPI Metric Counter Strip (Inspired by ShipNex & Shipper) ── */}
        <div className="pt-8 mt-6 border-t border-white/15 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-2xl sm:text-3xl font-black font-mono text-white">24+</span>
            <p className="text-xs text-teal-200/80 font-medium mt-0.5">Years Combined Logistics Network</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-2xl sm:text-3xl font-black font-mono text-amber-300">₹67M+</span>
            <p className="text-xs text-amber-200/80 font-medium mt-0.5">Dead Capital Liquidated</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-2xl sm:text-3xl font-black font-mono text-teal-300">83+</span>
            <p className="text-xs text-teal-200/80 font-medium mt-0.5">Monthly Freight Deliveries</p>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
            <span className="text-2xl sm:text-3xl font-black font-mono text-emerald-300">3,450+</span>
            <p className="text-xs text-emerald-200/80 font-medium mt-0.5">Verified Industrial Counterparties</p>
          </div>
        </div>

      </div>

      {/* Video Modal Simulation */}
      {isVideoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl bg-[#0A1A2F] border border-white/20 rounded-3xl p-6 shadow-2xl text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-sm font-mono font-bold text-teal-300 uppercase">
                DeadStock Logistics Engine Overview
              </span>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="text-white/60 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black/60 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=80"
                alt="Cargo Vessel in Port"
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-teal-500/80 text-white flex items-center justify-center shadow-lg">
                  <Play className="h-6 w-6 ml-0.5 fill-white" />
                </div>
                <h4 className="text-lg font-bold text-white">Automated Gantry & Intermodal Routing</h4>
                <p className="text-xs text-white/80 max-w-md">
                  Experience how dormant industrial inventory gets scanned, matched to buyers, and loaded onto container vessels within 72 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

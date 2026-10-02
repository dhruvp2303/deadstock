'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Ship,
  Train,
  Plane,
  Truck,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Star,
  CheckCircle2,
  Globe,
  MapPin,
  TrendingUp,
} from 'lucide-react'

interface GlobalRouteNetworkProps {
  onGetStarted: () => void
}

const TRADE_CORRIDORS = [
  {
    id: 'corridor-1',
    name: 'Western Industrial Hub to Harbor',
    origin: 'Ahmedabad / Surat Depots',
    destination: 'Port Nhava Sheva (Mumbai)',
    mode: 'Heavy Rail & Maritime Vessel',
    transitTime: '18 Hours',
    volume: '14,200 Tons/Mo',
    status: 'OPTIMAL VELOCITY',
  },
  {
    id: 'corridor-2',
    name: 'Southern Tech Arc to Coastal Port',
    origin: 'Bengaluru / Hyderabad Tech Parks',
    destination: 'Chennai Port Container Terminal',
    mode: 'Express Freight Air & Road Fleet',
    transitTime: '12 Hours',
    volume: '8,900 Tons/Mo',
    status: 'ACTIVE BERTH',
  },
  {
    id: 'corridor-3',
    name: 'Northern Manufacturing Belt',
    origin: 'NCR / Punjab Industrial Depots',
    destination: 'Kandla Sea Port Terminal',
    mode: 'Dedicated Freight Rail Corridor',
    transitTime: '24 Hours',
    volume: '19,500 Tons/Mo',
    status: 'ESCROW SEALED',
  },
]

export const DSGlobalRouteNetwork: React.FC<GlobalRouteNetworkProps> = ({ onGetStarted }) => {
  const [activeCorridor, setActiveCorridor] = useState(TRADE_CORRIDORS[0])

  return (
    <section className="py-24 sm:py-32 px-4 sm:px-8 bg-[#071E2E] text-white relative overflow-hidden border-t border-white/10">
      {/* Background Top-Down Aerial Container Ship Cutting Through Ocean (Inspired by Image 4: BeyRoute) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=2000&auto=format&fit=crop&q=85"
          alt="Top down container vessel cutting through deep turquoise sea"
          className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity scale-105"
        />

        {/* Cinematic Ocean Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 30%, rgba(20, 184, 166, 0.2) 0%, rgba(7, 30, 46, 0.9) 60%, rgba(4, 18, 28, 0.98) 100%)',
          }}
        />

        {/* Ambient Glows */}
        <div className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-teal-500/15 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 -left-20 w-[500px] h-[500px] bg-sky-500/15 rounded-full blur-[160px]" />
      </div>

      <div className="max-w-[1400px] mx-auto space-y-16 relative z-10">

        {/* Top Header Block: Beyond Borders to Faster (Inspired by Image 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-teal-300 text-xs font-mono font-bold tracking-widest uppercase">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Moving Industrial Assets Beyond Borders</span>
            </div>

            <h2
              className="font-black text-white leading-[0.92] tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5.8rem)', letterSpacing: '-0.035em' }}
            >
              BEYOND BORDERS<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-sky-200 to-amber-300">
                TO FASTER.
              </span>
            </h2>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <p className="text-white/85 text-base leading-relaxed">
              Trusted logistics solutions connecting industrial enterprises across deep-sea maritime ports, dedicated freight railways, and automated factory depots with maximum speed and zero friction.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-primary text-xs sm:text-sm py-3.5 px-8 shadow-xl"
              >
                <span>Book Intermodal Route</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Global Network Map Visualization Rig */}
        <div className="relative rounded-3xl overflow-hidden bg-black/40 backdrop-blur-2xl border border-white/20 p-6 sm:p-10 shadow-2xl space-y-8">

          {/* Dotted World Map & Animated Route Nodes SVG */}
          <div className="relative w-full aspect-[21/9] min-h-[300px] rounded-2xl overflow-hidden bg-[#051524] border border-white/10 flex items-center justify-center p-4">
            {/* World Grid Dotted Map Texture */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Simulated Animated Dotted Route Paths SVG */}
            <svg viewBox="0 0 1000 400" className="w-full h-full absolute inset-0 overflow-visible pointer-events-none">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2DD4BF" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#FBBF24" />
                </linearGradient>
              </defs>

              {/* Ocean Vessel Route 1 */}
              <path
                d="M 150 260 Q 350 140 550 220 T 850 180"
                fill="none"
                stroke="url(#routeGradient)"
                strokeWidth="2.5"
                strokeDasharray="6 4"
                className="animate-pulse"
              />

              {/* Freight Rail Route 2 */}
              <path
                d="M 220 320 Q 420 280 620 310 T 880 240"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="2"
                strokeDasharray="4 3"
                opacity="0.8"
              />

              {/* Nodes along path */}
              <circle cx="150" cy="260" r="7" fill="#2DD4BF" />
              <circle cx="550" cy="220" r="6" fill="#38BDF8" />
              <circle cx="850" cy="180" r="8" fill="#FBBF24" />
            </svg>

            {/* Interactive Floating Route Nodes */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-auto">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="px-4 py-2 rounded-2xl bg-[#071E2E]/90 backdrop-blur-md border border-teal-500/40 text-xs font-mono text-teal-300 flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>48 ACTIVE MARITIME LANES · 14 RAILWAY CORRIDORS</span>
                </div>

                <div className="flex items-center gap-2">
                  {TRADE_CORRIDORS.map((corridor) => (
                    <button
                      key={corridor.id}
                      type="button"
                      onClick={() => setActiveCorridor(corridor)}
                      className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold border transition-all ${
                        activeCorridor.id === corridor.id
                          ? 'bg-teal-500 text-[#071E2E] border-teal-400 font-extrabold shadow-lg'
                          : 'bg-white/10 text-white/80 border-white/15 hover:bg-white/20'
                      }`}
                    >
                      {corridor.name.split(' to ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating Active Node Banner */}
              <div className="max-w-md p-4 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/20 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-300 uppercase">
                    {activeCorridor.name}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                    {activeCorridor.status}
                  </span>
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{activeCorridor.origin}</span>
                  <ArrowRight className="h-4 w-4 text-teal-400" />
                  <span>{activeCorridor.destination}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-white/70 font-mono pt-1">
                  <span>Mode: {activeCorridor.mode}</span>
                  <span className="text-teal-300 font-bold">{activeCorridor.transitTime} Transit</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Trust & Volume Counters (Inspired by Image 4 bottom) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-white/15">
            {/* Stat 1 */}
            <div className="flex items-center gap-4">
              <div className="text-4xl sm:text-5xl font-black font-mono text-white">5M+</div>
              <div>
                <span className="text-xs font-bold text-white block">Tons of Cargo Rescued</span>
                <span className="text-[11px] text-teal-200/70 font-mono">Delivered Without Dead-Stock Losses</span>
              </div>
            </div>

            {/* Stat 2: Verified Client Testimonial Pill */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-8 h-8 rounded-full border-2 border-[#071E2E] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-8 h-8 rounded-full border-2 border-[#071E2E] object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
                  alt="Client"
                  className="w-8 h-8 rounded-full border-2 border-[#071E2E] object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span className="text-xs font-bold text-white font-mono">4.9 / 5.0 Rating</span>
                </div>
                <span className="text-[10px] text-white/70 font-mono">15,000+ Enterprise Clients</span>
              </div>
            </div>

            {/* Stat 3: 100% Escrow & Inspection Guarantee */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-bold text-white block">Escrow-Backed Delivery</span>
                <span className="text-[11px] text-teal-200/70 font-mono">Funds released upon destination QA</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

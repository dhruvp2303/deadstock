'use client'

import React, { useState } from 'react'
import {
  ShieldCheck,
  Star,
  Quote,
  CheckCircle2,
  Lock,
  Scale,
  FileCheck,
  Users,
  ChevronLeft,
  ChevronRight,
  Play,
} from 'lucide-react'

const TESTIMONIALS = [
  {
    name: 'Darlene Robertson',
    role: 'Procurement Director',
    company: 'Fakhouri Logistics & Manufacturing',
    quote:
      'DeadStock transformed how we handle quarterly factory surplus. Their automated crane dispatch and verified buyer matching salvaged ₹34.8L in dead capital within 6 days.',
    rating: 5,
    stat: '₹34.8L Recovered (92% Salvage)',
    verified: 'Verified Enterprise Seller',
    img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Michael R.',
    role: 'Director of Plant Operations',
    company: 'Nexis Precision Electronics',
    quote:
      'Their team handled our intermodal shipping and cargo lot liquidation seamlessly. Clear communication, automated escrow, and professional service made the whole process stress-free.',
    rating: 5,
    stat: '78% Value Salvaged',
    verified: 'Verified Procurement Partner',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  },
  {
    name: 'Arjun Mehta',
    role: 'VP Supply Chain',
    company: 'Vortex Auto Dynamics',
    quote:
      'No predatory broker markups, no hidden commissions. Direct counterparty matching backed by certified inspection reports and neutral escrow settlement.',
    rating: 5,
    stat: '48h Escrow Payout',
    verified: 'Verified B2B Buyer',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  },
]

const ENTERPRISE_LOGOS = ['TATA MOTORS', 'MAHINDRA', 'SIEMENS', 'SCHNEIDER', 'ABB INDUSTRIAL', 'L&T HEAVY']

export const DSTestimonials: React.FC = () => {
  const [currentIdx, setCurrentIdx] = useState(0)

  const next = () => setCurrentIdx((prev) => (prev + 1) % TESTIMONIALS.length)
  const prev = () => setCurrentIdx((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const current = TESTIMONIALS[currentIdx]

  return (
    <section id="trust-layer" className="py-24 sm:py-32 px-4 sm:px-8 bg-[#061826] text-white border-t border-white/10 relative overflow-hidden">
      <div className="max-w-[1400px] mx-auto space-y-16 relative z-10">

        {/* Section Header (Inspired by Image 2 & Image 3: See What Our Happy Clients Are Saying) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-teal-500/10 text-teal-300 border border-teal-500/30 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
              <span>Verified Enterprise Feedback</span>
            </div>
            <h2
              className="font-black text-white leading-[0.95] tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)', letterSpacing: '-0.03em' }}
            >
              See What Our Happy<br />Clients Are Saying
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prev}
              className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </button>
            <button
              type="button"
              onClick={next}
              className="h-12 w-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Main Testimonial Card Showcase (Image 3 ShipNex Style) */}
        <div className="bg-gradient-to-br from-black/50 to-[#0A2234]/80 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left: Client Portrait Photo with Glass Video Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden aspect-4/3 max-h-[380px] w-full shadow-2xl border border-white/20">
              <img
                src={current.img}
                alt={current.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs">
                <span className="font-bold text-white font-mono">{current.company}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                  {current.verified}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Quote, 5 Stars, Author Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-1.5 text-amber-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400" />
              ))}
              <span className="text-xs font-mono font-bold text-white/80 ml-2">5.0 Star Audit</span>
            </div>

            <Quote className="h-10 w-10 text-teal-400/40" />

            <p className="text-lg sm:text-2xl font-medium text-white leading-relaxed italic">
              &ldquo;{current.quote}&rdquo;
            </p>

            <div className="pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-white">{current.name}</h4>
                <p className="text-xs text-teal-200/80 font-medium">{current.role}</p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-teal-500/20 border border-teal-500/40 text-teal-300 font-mono text-xs font-bold">
                {current.stat}
              </div>
            </div>
          </div>

        </div>

        {/* Enterprise Logos Ribbon */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-6 text-xs font-mono font-black text-white/40 tracking-widest uppercase">
          {ENTERPRISE_LOGOS.map((brand, i) => (
            <span key={i} className="hover:text-teal-300 transition-colors">
              {brand}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}

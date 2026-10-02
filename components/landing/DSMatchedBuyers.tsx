'use client'

import React, { useState } from 'react'
import { CheckCircle2, TrendingUp, DollarSign, ArrowUpRight, Sparkles, Building2, MapPin, Sliders, ShieldCheck, Send, Layers } from 'lucide-react'

export const DSMatchedBuyers: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [activeBuyerIdx, setActiveBuyerIdx] = useState(0)
  const [offerPrice, setOfferPrice] = useState(38)
  const [offerUnits, setOfferUnits] = useState(3000)
  const [escrowTerm, setEscrowTerm] = useState('Standard (48h Escrow Payout)')

  const buyers = [
    {
      name: 'ElectroTech Industries',
      category: 'Electronics & Component Assembly',
      location: 'Ahmedabad, Gujarat',
      overallMatch: 93,
      verified: true,
      demandQty: '3,000 units',
      dealValue: '₹2.4L',
      breakdown: {
        specifications: 96,
        industry: 95,
        location: 96,
        price: 88,
      },
      note: 'Verified compatibility with industrial connector production batch.',
    },
    {
      name: 'Nova Components Ltd.',
      category: 'Robotics & Automation Systems',
      location: 'Bengaluru, Karnataka',
      overallMatch: 87,
      verified: true,
      demandQty: '2,500 units',
      dealValue: '₹1.9L',
      breakdown: {
        specifications: 90,
        industry: 92,
        location: 80,
        price: 85,
      },
      note: 'High purchasing capacity for surplus PCB sub-modules.',
    },
    {
      name: 'Kiran Polymers Corp',
      category: 'Plastics & Raw Resins',
      location: 'Surat, Gujarat',
      overallMatch: 84,
      verified: true,
      demandQty: '5,000 units',
      dealValue: '₹1.4L',
      breakdown: {
        specifications: 88,
        industry: 86,
        location: 94,
        price: 82,
      },
      note: 'Immediate absorption capability for industrial polymer housing.',
    },
  ]

  const activeBuyer = buyers[activeBuyerIdx]

  return (
    <section id="buyer-matching" className="py-20 sm:py-28 px-4 sm:px-8 bg-[#081525] text-white relative overflow-hidden border-t border-white/10 scroll-mt-20">
      {/* Background Watermark Text */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-black text-[18vw] leading-none select-none pointer-events-none uppercase tracking-widest">
        MATCH
      </div>

      <div className="max-w-[1380px] mx-auto space-y-14 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold tracking-wider bg-white/10 text-teal-300 border border-white/15 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Workflow 02 · Counterparty Matching & Negotiation</span>
          </div>
          <h2
            className="font-black text-white leading-tight tracking-tight"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', letterSpacing: '-0.025em' }}
          >
            Verified B2B Buyer Matching & Bargaining
          </h2>
          <p className="text-sm sm:text-base text-gray-300">
            Multi-factor scoring matches your dead stock to manufacturing counterparties. Negotiate price, terms, and escrow payouts in real-time.
          </p>
        </div>

        {/* Main 2-Column Showcase: Left Match Breakdown / Right Interactive Negotiation Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Buyer List & Detailed Breakdown Cards (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-mono text-teal-300 font-bold uppercase tracking-wider block">
              Active Ranked Matches for PC2048 (Surplus Batch)
            </span>

            <div className="space-y-3">
              {buyers.map((b, idx) => {
                const isSelected = activeBuyerIdx === idx
                return (
                  <div
                    key={b.name}
                    onClick={() => setActiveBuyerIdx(idx)}
                    className={`cursor-pointer rounded-2xl p-5 border transition-all duration-300 ${
                      isSelected
                        ? 'bg-white/12 border-teal-400/80 shadow-2xl scale-[1.01]'
                        : 'bg-white/5 border-white/10 hover:bg-white/8 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white">{b.name}</h3>
                          {b.verified && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                              <ShieldCheck className="h-3 w-3" />
                              VERIFIED
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                          <MapPin className="h-3.5 w-3.5 text-teal-400" />
                          <span>{b.location}</span>
                          <span>•</span>
                          <span>{b.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-black">
                          {b.overallMatch}% Fit
                        </div>
                        <span className="block text-[11px] font-mono text-gray-300 mt-1">
                          Absorbs {b.demandQty}
                        </span>
                      </div>
                    </div>

                    {/* Detailed Compatibility Score Breakdown Grid */}
                    <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                      <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                        <span className="text-[10px] text-gray-400 block">Specs Fit</span>
                        <span className="font-bold text-teal-300">{b.breakdown.specifications}%</span>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                        <span className="text-[10px] text-gray-400 block">Industry Fit</span>
                        <span className="font-bold text-teal-300">{b.breakdown.industry}%</span>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                        <span className="text-[10px] text-gray-400 block">Location Fit</span>
                        <span className="font-bold text-teal-300">{b.breakdown.location}%</span>
                      </div>
                      <div className="bg-black/30 rounded-lg p-2 border border-white/5">
                        <span className="text-[10px] text-gray-400 block">Price Elasticity</span>
                        <span className="font-bold text-emerald-300">{b.breakdown.price}%</span>
                      </div>
                    </div>

                    <p className="mt-3 text-xs text-teal-100/80 italic">
                      &ldquo;{b.note}&rdquo;
                    </p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Interactive Negotiation & Bargaining Console (6 cols) */}
          <div className="lg:col-span-6 bg-gradient-to-b from-[#0F254B] to-[#081827] rounded-3xl p-6 sm:p-8 border border-white/20 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/15 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-amber-400" />
                  <h3 className="font-black text-lg text-white">Live Deal Negotiation Console</h3>
                </div>
                <p className="text-xs text-gray-300 mt-0.5">
                  Negotiate directly with {activeBuyer.name}
                </p>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Escrow Protected
              </span>
            </div>

            {/* Negotiation Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">Bargaining Unit Price (₹)</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">₹{offerPrice}/unit</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={55}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
                <div className="flex justify-between text-[10px] font-mono text-gray-400 mt-1">
                  <span>Fast liquidation: ₹20</span>
                  <span>Target salvage: ₹38</span>
                  <span>Premium: ₹55</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-300 font-medium">Batch Volume Quantity</span>
                  <span className="font-mono font-bold text-white text-sm">{offerUnits.toLocaleString('en-IN')} units</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={4500}
                  step={250}
                  value={offerUnits}
                  onChange={(e) => setOfferUnits(Number(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-teal-400"
                />
              </div>
            </div>

            {/* Live Calculation Output Card */}
            <div className="rounded-2xl bg-black/40 p-4 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Total Settlement Value:</span>
                <span className="text-xl font-black font-mono text-emerald-400">
                  ₹{(offerPrice * offerUnits).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Capital Recovery Rate:</span>
                <span className="font-mono font-bold text-teal-300">
                  {Math.min(98, Math.round((offerPrice / 40) * 100))}% of Original Book Value
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-400">Escrow Settlement SLA:</span>
                <span className="font-mono text-amber-300 font-semibold">{escrowTerm}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-primary flex-1 py-3 text-xs font-bold"
              >
                <Send className="h-3.5 w-3.5" />
                <span>Submit Binding Counter-Offer</span>
              </button>

              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-secondary py-3 px-5 text-xs font-bold"
              >
                Inspect Buyer KYC
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

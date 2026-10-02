'use client'

import React, { useState } from 'react'
import { ArrowUpRight, Tag, Package, MapPin, ShieldCheck, Lock, CheckCircle2, RefreshCw } from 'lucide-react'

type Currency = 'INR' | 'USD' | 'EUR' | 'GBP'

const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number }> = {
  INR: { symbol: '₹', rate: 1 },
  USD: { symbol: '$', rate: 0.012 },
  EUR: { symbol: '€', rate: 0.011 },
  GBP: { symbol: '£', rate: 0.0095 },
}

const PRODUCTS = [
  {
    id: 1,
    title: 'High-Tensile Precision M8 Steel Fasteners',
    category: 'Mechanical Hardware',
    units: 12000,
    location: 'Ahmedabad Depot, IN',
    baseOriginalInr: 240000,
    baseSaleInr: 91000,
    discount: '62% off',
    img: 'https://images.unsplash.com/photo-1553413077-190dd305871c?w=600&auto=format&fit=crop&q=80',
    tag: 'VERIFIED SURPLUS',
    matchScore: 94,
    condition: 'Factory Sealed Surplus',
  },
  {
    id: 2,
    title: 'SMD Microcontroller PCB Boards v2',
    category: 'Electronics & Semiconductor',
    units: 5500,
    location: 'Bengaluru Center, IN',
    baseOriginalInr: 680000,
    baseSaleInr: 306000,
    discount: '55% off',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    tag: 'CRITICAL SALVAGE',
    matchScore: 91,
    condition: 'Original Packaging',
  },
  {
    id: 3,
    title: 'Industrial Polymer Storage Containers & Pallets',
    category: 'Plastics & Logistics',
    units: 850,
    location: 'Pune Logistics Hub, IN',
    baseOriginalInr: 520000,
    baseSaleInr: 270000,
    discount: '48% off',
    img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    tag: 'CIRCULAR RECOVERY',
    matchScore: 89,
    condition: 'Overstock Excess',
  },
  {
    id: 4,
    title: 'Hydraulic Seals & Actuator Gaskets OEM',
    category: 'Automotive & Heavy Industry',
    units: 3200,
    location: 'Surat Depot, IN',
    baseOriginalInr: 1160000,
    baseSaleInr: 348000,
    discount: '70% off',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&auto=format&fit=crop&q=80',
    tag: 'FLASH CLEARANCE',
    matchScore: 86,
    condition: 'OEM Certified Lot',
  },
]

export const DSMarketplace: React.FC<{ onBrowseMarketplace: () => void }> = ({ onBrowseMarketplace }) => {
  const [currency, setCurrency] = useState<Currency>('INR')

  const formatPrice = (inrVal: number) => {
    const { symbol, rate } = CURRENCY_RATES[currency]
    const converted = Math.round(inrVal * rate)
    if (currency === 'INR') {
      return inrVal >= 100000 ? `₹${(inrVal / 100000).toFixed(1)}L` : `₹${inrVal.toLocaleString('en-IN')}`
    }
    return `${symbol}${converted.toLocaleString()}`
  }

  return (
    <section id="marketplace" className="py-20 sm:py-28 px-4 sm:px-8 bg-white scroll-mt-24 border-b border-gray-200">
      <div className="max-w-[1380px] mx-auto space-y-10">

        {/* Top Header + Localized Currency Toggle */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-4 border-b border-gray-100">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-blue-50 text-blue-800 border border-blue-200">
              <Tag className="h-3.5 w-3.5 text-blue-600" />
              <span>Workflow 03 · Verified Surplus B2B Marketplace</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0B1E2D] tracking-tight">
              Liquidate & Source Verified Surplus Inventory
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
              Authentic batch photos, certified quality specs, instant multi-currency valuation, and zero-risk neutral escrow.
            </p>
          </div>

          {/* Controls: Currency Toggles & Action */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Localized Currency Switcher */}
            <div className="flex items-center bg-gray-100 p-1 rounded-full border border-gray-200 text-xs font-bold">
              {(['INR', 'USD', 'EUR', 'GBP'] as Currency[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCurrency(c)}
                  className={`px-3 py-1.5 rounded-full transition-all ${
                    currency === c
                      ? 'bg-[#0B1E2D] text-white shadow-xs'
                      : 'text-gray-600 hover:text-black hover:bg-gray-200/60'
                  }`}
                >
                  {c === 'INR' ? '₹ INR' : c === 'USD' ? '$ USD' : c === 'EUR' ? '€ EUR' : '£ GBP'}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onBrowseMarketplace}
              className="btn-glass-amber text-xs py-2.5 px-6 font-bold shadow-md flex items-center gap-2"
            >
              <span>Explore All Listings</span>
              <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* ── Product Listings Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              onClick={onBrowseMarketplace}
              className="group rounded-3xl border border-gray-200 bg-white overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 cursor-pointer transition-all duration-300 flex flex-col justify-between"
            >
              {/* Authentic Photo Image Container */}
              <div className="relative h-52 overflow-hidden bg-gray-900">
                <img
                  src={p.img}
                  alt={p.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Top Badges */}
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-mono font-black tracking-wider bg-[#0B1E2D]/90 text-teal-300 backdrop-blur-md border border-white/20">
                  {p.tag}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-600 text-white shadow-md">
                  {p.discount}
                </span>

                {/* Bottom Overlay: Condition */}
                <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-white/90">
                  <span className="font-semibold">{p.condition}</span>
                  <span className="font-mono font-bold text-emerald-400 bg-black/50 px-2 py-0.5 rounded backdrop-blur-xs">
                    {p.matchScore}% Match
                  </span>
                </div>
              </div>

              {/* Product Card Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-mono font-bold tracking-wider text-blue-600 uppercase block mb-1">
                    {p.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#0B1E2D] leading-snug line-clamp-2">
                    {p.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2.5">
                    <span className="flex items-center gap-1 font-mono font-medium">
                      <Package className="h-3.5 w-3.5 text-gray-400" />
                      {p.units.toLocaleString()} units
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 truncate">
                      <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                      {p.location}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-black text-[#0B1E2D] font-mono block leading-none">
                      {formatPrice(p.baseSaleInr)}
                    </span>
                    <span className="text-xs text-gray-400 line-through font-mono mt-1 block leading-none">
                      {formatPrice(p.baseOriginalInr)}
                    </span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-[#0B1E2D] group-hover:bg-blue-600 text-white flex items-center justify-center transition-colors shadow-xs">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Transparent Escrow & Payment Protection Strip ── */}
        <div className="rounded-2xl bg-gradient-to-r from-[#072433] via-[#0A344C] to-[#072433] p-6 text-white border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">1. Escrow Lock</h4>
              <p className="text-[11px] text-white/80">Funds securely held in neutral escrow upon offer agreement</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <Package className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">2. Waybill Dispatch</h4>
              <p className="text-[11px] text-white/80">Seller releases cargo with GPS & carrier bill of lading tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-teal-500/20 border border-teal-400/40 flex items-center justify-center text-teal-300 shrink-0">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-300">3. Depot Inspection</h4>
              <p className="text-[11px] text-white/80">Buyer verifies quantity and technical specs upon arrival</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300 shrink-0">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-300">4. Instant Payout</h4>
              <p className="text-[11px] text-white/80">Escrow funds immediately released to seller within 48h</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}


'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calculator,
  Ship,
  Train,
  Building2,
  Plane,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Scale,
} from 'lucide-react'

interface LiveCargoCalculationProps {
  onGetStarted: () => void
}

const CATEGORIES = [
  { id: 'electronics', name: 'Electronics & PCB', baseValue: 550, salvageRate: 0.88, avgMatchDays: 4.8 },
  { id: 'mechanical', name: 'Mechanical & Hardware', baseValue: 120, salvageRate: 0.92, avgMatchDays: 6.2 },
  { id: 'polymers', name: 'Polymers & Resins', baseValue: 85, salvageRate: 0.84, avgMatchDays: 5.5 },
  { id: 'packaging', name: 'Packaging & Cartons', baseValue: 25, salvageRate: 0.78, avgMatchDays: 7.1 },
]

const TRANSPORT_MODES = [
  { id: 'ocean', name: 'Ocean Freight Ship', icon: Ship, multiplier: 1.0, carbonSaved: '64%' },
  { id: 'rail', name: 'Heavy Freight Rail', icon: Train, multiplier: 1.08, carbonSaved: '72%' },
  { id: 'depot', name: 'Automated Depot Crane', icon: Building2, multiplier: 1.15, carbonSaved: '89%' },
  { id: 'air', name: 'Express Air Cargo', icon: Plane, multiplier: 1.45, carbonSaved: '32%' },
]

export const DSLiveCargoCalculation: React.FC<LiveCargoCalculationProps> = ({ onGetStarted }) => {
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0])
  const [selectedMode, setSelectedMode] = useState(TRANSPORT_MODES[0])
  const [units, setUnits] = useState(4500)
  const [agingMonths, setAgingMonths] = useState(8)
  const [originCity, setOriginCity] = useState('Ahmedabad Depot')
  const [destCity, setDestCity] = useState('Port Nhava Sheva (Mumbai)')

  // Calculations
  const grossValue = units * selectedCategory.baseValue
  const agingPenalty = Math.max(0.65, 1 - agingMonths * 0.035)
  const recoveredValue = Math.round(grossValue * selectedCategory.salvageRate * agingPenalty)
  const traditionalLoss = Math.round(grossValue * 0.15) // What traditional scrap dealers pay
  const deadStockGain = recoveredValue - traditionalLoss

  return (
    <section id="calculation" className="py-20 sm:py-28 px-4 sm:px-8 bg-white text-[#0A192F] relative overflow-hidden border-b border-gray-100 scroll-mt-20">
      <div className="max-w-[1380px] mx-auto space-y-12">

        {/* Section Header (Inspired by Image 1) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-700 text-xs font-mono font-bold tracking-wider uppercase">
              <Calculator className="h-3.5 w-3.5" />
              <span>Instant Recovery Engine</span>
            </div>
            <h2
              className="font-black text-[#0A192F] leading-[0.95] tracking-tight uppercase"
              style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.8rem)', letterSpacing: '-0.03em' }}
            >
              Calculation<br />Made Easy
            </h2>
          </div>
          <p className="text-gray-600 max-w-md text-sm sm:text-base leading-relaxed">
            We operate globally, connecting major industrial cities, maritime shipping lanes, and automated crane depots. Calculate your dead inventory liquidation yield in real time.
          </p>
        </div>

        {/* Interactive Live Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Configurator Console (7 cols) */}
          <div className="lg:col-span-7 bg-[#F8FAFC] border border-slate-200/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                Step 1: Configure Cargo Lot Parameters
              </span>
              <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
                Live Valuation Algorithm
              </span>
            </div>

            {/* Category Selectors */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Select Industry SKU Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold border transition-all text-left ${
                      selectedCategory.id === cat.id
                        ? 'bg-[#0B3D5C] text-white border-[#0B3D5C] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Units & Aging Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Dormant Inventory Units</span>
                  <span className="font-mono text-teal-600 text-sm font-black">{units.toLocaleString('en-IN')} units</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={25000}
                  step={500}
                  value={units}
                  onChange={(e) => setUnits(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#0A7FA8]"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>500</span>
                  <span>10,000</span>
                  <span>25,000</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span>Months In Warehouse</span>
                  <span className="font-mono text-amber-600 text-sm font-black">{agingMonths} Months</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={24}
                  step={1}
                  value={agingMonths}
                  onChange={(e) => setAgingMonths(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 mo</span>
                  <span>12 mo</span>
                  <span>24 mo</span>
                </div>
              </div>
            </div>

            {/* Intermodal Logistics Mode Switcher */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Preferred Intermodal Freight Channel
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRANSPORT_MODES.map((mode) => {
                  const Icon = mode.icon
                  const isSelected = selectedMode.id === mode.id
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setSelectedMode(mode)}
                      className={`p-3 rounded-xl border flex flex-col items-start gap-1.5 transition-all ${
                        isSelected
                          ? 'bg-[#072433] text-white border-[#072433] shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isSelected ? 'text-teal-400' : 'text-slate-500'}`} />
                      <span className="text-xs font-bold">{mode.name}</span>
                      <span className="text-[10px] opacity-75 font-mono">Eco: {mode.carbonSaved}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Origin Logistics Depot</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
                >
                  <option value="Ahmedabad Depot">Ahmedabad Dry Port Depot</option>
                  <option value="Surat Warehouse">Surat Industrial Center</option>
                  <option value="Pune Logistics Center">Pune Automotive Hub</option>
                  <option value="Bengaluru Center">Bengaluru Electronics Park</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Target Counterparty Hub</label>
                <select
                  value={destCity}
                  onChange={(e) => setDestCity(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:border-teal-500"
                >
                  <option value="Port Nhava Sheva (Mumbai)">Port Nhava Sheva (Deep Sea)</option>
                  <option value="Chennai Port Terminal">Chennai Port Terminal</option>
                  <option value="Delhi Freight Corridor">Delhi Freight Corridor</option>
                  <option value="Rotterdam Port (Export)">Rotterdam Port (EU Export)</option>
                </select>
              </div>
            </div>

          </div>

          {/* Right Yield & Settlement Display Card (5 cols) */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#072433] to-[#041420] text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-white/10 relative overflow-hidden">
            {/* Ambient Corner Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-6 relative z-10">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-mono font-bold text-teal-300 uppercase tracking-widest">
                  Live Liquidation Telemetry
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  INSTANT MATCH
                </span>
              </div>

              {/* Main Big Number */}
              <div>
                <span className="text-xs text-white/70 uppercase font-mono block">Estimated Net Recovery</span>
                <div className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 tracking-tight mt-1">
                  ₹{(recoveredValue / 100000).toFixed(2)} Lakhs
                </div>
                <p className="text-xs text-teal-200/80 mt-1 font-medium">
                  +₹{(deadStockGain / 100000).toFixed(2)}L additional capital vs traditional scrap disposal
                </p>
              </div>

              {/* Metric Breakdown Table */}
              <div className="space-y-3 bg-white/5 rounded-2xl p-4 border border-white/10 text-xs">
                <div className="flex justify-between items-center text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-teal-400" />
                    Buyer Settlement Speed
                  </span>
                  <span className="font-mono font-bold text-white">{selectedCategory.avgMatchDays} Days</span>
                </div>

                <div className="flex justify-between items-center text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-400" />
                    Automated Crane Staging
                  </span>
                  <span className="font-mono font-bold text-white">4.5 Hours to Harbor Load</span>
                </div>

                <div className="flex justify-between items-center text-white/80">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    Escrow Protection Term
                  </span>
                  <span className="font-mono font-bold text-emerald-300">100% Guaranteed</span>
                </div>
              </div>

              {/* Route Summary */}
              <div className="p-3.5 rounded-xl bg-teal-900/40 border border-teal-500/30 text-[11px] font-mono text-teal-200 flex items-center justify-between">
                <span>{originCity}</span>
                <ArrowRight className="h-3.5 w-3.5 text-amber-400" />
                <span>{destCity}</span>
              </div>
            </div>

            {/* Glass CTA Button */}
            <div className="pt-6 relative z-10">
              <button
                type="button"
                onClick={onGetStarted}
                className="btn-glass-amber w-full text-center justify-center text-sm py-4 shadow-xl"
              >
                <span>LOCK IN THIS VALUATION & LIQUIDATE</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

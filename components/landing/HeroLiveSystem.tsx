'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Zap,
  Activity,
  DollarSign,
  Package,
  Layers3,
  ShieldAlert,
  Clock,
  ChevronRight,
  RefreshCw,
} from 'lucide-react'

interface SampleSKU {
  id: string
  name: string
  sku: string
  category: string
  qty: number
  unitCost: number
  totalVal: number
  riskScore: number
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM'
  monthsOfSupply: number
  topBuyer: {
    name: string
    match: number
    unitsReq: number
    city: string
    dealVal: number
  }
  potentialRecovery: number
  recoveryPct: number
  aiExplanation: string
}

const SAMPLE_SKUS: SampleSKU[] = [
  {
    id: 'pc2048',
    name: 'Precision Polymer Connector 20mm',
    sku: 'PC2048',
    category: 'Connectors & Moldings',
    qty: 4500,
    unitCost: 40,
    totalVal: 180000,
    riskScore: 87,
    riskLevel: 'CRITICAL',
    monthsOfSupply: 4.1,
    topBuyer: {
      name: 'ElectroTech Industries',
      match: 93,
      unitsReq: 3000,
      city: 'Ahmedabad, GJ',
      dealVal: 165000,
    },
    potentialRecovery: 165000,
    recoveryPct: 92,
    aiExplanation: 'Sales velocity dropped 62% over 90 days with 11mo warehouse aging. Direct liquidation match discovered with automotive tier-1 supplier.',
  },
  {
    id: 'pcb401',
    name: 'PCB Multi-Layer Controller Module v2',
    sku: 'PCB-401',
    category: 'Electronics & PCB',
    qty: 1200,
    unitCost: 533.33,
    totalVal: 640000,
    riskScore: 94,
    riskLevel: 'CRITICAL',
    monthsOfSupply: 5.8,
    topBuyer: {
      name: 'Nova Components Ltd.',
      match: 89,
      unitsReq: 1000,
      city: 'Bengaluru, KA',
      dealVal: 576000,
    },
    potentialRecovery: 576000,
    recoveryPct: 90,
    aiExplanation: 'Component lifecycle obsolescence imminent. Matched with IoT instrumentation manufacturer at optimal salvage valuation.',
  },
  {
    id: 'pkg118',
    name: 'Heavy Duty 5-Ply Corrugated Shipping Cartons',
    sku: 'PKG-118',
    category: 'Packaging & Cartons',
    qty: 12000,
    unitCost: 17.5,
    totalVal: 210000,
    riskScore: 71,
    riskLevel: 'HIGH',
    monthsOfSupply: 3.2,
    topBuyer: {
      name: 'Apex Logistics Hub',
      match: 84,
      unitsReq: 10000,
      city: 'Nagpur Center',
      dealVal: 168000,
    },
    potentialRecovery: 168000,
    recoveryPct: 80,
    aiExplanation: 'Warehouse pallet holding costs exceed margin threshold. Regional transfer & flash sale buyer verified.',
  },
]

export const HeroLiveSystem: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [selectedSkuIndex, setSelectedSkuIndex] = useState(0)
  const [activeStep, setActiveStep] = useState<0 | 1 | 2 | 3>(1)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  const currentSku = SAMPLE_SKUS[selectedSkuIndex]

  // Auto cycle active pipeline step for live intelligence animation
  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setActiveStep((prev) => ((prev + 1) % 4) as 0 | 1 | 2 | 3)
    }, 3800)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const steps = [
    { label: 'Raw Inventory', icon: Package, value: `₹${(currentSku.totalVal / 100000).toFixed(1)}L Stranded` },
    { label: 'AI Risk Engine', icon: AlertTriangle, value: `${currentSku.riskScore}% (${currentSku.riskLevel})` },
    { label: 'B2B Matching', icon: Building2, value: `${currentSku.topBuyer.match}% Match Found` },
    { label: 'Value Recovery', icon: TrendingUp, value: `₹${(currentSku.potentialRecovery / 100000).toFixed(1)}L Preserved` },
  ]

  return (
    <div className="relative w-full rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white/95 dark:bg-zinc-950/95 p-5 sm:p-7 shadow-2xl backdrop-blur-xl transition-all">
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Top Controls: SKU Selector + Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-5">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Live System Stream</span>
          </div>
          <span className="text-xs text-zinc-400 font-mono hidden sm:inline">• Multi-Tenant Node</span>
        </div>

        {/* SKU Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80">
          {SAMPLE_SKUS.map((item, idx) => (
            <button
              key={item.sku}
              type="button"
              onClick={() => {
                setSelectedSkuIndex(idx)
                setIsAutoPlaying(false)
              }}
              className={`rounded-lg px-2.5 py-1 text-[11px] font-mono font-semibold transition-all ${
                selectedSkuIndex === idx
                  ? 'bg-white dark:bg-zinc-800 text-[#0D9488] dark:text-[#14B8A6] shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              {item.sku}
            </button>
          ))}
        </div>
      </div>

      {/* Live 4-Stage Ecosystem Data Ticker */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 mb-6">
        {steps.map((st, i) => {
          const Icon = st.icon
          const isActive = activeStep === i
          return (
            <div
              key={st.label}
              onClick={() => {
                setActiveStep(i as any)
                setIsAutoPlaying(false)
              }}
              className={`cursor-pointer rounded-2xl border p-3 transition-all ${
                isActive
                  ? 'border-[#0D9488] bg-teal-50/50 dark:bg-teal-950/30 shadow-xs'
                  : 'border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-900/30 hover:border-zinc-200 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                <span>Stage 0{i + 1}</span>
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#0D9488]' : 'text-zinc-400'}`} />
              </div>
              <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100">{st.label}</span>
              <span
                className={`block text-[11px] font-mono font-semibold mt-0.5 ${
                  isActive ? 'text-[#0D9488] dark:text-[#14B8A6]' : 'text-zinc-500'
                }`}
              >
                {st.value}
              </span>
            </div>
          )
        })}
      </div>

      {/* Main Diagnostic Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSku.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Header Line for Selected SKU */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#0D9488] dark:text-[#14B8A6]">{currentSku.sku}</span>
                <span className="rounded bg-zinc-200/70 dark:bg-zinc-800 px-2 py-0.2 text-[10px] text-zinc-600 dark:text-zinc-400 font-medium">
                  {currentSku.category}
                </span>
              </div>
              <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">{currentSku.name}</h4>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold block">Risk Index</span>
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-mono font-bold ${
                  currentSku.riskScore > 80
                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}
              >
                <AlertTriangle className="h-3 w-3" />
                {currentSku.riskScore}% {currentSku.riskLevel}
              </span>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 shadow-2xs">
              <span className="text-zinc-400 text-[11px] block">Stranded Lot Volume</span>
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5 block">
                {currentSku.qty.toLocaleString()} Units
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">Valuation: ₹{(currentSku.totalVal / 100000).toFixed(2)}L</span>
            </div>

            <div className="rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3.5 shadow-2xs">
              <span className="text-zinc-400 text-[11px] block">Velocity Decay</span>
              <span className="text-base font-bold font-mono text-amber-600 dark:text-amber-400 mt-0.5 block">
                {currentSku.monthsOfSupply}x Buffer Ratio
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">30+ months at current rate</span>
            </div>

            <div className="rounded-2xl border border-teal-500/20 bg-teal-50/40 dark:bg-teal-950/20 p-3.5 shadow-2xs">
              <span className="text-teal-700 dark:text-teal-400 text-[11px] font-semibold block">Recoverable Capital</span>
              <span className="text-base font-bold font-mono text-[#0D9488] dark:text-[#14B8A6] mt-0.5 block">
                ₹{(currentSku.potentialRecovery / 100000).toFixed(2)}L
              </span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold font-mono">
                {currentSku.recoveryPct}% of Book Value
              </span>
            </div>
          </div>

          {/* AI Grounded Reasoning & Top Buyer Card */}
          <div className="rounded-2xl border border-zinc-200/90 dark:border-zinc-800/90 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 p-4 text-xs space-y-3">
            <div className="flex items-start gap-2.5">
              <div className="h-6 w-6 rounded-lg bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">AI Diagnostic Explanation:</span>
                <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  {currentSku.aiExplanation}
                </p>
              </div>
            </div>

            {/* Top Matched Buyer Sub-Card */}
            <div className="rounded-xl border border-teal-500/20 bg-white dark:bg-zinc-950 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-teal-500/10 text-[#0D9488] flex items-center justify-center font-bold font-mono text-xs">
                  {currentSku.topBuyer.match}%
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                      {currentSku.topBuyer.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">• {currentSku.topBuyer.city}</span>
                  </div>
                  <span className="text-[11px] text-zinc-500">
                    Sourcing: {currentSku.topBuyer.unitsReq.toLocaleString()} units • Deal Value: ₹
                    {(currentSku.topBuyer.dealVal / 100000).toFixed(2)}L
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={onGetStarted}
                className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-4 py-1.5 text-xs font-bold text-white shadow-xs transition-all self-start sm:self-center shrink-0"
              >
                Liquidate via Match
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

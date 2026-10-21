'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Building2,
  DollarSign,
  TrendingUp,
  RefreshCw,
  Sliders,
  Play,
  Check,
} from 'lucide-react'

export const InteractiveProductDemo: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [selectedDemoSku, setSelectedDemoSku] = useState<'polymer' | 'pcb' | 'cable'>('polymer')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisStep, setAnalysisStep] = useState<number>(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [isRecovered, setIsRecovered] = useState(false)

  const demoPresets = {
    polymer: {
      name: 'Precision Polymer Connector 20mm',
      sku: 'PC2048',
      qty: 4500,
      unitCost: 40,
      bookValue: 180000,
      holdingMonths: 11,
      riskScore: 87,
      riskLevel: 'CRITICAL',
      buyer: 'ElectroTech Industries',
      matchScore: 93,
      recoveryValue: 165000,
      recoveryPct: 92,
      aiReason: 'Velocity decayed 62% over 90 days. Stock exceeds 4.1x monthly consumption baseline.',
    },
    pcb: {
      name: 'PCB Controller Module v2',
      sku: 'PCB-401',
      qty: 1200,
      unitCost: 533.33,
      bookValue: 640000,
      holdingMonths: 14,
      riskScore: 94,
      riskLevel: 'CRITICAL',
      buyer: 'Nova Components Ltd.',
      matchScore: 89,
      recoveryValue: 576000,
      recoveryPct: 90,
      aiReason: 'Firmware deprecation and architectural obsolescence detected. Salvage buyer ready.',
    },
    cable: {
      name: 'Industrial Shielded 4-Core Cable',
      sku: 'CAB-902',
      qty: 3500,
      unitCost: 140,
      bookValue: 490000,
      holdingMonths: 9,
      riskScore: 81,
      riskLevel: 'HIGH',
      buyer: 'Apex Controls & Drives',
      matchScore: 86,
      recoveryValue: 441000,
      recoveryPct: 90,
      aiReason: 'Regional project cancellation surplus. High purchasing appetite in Pune industrial corridor.',
    },
  }

  const current = demoPresets[selectedDemoSku]

  const handleRunDiagnostic = () => {
    setIsAnalyzing(true)
    setIsCompleted(false)
    setIsRecovered(false)
    setAnalysisStep(1)

    setTimeout(() => setAnalysisStep(2), 700)
    setTimeout(() => setAnalysisStep(3), 1400)
    setTimeout(() => {
      setAnalysisStep(4)
      setIsAnalyzing(false)
      setIsCompleted(true)
    }, 2100)
  }

  return (
    <section id="simulator" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
          <Play className="h-3 w-3 fill-current" />
          <span>Hands-On Simulator</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          See DeadStock in action.
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Test our risk calculation, automated buyer discovery, and capital recovery engine in real time.
        </p>
      </div>

      <div className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-2xl space-y-8">
        {/* Preset Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Select Test Lot</span>
            <div className="flex flex-wrap gap-2 mt-2">
              {[
                { id: 'polymer', label: 'Polymer Connector (PC2048)' },
                { id: 'pcb', label: 'PCB Module (PCB-401)' },
                { id: 'cable', label: 'Shielded Cable (CAB-902)' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedDemoSku(p.id as any)
                    setIsCompleted(false)
                    setIsRecovered(false)
                    setAnalysisStep(0)
                  }}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-semibold transition-all ${
                    selectedDemoSku === p.id
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-sm'
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={handleRunDiagnostic}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition-all disabled:opacity-50 shrink-0"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Running Multi-Signal Analysis...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Run Instant Diagnostic</span>
              </>
            )}
          </button>
        </div>

        {/* Live Multi-Stage Simulator View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Lot Parameters */}
          <div className="lg:col-span-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#0D9488]">{current.sku}</span>
              <span className="text-[10px] text-zinc-400 font-mono">Age: {current.holdingMonths} Months</span>
            </div>
            <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{current.name}</h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500">Lot Volume:</span>
                <span className="font-mono font-bold">{current.qty.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500">Unit Cost:</span>
                <span className="font-mono font-bold">₹{current.unitCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-zinc-200/60 dark:border-zinc-800">
                <span className="text-zinc-500">Trapped Capital:</span>
                <span className="font-mono font-bold text-rose-600">₹{(current.bookValue / 100000).toFixed(2)}L</span>
              </div>
            </div>

            {/* Analysis Progress Steps */}
            <div className="space-y-2 pt-2">
              {[
                { step: 1, label: 'Mathematical Risk Formula' },
                { step: 2, label: 'Demand Velocity Curve' },
                { step: 3, label: 'B2B Buyer Discovery' },
                { step: 4, label: 'Optimal Channel Liquidation' },
              ].map((s) => (
                <div key={s.step} className="flex items-center gap-2 text-xs">
                  <div
                    className={`h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      analysisStep >= s.step
                        ? 'bg-[#0D9488] text-white'
                        : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {analysisStep >= s.step ? <Check className="h-3 w-3" /> : s.step}
                  </div>
                  <span className={analysisStep >= s.step ? 'font-semibold text-zinc-900 dark:text-zinc-100' : 'text-zinc-400'}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic Computed Outcome */}
          <div className="lg:col-span-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 space-y-6">
            {!isCompleted && !isAnalyzing ? (
              <div className="py-14 text-center space-y-3">
                <div className="mx-auto h-12 w-12 rounded-full bg-teal-500/10 text-[#0D9488] flex items-center justify-center">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200">
                  Ready to run live inventory diagnostic
                </h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                  Click the button above to execute DeadStock risk scoring and discover matched buyer liquidity.
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-5"
              >
                {/* Result Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50">
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                      Risk Computed
                    </span>
                    <h5 className="text-xl font-mono font-black text-rose-600 dark:text-rose-400 mt-0.5">
                      {current.riskScore}% {current.riskLevel}
                    </h5>
                  </div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 max-w-md">
                    {current.aiReason}
                  </p>
                </div>

                {/* Match & Valuation Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl border border-teal-500/30 bg-teal-50/30 dark:bg-teal-950/20 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D9488]">
                      Top Matched B2B Buyer
                    </span>
                    <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{current.buyer}</h5>
                    <span className="inline-block font-mono text-xs font-bold text-[#0D9488]">
                      {current.matchScore}% Match Score (96% Product Fit)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600">
                      Recoverable Capital
                    </span>
                    <h5 className="font-mono font-bold text-lg text-emerald-600 dark:text-emerald-400">
                      ₹{(current.recoveryValue / 100000).toFixed(2)}L
                    </h5>
                    <span className="text-xs text-zinc-500">
                      {current.recoveryPct}% of original book value recovered
                    </span>
                  </div>
                </div>

                {/* Execution CTA */}
                {isRecovered ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1 text-xs text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-5 w-5 mx-auto text-emerald-600 mb-1" />
                    <strong className="block text-sm font-bold">Deal Dispatched & Inventory Decremented</strong>
                    <span>Immutable transaction audit ledger entry generated.</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-3 border-t border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs text-zinc-500">
                      Recommended: Liquidate batch directly to {current.buyer}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsRecovered(true)}
                      className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all"
                    >
                      Execute Recovery Action
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

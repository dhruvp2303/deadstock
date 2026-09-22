'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSpreadsheet,
  AlertTriangle,
  TrendingDown,
  Building2,
  Sparkles,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'

export const LifecycleWorkflow: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [selectedStep, setSelectedStep] = useState(0)

  const steps = [
    {
      id: 0,
      stepNum: '01',
      title: 'Inventory Ingestion',
      icon: FileSpreadsheet,
      badge: 'CSV & ERP Sync',
      headline: 'Automated Multi-Depot Data Parsing',
      summary: 'Upload enterprise spreadsheets or synchronize warehouse databases. Every row is parsed and verified for SKU, batch age, unit costs, and velocity data.',
      snippet: {
        tag: 'Validated Input',
        primary: '4,500 Units • SKU: PC2048',
        detail: 'Warehouse: Ahmedabad Depot • Base Cost: ₹40/unit',
      },
    },
    {
      id: 1,
      stepNum: '02',
      title: 'AI Risk Detection',
      icon: AlertTriangle,
      badge: '0–100 Risk Index',
      headline: 'Multi-Signal Mathematical Scoring',
      summary: 'DeadStock executes an auditable formula weighting supply velocity (35%), aging curve (25%), demand decay (20%), and obsolescence factors (20%).',
      snippet: {
        tag: 'Computed Risk',
        primary: 'Score: 87 / 100 (CRITICAL RISK)',
        detail: 'Dynamic AI Reason: 62% velocity collapse over 90 days',
      },
    },
    {
      id: 2,
      stepNum: '03',
      title: 'Demand Prediction',
      icon: TrendingDown,
      badge: 'Run-rate Decay',
      headline: 'Forward Velocity & Overhang Modeling',
      summary: 'Forecasts months-of-supply ratios against active historical consumption, warning operations teams before holding fees overtake product margin.',
      snippet: {
        tag: 'Velocity Analysis',
        primary: '4.1x Overhang Buffer',
        detail: '30+ months of stock remaining at current velocity',
      },
    },
    {
      id: 3,
      stepNum: '04',
      title: 'B2B Buyer Matching',
      icon: Building2,
      badge: 'Multi-Factor Algorithm',
      headline: 'Deterministic Compatibility Scoring',
      summary: 'Matches at-risk lots against purchasing criteria of verified manufacturers, wholesalers, and liquidators based on product specs, quantity, and logistics.',
      snippet: {
        tag: 'Top Buyer Found',
        primary: 'ElectroTech Industries (93% Match)',
        detail: 'Sourcing: 3,000 units • Deal Value: ₹1.65L',
      },
    },
    {
      id: 4,
      stepNum: '05',
      title: 'Recovery Strategy',
      icon: Sparkles,
      badge: '5-Channel Engine',
      headline: 'Side-by-Side Channel Optimization',
      summary: 'Compares expected recovery return across Direct B2B Sell, Regional Warehouse Transfer, Surplus Discount, Supplier Restock, and Circular Recycling.',
      snippet: {
        tag: 'Optimal Decision',
        primary: 'Recommended: Direct B2B Match',
        detail: 'Preserves 92% of original book valuation',
      },
    },
    {
      id: 5,
      stepNum: '06',
      title: 'Atomic Transaction',
      icon: CheckCircle2,
      badge: 'Immutable Ledger',
      headline: 'Real-Time Negotiation & Dispatch',
      summary: 'Execute deals with one click. Quantity decrements atomically, an immutable movement ledger record is logged, and shipping documents are dispatched.',
      snippet: {
        tag: 'Transaction Confirmed',
        primary: 'Ref #TXN-88402 Logged',
        detail: 'Remaining Depot Stock: 0 units • Logistics pickup pending',
      },
    },
    {
      id: 6,
      stepNum: '07',
      title: 'Capital & Eco Tracking',
      icon: DollarSign,
      badge: 'Scope-3 Certified',
      headline: 'Preserved Balance Sheet & Sustainability',
      summary: 'Recovered capital flows straight into operating cashflow while environmental analytics record landfill waste avoided and circular reuse gains.',
      snippet: {
        tag: 'Outcome Metrics',
        primary: '₹1.65L Capital Preserved',
        detail: '4,500 units diverted from industrial scrap stream',
      },
    },
  ]

  const active = steps[selectedStep]
  const ActiveIcon = active.icon

  return (
    <section id="how-it-works" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6]">
          <Zap className="h-3.5 w-3.5" />
          <span>End-to-End Operating Lifecycle</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          DeadStock finds where your inventory should go next.
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          A seamless 7-step intelligence pipeline transforming stagnant inventory into recovered working capital.
        </p>
      </div>

      {/* Interactive Pipeline Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
        {steps.map((st, idx) => {
          const Icon = st.icon
          const isCurrent = selectedStep === idx
          return (
            <button
              key={st.id}
              type="button"
              onClick={() => setSelectedStep(idx)}
              className={`flex flex-col items-start p-3.5 rounded-2xl border text-left transition-all ${
                isCurrent
                  ? 'border-[#0D9488] bg-teal-50/50 dark:bg-teal-950/40 shadow-xs ring-1 ring-[#0D9488]/40'
                  : 'border-zinc-200/70 dark:border-zinc-800/70 bg-white dark:bg-zinc-950 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span className="text-[10px] font-mono font-bold text-zinc-400">{st.stepNum}</span>
                <Icon className={`h-4 w-4 ${isCurrent ? 'text-[#0D9488]' : 'text-zinc-400'}`} />
              </div>
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">{st.title}</span>
            </button>
          )
        })}
      </div>

      {/* Selected Step Detailed Feature Stage */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="rounded-3xl border border-zinc-200/90 dark:border-zinc-800/90 bg-white dark:bg-zinc-950 p-6 sm:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
        >
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-3 py-1 text-xs font-mono font-semibold text-[#0D9488] dark:text-[#14B8A6]">
              <span>Stage {active.stepNum}</span>
              <span>• {active.badge}</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
              {active.headline}
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {active.summary}
            </p>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={onGetStarted}
                className="inline-flex items-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition-all"
              >
                <span>Try This Workflow</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
              {selectedStep < steps.length - 1 && (
                <button
                  type="button"
                  onClick={() => setSelectedStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  className="rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Next Step ({steps[selectedStep + 1].title}) →
                </button>
              )}
            </div>
          </div>

          {/* Interactive Live Output Snippet Card */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/70 p-5 space-y-4 shadow-inner">
              <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <div className="h-6 w-6 rounded-lg bg-teal-500/10 text-[#0D9488] flex items-center justify-center">
                    <ActiveIcon className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-bold text-zinc-800 dark:text-zinc-200">{active.snippet.tag}</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-400">Live Simulation</span>
              </div>

              <div className="space-y-2">
                <span className="block text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                  {active.snippet.primary}
                </span>
                <p className="text-xs text-zinc-500 font-mono leading-relaxed">
                  {active.snippet.detail}
                </p>
              </div>

              <div className="rounded-xl border border-teal-500/20 bg-teal-50/60 dark:bg-teal-950/30 p-3 text-[11px] text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
                <span className="font-medium">Pipeline Accuracy:</span>
                <span className="font-mono font-bold text-[#0D9488] dark:text-[#14B8A6]">99.4% Verified</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

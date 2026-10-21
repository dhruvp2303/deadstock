'use client'

import React from 'react'
import {
  X,
  Sparkles,
  AlertTriangle,
  Building2,
  TrendingDown,
  Warehouse,
  Package,
  Layers,
  DollarSign,
  Share2,
  Archive,
  Edit2,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'
import { InventoryItem } from '@/lib/api'

interface SkuDetailModalProps {
  isOpen: boolean
  onClose: () => void
  item: InventoryItem | null
  onOpenRecovery: (item: InventoryItem) => void
  onOpenMarketplacePublish: (item: InventoryItem) => void
  onOpenEdit: (item: InventoryItem) => void
}

export const SkuDetailModal: React.FC<SkuDetailModalProps> = ({
  isOpen,
  onClose,
  item,
  onOpenRecovery,
  onOpenMarketplacePublish,
  onOpenEdit,
}) => {
  if (!isOpen || !item) return null

  const unitCost = Number(item.unit_cost) || 40
  const qty = Number(item.quantity) || 1000
  const currentVal = Number(item.current_value) || qty * unitCost
  const monthlyDemand = Number(item.monthly_demand) || 150
  const ageMonths = Number(item.age_months) || 6
  const riskScore = Number(item.risk_score) || 87
  const mos = monthlyDemand > 0 ? (qty / monthlyDemand).toFixed(1) : '∞'

  // Holding cost estimates: ~2% per month
  const holdingCostPerMonth = Math.round(currentVal * 0.02)
  const projectedLoss12Mo = Math.round(currentVal * 0.24)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#0D9488] dark:text-[#14B8A6]">
                {item.sku}
              </span>
              <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-500">
                {item.category || 'Components'}
              </span>
              <span
                className={`rounded-md px-2 py-0.5 text-[10px] font-bold font-mono ${
                  riskScore > 80
                    ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                }`}
              >
                {riskScore}% {item.risk_level || 'CRITICAL'} RISK
              </span>
            </div>
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mt-1">
              {item.product}
            </h3>
            <span className="text-xs text-zinc-400 font-mono">
              Depot: {item.warehouse || 'Primary Facility'} • Material: {item.material || 'Standard Industrial Grade'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* 4 Financial & Inventory Metric Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Lot Quantity</span>
            <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5 block">
              {qty.toLocaleString()} Units
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">@ ₹{unitCost.toFixed(2)}/unit</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Book Valuation</span>
            <span className="text-lg font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5 block">
              ₹{(currentVal / 100000).toFixed(2)}L
            </span>
            <span className="text-[10px] text-rose-600 font-mono">₹{holdingCostPerMonth.toLocaleString()}/mo carry</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
            <span className="text-zinc-400 text-[11px] block">Holding Duration</span>
            <span className="text-lg font-bold font-mono text-amber-600 mt-0.5 block">
              {ageMonths} Months
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">Velocity: {monthlyDemand} units/mo</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-500/20">
            <span className="text-teal-700 dark:text-teal-400 text-[11px] font-semibold block">Supply Buffer</span>
            <span className="text-lg font-bold font-mono text-[#0D9488] dark:text-[#14B8A6] mt-0.5 block">
              {mos}x Ratio
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold font-mono">
              Liquidation Recommended
            </span>
          </div>
        </div>

        {/* Explainable AI Risk Formula Signals */}
        <div className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-3 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0D9488]" />
            <h4 className="font-bold text-zinc-900 dark:text-zinc-100">AI Risk Decomposition Formula</h4>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {item.ai_explanation ||
              `This item's risk score is ${riskScore} because warehouse holding period has reached ${ageMonths} months and current inventory is ${mos}x higher than standard monthly depletion.`}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-[11px]">
              <span className="text-zinc-400 block">Supply Velocity (35%)</span>
              <span className="font-bold text-rose-600 font-mono">Critical Decay (-62%)</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-[11px]">
              <span className="text-zinc-400 block">Inventory Aging (25%)</span>
              <span className="font-bold text-amber-600 font-mono">{ageMonths} Months Aged</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-[11px]">
              <span className="text-zinc-400 block">Holding Cost Risk (20%)</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">₹{projectedLoss12Mo.toLocaleString()}/yr</span>
            </div>
            <div className="p-2 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800 text-[11px]">
              <span className="text-zinc-400 block">Obsolescence Factor (20%)</span>
              <span className="font-bold text-[#0D9488] font-mono">High Salvage Fit</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenEdit(item)
              }}
              className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit SKU Parameters</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenMarketplacePublish(item)
              }}
              className="flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 px-3.5 py-2 text-xs font-semibold text-[#0D9488] hover:bg-teal-100/50"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Publish to Marketplace</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onClose()
              onOpenRecovery(item)
            }}
            className="flex items-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20"
          >
            <Sparkles className="h-4 w-4" />
            <span>Launch Recovery Center</span>
          </button>
        </div>
      </div>
    </div>
  )
}

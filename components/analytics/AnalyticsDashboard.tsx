'use client'

import React from 'react'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  ShieldCheck,
  Recycle,
  Layers3,
  DollarSign,
  AlertTriangle,
  Clock,
  Warehouse,
} from 'lucide-react'
import { DashboardSummary, InventoryItem } from '@/lib/api'

interface AnalyticsDashboardProps {
  summary: DashboardSummary | null
  inventory: InventoryItem[]
  currentRole: 'seller' | 'buyer'
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  summary,
  inventory,
  currentRole,
}) => {
  const totalValue = inventory.reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const atRiskValue = inventory
    .filter((i) => inRiskRange(i.risk_level))
    .reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const deadStockValue = inventory
    .filter((i) => i.risk_level === 'CRITICAL')
    .reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const potentialRecovered = Math.round(atRiskValue * 0.82)

  function inRiskRange(level?: string) {
    return level === 'HIGH' || level === 'CRITICAL'
  }

  // Category Aggregates
  const categoryMap = inventory.reduce((acc: Record<string, { count: number; value: number; riskSum: number }>, item) => {
    const cat = item.category || 'Mechanical Components'
    if (!acc[cat]) acc[cat] = { count: 0, value: 0, riskSum: 0 }
    acc[cat].count++
    acc[cat].value += Number(item.current_value) || 0
    acc[cat].riskSum += Number(item.risk_score) || 50
    return acc
  }, {})

  const categoryData = Object.entries(categoryMap).map(([category, data]) => ({
    category,
    count: data.count,
    value: data.value,
    avgRisk: Math.round(data.riskSum / Math.max(1, data.count)),
  }))

  return (
    <div className="space-y-6">
      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>Total Tracked Inventory</span>
            <Warehouse className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            ₹{totalValue >= 100000 ? `${(totalValue / 100000).toFixed(1)}L` : totalValue.toLocaleString()}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500 font-mono">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">{inventory.length} SKUs</span>
            <span>across 2 branch depots</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-amber-600 dark:text-amber-400">
            <span>At-Risk Working Capital</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
            ₹{atRiskValue >= 100000 ? `${(atRiskValue / 100000).toFixed(1)}L` : atRiskValue.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            <span className="font-semibold text-amber-600 dark:text-amber-400 font-mono">
              {inventory.filter((i) => inRiskRange(i.risk_level)).length} SKUs
            </span>{' '}
            exceeding 6mo velocity threshold
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
            <span>Recoverable Value</span>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            ₹{potentialRecovered >= 100000 ? `${(potentialRecovered / 100000).toFixed(1)}L` : potentialRecovered.toLocaleString()}
          </div>
          <div className="mt-2 text-[11px] text-zinc-500">
            Estimated via B2B buyer liquidation matching
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs text-indigo-600 dark:text-indigo-400">
            <span>Avg. Recovery Velocity</span>
            <Clock className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            8.4 Days
          </div>
          <div className="mt-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            3.2x faster than traditional liquidation brokers
          </div>
        </div>
      </div>

      {/* Category Risk Breakdown & Visual Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Category Breakdown Table */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm">
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-1">
            Category Risk Exposure
          </h4>
          <p className="text-xs text-zinc-500 mb-4">
            Aggregated exposure across active product verticals
          </p>

          <div className="space-y-3">
            {categoryData.map((cat) => (
              <div key={cat.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    <span>{cat.category}</span>
                    <span className="text-[10px] text-zinc-400 font-mono">({cat.count} SKUs)</span>
                  </div>
                  <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 font-semibold">
                    ₹{(cat.value / 100000).toFixed(1)}L{' '}
                    <span className={`text-[11px] ml-1 font-bold ${cat.avgRisk > 70 ? 'text-rose-600' : cat.avgRisk > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      ({cat.avgRisk}% Risk)
                    </span>
                  </div>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      cat.avgRisk > 70
                        ? 'bg-rose-500'
                        : cat.avgRisk > 40
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(10, cat.avgRisk))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Circular Sustainability & Waste Diversion */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Recycle className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Circular Sustainability Index
              </h4>
            </div>
            <p className="text-xs text-zinc-500 mt-1 mb-4">
              Verified environmental impact from surplus redistribution & scrap diversion
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3">
                <span className="text-[11px] text-zinc-500">Units Diverted from Scrap</span>
                <span className="block text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                  84,200
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+18% this month</span>
              </div>
              <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3">
                <span className="text-[11px] text-zinc-500">Solid Waste Avoided</span>
                <span className="block text-xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1">
                  14.8 Tons
                </span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-semibold">Scope-3 Certified</span>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 dark:border-teal-900/60 bg-teal-50/50 dark:bg-teal-950/30 p-3 text-xs text-teal-900 dark:text-teal-300 flex items-center justify-between">
            <span>Total Circular Recovery Factor</span>
            <span className="font-mono font-bold text-sm">88.4%</span>
          </div>
        </div>
      </div>
    </div>
  )
}

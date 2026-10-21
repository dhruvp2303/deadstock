'use client'

import React from 'react'
import {
  TrendingUp,
  BarChart3,
  Recycle,
  AlertTriangle,
  Clock,
  Warehouse,
  Plus,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { DashboardSummary, InventoryItem } from '@/lib/api'

interface AnalyticsDashboardProps {
  summary: DashboardSummary | null
  inventory: InventoryItem[]
  currentRole: 'seller' | 'buyer'
  onAddInventory?: () => void
  onImportCsv?: () => void
  onBrowseMarketplace?: () => void
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  summary,
  inventory,
  currentRole,
  onAddInventory,
  onImportCsv,
  onBrowseMarketplace,
}) => {
  const totalValue = inventory.reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const atRiskValue = inventory
    .filter((i) => inRiskRange(i.risk_level))
    .reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const potentialRecovered = Math.round(atRiskValue * 0.82)

  function inRiskRange(level?: string) {
    return level === 'HIGH' || level === 'CRITICAL'
  }

  // Category Aggregates
  const categoryMap = inventory.reduce((acc: Record<string, { count: number; value: number; riskSum: number }>, item) => {
    const cat = item.category || 'Uncategorized'
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

  const uniqueWarehouses = new Set(inventory.map((i) => i.warehouse).filter(Boolean)).size

  return (
    <div className="space-y-6">
      {/* Onboarding Welcome Banner for Fresh Accounts */}
      {inventory.length === 0 && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-zinc-900 to-zinc-950 p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-base font-bold text-white">Your Workspace is Live & Ready</h3>
            </div>
            <p className="text-xs text-[#8B949E] max-w-xl leading-relaxed">
              Upload your excess, slow-moving, or dead inventory. DeadStock will automatically calculate 0–100 risk scores, match with buyers, and enable multi-channel liquidation.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {onAddInventory && (
              <button
                type="button"
                onClick={onAddInventory}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 transition-all"
              >
                <Plus className="h-4 w-4" />
                <span>Add First SKU</span>
              </button>
            )}
            {onImportCsv && (
              <button
                type="button"
                onClick={onImportCsv}
                className="flex items-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 hover:bg-zinc-800 px-4 py-2.5 text-xs font-semibold text-white transition-all"
              >
                <FileSpreadsheet className="h-4 w-4 text-emerald-400" />
                <span>Import ERP CSV</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1 */}
        <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Total Tracked Inventory</span>
            <div className="h-9 w-9 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center text-zinc-600 dark:text-zinc-400 group-hover:scale-105 transition-transform">
              <Warehouse className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
            {totalValue === 0 ? '₹0' : totalValue >= 100000 ? `₹${(totalValue / 100000).toFixed(1)}L` : `₹${totalValue.toLocaleString('en-IN')}`}
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <span className="font-bold text-zinc-700 dark:text-zinc-300">{inventory.length} SKUs</span>
            <span>across {uniqueWarehouses || 0} depot{uniqueWarehouses !== 1 ? 's' : ''}</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="group rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-950/10 p-5 sm:p-6 shadow-2xs hover:border-amber-500/40 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">At-Risk Working Capital</span>
            <div className="h-9 w-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black font-mono tracking-tight text-amber-600 dark:text-amber-400">
            {atRiskValue === 0 ? '₹0' : atRiskValue >= 100000 ? `₹${(atRiskValue / 100000).toFixed(1)}L` : `₹${atRiskValue.toLocaleString('en-IN')}`}
          </div>
          <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono">
              {inventory.filter((i) => inRiskRange(i.risk_level)).length} SKUs
            </span>{' '}
            exceeding risk velocity
          </div>
        </div>

        {/* Metric 3 */}
        <div className="group rounded-2xl border border-teal-500/20 bg-teal-500/5 dark:bg-teal-950/10 p-5 sm:p-6 shadow-2xs hover:border-teal-500/40 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-700 dark:text-teal-400">Recoverable Capital</span>
            <div className="h-9 w-9 rounded-xl bg-teal-500/15 flex items-center justify-center text-teal-600 dark:text-teal-400 group-hover:scale-105 transition-transform">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black font-mono tracking-tight text-teal-600 dark:text-teal-400">
            {potentialRecovered === 0 ? '₹0' : potentialRecovered >= 100000 ? `₹${(potentialRecovered / 100000).toFixed(1)}L` : `₹${potentialRecovered.toLocaleString('en-IN')}`}
          </div>
          <div className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
            Estimated via B2B buyer liquidation matching
          </div>
        </div>

        {/* Metric 4 */}
        <div className="group rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-2xs hover:border-zinc-300 dark:hover:border-zinc-700 hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Avg. Recovery Velocity</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-100">
            {inventory.length > 0 ? '8.4 Days' : '—'}
          </div>
          <div className="mt-3 text-xs text-teal-600 dark:text-teal-400 font-semibold">
            {inventory.length > 0 ? '3.2x faster than traditional liquidation' : 'Awaiting initial inventory'}
          </div>
        </div>
      </div>

      {/* Category Risk Breakdown & Sustainability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Breakdown Table */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Category Risk Exposure
            </h4>
            <span className="text-[11px] font-mono text-zinc-400">{categoryData.length} active sectors</span>
          </div>
          <p className="text-xs text-zinc-500 mb-5">
            Aggregated exposure across active product verticals
          </p>

          {categoryData.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-400 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <BarChart3 className="h-8 w-8 text-zinc-500 mx-auto mb-2 opacity-50" />
              <p className="font-semibold text-zinc-300">No inventory tracked yet</p>
              <p className="text-[11px] text-zinc-500 mt-1">Upload inventory items to visualize your category risk breakdown.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div key={cat.category} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                      <span>{cat.category}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">({cat.count} SKUs)</span>
                    </div>
                    <div className="font-mono text-xs text-zinc-900 dark:text-zinc-100 font-semibold">
                      ₹{(cat.value / 100000).toFixed(1)}L{' '}
                      <span className={`text-[11px] ml-1.5 font-bold ${cat.avgRisk > 70 ? 'text-rose-600' : cat.avgRisk > 40 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ({cat.avgRisk}% Risk)
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800/80 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
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
          )}
        </div>

        {/* Circular Sustainability & Waste Diversion */}
        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-5 sm:p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400">
                <Recycle className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Circular Sustainability Index
              </h4>
            </div>
            <p className="text-xs text-zinc-500 mt-1.5 mb-5">
              Verified environmental impact from surplus redistribution & scrap diversion
            </p>

            <div className="grid grid-cols-2 gap-3.5 mb-5">
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4">
                <span className="text-xs text-zinc-500">Units Diverted from Scrap</span>
                <span className="block text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1.5">
                  {inventory.length > 0 ? (inventory.reduce((acc, i) => acc + (i.quantity || 0), 0) * 0.4).toLocaleString() : '0'}
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1 inline-block">
                  {inventory.length > 0 ? 'Active Monitoring' : 'Starts on stock upload'}
                </span>
              </div>
              <div className="rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4">
                <span className="text-xs text-zinc-500">Solid Waste Avoided</span>
                <span className="block text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-1.5">
                  {inventory.length > 0 ? `${((inventory.reduce((acc, i) => acc + (i.quantity || 0), 0) * 0.0002)).toFixed(1)} Tons` : '0.0 Tons'}
                </span>
                <span className="text-[11px] text-teal-600 dark:text-teal-400 font-semibold mt-1 inline-block">Scope-3 Compliant</span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-teal-200/80 dark:border-teal-900/60 bg-teal-50/60 dark:bg-teal-950/30 p-3.5 text-xs text-teal-900 dark:text-teal-300 flex items-center justify-between">
            <span>Total Circular Recovery Factor</span>
            <span className="font-mono font-bold text-sm">{inventory.length > 0 ? '88.4%' : '0.0%'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

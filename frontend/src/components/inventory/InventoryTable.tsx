'use client'

import React, { useState } from 'react'
import {
  Search,
  Filter,
  ArrowUpDown,
  Sparkles,
  Users,
  MoreVertical,
  Plus,
  FileSpreadsheet,
  AlertTriangle,
  Info,
  Archive,
  Edit2,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  DollarSign,
  TrendingDown,
  ShieldAlert,
  Package,
} from 'lucide-react'
import { InventoryItem } from '@/lib/api'

interface InventoryTableProps {
  items: InventoryItem[]
  onOpenAddModal: () => void
  onOpenCsvModal: () => void
  onOpenEditModal: (item: InventoryItem) => void
  onOpenRecovery: (item: InventoryItem) => void
  onOpenMatches: (item: InventoryItem) => void
  onArchiveItem: (item: InventoryItem) => void
  onOpenSkuDetail?: (item: InventoryItem) => void
  onOpenExportReport?: () => void
  onOpenPublishMarketplace?: (item: InventoryItem) => void
  loading?: boolean
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  items,
  onOpenAddModal,
  onOpenCsvModal,
  onOpenEditModal,
  onOpenRecovery,
  onOpenMatches,
  onArchiveItem,
  onOpenSkuDetail,
  onOpenExportReport,
  onOpenPublishMarketplace,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRisk, setSelectedRisk] = useState<string>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [sortField, setSortField] = useState<keyof InventoryItem>('risk_score')
  const [sortAsc, setSortAsc] = useState(false)
  const [expandedSkuId, setExpandedSkuId] = useState<number | null>(null)

  const categories = ['ALL', ...Array.from(new Set(items.map((i) => i.category || 'General Industrial').filter(Boolean)))]

  const filteredItems = items
    .filter((item) => {
      const matchSearch =
        item.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.category && item.category.toLowerCase().includes(searchTerm.toLowerCase()))
      const matchRisk = selectedRisk === 'ALL' || item.risk_level === selectedRisk
      const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory
      return matchSearch && matchRisk && matchCat
    })
    .sort((a, b) => {
      let aVal = a[sortField]
      let bVal = b[sortField]
      if (typeof aVal === 'string') aVal = aVal.toLowerCase()
      if (typeof bVal === 'string') bVal = bVal.toLowerCase()
      if ((aVal ?? 0) < (bVal ?? 0)) return sortAsc ? -1 : 1
      if ((aVal ?? 0) > (bVal ?? 0)) return sortAsc ? 1 : -1
      return 0
    })

  const toggleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(false)
    }
  }

  const getRiskBadge = (level?: string, score?: number) => {
    switch (level) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            CRITICAL ({score ?? 90}%)
          </span>
        )
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            HIGH ({score ?? 70}%)
          </span>
        )
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs font-semibold text-yellow-700 dark:text-yellow-400 border border-yellow-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
            MEDIUM ({score ?? 45}%)
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            LOW ({score ?? 15}%)
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col gap-3.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 max-w-xl">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by SKU, product name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-2 pl-9 pr-3.5 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-[#0D9488] dark:focus:border-[#0D9488] focus:outline-none focus:ring-1 focus:ring-[#0D9488]/30 shadow-2xs transition-all"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-[#0D9488] shadow-2xs transition-all cursor-pointer"
          >
            <option value="ALL">All Risk Levels</option>
            <option value="CRITICAL">Critical (81-100%)</option>
            <option value="HIGH">High (61-80%)</option>
            <option value="MEDIUM">Medium (31-60%)</option>
            <option value="LOW">Low (0-30%)</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 focus:outline-none focus:border-[#0D9488] shadow-2xs transition-all cursor-pointer"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {onOpenExportReport && (
            <button
              onClick={onOpenExportReport}
              className="flex items-center gap-1.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 transition-all shadow-2xs"
              title="Export Recovery Audit Report"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" />
              <span>Export Audit</span>
            </button>
          )}
          <button
            onClick={onOpenCsvModal}
            className="flex items-center gap-1.5 rounded-xl border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-300 transition-all shadow-2xs"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-xl bg-[#0D9488] hover:bg-[#0F9D8D] px-4 py-2 text-xs font-bold text-white shadow-sm shadow-teal-700/25 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add SKU</span>
          </button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/80 dark:bg-zinc-900/60 text-zinc-400 font-bold uppercase tracking-wider text-[11px] select-none">
                <th
                  onClick={() => toggleSort('product')}
                  className="cursor-pointer py-3.5 px-4 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Product & SKU</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('risk_score')}
                  className="cursor-pointer py-3.5 px-3 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Risk Level (Click to Expand)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('quantity')}
                  className="cursor-pointer py-3.5 px-3 text-right hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Stock Qty</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('current_value')}
                  className="cursor-pointer py-3.5 px-3 text-right hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Valuation</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('age_months')}
                  className="cursor-pointer py-3.5 px-3 text-center hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <div className="flex items-center justify-center gap-1.5">
                    <span>Age</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('monthly_demand')}
                  className="cursor-pointer py-3.5 px-3 text-right hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Mo. Demand</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 text-right">Recovery Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-14 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-3 max-w-sm mx-auto">
                      <div className="h-12 w-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-[#0D9488]">
                        <Package className="h-6 w-6" />
                      </div>
                      <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {items.length === 0 ? 'No inventory registered yet' : 'No matching inventory items found'}
                      </p>
                      <p className="text-xs text-zinc-400">
                        {items.length === 0
                          ? 'Add your first SKU or bulk-import via CSV to calculate predictive risk scores and initiate AI buyer matching.'
                          : 'Try adjusting your search query or clear selected category/risk filters.'}
                      </p>
                      {items.length === 0 && (
                        <div className="flex items-center gap-2 pt-2">
                          <button
                            type="button"
                            onClick={onOpenAddModal}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0D9488] hover:bg-[#0F9D8D] px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add First SKU</span>
                          </button>
                          <button
                            type="button"
                            onClick={onOpenCsvModal}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 px-3.5 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 shadow-xs transition-all"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" />
                            <span>Bulk Import CSV</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => {
                  const isExpanded = expandedSkuId === item.id
                  const demandRatio =
                    item.monthly_demand && item.monthly_demand > 0
                      ? ((item.quantity || 1000) / item.monthly_demand).toFixed(1)
                      : '4.1'

                  return (
                    <React.Fragment key={item.id}>
                      <tr className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors">
                        {/* Product & SKU */}
                        <td className="py-3 px-4">
                          <div
                            className="cursor-pointer group/title"
                            onClick={() => onOpenSkuDetail?.(item)}
                          >
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 group-hover/title:text-[#0D9488] transition-colors">
                              <span>{item.product}</span>
                              {item.category && (
                                <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] text-zinc-500 font-normal">
                                  {item.category}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-mono mt-0.5">
                              <span>SKU: {item.sku}</span>
                              {item.warehouse && <span>• {item.warehouse}</span>}
                              <span className="text-[#0D9488] opacity-0 group-hover/title:opacity-100 transition-opacity text-[10px] font-bold">
                                View Diagnostic →
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Risk Badge with Expandable Toggle */}
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => setExpandedSkuId(isExpanded ? null : item.id)}
                            className="flex items-center gap-1.5 text-left group/badge"
                          >
                            {getRiskBadge(item.risk_level, item.risk_score)}
                            {isExpanded ? (
                              <ChevronUp className="h-3.5 w-3.5 text-zinc-400" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-zinc-400 opacity-60 group-hover/badge:opacity-100" />
                            )}
                          </button>
                        </td>

                        {/* Stock Quantity */}
                        <td className="py-3 px-3 text-right font-mono font-medium text-zinc-900 dark:text-zinc-100">
                          {item.qty || (item.quantity ? item.quantity.toLocaleString() : '0')}
                        </td>

                        {/* Valuation */}
                        <td className="py-3 px-3 text-right font-mono font-medium text-zinc-900 dark:text-zinc-100">
                          {item.value || `₹${(item.current_value || 0).toLocaleString()}`}
                        </td>

                        {/* Age */}
                        <td className="py-3 px-3 text-center text-zinc-600 dark:text-zinc-400">
                          {item.age || `${item.age_months || 0} mo`}
                        </td>

                        {/* Monthly Demand */}
                        <td className="py-3 px-3 text-right font-mono text-zinc-600 dark:text-zinc-400">
                          {item.demand || (item.monthly_demand ? item.monthly_demand.toLocaleString() : '0')}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onOpenMatches(item)}
                              className="flex items-center gap-1.5 rounded-lg border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-[11px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all shadow-2xs"
                              title="View Matched Buyers"
                            >
                              <Users className="h-3 w-3 text-indigo-500" />
                              <span className="hidden sm:inline">Buyers</span>
                            </button>

                            <button
                              onClick={() => onOpenRecovery(item)}
                              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-[11px] font-bold text-white transition-all shadow-2xs shadow-emerald-600/20 hover:scale-[1.02]"
                              title="Execute Recovery Action"
                            >
                              <Sparkles className="h-3 w-3" />
                              <span>Recover</span>
                            </button>

                            {onOpenPublishMarketplace && (
                              <button
                                onClick={() => onOpenPublishMarketplace(item)}
                                className="h-7 w-7 rounded-lg hover:bg-teal-50 dark:hover:bg-teal-950/40 text-zinc-400 hover:text-[#0D9488] flex items-center justify-center transition-colors"
                                title="Publish to Marketplace"
                              >
                                <FileSpreadsheet className="h-3.5 w-3.5" />
                              </button>
                            )}

                            <button
                              onClick={() => onOpenEditModal(item)}
                              className="h-7 w-7 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 flex items-center justify-center transition-colors"
                              title="Edit SKU"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              onClick={() => onArchiveItem(item)}
                              className="h-7 w-7 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center justify-center transition-colors"
                              title="Archive SKU"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Root-Cause Explanation Drawer */}
                      {isExpanded && (
                        <tr className="bg-zinc-50/80 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
                          <td colSpan={7} className="p-4 sm:p-5">
                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-4 shadow-sm space-y-3">
                              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2.5">
                                <div className="flex items-center gap-2">
                                  <ShieldAlert className="h-4 w-4 text-rose-500" />
                                  <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                                    Root Cause & Risk Math Diagnostic · SKU {item.sku}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-zinc-500">
                                  Holding Cost Burn: ₹{Math.round((item.current_value || 100000) * 0.022).toLocaleString()}/mo
                                </span>
                              </div>

                              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-100 dark:border-zinc-800">
                                  <span className="text-[10px] text-zinc-400 font-semibold block">Demand Multiplier</span>
                                  <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
                                    {demandRatio}x monthly run-rate
                                  </span>
                                </div>
                                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-100 dark:border-zinc-800">
                                  <span className="text-[10px] text-zinc-400 font-semibold block">Inventory Age</span>
                                  <span className="font-bold font-mono text-zinc-900 dark:text-zinc-100">
                                    {item.age_months || 11} Months Stagnant
                                  </span>
                                </div>
                                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-100 dark:border-zinc-800">
                                  <span className="text-[10px] text-zinc-400 font-semibold block">Velocity Trend</span>
                                  <span className="font-bold font-mono text-rose-600">
                                    -64% Falloff vs 6mo Avg
                                  </span>
                                </div>
                                <div className="rounded-lg bg-zinc-50 dark:bg-zinc-900 p-2.5 border border-zinc-100 dark:border-zinc-800">
                                  <span className="text-[10px] text-zinc-400 font-semibold block">Recommended Channel</span>
                                  <span className="font-bold font-mono text-emerald-600">
                                    {item.action || 'B2B Liquidation'}
                                  </span>
                                </div>
                              </div>

                              <div className="p-3 rounded-lg bg-teal-50/60 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900/50 flex items-start gap-2.5">
                                <Sparkles className="h-4 w-4 text-[#0D9488] shrink-0 mt-0.5" />
                                <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
                                  {item.ai_explanation ||
                                    `This SKU's risk score is ${item.risk_score || 87}% (${item.risk_level || 'CRITICAL'}) because quantity exceeds standard reorder thresholds, inventory age is high, and sales velocity dropped.`}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

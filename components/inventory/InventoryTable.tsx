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
  const [activeTooltipSku, setActiveTooltipSku] = useState<string | null>(null)

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by SKU, product name, category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-zinc-400 dark:focus:border-zinc-600 focus:outline-none focus:ring-0"
            />
          </div>

          {/* Risk Filter */}
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
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
            className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2.5 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {onOpenExportReport && (
            <button
              onClick={onOpenExportReport}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
              title="Export Recovery Audit Report"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-teal-600" />
              <span>Export Audit</span>
            </button>
          )}
          <button
            onClick={onOpenCsvModal}
            className="flex items-center gap-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add SKU</span>
          </button>
        </div>
      </div>

      {/* Table Surface */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-zinc-500 font-semibold select-none">
                <th
                  onClick={() => toggleSort('product')}
                  className="cursor-pointer py-3 px-4 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Product & SKU</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('risk_score')}
                  className="cursor-pointer py-3 px-3 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Level & Reason</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('quantity')}
                  className="cursor-pointer py-3 px-3 text-right hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Stock Qty</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('current_value')}
                  className="cursor-pointer py-3 px-3 text-right hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valuation</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('age_months')}
                  className="cursor-pointer py-3 px-3 text-center hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Age</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('monthly_demand')}
                  className="cursor-pointer py-3 px-3 text-right hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Mo. Demand</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-right">Recommended Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/80">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="h-8 w-8 text-zinc-400" />
                      <p className="font-medium text-zinc-700 dark:text-zinc-300">No matching inventory items found</p>
                      <p className="text-xs text-zinc-400">Try adjusting your search terms or upload a new CSV dataset.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-zinc-50/80 dark:hover:bg-zinc-900/40 transition-colors"
                  >
                    {/* Product & SKU */}
                    <td className="py-3 px-4">
                      <div
                        className="cursor-pointer group/title"
                        onClick={() => onOpenSkuDetail?.(item)}
                      >
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5 group-hover/title:text-[#0D9488] transition-colors">
                          <span>{item.product}</span>
                          {item.category && (
                            <span className="rounded bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 text-[10px] text-zinc-500 font-normal">
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

                    {/* Risk Badge with Plain-English Explanation */}
                    <td className="py-3 px-3">
                      <div className="relative">
                        <div
                          className="cursor-pointer"
                          onClick={() => onOpenSkuDetail?.(item)}
                          onMouseEnter={() => setActiveTooltipSku(item.sku)}
                          onMouseLeave={() => setActiveTooltipSku(null)}
                        >
                          {getRiskBadge(item.risk_level, item.risk_score)}
                        </div>
                        {activeTooltipSku === item.sku && item.ai_explanation && (
                          <div className="absolute left-0 bottom-full mb-2 w-72 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 p-2.5 shadow-xl z-50 text-[11px] text-zinc-700 dark:text-zinc-200 animate-in fade-in duration-100">
                            <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-indigo-500" />
                              <span>Risk Explanation</span>
                            </div>
                            <p className="leading-relaxed">{item.ai_explanation}</p>
                          </div>
                        )}
                      </div>
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
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenMatches(item)}
                          className="flex items-center gap-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-2 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="View Matched Buyers"
                        >
                          <Users className="h-3 w-3 text-indigo-500" />
                          <span className="hidden sm:inline">Buyers</span>
                        </button>

                        <button
                          onClick={() => onOpenRecovery(item)}
                          className="flex items-center gap-1 rounded-md bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white transition-all shadow-xs"
                          title="Execute Recovery Action"
                        >
                          <Sparkles className="h-3 w-3" />
                          <span>Recover</span>
                        </button>

                        {onOpenPublishMarketplace && (
                          <button
                            onClick={() => onOpenPublishMarketplace(item)}
                            className="p-1 rounded hover:bg-teal-50 dark:hover:bg-teal-950/40 text-zinc-400 hover:text-[#0D9488]"
                            title="Publish to Marketplace"
                          >
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => onOpenEditModal(item)}
                          className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Edit SKU"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>

                        <button
                          onClick={() => onArchiveItem(item)}
                          className="p-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-600 dark:hover:text-rose-400"
                          title="Archive SKU"
                        >
                          <Archive className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

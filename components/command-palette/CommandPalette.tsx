'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Package,
  ShoppingBag,
  Sparkles,
  Plus,
  FileSpreadsheet,
  BarChart3,
  X,
  ArrowRight,
} from 'lucide-react'
import { InventoryItem, MarketplaceItem } from '@/lib/api'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  inventory: InventoryItem[]
  marketplace: MarketplaceItem[]
  onSelectSKU: (sku: string) => void
  onTriggerAction: (action: string) => void
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  inventory,
  marketplace,
  onSelectSKU,
  onTriggerAction,
}) => {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else onTriggerAction('open_command')
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, onTriggerAction])

  if (!isOpen) return null

  const q = query.toLowerCase()
  const matchedInventory = inventory
    .filter((i) => i.product.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
    .slice(0, 4)

  const matchedMarketplace = marketplace
    .filter((m) => m.title.toLowerCase().includes(q) || m.location.toLowerCase().includes(q))
    .slice(0, 3)

  const actions = [
    { id: 'add_sku', label: 'Add New Inventory SKU', icon: Plus },
    { id: 'import_csv', label: 'Bulk Import Inventory (CSV / ERP)', icon: FileSpreadsheet },
    { id: 'open_ai', label: 'Ask DeadStock AI Assistant', icon: Sparkles },
    { id: 'view_analytics', label: 'View Inventory & Recovery Analytics', icon: BarChart3 },
  ].filter((a) => a.label.toLowerCase().includes(q))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs pt-20 p-4 animate-in fade-in duration-100">
      <div className="w-full max-w-xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search inventory SKUs, surplus lots, or type an action..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none"
          />
          <kbd className="rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-3 text-xs">
          {/* Actions */}
          {actions.length > 0 && (
            <div>
              <span className="block px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Quick Actions
              </span>
              <div className="space-y-0.5 mt-1">
                {actions.map((act) => {
                  const Icon = act.icon
                  return (
                    <button
                      key={act.id}
                      onClick={() => {
                        onTriggerAction(act.id)
                        onClose()
                      }}
                      className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-3.5 w-3.5 text-zinc-400" />
                        <span>{act.label}</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-zinc-400" />
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Inventory SKUs */}
          {matchedInventory.length > 0 && (
            <div>
              <span className="block px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Inventory SKUs
              </span>
              <div className="space-y-0.5 mt-1">
                {matchedInventory.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      onSelectSKU(item.sku)
                      onClose()
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Package className="h-3.5 w-3.5 text-indigo-500" />
                      <div className="text-left">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{item.product}</div>
                        <div className="text-[10px] font-mono text-zinc-400">SKU: {item.sku}</div>
                      </div>
                    </div>
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">
                      {item.qty || item.quantity} units
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Marketplace Surplus */}
          {matchedMarketplace.length > 0 && (
            <div>
              <span className="block px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                Marketplace Lots
              </span>
              <div className="space-y-0.5 mt-1">
                {matchedMarketplace.map((lot) => (
                  <button
                    key={lot.id}
                    onClick={() => {
                      onTriggerAction('marketplace')
                      onClose()
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-3.5 w-3.5 text-emerald-500" />
                      <div className="text-left">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{lot.title}</div>
                        <div className="text-[10px] text-zinc-400">{lot.location}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {lot.price}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {actions.length === 0 && matchedInventory.length === 0 && matchedMarketplace.length === 0 && (
            <div className="py-6 text-center text-xs text-zinc-400">
              No matching SKUs, listings, or commands found for &ldquo;{query}&rdquo;.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

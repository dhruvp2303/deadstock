'use client'

import React, { useState } from 'react'
import { X, ShoppingBag, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'
import { InventoryItem, DeadStockAPI } from '@/lib/api'

interface PublishListingModalProps {
  isOpen: boolean
  onClose: () => void
  item: InventoryItem | null
  onSuccess: () => void
}

export const PublishListingModal: React.FC<PublishListingModalProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const [discountPct, setDiscountPct] = useState<number>(20)
  const [condition, setCondition] = useState('Factory Sealed Surplus')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen || !item) return null

  const unitCost = Number(item.unit_cost) || 40
  const qty = Number(item.quantity) || 1000
  const askingPrice = Math.max(1, Math.round(unitCost * (1 - discountPct / 100)))
  const totalListedValue = askingPrice * qty

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await DeadStockAPI.createMarketplaceListing({
        title: item.product,
        category: item.category || 'Mechanical Components',
        units_available: qty,
        price_per_unit: askingPrice,
        location: item.warehouse || 'Ahmedabad Depot',
        condition,
        description: description || `Verified surplus inventory lot for SKU ${item.sku}. High-grade industrial components available for bulk procurement.`,
        inventory_id: item.id,
      })

      if (res?.success !== false) {
        onSuccess()
        onClose()
      } else {
        setErrorMessage(res?.message || 'Failed to publish marketplace listing.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while publishing listing.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-[#0D9488] flex items-center justify-center">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Publish to Surplus Marketplace
              </h3>
              <span className="text-xs text-zinc-400 font-mono">SKU: {item.sku}</span>
            </div>
          </div>

          <button onClick={onClose} className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handlePublish} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Listing Title
            </label>
            <input
              type="text"
              readOnly
              value={item.product}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 font-semibold text-zinc-800 dark:text-zinc-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Discount Off Cost (%)
              </label>
              <select
                value={discountPct}
                onChange={(e) => setDiscountPct(Number(e.target.value))}
                className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 font-mono font-bold text-zinc-900 dark:text-zinc-100"
              >
                <option value={10}>10% Discount (Max Value)</option>
                <option value={15}>15% Discount</option>
                <option value={20}>20% Discount (Recommended)</option>
                <option value={25}>25% Discount (Fast Sale)</option>
                <option value={35}>35% Discount (Aggressive)</option>
                <option value={50}>50% Liquidation</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Surplus Price / Unit (₹)
              </label>
              <input
                type="text"
                readOnly
                value={`₹${askingPrice} / unit`}
                className="w-full rounded-xl border border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/30 px-3 py-2 font-mono font-bold text-[#0D9488]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Quality & Packaging Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2"
            >
              <option value="Factory Sealed Surplus">Factory Sealed Surplus (Grade A+)</option>
              <option value="Overstock Excess Unused">Overstock Excess Unused (Grade A)</option>
              <option value="Reworked Certified">Reworked Certified & Tested</option>
              <option value="Open Box Inspected">Open Box Inspected</option>
            </select>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 flex items-center justify-between">
            <span className="text-zinc-500">Total Listed Lot Capital:</span>
            <span className="font-mono font-bold text-sm text-[#0D9488] dark:text-[#14B8A6]">
              ₹{(totalListedValue / 100000).toFixed(2)}L ({qty.toLocaleString()} units)
            </span>
          </div>

          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2 font-bold text-white shadow-md shadow-teal-600/20 disabled:opacity-50"
            >
              {submitting ? 'Publishing Lot...' : 'Publish to Marketplace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

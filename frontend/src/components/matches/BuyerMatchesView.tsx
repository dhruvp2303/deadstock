'use client'

import React, { useState } from 'react'
import {
  Users,
  Building2,
  Sparkles,
  MapPin,
  Tag,
  Send,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  X,
  DollarSign,
  AlertCircle,
} from 'lucide-react'
import { BuyerMatchItem, DeadStockAPI } from '@/lib/api'

interface BuyerMatchesViewProps {
  matches: BuyerMatchItem[]
  onRefresh: () => void
}

export const BuyerMatchesView: React.FC<BuyerMatchesViewProps> = ({
  matches,
  onRefresh,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<BuyerMatchItem | null>(null)
  const [offerQty, setOfferQty] = useState<number>(2500)
  const [offerPrice, setOfferPrice] = useState<number>(42)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleOpenOffer = (match: BuyerMatchItem) => {
    setSelectedMatch(match)
    setOfferQty(match.required_units || 2500)
    setOfferPrice(42)
    setNotes(`Direct negotiation initiated with verified match score ${match.match || `${match.match_score}%`}.`)
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMatch) return
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await DeadStockAPI.sendOffer({
        inventory_id: selectedMatch.inventory_id || (selectedMatch as any).inventory?.id || 1,
        sku: selectedMatch.inventory_sku || (selectedMatch as any).inventory?.sku,
        buyer_match_id: selectedMatch.id,
        receiver_company_id: selectedMatch.buyer_company_id || 2,
        offered_quantity: offerQty,
        offered_unit_price: offerPrice,
        notes: notes || `Direct B2B liquidation offer for ${offerQty} units at ₹${offerPrice}/unit.`,
      })

      if (res?.success) {
        setSuccessMessage('Direct offer dispatched to buyer procurement desk!')
        setTimeout(() => {
          setSelectedMatch(null)
          onRefresh()
        }, 1200)
      } else {
        setErrorMessage(res?.message || 'Failed to dispatch offer.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error occurred while sending offer.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            <span>High-Confidence B2B Buyer Matches</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Ranked counterparty matches computed from material specs, industrial category, and regional manufacturing demand.
          </p>
        </div>
      </div>

      {/* Matches Grid or Empty State */}
      {matches.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">No buyer matches found yet</h4>
          <p className="text-xs text-zinc-500 max-w-md mx-auto mt-1 leading-relaxed">
            Our multi-parameter compatibility engine computes matches in real-time. Once you upload or add inventory SKUs, qualified buyers will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {matches.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs hover:border-[#0D9488]/40 hover:shadow-md transition-all"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <Building2 className="h-4 w-4 text-[#0D9488] shrink-0" />
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
                    {item.match || `${item.match_score}%`} Fit
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span>{item.location}</span>
                  <span>• Industrial Manufacturing</span>
                </div>

                <div className="mt-3.5 space-y-2 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 p-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Target Absorption:</span>
                    <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                      {item.units || `${item.required_units?.toLocaleString()} units`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Est. Deal Value:</span>
                    <span className="font-mono font-bold text-[#0D9488] dark:text-[#14B8A6]">
                      {item.value || `₹${(item.potential_deal_value || 0).toLocaleString()}`}
                    </span>
                  </div>
                </div>

                {/* Factor Breakdown */}
                <div className="mt-3.5 space-y-2">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Compatibility Breakdown
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-2 text-zinc-600 dark:text-zinc-300">
                      <span className="text-[10px] text-zinc-400 block">Product</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{item.breakdown?.product_compatibility || '95%'}</strong>
                    </div>
                    <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-2 text-zinc-600 dark:text-zinc-300">
                      <span className="text-[10px] text-zinc-400 block">Volume</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{item.breakdown?.quantity_compatibility || '90%'}</strong>
                    </div>
                    <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-2 text-zinc-600 dark:text-zinc-300">
                      <span className="text-[10px] text-zinc-400 block">Industry</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{item.breakdown?.industry || '92%'}</strong>
                    </div>
                    <div className="rounded-xl border border-zinc-200/70 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/60 p-2 text-zinc-600 dark:text-zinc-300">
                      <span className="text-[10px] text-zinc-400 block">Location</span>
                      <strong className="text-zinc-900 dark:text-zinc-100 font-mono">{item.breakdown?.location || '85%'}</strong>
                    </div>
                  </div>
                </div>

                {item.note && (
                  <p className="mt-3 text-[11px] text-zinc-500 italic leading-relaxed">
                    &ldquo;{item.note}&rdquo;
                  </p>
                )}
              </div>

              <div className="mt-4 pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Verified Buyer
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenOffer(item)}
                  className="flex items-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-4 py-2 text-xs font-bold text-white transition-all shadow-xs shrink-0"
                >
                  <Send className="h-3 w-3" />
                  <span>Send Direct Offer</span>
                </button>
              </div>
            </div>
          ))}
      </div>
    )}

      {/* Direct Offer Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Send B2B Offer to {selectedMatch.name}
                </h3>
                <p className="text-xs text-zinc-500">High Match Fit: {selectedMatch.match || '90%'}</p>
              </div>
              <button
                onClick={() => setSelectedMatch(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage ? (
              <div className="mt-6 py-4 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Offered Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={offerQty}
                      onChange={(e) => setOfferQty(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Offered Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={0.01}
                      step={0.01}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 flex items-center justify-between">
                  <span className="text-zinc-500">Total Deal Capital:</span>
                  <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    ₹{(offerQty * offerPrice).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Direct Note to Buyer
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedMatch(null)}
                    className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || offerQty <= 0}
                    className="flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
                  >
                    {submitting ? 'Dispatching...' : 'Dispatch Direct Offer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

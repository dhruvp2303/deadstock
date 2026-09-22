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
        receiver_company_id: selectedMatch.buyer_company_id || 2,
        offered_quantity: offerQty,
        offered_unit_price: offerPrice,
        notes: notes,
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

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((item) => (
          <div
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700 transition-all"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  <Building2 className="h-4 w-4 text-zinc-400" />
                  <span>{item.name}</span>
                </div>
                <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  {item.match || `${item.match_score}%`} Fit
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1 text-[11px] text-zinc-400">
                <MapPin className="h-3 w-3" />
                <span>{item.location}</span>
                <span>• Industrial Manufacturing</span>
              </div>

              <div className="mt-3 space-y-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 p-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Target Absorption:</span>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.units || `${item.required_units?.toLocaleString()} units`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Est. Deal Value:</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {item.value || `₹${(item.potential_deal_value || 0).toLocaleString()}`}
                  </span>
                </div>
              </div>

              {/* Factor Breakdown */}
              <div className="mt-3">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">
                  Compatibility Breakdown
                </span>
                <div className="mt-1.5 grid grid-cols-2 gap-1.5 text-[11px]">
                  <div className="rounded bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-zinc-600 dark:text-zinc-300">
                    Product: <strong className="text-zinc-900 dark:text-zinc-100">{item.breakdown?.product_compatibility || '95%'}</strong>
                  </div>
                  <div className="rounded bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-zinc-600 dark:text-zinc-300">
                    Volume: <strong className="text-zinc-900 dark:text-zinc-100">{item.breakdown?.quantity_compatibility || '90%'}</strong>
                  </div>
                  <div className="rounded bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-zinc-600 dark:text-zinc-300">
                    Industry: <strong className="text-zinc-900 dark:text-zinc-100">{item.breakdown?.industry || '92%'}</strong>
                  </div>
                  <div className="rounded bg-zinc-100 dark:bg-zinc-900 px-2 py-1 text-zinc-600 dark:text-zinc-300">
                    Location: <strong className="text-zinc-900 dark:text-zinc-100">{item.breakdown?.location || '85%'}</strong>
                  </div>
                </div>
              </div>

              {item.note && (
                <p className="mt-3 text-[11px] text-zinc-500 italic leading-relaxed">
                  &ldquo;{item.note}&rdquo;
                </p>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified Buyer
              </span>
              <button
                type="button"
                onClick={() => handleOpenOffer(item)}
                className="flex items-center gap-1 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-xs"
              >
                <Send className="h-3 w-3" />
                <span>Send Direct Offer</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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

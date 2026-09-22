'use client'

import React, { useState } from 'react'
import {
  Inbox,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  Building2,
  ArrowRight,
  Clock,
  AlertCircle,
  DollarSign,
  X,
} from 'lucide-react'
import { OfferItem, DeadStockAPI } from '@/lib/api'

interface OffersManagementProps {
  offers: OfferItem[]
  currentRole: 'seller' | 'buyer'
  onRefresh: () => void
}

export const OffersManagement: React.FC<OffersManagementProps> = ({
  offers,
  currentRole,
  onRefresh,
}) => {
  const [selectedOfferForCounter, setSelectedOfferForCounter] = useState<OfferItem | null>(null)
  const [counterPrice, setCounterPrice] = useState<number>(0)
  const [counterNotes, setCounterNotes] = useState('')
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleAccept = async (id: number) => {
    setProcessingId(id)
    setStatusMessage(null)
    try {
      const res = await DeadStockAPI.acceptOffer(id)
      if (res?.success) {
        setStatusMessage({ text: 'Offer accepted! Transaction executed and inventory decremented.', type: 'success' })
        onRefresh()
      } else {
        setStatusMessage({ text: res?.message || 'Failed to accept offer.', type: 'error' })
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error executing offer acceptance.', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: number) => {
    setProcessingId(id)
    setStatusMessage(null)
    try {
      const res = await DeadStockAPI.rejectOffer(id, 'Declined by counterparty.')
      if (res?.success) {
        setStatusMessage({ text: 'Offer declined.', type: 'success' })
        onRefresh()
      } else {
        setStatusMessage({ text: res?.message || 'Failed to decline offer.', type: 'error' })
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error declining offer.', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleOpenCounter = (offer: OfferItem) => {
    setSelectedOfferForCounter(offer)
    setCounterPrice(offer.offered_unit_price * 1.1)
    setCounterNotes('')
  }

  const handleSendCounter = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOfferForCounter) return
    setProcessingId(selectedOfferForCounter.id)

    try {
      const res = await DeadStockAPI.counterOffer(selectedOfferForCounter.id, {
        counter_unit_price: counterPrice,
        notes: counterNotes,
      })
      if (res?.success) {
        setStatusMessage({ text: 'Counter-offer dispatched to counterparty.', type: 'success' })
        setSelectedOfferForCounter(null)
        onRefresh()
      } else {
        setStatusMessage({ text: res?.message || 'Failed to send counter-offer.', type: 'error' })
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error sending counter-offer.', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3 w-3" />
            ACCEPTED & COMPLETED
          </span>
        )
      case 'countered':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 px-2 py-0.5 text-xs font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <RotateCcw className="h-3 w-3" />
            COUNTER-OFFER SENT
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <XCircle className="h-3 w-3" />
            DECLINED
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Clock className="h-3 w-3" />
            PENDING REVIEW
          </span>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Inbox className="h-4 w-4 text-indigo-500" />
            <span>{currentRole === 'seller' ? 'Inbound Buyer Offers & Negotiations' : 'My Outgoing B2B Offers'}</span>
          </h3>
          <p className="text-xs text-zinc-500">
            {currentRole === 'seller'
              ? 'Accept offers to atomically execute transactions, or send counter-proposals.'
              : 'Track active status of your surplus bids and counter-proposals.'}
          </p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-xs border ${
            statusMessage.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
          }`}
        >
          {statusMessage.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Offers Table */}
      <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/50 text-zinc-500 font-semibold">
                <th className="py-3 px-4">Offer ID & Product</th>
                <th className="py-3 px-3">Counterparty Company</th>
                <th className="py-3 px-3 text-right">Offered Qty</th>
                <th className="py-3 px-3 text-right">Unit Price</th>
                <th className="py-3 px-3 text-right">Total Deal Value</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-4 text-right">Negotiation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-zinc-400">
                    <Inbox className="mx-auto h-8 w-8 text-zinc-300 mb-2" />
                    <p className="font-semibold text-zinc-700 dark:text-zinc-300">No active offers in negotiation</p>
                    <p className="text-xs text-zinc-400">Offers submitted through the surplus catalog will appear here.</p>
                  </td>
                </tr>
              ) : (
                offers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-bold text-zinc-900 dark:text-zinc-100">
                          {offer.inventory?.product_name || `Inventory Item #${offer.inventory_id}`}
                        </div>
                        <div className="font-mono text-[11px] text-zinc-400">
                          ID: #{offer.id} {offer.inventory?.sku && `• SKU: ${offer.inventory.sku}`}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-zinc-800 dark:text-zinc-200">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                        <span>
                          {currentRole === 'seller'
                            ? offer.sender_company?.name || 'Verified B2B Buyer'
                            : offer.receiver_company?.name || 'Verified Surplus Seller'}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      {offer.offered_quantity.toLocaleString()} units
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      ₹{offer.offered_unit_price}/unit
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{offer.total_deal_value.toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(offer.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {offer.status === 'pending' || offer.status === 'countered' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          {currentRole === 'seller' && (
                            <>
                              <button
                                type="button"
                                disabled={processingId === offer.id}
                                onClick={() => handleAccept(offer.id)}
                                className="rounded-md bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 text-[11px] font-semibold text-white transition-all disabled:opacity-50"
                              >
                                Accept
                              </button>
                              <button
                                type="button"
                                disabled={processingId === offer.id}
                                onClick={() => handleOpenCounter(offer)}
                                className="rounded-md border border-zinc-200 dark:border-zinc-800 px-2 py-1 text-[11px] font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800"
                              >
                                Counter
                              </button>
                            </>
                          )}
                          <button
                            type="button"
                            disabled={processingId === offer.id}
                            onClick={() => handleReject(offer.id)}
                            className="rounded-md p-1 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600"
                            title="Decline Offer"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-zinc-400">Completed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Counter Offer Modal */}
      {selectedOfferForCounter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Submit Counter-Offer
                </h3>
                <p className="text-xs text-zinc-500">Offer #{selectedOfferForCounter.id}</p>
              </div>
              <button
                onClick={() => setSelectedOfferForCounter(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSendCounter} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Counter Unit Price (₹)
                </label>
                <input
                  type="number"
                  required
                  min={0.01}
                  step={0.01}
                  value={counterPrice}
                  onChange={(e) => setCounterPrice(Number(e.target.value))}
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Counter Notes & Terms
                </label>
                <textarea
                  rows={3}
                  value={counterNotes}
                  onChange={(e) => setCounterNotes(e.target.value)}
                  placeholder="e.g. Can release 3,000 units immediately at ₹42/unit with standard test certs."
                  className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                <button
                  type="button"
                  onClick={() => setSelectedOfferForCounter(null)}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={processingId === selectedOfferForCounter.id || counterPrice <= 0}
                  className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-1.5 font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
                >
                  {processingId === selectedOfferForCounter.id ? 'Dispatching...' : 'Send Counter-Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

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
  FileText,
} from 'lucide-react'
import { OfferItem, DeadStockAPI } from '@/lib/api'
import { DealRoomModal } from '@/components/deal-room/DealRoomModal'

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
  const [selectedOfferForDealRoom, setSelectedOfferForDealRoom] = useState<OfferItem | null>(null)
  const [counterPrice, setCounterPrice] = useState<number>(0)
  const [counterNotes, setCounterNotes] = useState('')
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const handleAccept = async (id: number) => {
    setProcessingId(id)
    setStatusMessage(null)
    try {
      const res = await DeadStockAPI.acceptOffer(id)
      if (res) {
        setStatusMessage({ text: 'Offer accepted! Transaction executed and inventory decremented.', type: 'success' })
        onRefresh()
      } else {
        setStatusMessage({ text: 'Failed to accept offer.', type: 'error' })
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
      if (res) {
        setStatusMessage({ text: 'Offer declined.', type: 'success' })
        onRefresh()
      } else {
        setStatusMessage({ text: 'Failed to decline offer.', type: 'error' })
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error declining offer.', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const handleOpenCounter = (offer: OfferItem) => {
    setSelectedOfferForCounter(offer)
    const unitPrice = Number(offer.offered_unit_price || offer.offered_price_per_unit || 0)
    setCounterPrice(Math.round(unitPrice * 1.1 * 100) / 100)
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
      if (res) {
        setStatusMessage({ text: 'Counter-offer dispatched to counterparty.', type: 'success' })
        setSelectedOfferForCounter(null)
        onRefresh()
      } else {
        setStatusMessage({ text: 'Failed to send counter-offer.', type: 'error' })
      }
    } catch (err: any) {
      setStatusMessage({ text: err.message || 'Error sending counter-offer.', type: 'error' })
    } finally {
      setProcessingId(null)
    }
  }

  const [selectedOfferForLifecycle, setSelectedOfferForLifecycle] = useState<OfferItem | null>(null)
  const [localStatuses, setLocalStatuses] = useState<Record<number, string>>({})

  const getEffectiveStatus = (offer: OfferItem) => {
    return localStatuses[offer.id] || offer.status || 'pending'
  }

  const handleAdvanceLifecycle = (offerId: number, nextStatus: string) => {
    setLocalStatuses((prev) => ({ ...prev, [offerId]: nextStatus }))
    setStatusMessage({
      text: `Deal #${offerId} transitioned to: ${nextStatus.toUpperCase().replace('_', ' ')}`,
      type: 'success',
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            COMPLETED & SETTLED
          </span>
        )
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-bold text-[#0D9488] dark:text-[#14B8A6] border border-teal-500/20 whitespace-nowrap shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            DELIVERED & VERIFIED
          </span>
        )
      case 'dispatched':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 border border-blue-500/20 whitespace-nowrap shrink-0">
            <Clock className="h-3 w-3" />
            DISPATCHED (IN TRANSIT)
          </span>
        )
      case 'escrow_funded':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 border border-purple-500/20 whitespace-nowrap shrink-0">
            <DollarSign className="h-3 w-3" />
            IN ESCROW / PAYMENT
          </span>
        )
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 border border-emerald-500/20 whitespace-nowrap shrink-0">
            <CheckCircle2 className="h-3 w-3" />
            DEAL ACCEPTED
          </span>
        )
      case 'countered':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-bold text-amber-600 border border-amber-500/20 whitespace-nowrap shrink-0">
            <RotateCcw className="h-3 w-3" />
            COUNTER-OFFER
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[11px] font-bold text-rose-600 border border-rose-500/20 whitespace-nowrap shrink-0">
            <XCircle className="h-3 w-3" />
            DECLINED
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600 border border-indigo-500/20 whitespace-nowrap shrink-0">
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
                      {(Number(offer.offered_quantity) || 0).toLocaleString()} units
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium">
                      ₹{(Number(offer.offered_unit_price || offer.offered_price_per_unit || 0)).toLocaleString()}/unit
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      ₹{(Number(offer.total_deal_value || offer.total_offer_amount || 0)).toLocaleString()}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => setSelectedOfferForLifecycle(offer)}
                        className="hover:opacity-80 transition-opacity"
                        title="Click to view 6-stage transaction lifecycle tracker"
                      >
                        {getStatusBadge(getEffectiveStatus(offer))}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedOfferForDealRoom(offer)}
                          className="rounded-md border border-teal-500/30 bg-teal-500/10 px-2.5 py-1 text-[11px] font-bold text-[#0D9488] hover:bg-teal-500/20 transition-all flex items-center gap-1 shadow-xs"
                          title="Open B2B Deal Room (Agreements, Invoices, Escrow, Logistics & QC)"
                        >
                          <FileText className="h-3 w-3" />
                          Deal Room
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedOfferForLifecycle(offer)}
                          className="rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-2 py-1 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                        >
                          Lifecycle
                        </button>
                        {(getEffectiveStatus(offer) === 'pending' || getEffectiveStatus(offer) === 'countered') && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6-Stage Transaction Lifecycle Tracker Modal (Section 20) */}
      {selectedOfferForLifecycle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <span className="rounded-md bg-teal-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-[#0D9488]">
                  TXN-LIFECYCLE-#{selectedOfferForLifecycle.id}
                </span>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                  6-Stage Transaction & Settlement Tracker
                </h3>
                <p className="text-xs text-zinc-500">
                  {selectedOfferForLifecycle.inventory?.product_name || 'Industrial Surplus Lot'} • {(Number(selectedOfferForLifecycle.offered_quantity) || 0).toLocaleString()} units at ₹{(Number(selectedOfferForLifecycle.offered_unit_price || selectedOfferForLifecycle.offered_price_per_unit || 0)).toLocaleString()}/unit
                </p>
              </div>
              <button
                onClick={() => setSelectedOfferForLifecycle(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* 6 Stages Visual Timeline */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                End-to-End Deal Progression
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                {[
                  { key: 'pending', num: '01', title: 'Pending', desc: 'Buyer Offer' },
                  { key: 'countered', num: '02', title: 'Counter', desc: 'Negotiation' },
                  { key: 'accepted', num: '03', title: 'Accepted', desc: 'Deal Signed' },
                  { key: 'escrow_funded', num: '04', title: 'Escrow', desc: 'Funds Secured' },
                  { key: 'dispatched', num: '05', title: 'Dispatched', desc: 'In Freight' },
                  { key: 'completed', num: '06', title: 'Settled', desc: 'Value Released' },
                ].map((st) => {
                  const curr = getEffectiveStatus(selectedOfferForLifecycle)
                  const stagesOrder = ['pending', 'countered', 'accepted', 'escrow_funded', 'dispatched', 'delivered', 'completed']
                  const isDone = stagesOrder.indexOf(curr) >= stagesOrder.indexOf(st.key)
                  const isCurrent = curr === st.key

                  return (
                    <div
                      key={st.key}
                      className={`rounded-xl border p-2.5 text-center transition-all ${
                        isCurrent
                          ? 'border-[#0D9488] bg-teal-500/10 shadow-xs'
                          : isDone
                          ? 'border-emerald-500/40 bg-emerald-500/5'
                          : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-60'
                      }`}
                    >
                      <span className="text-[10px] font-mono font-bold text-zinc-400 block">{st.num}</span>
                      <span className={`text-xs font-bold block mt-0.5 ${isCurrent ? 'text-[#0D9488]' : isDone ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600'}`}>
                        {st.title}
                      </span>
                      <span className="text-[10px] text-zinc-400 block leading-tight">{st.desc}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Financial Summary & Auto Inventory Synchronization Card */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Total Deal Capital</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">
                  ₹{(Number(selectedOfferForLifecycle.total_deal_value || selectedOfferForLifecycle.total_offer_amount || 0)).toLocaleString()}
                </span>
                <span className="text-[10px] text-zinc-500 block">Bank Escrow Protected</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Inventory Sync</span>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Atomic Auto-Deduct</span>
                </span>
                <span className="text-[10px] text-zinc-500 block">Ledger Txn Created</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] uppercase font-bold block">Current Stage</span>
                <span className="text-xs font-bold font-mono text-[#0D9488]">
                  {getEffectiveStatus(selectedOfferForLifecycle).toUpperCase().replace('_', ' ')}
                </span>
                <span className="text-[10px] text-zinc-500 block">SLA: On Schedule</span>
              </div>
            </div>

            {/* Stage Action Controls */}
            <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
                Advance Transaction Workflow (Interactive Simulation):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdvanceLifecycle(selectedOfferForLifecycle.id, 'escrow_funded')}
                  className="rounded-full bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  1. Secure Payment in Escrow
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceLifecycle(selectedOfferForLifecycle.id, 'dispatched')}
                  className="rounded-full bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  2. Mark Freight Dispatched
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceLifecycle(selectedOfferForLifecycle.id, 'delivered')}
                  className="rounded-full bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  3. Confirm Facility Delivery
                </button>
                <button
                  type="button"
                  onClick={() => handleAdvanceLifecycle(selectedOfferForLifecycle.id, 'completed')}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
                >
                  4. Release Funds & Complete
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <button
                type="button"
                onClick={() => {
                  const o = selectedOfferForLifecycle
                  setSelectedOfferForLifecycle(null)
                  setSelectedOfferForDealRoom(o)
                }}
                className="rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-2 text-xs font-bold text-[#0D9488] hover:bg-teal-500/20 transition-all flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5" />
                Open Full Deal Room, Invoice & Agreement
              </button>
              <button
                type="button"
                onClick={() => setSelectedOfferForLifecycle(null)}
                className="rounded-full bg-zinc-900 dark:bg-zinc-100 px-5 py-2 text-xs font-bold text-white dark:text-zinc-900"
              >
                Close Tracker
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* B2B Deal Room Modal */}
      {selectedOfferForDealRoom && (
        <DealRoomModal
          isOpen={!!selectedOfferForDealRoom}
          onClose={() => setSelectedOfferForDealRoom(null)}
          offer={selectedOfferForDealRoom}
          currentRole={currentRole}
        />
      )}
    </div>
  )
}

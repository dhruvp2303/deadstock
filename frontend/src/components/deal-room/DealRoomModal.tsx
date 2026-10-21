'use client'

import React, { useState } from 'react'
import {
  X,
  Building2,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Truck,
  DollarSign,
  Clock,
  Download,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Package,
  Layers,
  Check,
  ArrowRight,
} from 'lucide-react'
import { OfferItem, InventoryItem } from '@/lib/api'

interface DealRoomModalProps {
  isOpen: boolean
  onClose: () => void
  offer: OfferItem | null
  currentRole: 'seller' | 'buyer'
  onStatusChange?: (offerId: number, newStatus: string) => void
}

export const DealRoomModal: React.FC<DealRoomModalProps> = ({
  isOpen,
  onClose,
  offer,
  currentRole,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'documents' | 'logistics' | 'inspection' | 'escrow'>('overview')
  const [currentStage, setCurrentStage] = useState<'accepted' | 'escrow_funded' | 'inspected' | 'dispatched' | 'delivered' | 'completed'>('escrow_funded')
  const [logisticsBooked, setLogisticsBooked] = useState(false)
  const [inspectionRequested, setInspectionRequested] = useState(false)
  const [actionFeedback, setActionFeedback] = useState<string | null>(null)

  if (!isOpen || !offer) return null

  const dealQty = offer.offered_quantity || 3000
  const unitPrice = Number(offer.offered_unit_price || offer.offered_price_per_unit || 40)
  const totalDealAmount = dealQty * unitPrice

  // DeadStock Business Model Economics (0.5-1% seller, 0.25-0.75% buyer, listing commitment credit)
  const sellerFeeRate = 0.01 // 1%
  const buyerFeeRate = 0.005 // 0.5%
  const listingCommitmentCredit = 299 // ₹299 listing commitment credited against transaction fee

  const rawSellerFee = Math.round(totalDealAmount * sellerFeeRate)
  const netSellerFee = Math.max(0, rawSellerFee - listingCommitmentCredit)
  const buyerFee = Math.round(totalDealAmount * buyerFeeRate)
  const totalPlatformRevenue = rawSellerFee + buyerFee
  const netSellerPayout = totalDealAmount - netSellerFee

  const showFeedback = (msg: string) => {
    setActionFeedback(msg)
    setTimeout(() => setActionFeedback(null), 3000)
  }

  const handleAdvanceStage = (next: 'escrow_funded' | 'inspected' | 'dispatched' | 'delivered' | 'completed') => {
    setCurrentStage(next)
    if (onStatusChange) {
      onStatusChange(offer.id, next === 'inspected' ? 'escrow_funded' : next)
    }
    showFeedback(`Deal stage advanced to: ${next.toUpperCase().replace('_', ' ')}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header with Deal Room ID and Verified Badges */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-teal-500/10 px-2.5 py-1 text-[10px] font-mono font-bold text-[#0D9488] whitespace-nowrap shrink-0">
                B2B DEAL ROOM #DR-{offer.id}-{dateStamp()}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 whitespace-nowrap shrink-0">
                <ShieldCheck className="h-3 w-3" />
                DeadStock Protected Transaction
              </span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
              {offer.inventory?.product_name || 'Industrial Surplus Lot'}
            </h3>
            <p className="text-xs text-zinc-500">
              SKU: {offer.inventory?.sku || 'PC2048'} • {dealQty.toLocaleString()} units @ ₹{unitPrice}/unit • Total Contract Value: ₹{totalDealAmount.toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Action Feedback Banner */}
        {actionFeedback && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 p-3 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Counterparty Summary Bar */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Seller Entity</span>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-[#0D9488]" />
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {offer.receiver_company?.name || offer.seller_company_name || 'Registered Seller Entity'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">Origin Depot: Verified Primary Distribution Facility</p>
          </div>

          <div className="space-y-1 border-t md:border-t-0 md:border-l border-zinc-200 dark:border-zinc-800 pt-3 md:pt-0 md:pl-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Buyer Entity</span>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 text-indigo-500" />
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {offer.sender_company?.name || offer.buyer_company_name || 'Verified B2B Procurement Buyer'}
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">Delivery Depot: Designated Consignee Logistics Depot</p>
          </div>
        </div>

        {/* 6-Stage Milestone Tracker */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
            Deal Execution Milestones & Settlement Progress
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {[
              { id: 'accepted', num: '01', title: 'Deal Signed', desc: 'Contract Ready' },
              { id: 'escrow_funded', num: '02', title: 'Escrow Funded', desc: '₹' + (totalDealAmount + buyerFee).toLocaleString() + ' Secured' },
              { id: 'inspected', num: '03', title: 'Inspection', desc: inspectionRequested ? 'Passed (Grade A)' : 'Optional Quality Check' },
              { id: 'dispatched', num: '04', title: 'Dispatched', desc: 'Freight In-Transit' },
              { id: 'delivered', num: '05', title: 'Delivered', desc: 'Depot Receiving' },
              { id: 'completed', num: '06', title: 'Settled', desc: 'Funds Credited' },
            ].map((step) => {
              const stages = ['accepted', 'escrow_funded', 'inspected', 'dispatched', 'delivered', 'completed']
              const isPast = stages.indexOf(currentStage) >= stages.indexOf(step.id as any)
              const isCurrent = currentStage === step.id

              return (
                <div
                  key={step.id}
                  className={`rounded-xl border p-2.5 text-center transition-all ${
                    isCurrent
                      ? 'border-[#0D9488] bg-teal-500/10 shadow-xs'
                      : isPast
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 opacity-60'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold text-zinc-400 block">{step.num}</span>
                  <span className={`text-xs font-bold block mt-0.5 ${isCurrent ? 'text-[#0D9488]' : isPast ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-600'}`}>
                    {step.title}
                  </span>
                  <span className="text-[10px] text-zinc-400 block mt-0.5 line-clamp-1 font-medium">{step.desc}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sub-Tabs: Overview, Settlement/Economics, Documents, Logistics, Inspection */}
        <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2">
          {[
            { id: 'overview', label: 'Financial Settlement & Economics', icon: DollarSign },
            { id: 'documents', label: 'B2B Invoices & Contract Docs', icon: FileText },
            { id: 'logistics', label: 'DeadStock Freight & Logistics', icon: Truck },
            { id: 'inspection', label: 'Third-Party Verification', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#0D9488] text-white shadow-xs font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* SUBTAB 1: Financial Settlement & Transparent Revenue Economics */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Total Lot Value</span>
                <span className="text-xl font-black font-mono text-zinc-900 dark:text-zinc-100 block">
                  ₹{totalDealAmount.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">{dealQty.toLocaleString()} units @ ₹{unitPrice}</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Net Seller Capital Recovery</span>
                <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400 block">
                  ₹{netSellerPayout.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-600 font-medium">99.1% recovery efficiency</span>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">DeadStock Platform Fee</span>
                <span className="text-xl font-black font-mono text-[#0D9488] block">
                  ₹{totalPlatformRevenue.toLocaleString()}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono">1.5% combined value take-rate</span>
              </div>
            </div>

            {/* Transparent Fee Ledger Breakdown */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                Transparent Deal Room Revenue Ledger (Official DeadStock Model)
              </h4>
              <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-2">
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-zinc-600 dark:text-zinc-300">Base Deal Amount</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{totalDealAmount.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-300 block">Seller Transaction Fee (1.0%)</span>
                    <span className="text-[10px] text-zinc-400">Standard seller liquidation success fee</span>
                  </div>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">₹{rawSellerFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex items-center justify-between text-emerald-600 dark:text-emerald-400">
                  <div>
                    <span className="font-semibold block">Listing Commitment Fee Credit (100% Refunded)</span>
                    <span className="text-[10px] text-emerald-600/80">Anti-spam deposit credited back to seller on successful deal completion</span>
                  </div>
                  <span className="font-mono font-bold">-₹{listingCommitmentCredit}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-300 block">Net Seller Transaction Deduct</span>
                    <span className="text-[10px] text-zinc-400">Deducted from escrow payout</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">₹{netSellerFee.toLocaleString()}</span>
                </div>
                <div className="pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-zinc-600 dark:text-zinc-300 block">Buyer Platform & Sourcing Fee (0.5%)</span>
                    <span className="text-[10px] text-zinc-400">Added to buyer escrow deposit invoice</span>
                  </div>
                  <span className="font-mono font-semibold text-zinc-900 dark:text-zinc-100">+₹{buyerFee.toLocaleString()}</span>
                </div>
                <div className="pt-3 flex items-center justify-between border-t-2 border-zinc-200 dark:border-zinc-700 font-bold">
                  <span>Total Escrow Deposit Required from Buyer</span>
                  <span className="font-mono text-sm text-[#0D9488]">₹{(totalDealAmount + buyerFee).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: B2B Contract Documents & Invoices */}
        {activeTab === 'documents' && (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-3 text-xs">
            <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
              Legally Binding Deal Contracts & Digital Invoices
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { title: 'B2B Surplus Purchase Agreement', id: `AGR-2026-${offer.id}`, size: '184 KB PDF', status: 'Signed via Digital DSC' },
                { title: 'GST Proforma Tax Invoice', id: `INV-GST-${offer.id}`, size: '142 KB PDF', status: 'Generated' },
                { title: 'Quality & Material Spec Certificate', id: `SPEC-QC-${offer.id}`, size: '210 KB PDF', status: 'Verified' },
                { title: 'Escrow Payment Protection Voucher', id: `ESC-VOUCH-${offer.id}`, size: '98 KB PDF', status: 'Secured' },
              ].map((doc) => (
                <div
                  key={doc.id}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 flex items-center justify-between bg-zinc-50/60 dark:bg-zinc-900/40"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-5 w-5 text-[#0D9488]" />
                    <div>
                      <span className="font-bold text-zinc-900 dark:text-zinc-100 block">{doc.title}</span>
                      <span className="text-[10px] text-zinc-400 font-mono">{doc.id} • {doc.size}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showFeedback(`Downloaded ${doc.title}`)}
                    className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    title="Download Document"
                  >
                    <Download className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: DeadStock Freight & Logistics */}
        {activeTab === 'logistics' && (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  Partnered Industrial Freight (Ahmedabad → Pune Corridor)
                </h4>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  DeadStock logistics network provides insured dedicated truck freight with GPS telemetry.
                </p>
              </div>
              <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[10px] font-bold text-blue-600 border border-blue-500/20">
                Logistics Add-On
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-zinc-400 text-[10px] font-bold uppercase block">Freight Carrier</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">Delhivery Industrial Cargo</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] font-bold uppercase block">Estimated Transit</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">36 Hours (Door-to-Door)</span>
              </div>
              <div>
                <span className="text-zinc-400 text-[10px] font-bold uppercase block">Freight Cost Quote</span>
                <span className="font-bold font-mono text-[#0D9488]">₹14,500 (All Inclusive)</span>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="text-[11px] text-zinc-500">Includes transit cargo insurance up to ₹5,00,000.</span>
              <button
                type="button"
                onClick={() => {
                  setLogisticsBooked(true)
                  showFeedback('DeadStock Freight assigned! Pickup scheduled for tomorrow 10:00 AM.')
                }}
                className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                {logisticsBooked ? 'Freight Booked ✓' : 'Book DeadStock Freight (₹14,500)'}
              </button>
            </div>
          </div>
        )}

        {/* SUBTAB 4: Third-Party Verification & Inspection */}
        {activeTab === 'inspection' && (
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-zinc-400">
                  On-Site Third-Party Quality & Count Verification
                </h4>
                <p className="text-zinc-500 text-[11px] mt-0.5">
                  Accredited industrial inspection partner verifies seal, piece count, packaging integrity, and batch certificate before freight dispatch.
                </p>
              </div>
              <span className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-600 border border-purple-500/20">
                Premium Service: ₹499
              </span>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 bg-zinc-50 dark:bg-zinc-900 space-y-2">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 className="h-4 w-4" />
                <span>Physical Warehouse Verification Checklist</span>
              </div>
              <ul className="text-[11px] text-zinc-600 dark:text-zinc-400 space-y-1 list-disc pl-4">
                <li>100% Barcode / Serial batch scanning and count reconciliation.</li>
                <li>Visual defect inspection (No oxidation, warping, or moisture damage).</li>
                <li>Original manufacturer factory packaging verification.</li>
                <li>Timestamped high-resolution photos uploaded to Deal Room.</li>
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="text-[11px] text-zinc-500">Inspection completed in 12–24 hours.</span>
              <button
                type="button"
                onClick={() => {
                  setInspectionRequested(true)
                  showFeedback('Inspection Engineer assigned to Ahmedabad Central Depot!')
                }}
                className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                {inspectionRequested ? 'Inspection Certified (Grade-A) ✓' : 'Request On-Site Inspection (₹499)'}
              </button>
            </div>
          </div>
        )}

        {/* Live Deal Progress Simulator Controls */}
        <div className="space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
              Interactive Deal Room Lifecycle Actions:
            </span>
            <span className="text-[10px] text-zinc-400 font-mono">Current: {currentStage.toUpperCase()}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleAdvanceStage('escrow_funded')}
              className="rounded-full bg-purple-600 hover:bg-purple-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
            >
              1. Buyer Funds Escrow (₹{(totalDealAmount + buyerFee).toLocaleString()})
            </button>
            <button
              type="button"
              onClick={() => handleAdvanceStage('inspected')}
              className="rounded-full bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
            >
              2. Complete QC Inspection
            </button>
            <button
              type="button"
              onClick={() => handleAdvanceStage('dispatched')}
              className="rounded-full bg-blue-600 hover:bg-blue-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
            >
              3. Dispatch Freight Lot
            </button>
            <button
              type="button"
              onClick={() => handleAdvanceStage('delivered')}
              className="rounded-full bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
            >
              4. Confirm Depot Delivery
            </button>
            <button
              type="button"
              onClick={() => handleAdvanceStage('completed')}
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 px-3.5 py-1.5 text-xs font-bold text-white transition-colors"
            >
              5. Release Escrow Payout (₹{netSellerPayout.toLocaleString()})
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <div className="flex items-center gap-2 text-[11px] text-zinc-500">
            <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
            <span>Bank-grade Escrow & Immutable Movement Ledger Record</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-zinc-900 dark:bg-zinc-100 px-6 py-2 text-xs font-bold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
          >
            Close Deal Room
          </button>
        </div>
      </div>
    </div>
  )
}

function dateStamp(): string {
  const d = new Date()
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`
}

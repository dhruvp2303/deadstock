import React from 'react'
import Link from 'next/link'
import { ArrowLeft, RefreshCcw, CheckCircle2, ShieldAlert } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export const metadata = {
  title: 'Refund & Settlement Policy — DeadStock',
  description: 'Understand escrow funding, listing commitment fee rebates, cancellation guidelines, and freight dispute resolution on DeadStock.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A0A0A]">
      {/* Top Header Bar */}
      <header className="bg-[#072433] text-white py-5 px-6 sm:px-10 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group text-sm font-semibold">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </Link>
          <Logo size="md" variant="dark" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-14 sm:py-20 space-y-12">
        {/* Title */}
        <div className="space-y-3 pb-8 border-b border-gray-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
            <RefreshCcw className="h-3.5 w-3.5" />
            <span>Commercial Payout & Cancellation Rules</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B1E2D] tracking-tight">
            Refund & Dispute Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: October 1, 2026 · Governing B2B Marketplace Transactions
          </p>
        </div>

        {/* Section 1: Listing Commitment Fee Policy */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">1. Listing Commitment Fee Policy</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            To prevent spam, ghost inventory, and unverified broker claims, sellers deposit a small listing commitment fee (₹99–₹499) upon publishing surplus stock to the public marketplace.
          </p>
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block">100% Deal Credit Rebate</span>
            <p className="text-xs text-gray-600">
              When a seller successfully closes and completes a transaction through the DeadStock Deal Room, <strong>100% of the original listing commitment fee is credited against their final transaction fee</strong>.
            </p>
          </div>
          <p className="text-xs text-gray-500">
            *If a seller voluntarily deletes or withdraws an active listing without concluding a transaction, the anti-spam commitment fee is non-refundable.
          </p>
        </section>

        {/* Section 2: Escrow Protection & Buyer Inspection */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">2. Escrow Protection & 72-Hour Inspection Window</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Buyer funds deposited into DeadStock Escrow remain protected until freight arrives at the destination warehouse. Buyers have a standard <strong>72-hour window</strong> upon signed bill of lading to inspect the delivered lot against the digital manifest.
          </p>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full refund if goods differ materially in specifications, grade, or quantity from the Deal Room contract.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Automatic escrow payout to seller once inspection passes or the 72-hour verification window elapses without dispute.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Dispute Mediation */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">3. Dispute Resolution & Arbitration</h2>
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-bold text-sm">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>Independent Inspection Dispatch</span>
            </div>
            <p>
              In the event of a quality dispute, DeadStock dispatches an accredited 3rd-party surveyor to inspect the physical lot. Surveyor findings serve as binding evidentiary basis for fund release or reverse-logistics dispatch.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Scale, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Terms & Conditions — DeadStock',
  description: 'Review the Terms of Service and Merchant Agreement governing the use of DeadStock recovery marketplace.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0A0A0A]">
      {/* Top Header Bar */}
      <header className="bg-[#072433] text-white py-6 px-6 sm:px-10 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors group">
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-semibold">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-3.5 w-3.5 rotate-45 bg-white" />
            <span className="font-extrabold text-base tracking-tight text-white">DeadStock</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-14 sm:py-20 space-y-12">
        {/* Title */}
        <div className="space-y-3 pb-8 border-b border-gray-200">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold">
            <Scale className="h-3.5 w-3.5" />
            <span>Master Merchant Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B1E2D] tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: October 1, 2026 · Standard Commercial Agreement
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">1. Acceptance of Terms</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            By accessing or using the DeadStock platform, API integrations, or recovery networks, you agree to be bound by these Terms of Service. If you represent an entity or corporation, you warrant that you possess the authority to bind such entity.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">2. Marketplace Listings & Warranties</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            Sellers represent and warrant that all listed inventory is free and clear of liens, unencumbered, authentic, and safely stored in compliance with local industrial safety regulations.
          </p>
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-[#0B1E2D] uppercase tracking-wider block">Authenticity & Quality</span>
            <p className="text-xs text-gray-600">Buyers have 72 hours upon verified freight delivery to inspect lot items against the manifest before escrow funds are released.</p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">3. Escrow, Fees & Payouts</h2>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Escrow accounts are maintained through RBI/Compliant financial partners.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Platform service fees are calculated transparently per chosen tier.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>Settlement transfers are disbursed within 48 hours of inspection sign-off.</span>
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">4. Limitation of Liability</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            To the maximum extent permitted by applicable law, DeadStock shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of logistics transit delays or third-party carrier failures.
          </p>
        </section>

        {/* Contact Footer */}
        <section className="p-6 rounded-3xl bg-[#072433] text-white space-y-3">
          <h3 className="text-lg font-bold">Legal Inquiries & Dispute Resolution</h3>
          <p className="text-xs sm:text-sm text-gray-300">
            Send legal notices to <span className="text-teal-300 font-mono">legal@deadstock.io</span>. Disputes are subject to the exclusive jurisdiction of the commercial courts in Mumbai, India.
          </p>
        </section>
      </main>
    </div>
  )
}

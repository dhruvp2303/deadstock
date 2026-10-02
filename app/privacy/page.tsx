import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy — DeadStock',
  description: 'Learn how DeadStock collects, uses, protects, and handles your enterprise data and personal information.',
}

export default function PrivacyPolicyPage() {
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
            <Shield className="h-3.5 w-3.5" />
            <span>Legal & Privacy Compliance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0B1E2D] tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-500">
            Last Updated: October 1, 2026 · Effective Date: January 1, 2026
          </p>
        </div>

        {/* Section 1: Overview */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">1. Introduction & Scope</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            DeadStock Technologies (&ldquo;DeadStock,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) provides an enterprise B2B surplus inventory management, valuation, and matchmaking platform. This Privacy Policy explains our practices regarding the collection, use, disclosure, and protection of company inventory data and personal identifiers.
          </p>
        </section>

        {/* Section 2: Data Collected */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">2. Information We Collect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Account & Contact</span>
              <p className="text-xs text-gray-600">Company name, authorized representative name, business email address, billing information, and tax identification numbers (GSTIN, VAT).</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block">Inventory & Telemetry</span>
              <p className="text-xs text-gray-600">SKU catalogues, unit volumes, warehousing depots, valuation costs, sales velocity metrics, and AI risk scoring signals.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Data Usage */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">3. How We Use Your Data</h2>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Matching surplus inventory with verified buyers across industrial sectors.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Generating predictive risk scores and automated dynamic pricing recommendations.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Facilitating secure escrow settlement, freight dispatch, and invoice reconciliation.</span>
            </li>
          </ul>
        </section>

        {/* Section 4: Security */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">4. Enterprise Security & Encryption</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            All data in transit is protected using TLS 1.3 encryption, and data at rest is encrypted with AES-256 standards. Multi-tenant database isolation ensures your sensitive proprietary cost benchmarks remain private.
          </p>
        </section>

        {/* Section 5: Cookies & Analytics */}
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1E2D]">5. Cookies & Tracking Technologies</h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            We use essential session tokens and privacy-preserving analytics cookies to enhance operational stability. You can adjust your consent preferences at any time via our Cookie Consent banner.
          </p>
        </section>

        {/* Section 6: Contact */}
        <section className="p-6 rounded-3xl bg-[#072433] text-white space-y-3">
          <h3 className="text-lg font-bold">Have Questions or Data Rights Requests?</h3>
          <p className="text-xs sm:text-sm text-gray-300">
            Contact our Data Protection Officer at <span className="text-teal-300 font-mono">privacy@deadstock.io</span> or DeadStock Legal Dept, BKC Financial Center, Mumbai, Maharashtra 400051.
          </p>
        </section>
      </main>
    </div>
  )
}

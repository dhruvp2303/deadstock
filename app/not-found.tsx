import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Home, PackageX, RefreshCw } from 'lucide-react'

export const metadata = {
  title: '404 — Page Not Found | DeadStock',
  description: 'The inventory lot or page you are looking for has been relocated or recovered.',
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#072433] text-white flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Background glow & watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.03] font-black text-[25vw] leading-none select-none pointer-events-none">
        404
      </div>

      {/* Top Bar */}
      <header className="flex items-center justify-between max-w-5xl mx-auto w-full relative z-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="h-4 w-4 rotate-45 bg-white group-hover:bg-teal-300 transition-colors" />
          <span className="font-extrabold text-xl tracking-tight text-white">DeadStock</span>
        </Link>
        <span className="px-3.5 py-1 rounded-full text-xs font-semibold bg-white/10 text-teal-300 border border-white/15">
          ERROR 404
        </span>
      </header>

      {/* Center Content */}
      <main className="max-w-md mx-auto text-center space-y-6 my-auto relative z-10">
        <div className="h-20 w-20 rounded-3xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto shadow-2xl backdrop-blur-xl">
          <PackageX className="h-10 w-10 text-rose-400" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Inventory Lot Not Found
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The page, SKU listing, or recovery route you requested does not exist or has already been moved to another warehouse.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
          >
            <Home className="h-4 w-4" />
            <span>Return to Workspace</span>
          </Link>
          <Link
            href="/#marketplace"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Browse Marketplace</span>
          </Link>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="text-center text-xs text-slate-500 max-w-5xl mx-auto w-full relative z-10 pt-6 border-t border-white/10">
        © 2026 DeadStock Global Surplus Inventory Marketplace · Escrow & Recovery Operations
      </footer>
    </div>
  )
}

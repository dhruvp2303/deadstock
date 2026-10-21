'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Cookie, Shield, X, Check } from 'lucide-react'

export const CookieConsent: React.FC = () => {
  const [mounted, setMounted] = useState(false)
  const [consent, setConsent] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('deadstock_cookie_consent')
    if (saved) setConsent(saved)
  }, [])

  const handleAccept = (type: 'all' | 'essential') => {
    localStorage.setItem('deadstock_cookie_consent', type)
    setConsent(type)
  }

  if (!mounted || consent) return null

  return (
    <div
      className="fixed bottom-4 sm:bottom-6 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 rounded-3xl p-5 sm:p-6 bg-[#072433]/95 text-white backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-6"
      style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.35)' }}
    >
      <div className="flex items-start gap-3.5">
        <div className="h-10 w-10 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/15">
          <Cookie className="h-5 w-5 text-amber-300" />
        </div>
        <div className="space-y-2 flex-1">
          <h4 className="text-sm font-bold text-white tracking-tight">Cookie & Privacy Preferences</h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            We use essential cookies to maintain platform security and optional analytics cookies to optimize inventory matching algorithms. Read our{' '}
            <Link href="/privacy" className="text-teal-300 hover:underline font-semibold">
              Privacy Policy
            </Link>.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handleAccept('all')}
              className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all hover:scale-105"
            >
              Accept All
            </button>
            <button
              type="button"
              onClick={() => handleAccept('essential')}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-all"
            >
              Essential Only
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => handleAccept('essential')}
          className="text-slate-400 hover:text-white p-1"
          aria-label="Dismiss cookie banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}

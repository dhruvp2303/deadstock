'use client'

import React, { useState, useEffect } from 'react'
import { Menu, X, ArrowUpRight, ShieldCheck, Activity, Users, ShoppingBag, RotateCcw, BarChart3, Tag } from 'lucide-react'

interface NavProps {
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
}

const WORKFLOW_NAV_LINKS = [
  { label: 'Risk Detection', href: '#risk-detection', icon: Activity },
  { label: 'Buyer Matching', href: '#buyer-matching', icon: Users },
  { label: 'Marketplace', href: '#marketplace', icon: ShoppingBag },
  { label: 'Recovery Center', href: '#recovery-center', icon: RotateCcw },
  { label: 'Analytics', href: '#analytics', icon: BarChart3 },
  { label: 'Pricing', href: '#pricing', icon: Tag },
]

export const DSNavbar: React.FC<NavProps> = ({ onGetStarted, onLogin, onBrowseMarketplace }) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [active, setActive] = useState('Risk Detection')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#072433]/90 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3'
            : 'bg-gradient-to-b from-[#072433]/80 via-[#072433]/40 to-transparent py-4 sm:py-5 backdrop-blur-xs'
        }`}
      >
        <div className="max-w-[1380px] mx-auto px-4 sm:px-8 flex items-center justify-between gap-4">

          {/* Logo with Diamond & Industrial Tag */}
          <button
            type="button"
            onClick={onGetStarted}
            className="flex items-center gap-3 shrink-0 group text-left"
          >
            <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-gradient-to-br from-teal-400 to-blue-600 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <div className="h-3.5 w-3.5 rotate-45 bg-white shadow-xs" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white flex items-center gap-1.5">
                DeadStock
                <span className="text-[10px] font-mono font-bold tracking-widest text-amber-400 bg-amber-400/10 border border-amber-400/30 px-1.5 py-0.5 rounded">
                  B2B
                </span>
              </span>
              <span className="block text-[9px] font-mono text-teal-200/70 tracking-wider uppercase">
                Inventory Recovery Network
              </span>
            </div>
          </button>

          {/* Desktop Workflow Nav Links — Explicit Product Workflows */}
          <nav className="hidden xl:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/12 px-3 py-1.5 rounded-full shadow-inner">
            {WORKFLOW_NAV_LINKS.map((l) => {
              const Icon = l.icon
              const isActive = active === l.label
              return (
                <a
                  key={l.label}
                  href={l.href}
                  onClick={() => {
                    setActive(l.label)
                    if (l.label === 'Marketplace') onBrowseMarketplace()
                  }}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 rounded-full ${
                    isActive
                      ? 'bg-white text-[#072433] shadow-md font-bold'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#072433]' : 'text-teal-300'}`} />
                  <span>{l.label}</span>
                </a>
              )
            })}
          </nav>

          {/* Medium Screen Nav Links (Condensed) */}
          <nav className="hidden md:flex xl:hidden items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/12 px-2.5 py-1.5 rounded-full">
            {WORKFLOW_NAV_LINKS.slice(0, 4).map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => {
                  setActive(l.label)
                  if (l.label === 'Marketplace') onBrowseMarketplace()
                }}
                className={`px-3 py-1.5 text-xs font-semibold transition-all rounded-full ${
                  active === l.label
                    ? 'bg-white text-[#072433] font-bold'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Right Glass Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onLogin}
              className="px-4 py-2 text-xs font-bold text-white/90 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={onGetStarted}
              className="btn-glass-primary text-xs py-2 px-5 font-bold shadow-lg flex items-center gap-2"
            >
              <span>Recover Inventory</span>
              <ArrowUpRight className="h-3.5 w-3.5 text-teal-200" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-white bg-white/10 backdrop-blur-md"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#072433]/98 backdrop-blur-2xl flex flex-col pt-24 px-6 pb-10 gap-3 overflow-y-auto">
          <div className="text-[11px] font-mono text-teal-300 font-bold uppercase tracking-wider mb-2">
            Workflows & Platform Navigation
          </div>
          {WORKFLOW_NAV_LINKS.map((l) => {
            const Icon = l.icon
            return (
              <a
                key={l.label}
                href={l.href}
                onClick={() => {
                  setActive(l.label)
                  setMobileOpen(false)
                  if (l.label === 'Marketplace') onBrowseMarketplace()
                }}
                className="flex items-center gap-3 text-lg font-bold text-white py-3 border-b border-white/10 hover:text-teal-300 transition-colors"
              >
                <Icon className="h-5 w-5 text-teal-400" />
                <span>{l.label}</span>
              </a>
            )
          })}
          <div className="flex flex-col gap-3 mt-6">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onLogin()
              }}
              className="w-full py-3.5 rounded-full bg-white/10 border border-white/20 text-white font-bold text-sm"
            >
              Log in to Workspace
            </button>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                onGetStarted()
              }}
              className="btn-glass-primary w-full py-3.5 text-sm"
            >
              Get Started Free →
            </button>
          </div>
        </div>
      )}
    </>
  )
}


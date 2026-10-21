'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

interface LandingNavbarProps {
  currentUser?: any
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
  onExploreDemo?: () => void
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  currentUser,
  onGetStarted,
  onLogin,
  onBrowseMarketplace,
  onExploreDemo,
}) => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Features', href: '#features' },
    { label: 'Simulator', href: '#simulator' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ]

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl shadow-xs py-3'
          : 'bg-transparent py-4 sm:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
        {/* Brand Logo Lockup */}
        <div className="flex items-center gap-3 shrink-0">
          <a href="#" className="flex items-center gap-2 group shrink-0">
            <Logo size="md" withTagline={false} />
          </a>
          <span className="hidden 2xl:inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#0D9488] dark:text-[#14B8A6] whitespace-nowrap shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            v2.4 Live System
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 2xl:gap-7 text-xs font-semibold text-zinc-600 dark:text-zinc-300 shrink-0">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-[#0D9488] dark:hover:text-[#14B8A6] transition-colors py-1 whitespace-nowrap shrink-0"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onBrowseMarketplace}
            className="flex items-center gap-1.5 text-[#0D9488] dark:text-[#14B8A6] hover:underline font-bold whitespace-nowrap shrink-0"
          >
            <span>Surplus Market</span>
            <span className="rounded-md bg-teal-500/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider font-mono whitespace-nowrap shrink-0">
              B2B
            </span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-2.5 shrink-0">
          {currentUser ? (
            <button
              type="button"
              onClick={onGetStarted}
              className="group relative inline-flex items-center gap-2 whitespace-nowrap shrink-0 rounded-full bg-[#0D9488] px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-[#0F9D8D] hover:shadow-teal-600/30 transition-all active:scale-[0.98]"
            >
              <span>Go to Workspace ({currentUser.company?.name || currentUser.name})</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          ) : (
            <>
              {onExploreDemo && (
                <button
                  type="button"
                  onClick={onExploreDemo}
                  className="whitespace-nowrap shrink-0 inline-flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-2 text-xs font-bold text-[#0D9488] dark:text-[#14B8A6] hover:bg-teal-500/20 transition-all shadow-2xs"
                >
                  <Sparkles className="h-3.5 w-3.5 text-[#0D9488] dark:text-[#14B8A6]" />
                  <span>Explore Demo</span>
                </button>
              )}
              <button
                type="button"
                onClick={onLogin}
                className="whitespace-nowrap shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
              >
                Log In
              </button>
              <button
                type="button"
                onClick={onGetStarted}
                className="group relative inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 rounded-full bg-[#0D9488] px-4.5 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-[#0F9D8D] hover:shadow-teal-600/30 transition-all active:scale-[0.98]"
              >
                <span>Start Free</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5 text-zinc-800 dark:text-zinc-200" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="xl:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl px-6 py-5 shadow-xl"
          >
            <div className="flex flex-col space-y-3 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="py-1.5 hover:text-[#0D9488] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false)
                  onBrowseMarketplace()
                }}
                className="py-1.5 text-left text-[#0D9488] font-bold"
              >
                Browse Surplus Marketplace →
              </button>

              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-2">
                {onExploreDemo && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onExploreDemo()
                    }}
                    className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 py-2.5 text-xs font-bold text-[#0D9488] dark:text-[#14B8A6]"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Explore Platform Demo</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onLogin()
                  }}
                  className="w-full rounded-full border border-zinc-200 dark:border-zinc-800 py-2.5 text-xs font-bold text-zinc-800 dark:text-zinc-200"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false)
                    onGetStarted()
                  }}
                  className="w-full rounded-full bg-[#0D9488] py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20"
                >
                  Start Recovering Value Free
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

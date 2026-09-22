'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

interface LandingNavbarProps {
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
}

export const LandingNavbar: React.FC<LandingNavbarProps> = ({
  onGetStarted,
  onLogin,
  onBrowseMarketplace,
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
    { label: 'Live System', href: '#live-system' },
    { label: 'Features', href: '#features' },
    { label: 'Interactive Demo', href: '#demo' },
    { label: 'Industries', href: '#industries' },
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
          ? 'border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xl shadow-xs py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo Lockup */}
        <div className="flex items-center gap-4">
          <a href="#" className="flex items-center gap-2 group">
            <Logo size="md" withTagline={false} />
          </a>
          <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#0D9488] dark:text-[#14B8A6]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0D9488] animate-pulse" />
            v2.4 Live System
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-xs font-semibold text-zinc-600 dark:text-zinc-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="hover:text-[#0D9488] dark:hover:text-[#14B8A6] transition-colors relative py-1"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onBrowseMarketplace}
            className="flex items-center gap-1 text-[#0D9488] dark:text-[#14B8A6] hover:underline font-bold"
          >
            <span>Surplus Market</span>
            <span className="rounded bg-teal-500/15 px-1 py-0.2 text-[9px] uppercase tracking-wider font-mono">B2B</span>
          </button>
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            type="button"
            onClick={onLogin}
            className="rounded-full px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
          >
            Log In
          </button>
          <button
            type="button"
            onClick={onGetStarted}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[#0D9488] px-5 py-2 text-xs font-bold text-white shadow-md shadow-teal-600/20 hover:bg-[#0F9D8D] hover:shadow-teal-600/30 transition-all active:scale-[0.98]"
          >
            <span>Start Recovering Value</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="xl:hidden p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900"
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

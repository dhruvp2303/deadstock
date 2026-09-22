'use client'

import React from 'react'
import { Logo } from '@/components/brand/Logo'

export const LandingFooter: React.FC<{
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
}> = ({ onGetStarted, onLogin, onBrowseMarketplace }) => {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 pt-16 pb-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <Logo size="md" withTagline={true} />
            <p className="text-xs text-zinc-500 max-w-sm leading-relaxed">
              DeadStock is India's leading AI-powered B2B inventory recovery and surplus matching platform. Turn slow-moving assets into liquid capital.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-mono text-zinc-500">All Systems Operational • 99.9% Uptime</span>
            </div>
          </div>

          {/* Product Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Product</h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <a href="#how-it-works" className="hover:text-[#0D9488] transition-colors">
                  Risk Engine
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[#0D9488] transition-colors">
                  Buyer Matching
                </a>
              </li>
              <li>
                <button type="button" onClick={onBrowseMarketplace} className="hover:text-[#0D9488] transition-colors">
                  Surplus Marketplace
                </button>
              </li>
              <li>
                <a href="#features" className="hover:text-[#0D9488] transition-colors">
                  Recovery Center
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-[#0D9488] transition-colors">
                  Interactive Simulator
                </a>
              </li>
            </ul>
          </div>

          {/* Solutions Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Solutions</h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <a href="#industries" className="hover:text-[#0D9488] transition-colors">
                  Discrete Manufacturing
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-[#0D9488] transition-colors">
                  Electronics & PCB
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-[#0D9488] transition-colors">
                  Automotive Supply
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-[#0D9488] transition-colors">
                  Industrial Wholesalers
                </a>
              </li>
              <li>
                <a href="#industries" className="hover:text-[#0D9488] transition-colors">
                  Packaging Overruns
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Company */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">Company & Trust</h4>
            <ul className="space-y-2 text-xs text-zinc-500">
              <li>
                <a href="#pricing" className="hover:text-[#0D9488] transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#0D9488] transition-colors">
                  Platform FAQ
                </a>
              </li>
              <li>
                <span className="text-zinc-400">Security & Isolation</span>
              </li>
              <li>
                <span className="text-zinc-400">Privacy Policy</span>
              </li>
              <li>
                <span className="text-zinc-400">Terms of Service</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-100 dark:border-zinc-850 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <span>© 2026 DeadStock Platform Technologies Pvt Ltd. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <button type="button" onClick={onLogin} className="hover:text-[#0D9488] transition-colors">
              Sign In to Account
            </button>
            <span>•</span>
            <button type="button" onClick={onGetStarted} className="hover:text-[#0D9488] transition-colors font-bold">
              Register Company
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

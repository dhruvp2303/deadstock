'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'

interface FooterProps {
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
}

const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: ['Risk engine', 'Buyer matching', 'Smart pricing', 'Marketplace'],
  },
  {
    title: 'Company',
    links: ['About us', 'Contact', 'Careers', 'Get a quote'],
  },
  {
    title: 'Quick links',
    links: ['Help center', 'Sustainability', 'Press', 'Privacy'],
  },
]

export const DSFooter: React.FC<FooterProps> = ({ onGetStarted, onBrowseMarketplace }) => (
  <footer className="bg-[#05111D] text-white pt-20 pb-12 px-6 border-t border-white/10 relative overflow-hidden">
    <div className="max-w-[1360px] mx-auto space-y-16 relative z-10">

      {/* Top Grid: Brand Description Left + 3 Link Columns Right (Reference 5) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

        {/* Brand Left Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-4 w-4 rotate-45 bg-white" />
            <span className="font-extrabold text-2xl tracking-tight text-white">DeadStock</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-400 max-w-sm leading-relaxed font-normal">
            Your recovery partner. Find risky stock early and match it with businesses that need it.
          </p>
        </div>

        {/* 3 Link Columns Right (Reference 5) */}
        <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
          {FOOTER_SECTIONS.map((sec) => (
            <div key={sec.title} className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
                {sec.title}
              </span>
              <ul className="space-y-2.5">
                {sec.links.map((link) => (
                  <li key={link}>
                    <button
                      type="button"
                      onClick={onGetStarted}
                      className="text-xs text-gray-400 hover:text-white transition-colors duration-200"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>

      {/* Decorative Blue Container Graphic in Footer (Reference 5) */}
      <div className="relative pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="text-[11px] text-gray-500 font-medium">
          © 2026 DeadStock Network. All rights reserved. Precision inventory recovery across India & Global Hubs.
        </p>

        <div className="flex items-center gap-4 text-[11px] text-gray-400">
          <button type="button" onClick={onGetStarted} className="hover:text-white transition-colors">
            Terms of Service
          </button>
          <span>·</span>
          <button type="button" onClick={onGetStarted} className="hover:text-white transition-colors">
            Privacy Policy
          </button>
          <span>·</span>
          <button type="button" onClick={onGetStarted} className="hover:text-white transition-colors">
            Security Certifications
          </button>
        </div>
      </div>

    </div>
  </footer>
)


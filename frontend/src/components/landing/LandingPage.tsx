'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react'
import { LandingNavbar } from '@/components/landing/LandingNavbar'
import { HeroLiveSystem } from '@/components/landing/HeroLiveSystem'
import { TrustSection } from '@/components/landing/TrustSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { LifecycleWorkflow } from '@/components/landing/LifecycleWorkflow'
import { FeatureShowcase } from '@/components/landing/FeatureShowcase'
import { InteractiveProductDemo } from '@/components/landing/InteractiveProductDemo'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { AISection } from '@/components/landing/AISection'
import { SustainabilitySection } from '@/components/landing/SustainabilitySection'
import { IndustriesSection } from '@/components/landing/IndustriesSection'
import { PricingSection } from '@/components/landing/PricingSection'
import { FAQSection } from '@/components/landing/FAQSection'
import { FinalCTA } from '@/components/landing/FinalCTA'
import { LandingFooter } from '@/components/landing/LandingFooter'

interface LandingPageProps {
  currentUser?: any
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
  onExploreDemo?: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onGetStarted,
  onLogin,
  onBrowseMarketplace,
  onExploreDemo,
}) => {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased font-sans selection:bg-[#14B8A6]/20 overflow-x-hidden">
      {/* 1. Sticky Navigation Header */}
      <LandingNavbar
        currentUser={currentUser}
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onBrowseMarketplace={onBrowseMarketplace}
        onExploreDemo={onExploreDemo}
      />

      {/* 2. Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto text-center overflow-hidden">
        {/* Subtle Ambient Gradient Blobs */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-teal-500/10 rounded-full blur-[130px] pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/20 bg-teal-500/10 px-3.5 py-1 text-xs font-semibold text-[#0D9488] dark:text-[#14B8A6] animate-in fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Turn dead stock into business value</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.12]">
            Your dead inventory could be{' '}
            <span className="bg-gradient-to-r from-[#0D9488] via-[#0F9D8D] to-[#14B8A6] bg-clip-text text-transparent">
              someone else's opportunity.
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            DeadStock predicts inventory risk, finds potential buyers, and helps businesses recover value from excess stock before it becomes a loss.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={onGetStarted}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-teal-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span>Start Recovering Value</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {onExploreDemo && (
              <button
                type="button"
                onClick={onExploreDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-7 py-3.5 text-sm font-bold text-[#0D9488] dark:text-[#14B8A6] hover:bg-teal-500/20 transition-all shadow-xs"
              >
                <Sparkles className="h-4 w-4" />
                <span>Explore Platform Demo</span>
              </button>
            )}

            <a
              href="#how-it-works"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-7 py-3.5 text-sm font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-850 transition-all shadow-xs"
            >
              <span>See How It Works</span>
            </a>
          </div>
        </div>

        {/* Live Interactive Hero Intelligence System */}
        <div id="live-system" className="mt-16 max-w-5xl mx-auto relative z-10">
          <HeroLiveSystem onGetStarted={onGetStarted} />
        </div>
      </section>

      {/* 3. Industry Trust & Illustrative Metrics Strip */}
      <TrustSection />

      {/* 4. Problem Breakdown */}
      <ProblemSection />

      {/* 5. 7-Step Lifecycle Pipeline */}
      <LifecycleWorkflow onGetStarted={onGetStarted} />

      {/* 6. Core Technology Feature Stations */}
      <FeatureShowcase onGetStarted={onGetStarted} />

      {/* 7. Interactive Hands-On Product Demo */}
      <InteractiveProductDemo onGetStarted={onGetStarted} />

      {/* 8. 3D Perspective Workspace Showcase */}
      <DashboardPreview onGetStarted={onGetStarted} />

      {/* 9. Conversational AI Assistant */}
      <AISection onGetStarted={onGetStarted} />

      {/* 10. Circular Sustainability Impact */}
      <SustainabilitySection onGetStarted={onGetStarted} />

      {/* 11. Industry Verticals */}
      <IndustriesSection onGetStarted={onGetStarted} />

      {/* 12. Predictable SaaS Pricing */}
      <PricingSection onGetStarted={onGetStarted} />

      {/* 13. Platform FAQ */}
      <FAQSection />

      {/* 14. Final High-Impact CTA */}
      <FinalCTA
        onGetStarted={onGetStarted}
        onBrowseMarketplace={onBrowseMarketplace}
      />

      {/* 15. Comprehensive SaaS Footer */}
      <LandingFooter
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onBrowseMarketplace={onBrowseMarketplace}
      />
    </div>
  )
}

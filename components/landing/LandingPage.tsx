'use client'

import React from 'react'
import { DSNavbar } from '@/components/landing/DSNavbar'
import { DSHero } from '@/components/landing/DSHero'
import { DSTrustedLogos } from '@/components/landing/DSTrustedLogos'
import { DSLiveCargoCalculation } from '@/components/landing/DSLiveCargoCalculation'
import { DSWarehouseCraneTerminal } from '@/components/landing/DSWarehouseCraneTerminal'
import { DSHangingContainer } from '@/components/landing/DSHangingContainer'
import { DSGlobalRouteNetwork } from '@/components/landing/DSGlobalRouteNetwork'
import { DSFeaturesGrid } from '@/components/landing/DSFeaturesGrid'
import { DSMatchedBuyers } from '@/components/landing/DSMatchedBuyers'
import { DSMarketplace } from '@/components/landing/DSMarketplace'
import { DashboardPreview } from '@/components/landing/DashboardPreview'
import { DSTestimonials } from '@/components/landing/DSTestimonials'
import { DSPricing } from '@/components/landing/PricingSection'
import { DSAbout } from '@/components/landing/DSAbout'
import { DSCtaBanner } from '@/components/landing/DSCtaBanner'
import { DSFooter } from '@/components/landing/DSFooter'

interface LandingPageProps {
  onGetStarted: () => void
  onLogin: () => void
  onBrowseMarketplace: () => void
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onLogin,
  onBrowseMarketplace,
}) => {
  return (
    <div className="bg-white text-[#0A0A0A] antialiased overflow-x-hidden selection:bg-teal-500 selection:text-white">

      {/* 1. Nav — Diamond logo + Glass pill navigation */}
      <DSNavbar
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onBrowseMarketplace={onBrowseMarketplace}
      />

      {/* 2. Hero — Full-bleed oceanic ship + Gantry Crane lifting DEADSTOCK Container */}
      <DSHero
        onGetStarted={onGetStarted}
        onBrowseMarketplace={onBrowseMarketplace}
      />

      {/* 3. Trusted Logos — Industrial manufacturers and enterprise supply chains */}
      <DSTrustedLogos />

      {/* 4. Live Calculation ("Calculation Made Easy" - Image 1 Reference) */}
      <DSLiveCargoCalculation onGetStarted={onGetStarted} />

      {/* 5. Warehouse Depot & Mini Industry Cranes (Image 5 Reference: Logist) */}
      <DSWarehouseCraneTerminal onGetStarted={onGetStarted} />

      {/* 6. Risk Detection (#risk-detection) — Real-time surplus diagnostics & hanging container (Image 1 Reference) */}
      <DSHangingContainer onGetStarted={onGetStarted} />

      {/* 7. Beyond Borders To Faster — Global Maritime & Rail Trade Network (Image 4 Reference: BeyRoute) */}
      <DSGlobalRouteNetwork onGetStarted={onGetStarted} />

      {/* 8. Comprehensive Live Logistics & 5-Channel Recovery (Image 3 Reference: ShipNex) */}
      <DSFeaturesGrid onGetStarted={onGetStarted} />

      {/* 9. Buyer Matching (#buyer-matching) — Compatibility score breakdown & interactive bargaining */}
      <DSMatchedBuyers onGetStarted={onGetStarted} />

      {/* 10. Marketplace (#marketplace) — Verified listings, multi-currency switcher & escrow flow */}
      <div id="marketplace">
        <DSMarketplace onBrowseMarketplace={onBrowseMarketplace} />
      </div>

      {/* 11. Analytics & Risk Intelligence (#analytics) — KPIs & Transparent Root-Cause Panels */}
      <DashboardPreview onGetStarted={onGetStarted} />

      {/* 12. Verified Enterprise Feedback & Testimonials (Image 2 & 3 References) */}
      <DSTestimonials />

      {/* 13. Transparent Pricing (#pricing - Image 2 Reference) */}
      <div id="pricing">
        <DSPricing onGetStarted={onGetStarted} />
      </div>

      {/* 14. About Us — Industrial Network Mission */}
      <DSAbout onGetStarted={onGetStarted} />

      {/* 15. CTA Banner — "Ready To Ship With Confidence?" (Image 2 Reference) */}
      <DSCtaBanner onGetStarted={onGetStarted} />

      {/* 16. Logistics Industrial Footer */}
      <DSFooter
        onGetStarted={onGetStarted}
        onLogin={onLogin}
        onBrowseMarketplace={onBrowseMarketplace}
      />
    </div>
  )
}

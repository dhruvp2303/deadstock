# DeadStock — Rebuild Baseline & Rollback Protocol

## 1. Baseline System State
- **Baseline Git Commit:** `466fbf93eee89ad152dc11d14a1d9572e9f36999`
- **Rebuild Branch:** `rebuild/baseline-verified`
- **Timestamp:** 2026-10-02T13:36:00+05:30
- **Database Engine:** SQLite
- **Database File:** `backend/database/database.sqlite` (188,416 bytes)
- **Database Backup:** `backend/database/database.sqlite.backup.20261002-133600` (188,416 bytes, Verified)
- **Migrations Applied (All 16 Ran):**
  1. `0001_01_01_000000_create_users_table` (Batch 1)
  2. `0001_01_01_000001_create_cache_table` (Batch 1)
  3. `0001_01_01_000002_create_jobs_table` (Batch 1)
  4. `2026_09_14_000001_create_companies_table` (Batch 3)
  5. `2026_09_14_000002_add_company_id_to_users_table` (Batch 3)
  6. `2026_09_14_000003_create_inventories_table` (Batch 3)
  7. `2026_09_14_000004_create_inventory_movements_table` (Batch 3)
  8. `2026_09_14_000005_create_buyer_matches_table` (Batch 3)
  9. `2026_09_14_000006_create_marketplace_listings_table` (Batch 3)
  10. `2026_09_14_000007_create_recovery_actions_table` (Batch 3)
  11. `2026_09_14_000008_create_notifications_table` (Batch 3)
  12. `2026_09_14_000009_create_demo_requests_table` (Batch 3)
  13. `2026_09_14_000010_create_ai_interactions_table` (Batch 3)
  14. `2026_09_14_000011_create_transactions_table` (Batch 4)
  15. `2026_09_14_000012_create_offers_table` (Batch 4)
  16. `2026_09_14_160749_create_personal_access_tokens_table` (Batch 2)

---

## 2. Phase 2 Clean-Up Action Plan

### Files Verified for Removal (22 Legacy Landing Components)
All 22 files have been searched across the repository and verified to have 0 imports in `LandingPage.tsx` or application modules:
- `components/landing/HeroFreightAssembly.tsx`
- `components/landing/HeroLiveSystem.tsx`
- `components/landing/CrateMarketplace.tsx`
- `components/landing/FeatureShowcase.tsx`
- `components/landing/LifecycleWorkflow.tsx`
- `components/landing/PackAndShipStudio.tsx`
- `components/landing/ScrollLogisticsJourney.tsx`
- `components/landing/SellerFreightPreview.tsx`
- `components/landing/LandingFooter.tsx`
- `components/landing/LandingNavbar.tsx`
- `components/landing/TrustSection.tsx`
- `components/landing/ProblemSection.tsx`
- `components/landing/AISection.tsx`
- `components/landing/HowItWorksSection.tsx`
- `components/landing/IndustriesSection.tsx`
- `components/landing/FinalCTA.tsx`
- `components/landing/GlobalShippingMap.tsx`
- `components/landing/LogisticsFooter.tsx`
- `components/landing/InteractiveProductDemo.tsx`
- `components/landing/DSHowItWorks.tsx`
- `components/landing/DSGlobalReach.tsx`
- `components/landing/DSStatsServices.tsx`
- `adapters/CLAUDE.md`
- `adapters/GEMINI.md`
- `adapters/GPT_OSS.md`

### Active Landing Components (Preserved 1:1)
- `components/landing/LandingPage.tsx`
- `components/landing/DSNavbar.tsx`
- `components/landing/DSHero.tsx`
- `components/landing/DSTrustedLogos.tsx`
- `components/landing/DSLiveCargoCalculation.tsx`
- `components/landing/DSWarehouseCraneTerminal.tsx`
- `components/landing/DSHangingContainer.tsx`
- `components/landing/DSGlobalRouteNetwork.tsx`
- `components/landing/DSFeaturesGrid.tsx`
- `components/landing/DSMatchedBuyers.tsx`
- `components/landing/DSMarketplace.tsx`
- `components/landing/DashboardPreview.tsx`
- `components/landing/DSTestimonials.tsx`
- `components/landing/PricingSection.tsx`
- `components/landing/DSAbout.tsx`
- `components/landing/DSCtaBanner.tsx`
- `components/landing/DSFooter.tsx`

---

## 3. Rollback Instructions

If any regression occurs during the rebuild:

### 1. Revert Code State
```bash
git checkout main
git reset --hard 466fbf93eee89ad152dc11d14a1d9572e9f36999
```

### 2. Restore Database Snapshot
```powershell
Copy-Item -Path "backend/database/database.sqlite.backup.20261002-133600" -Destination "backend/database/database.sqlite" -Force
```

### 3. Rebuild Application & Verify
```bash
npm install
npm run build
cd backend && php artisan test
```

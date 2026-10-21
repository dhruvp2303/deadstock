# 📦 DeadStock — Global B2B Surplus Inventory Recovery Platform

DeadStock is an AI-powered B2B inventory recovery and surplus matching platform designed for discrete manufacturing, PCB & electronics, automotive components, polymer moldings, and industrial supplies.

---

## 🏗️ Project Architecture & Directory Layout

```
DeadStock/
├── 🌐 app/                          # Next.js 16 (App Router)
│   ├── layout.tsx                  # Root HTML shell & global SEO metadata
│   ├── page.tsx                    # Main platform screen router (Landing / App / Auth / Onboarding)
│   ├── globals.css                 # Clean Tailwind CSS & design tokens
│   ├── opengraph-image.tsx         # Dynamic OpenGraph social card generator
│   ├── not-found.tsx               # 404 error page
│   ├── privacy/                    # Privacy Policy page
│   ├── terms/                      # Terms of Service page
│   ├── robots.ts                   # Search engine crawl rules
│   └── sitemap.ts                  # Dynamic XML sitemap
│
├── 🎨 components/                   # Modular React UI Components
│   ├── ai/                         # Conversational AI Assistant drawer & queries
│   ├── analytics/                  # Working capital analytics & charts
│   ├── auth/                       # Sign In & Sign Up multi-tenant auth modal
│   ├── brand/                      # SVG Brand marks & typography logos
│   ├── command-palette/            # Keyboard shortcut quick actions (Cmd+K)
│   ├── inventory/                  # SKU data tables, detail modals & CSV importer
│   ├── landing/                    # High-converting landing page modules:
│   │   ├── LandingNavbar.tsx       # Top navigation with live system badge
│   │   ├── HeroLiveSystem.tsx      # Hero banner + interactive 4-stage live system
│   │   ├── TrustSection.tsx        # Supply chain proof points & trust metrics
│   │   ├── IndustriesSection.tsx   # 6 industrial sectors & benchmark metrics
│   │   ├── ProblemSection.tsx      # The Hidden Cost of Stagnation
│   │   ├── LifecycleWorkflow.tsx   # 7-step operating lifecycle pipeline
│   │   ├── FeatureShowcase.tsx     # Core technology stations & tabs
│   │   ├── InteractiveProductDemo.tsx # Real-time recovery valuation calculator
│   │   ├── DashboardPreview.tsx    # 3D workspace preview
│   │   ├── AISection.tsx           # Conversational AI assistant spotlight
│   │   ├── SustainabilitySection.tsx # Circular economy & Scope-3 ESG metrics
│   │   ├── PricingSection.tsx      # Transparent SaaS pricing tiers
│   │   ├── FAQSection.tsx          # Interactive FAQ accordion
│   │   ├── FinalCTA.tsx            # Value recovery conversion banner
│   │   ├── LandingFooter.tsx       # Platform footer & compliance badges
│   │   └── LandingPage.tsx         # Landing layout orchestrator
│   ├── ledger/                     # Inventory movement audit trails
│   ├── marketplace/                # Live B2B Surplus Catalog & quoting
│   ├── matches/                    # AI Buyer matching & compatibility scores
│   ├── navigation/                 # App workspace header & sidebar
│   ├── offers/                     # Deal negotiation & counter-offer manager
│   ├── onboarding/                 # New organization setup wizard
│   ├── recovery/                   # 5-channel recovery strategy drawer
│   ├── reports/                    # PDF/Excel export report generator
│   ├── settings/                   # Organization & warehouse profile settings
│   └── ui/                         # Clean primitives (buttons, cookie consent)
│
├── 🪝 hooks/                        # Custom React State & Data Hooks
│   ├── useWorkspace.ts             # Active workspace screen, role & tab state
│   ├── useInventory.ts             # CRUD operations & risk analysis data
│   ├── useBuyerMatches.ts          # Buyer compatibility matching streams
│   ├── useMarketplace.ts           # Public surplus marketplace catalog
│   ├── useOffers.ts                # Real-time counter-offers & deals
│   ├── useNotifications.ts         # User alerts & system notifications
│   └── useMasterData.ts            # Categories & multi-depot warehouse data
│
├── 📚 lib/                          # Core Business Logic & Shared Utilities
│   ├── api.ts                      # Universal HTTP client (Laravel REST API + fallback mock state)
│   ├── analytics.ts                # Recovery calculations & sustainability metrics
│   └── utils.ts                    # ClassName merge helpers (clsx + tailwind-merge)
│
├── ⚙️ backend/                      # Laravel 11 PHP REST API
│   ├── app/
│   │   ├── Http/Controllers/Api/v1/ # Inventory, Match, Auth, Recovery, Offer & Analytics endpoints
│   │   ├── Http/Requests/           # Form request validation rules
│   │   └── Models/                  # Eloquent models (Company, Inventory, Warehouse, Category, Offer, etc.)
│   ├── database/
│   │   ├── migrations/              # Database schema migrations
│   │   └── seeders/                 # Realistic multi-depot demo seeders
│   ├── routes/
│   │   └── api.php                  # RESTful API route definitions (v1)
│   └── tests/Feature/               # Automated PHPUnit / Pest integration tests
│
├── 📖 docs/                         # Project Documentation
│   ├── api/
│   │   └── API_DOCUMENTATION.md    # Complete REST API endpoint reference
│   ├── reports/
│   │   ├── DeadStock_Project_Report.docx # Comprehensive project report document
│   │   └── generate_report_docx.py       # Report generator script
│   └── rebuild/
│       └── rollback.md              # Rebuild verification & rollback protocol
│
└── 🖼️ public/                       # Static Public Assets (SVGs, icons, images)
```

---

## 🚀 Getting Started

### 1. Run the Frontend (Next.js 16)
```bash
npm install
npm run dev
```
Access the application at [http://localhost:3000](http://localhost:3000).

### 2. Run the Backend API (Laravel 11)
```bash
cd backend
php artisan serve
```
API endpoints will be active at [http://127.0.0.1:8000/api/v1](http://127.0.0.1:8000/api/v1).

---

## 🛡️ Core Capabilities
- **Predictive Risk Engine**: Multi-factor AI score (0–100) combining holding time, velocity drop, and shelf-life half-life.
- **5-Channel Recovery Engine**: Direct B2B sale, warehouse rebalancing, marketplace clearance, supplier restock, or circular recycling.
- **Private Dark Pool**: Match with 85,000+ verified enterprise buyers without competitor price leakage.
- **Escrow Settlement**: 100% smart contract escrow protection ensuring guaranteed payments.

'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Layers3,
  Package,
  Plus,
  FileSpreadsheet,
  Users,
  Sparkles,
  ShoppingBag,
  Inbox,
  BarChart3,
  Recycle,
  Building2,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  SlidersHorizontal,
  RefreshCw,
} from 'lucide-react'

import {
  DeadStockAPI,
  InventoryItem,
  BuyerMatchItem,
  MarketplaceItem,
  DashboardSummary,
  NotificationItem,
  OfferItem,
} from '@/lib/api'

import { LandingPage } from '@/components/landing/LandingPage'
import { AuthScreen } from '@/components/auth/AuthScreen'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { Header } from '@/components/navigation/Header'
import { Sidebar, NavSection } from '@/components/navigation/Sidebar'
import { InventoryTable } from '@/components/inventory/InventoryTable'
import { InventoryModal } from '@/components/inventory/InventoryModal'
import { CsvImportModal } from '@/components/inventory/CsvImportModal'
import { SkuDetailModal } from '@/components/inventory/SkuDetailModal'
import { PublishListingModal } from '@/components/inventory/PublishListingModal'
import { ExportReportModal } from '@/components/reports/ExportReportModal'
import { RecoveryDrawer } from '@/components/recovery/RecoveryDrawer'
import { MarketplaceView } from '@/components/marketplace/MarketplaceView'
import { OffersManagement } from '@/components/offers/OffersManagement'
import { BuyerMatchesView } from '@/components/matches/BuyerMatchesView'
import { MovementsLedgerView } from '@/components/ledger/MovementsLedgerView'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { SettingsView } from '@/components/settings/SettingsView'
import { CommandPalette } from '@/components/command-palette/CommandPalette'
import { AIAssistantModal } from '@/components/ai/AIAssistantModal'

// Resilient Fallback Data
const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 1,
    product: 'Precision Polymer Connector 20mm',
    sku: 'PC2048',
    qty: '4,500',
    quantity: 4500,
    value: '₹1.8L',
    current_value: 180000,
    unit_cost: 40,
    age: '11 mo',
    age_months: 11,
    demand: '1,100',
    monthly_demand: 1100,
    risk: '87%',
    risk_score: 87,
    risk_level: 'CRITICAL',
    action: 'Find Buyer',
    tone: 'red',
    category: 'Mechanical Components',
    warehouse: 'Ahmedabad Depot',
    ai_explanation: "This item's risk is 87 (CRITICAL) because stock quantity is 4.1x expected demand, inventory age has reached 11 months, and sales velocity dropped 62%.",
  },
  {
    id: 2,
    product: 'PCB Control Module v2',
    sku: 'PCB-401',
    qty: '1,200',
    quantity: 1200,
    value: '₹6.4L',
    current_value: 640000,
    unit_cost: 533.33,
    age: '14 mo',
    age_months: 14,
    demand: '480',
    monthly_demand: 480,
    risk: '94%',
    risk_score: 94,
    risk_level: 'CRITICAL',
    action: 'Urgent Liquidation',
    tone: 'red',
    category: 'Electronics & PCB',
    warehouse: 'Surat Warehouse',
    ai_explanation: "This item's risk is 94 (CRITICAL) because component obsolescence is imminent and stock exceeds 2.5x annual turnover.",
  },
  {
    id: 3,
    product: 'Heavy Duty Packaging Box',
    sku: 'PKG-118',
    qty: '12,000',
    quantity: 12000,
    value: '₹2.1L',
    current_value: 210000,
    unit_cost: 17.5,
    age: '8 mo',
    age_months: 8,
    demand: '5,200',
    monthly_demand: 5200,
    risk: '71%',
    risk_score: 71,
    risk_level: 'HIGH',
    action: 'Discount Sale',
    tone: 'amber',
    category: 'Packaging & Cartons',
    warehouse: 'Nagpur Center',
    ai_explanation: "This item's risk is 71 (HIGH) because storage holding costs exceed standard margin thresholds.",
  },
  {
    id: 4,
    product: 'Steel Bolt M8 High Tensile',
    sku: 'SBM8-22',
    qty: '8,200',
    quantity: 8200,
    value: '₹3.2L',
    current_value: 320000,
    unit_cost: 39,
    age: '5 mo',
    age_months: 5,
    demand: '3,400',
    monthly_demand: 3400,
    risk: '28%',
    risk_score: 28,
    risk_level: 'LOW',
    action: 'Monitor',
    tone: 'green',
    category: 'Industrial Hardware',
    warehouse: 'Ahmedabad Depot',
    ai_explanation: "This item's risk is 28 (LOW) because inventory velocity is within normal operational turnover.",
  },
]

const DEFAULT_MATCHES: BuyerMatchItem[] = [
  {
    id: 1,
    name: 'ElectroTech Industries',
    buyer_company_id: 2,
    match: '93%',
    match_score: 93,
    units: '3,000 units',
    required_units: 3000,
    location: 'Ahmedabad, Gujarat',
    value: '₹2.4L',
    potential_deal_value: 240000,
    note: 'Verified compatibility with industrial connector production batch.',
    tags: ['Material Match', 'Direct Sourcing'],
    breakdown: {
      product_compatibility: '96%',
      quantity_compatibility: '92%',
      industry: '95%',
      location: '96%',
      price: '88%',
      overall: '93%',
    },
  },
  {
    id: 2,
    name: 'Nova Components Ltd.',
    buyer_company_id: 3,
    match: '87%',
    match_score: 87,
    units: '2,500 units',
    required_units: 2500,
    location: 'Bengaluru, Karnataka',
    value: '₹1.9L',
    potential_deal_value: 190000,
    note: 'High purchasing capacity for surplus PCB sub-modules.',
    tags: ['Electronics Fit', 'Regional Logistics'],
    breakdown: {
      product_compatibility: '90%',
      quantity_compatibility: '88%',
      industry: '92%',
      location: '80%',
      price: '85%',
      overall: '87%',
    },
  },
]

const DEFAULT_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 1,
    title: 'Industrial Connector 20mm High Temp',
    category: 'Mechanical Components',
    units: '5,000 units',
    units_available: 5000,
    price: '₹28/unit',
    price_per_unit: 28,
    match: '91%',
    location: 'Ahmedabad Depot',
    action: 'Submit Offer',
  },
  {
    id: 2,
    title: 'ABS Molded Shells Grade-A',
    category: 'Plastic & Polymers',
    units: '2,800 units',
    units_available: 2800,
    price: '₹45/unit',
    price_per_unit: 45,
    match: '84%',
    location: 'Surat Depot',
    action: 'Submit Offer',
  },
  {
    id: 3,
    title: 'Heavy Duty Corrugated Shipping Cartons',
    category: 'Packaging & Cartons',
    units: '18,400 units',
    units_available: 18400,
    price: '₹12/unit',
    price_per_unit: 12,
    match: '78%',
    location: 'Nagpur Center',
    action: 'Submit Offer',
  },
]

export default function DeadStockPlatform() {
  // App Navigation Flow: 'landing' | 'auth_signup' | 'auth_login' | 'onboarding' | 'app'
  const [appScreen, setAppScreen] = useState<'landing' | 'auth_signup' | 'auth_login' | 'onboarding' | 'app'>('landing')

  const [role, setRole] = useState<'seller' | 'buyer'>('seller')
  const [activeTab, setActiveTab] = useState<NavSection>('dashboard')

  // API State
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY)
  const [matches, setMatches] = useState<BuyerMatchItem[]>(DEFAULT_MATCHES)
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(DEFAULT_MARKETPLACE)
  const [offers, setOffers] = useState<OfferItem[]>([])
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(false)
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // Modals & Drawers
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null)
  const [itemForRecovery, setItemForRecovery] = useState<InventoryItem | null>(null)
  const [itemForSkuDetail, setItemForSkuDetail] = useState<InventoryItem | null>(null)
  const [itemForMarketplacePublish, setItemForMarketplacePublish] = useState<InventoryItem | null>(null)
  const [isExportReportOpen, setIsExportReportOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)
  const [isAIOpen, setIsAIOpen] = useState(false)

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3500)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [invRes, matchRes, mktRes, offRes, sumRes, notifRes] = await Promise.all([
        DeadStockAPI.getInventory(),
        DeadStockAPI.getMatches(),
        DeadStockAPI.getMarketplace(),
        DeadStockAPI.getOffers(),
        DeadStockAPI.getDashboardSummary(),
        DeadStockAPI.getNotifications(),
      ])

      if (invRes && Array.isArray(invRes) && invRes.length > 0) setInventory(invRes)
      if (matchRes && Array.isArray(matchRes) && matchRes.length > 0) setMatches(matchRes)
      if (mktRes && Array.isArray(mktRes) && mktRes.length > 0) setMarketplace(mktRes)
      if (offRes && Array.isArray(offRes)) setOffers(offRes)
      if (sumRes) setDashboardSummary(sumRes)
      if (notifRes && Array.isArray(notifRes)) setNotifications(notifRes)
    } catch (err) {
      console.warn('Failed fetching data, continuing with resilient state.', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleRoleChange = (newRole: 'seller' | 'buyer') => {
    setRole(newRole)
    if (newRole === 'buyer') {
      setActiveTab('marketplace')
    } else {
      setActiveTab('dashboard')
    }
  }

  const handleArchiveItem = async (item: InventoryItem) => {
    try {
      await DeadStockAPI.archiveInventory(item.id)
      showToast(`SKU ${item.sku} archived successfully.`)
      loadData()
    } catch (err) {
      showToast(`Failed to archive SKU ${item.sku}.`)
    }
  }

  const totalAtRisk = inventory.filter((i) => i.risk_level === 'CRITICAL' || i.risk_level === 'HIGH').length
  const pendingOffers = offers.filter((o) => o.status === 'pending').length

  // Screen 1: Public Landing Page
  if (appScreen === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setAppScreen('auth_signup')}
        onLogin={() => setAppScreen('auth_login')}
        onBrowseMarketplace={() => {
          setRole('buyer')
          setActiveTab('marketplace')
          setAppScreen('app')
        }}
      />
    )
  }

  // Screen 2: Authentication (Sign Up or Log In)
  if (appScreen === 'auth_signup' || appScreen === 'auth_login') {
    return (
      <AuthScreen
        initialMode={appScreen === 'auth_signup' ? 'signup' : 'login'}
        onCancel={() => setAppScreen('landing')}
        onSuccess={({ role: selectedRole, isNew }) => {
          setRole(selectedRole)
          if (isNew) {
            setAppScreen('onboarding')
          } else {
            setAppScreen('app')
            loadData()
          }
        }}
      />
    )
  }

  // Screen 3: Onboarding 3-step Wizard
  if (appScreen === 'onboarding') {
    return (
      <OnboardingWizard
        role={role}
        onComplete={() => {
          setAppScreen('app')
          showToast('Company workspace initialized!')
          loadData()
        }}
      />
    )
  }

  // Screen 4: Main Application Workspace
  return (
    <div className="flex h-screen w-full bg-zinc-100/60 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 antialiased overflow-hidden font-sans selection:bg-[#14B8A6]/20">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentRole={role}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        totalAtRiskCount={totalAtRisk}
        pendingOffersCount={pendingOffers}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentRole={role}
          onRoleChange={handleRoleChange}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          notifications={notifications}
          onRefreshNotifications={loadData}
          onSignOut={() => setAppScreen('landing')}
        />

        {/* Dynamic Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs font-semibold shadow-xl text-zinc-900 dark:text-zinc-100 animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Header Context */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                  {activeTab === 'dashboard' && 'Operations Dashboard'}
                  {activeTab === 'inventory' && 'Inventory & Risk Intelligence'}
                  {activeTab === 'matches' && 'B2B Counterparty Matching'}
                  {activeTab === 'recovery' && 'Capital Recovery Center'}
                  {activeTab === 'marketplace' && 'Surplus B2B Marketplace'}
                  {activeTab === 'offers' && (role === 'seller' ? 'Inbound Offers' : 'My B2B Bids')}
                  {activeTab === 'analytics' && 'Analytics & Performance'}
                  {activeTab === 'sustainability' && 'Circular Sustainability'}
                  {activeTab === 'settings' && 'Workspace & Organization Settings'}
                </h1>
                <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-mono font-semibold text-[#0D9488] dark:text-[#14B8A6]">
                  {role === 'seller' ? 'SELLER_OPERATIONS' : 'BUYER_SOURCING'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                {role === 'seller'
                  ? 'Identify dead-stock risks early, optimize recovery channels, and liquidate to verified buyers.'
                  : 'Source high-quality industrial surplus and components at verified discounted rates.'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={loadData}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-xs transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Sync Live</span>
              </button>
            </div>
          </div>

          {/* Tab Routing */}
          {(activeTab === 'dashboard' || activeTab === 'analytics') && (
            <AnalyticsDashboard
              summary={dashboardSummary}
              inventory={inventory}
              currentRole={role}
            />
          )}

          {activeTab === 'inventory' && (
            <InventoryTable
              items={inventory}
              loading={loading}
              onOpenAddModal={() => {
                setItemToEdit(null)
                setIsAddModalOpen(true)
              }}
              onOpenCsvModal={() => setIsCsvModalOpen(true)}
              onOpenEditModal={(item) => {
                setItemToEdit(item)
                setIsAddModalOpen(true)
              }}
              onOpenRecovery={(item) => setItemForRecovery(item)}
              onOpenMatches={(item) => setActiveTab('matches')}
              onArchiveItem={handleArchiveItem}
              onOpenSkuDetail={(item) => setItemForSkuDetail(item)}
              onOpenExportReport={() => setIsExportReportOpen(true)}
              onOpenPublishMarketplace={(item) => setItemForMarketplacePublish(item)}
            />
          )}

          {activeTab === 'matches' && (
            <BuyerMatchesView matches={matches} onRefresh={loadData} />
          )}

          {activeTab === 'recovery' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-sm">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#0D9488]" />
                  <span>Select an Inventory Item for Multi-Channel Recovery</span>
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Choose an at-risk SKU below to compare and execute Sell, Transfer, Discount, Return, or Circular Recycling.
                </p>
              </div>

              <InventoryTable
                items={inventory}
                loading={loading}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
                onOpenEditModal={(item) => {
                  setItemToEdit(item)
                  setIsAddModalOpen(true)
                }}
                onOpenRecovery={(item) => setItemForRecovery(item)}
                onOpenMatches={() => setActiveTab('matches')}
                onArchiveItem={handleArchiveItem}
                onOpenSkuDetail={(item) => setItemForSkuDetail(item)}
                onOpenExportReport={() => setIsExportReportOpen(true)}
                onOpenPublishMarketplace={(item) => setItemForMarketplacePublish(item)}
              />
            </div>
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView listings={marketplace} onRefresh={loadData} />
          )}

          {activeTab === 'offers' && (
            <OffersManagement
              offers={offers}
              currentRole={role}
              onRefresh={loadData}
            />
          )}

          {activeTab === 'ledger' && <MovementsLedgerView />}

          {activeTab === 'sustainability' && (
            <AnalyticsDashboard
              summary={dashboardSummary}
              inventory={inventory}
              currentRole={role}
            />
          )}

          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>

      {/* Global Modals & Command Palette */}
      <InventoryModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setItemToEdit(null)
        }}
        itemToEdit={itemToEdit}
        onSuccess={() => {
          showToast(itemToEdit ? 'SKU updated successfully.' : 'New SKU analyzed and added.')
          loadData()
        }}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => {
          showToast('Bulk import completed and risk scores analyzed.')
          loadData()
        }}
      />

      <SkuDetailModal
        isOpen={!!itemForSkuDetail}
        item={itemForSkuDetail}
        onClose={() => setItemForSkuDetail(null)}
        onOpenRecovery={(item) => setItemForRecovery(item)}
        onOpenMarketplacePublish={(item) => setItemForMarketplacePublish(item)}
        onOpenEdit={(item) => {
          setItemToEdit(item)
          setIsAddModalOpen(true)
        }}
      />

      <PublishListingModal
        isOpen={!!itemForMarketplacePublish}
        item={itemForMarketplacePublish}
        onClose={() => setItemForMarketplacePublish(null)}
        onSuccess={() => {
          showToast('Lot successfully published to live Surplus Marketplace!')
          loadData()
        }}
      />

      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        inventory={inventory}
      />

      <RecoveryDrawer
        isOpen={!!itemForRecovery}
        item={itemForRecovery}
        onClose={() => setItemForRecovery(null)}
        onSuccess={() => {
          showToast('Recovery deal successfully executed and capital logged.')
          loadData()
        }}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        inventory={inventory}
        marketplace={marketplace}
        onSelectSKU={(sku) => {
          const itm = inventory.find((i) => i.sku === sku)
          if (itm) setItemForRecovery(itm)
        }}
        onTriggerAction={(act) => {
          if (act === 'add_sku') setIsAddModalOpen(true)
          if (act === 'import_csv') setIsCsvModalOpen(true)
          if (act === 'open_ai') setIsAIOpen(true)
          if (act === 'view_analytics') setActiveTab('analytics')
          if (act === 'marketplace') {
            setRole('buyer')
            setActiveTab('marketplace')
          }
        }}
      />

      <AIAssistantModal
        isOpen={isAIOpen}
        onClose={() => setIsAIOpen(false)}
      />
    </div>
  )
}

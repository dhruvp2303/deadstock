'use client'

import React, { useState, useCallback } from 'react'
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
  InventoryItem,
  BuyerMatchItem,
  MarketplaceItem,
  NotificationItem,
  OfferItem,
} from '@/lib/api'

import { useInventory } from '@/hooks/useInventory'
import { useBuyerMatches } from '@/hooks/useBuyerMatches'
import { useMarketplace } from '@/hooks/useMarketplace'
import { useOffers } from '@/hooks/useOffers'
import { useNotifications } from '@/hooks/useNotifications'
import { useWorkspace } from '@/hooks/useWorkspace'

import { LandingPage } from '@/components/landing/LandingPage'
import { AuthScreen } from '@/components/auth/AuthScreen'
import { OnboardingWizard } from '@/components/onboarding/OnboardingWizard'
import { Header } from '@/components/navigation/Header'
import { Sidebar } from '@/components/navigation/Sidebar'
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

export default function DeadStockPlatform() {
  const {
    appScreen,
    setAppScreen,
    role,
    setRole,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    toasts,
    showToast,
    dashboardSummary,
    handleRoleChange,
    refetchSummary,
  } = useWorkspace()

  const { inventory, loading: inventoryLoading, refetch: refetchInventory, archiveItem } = useInventory()
  const { matches, refetch: refetchMatches } = useBuyerMatches()
  const { marketplace, refetch: refetchMarketplace } = useMarketplace()
  const { offers, refetch: refetchOffers } = useOffers()
  const { notifications, markAsRead, refetch: refetchNotifications } = useNotifications()

  // Modal Dialog States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [itemToEdit, setItemToEdit] = useState<InventoryItem | null>(null)
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false)
  const [isExportReportOpen, setIsExportReportOpen] = useState(false)
  const [itemForRecovery, setItemForRecovery] = useState<InventoryItem | null>(null)
  const [itemForSkuDetail, setItemForSkuDetail] = useState<InventoryItem | null>(null)
  const [itemForMarketplacePublish, setItemForMarketplacePublish] = useState<InventoryItem | null>(null)
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false)

  const reloadAllData = useCallback(() => {
    refetchInventory()
    refetchMatches()
    refetchMarketplace()
    refetchOffers()
    refetchNotifications()
    refetchSummary()
  }, [refetchInventory, refetchMatches, refetchMarketplace, refetchOffers, refetchNotifications, refetchSummary])

  const handleArchive = async (item: InventoryItem) => {
    const ok = await archiveItem(item)
    if (ok) {
      showToast(`SKU ${item.sku} archived successfully.`)
      reloadAllData()
    } else {
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
            reloadAllData()
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
          reloadAllData()
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
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          notifications={notifications}
          onMarkNotificationAsRead={markAsRead}
          onOpenAddInventory={() => {
            setItemToEdit(null)
            setIsAddModalOpen(true)
          }}
          onOpenCsvImport={() => setIsCsvModalOpen(true)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onNavigateToLanding={() => setAppScreen('landing')}
        />

        {/* Dynamic Workspace Tab Content */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 space-y-6">
          {/* Top Info Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 capitalize">
                  {activeTab.replace('-', ' ')}
                </h1>
                <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  {role === 'seller' ? 'Seller Workspace' : 'Buyer Sourcing Mode'}
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
                onClick={reloadAllData}
                disabled={inventoryLoading}
                className="flex items-center gap-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-xs transition-colors"
                title="Refresh Live Data"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${inventoryLoading ? 'animate-spin' : ''}`} />
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
              loading={inventoryLoading}
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
              onArchiveItem={handleArchive}
              onOpenSkuDetail={(item) => setItemForSkuDetail(item)}
              onOpenExportReport={() => setIsExportReportOpen(true)}
              onOpenPublishMarketplace={(item) => setItemForMarketplacePublish(item)}
            />
          )}

          {activeTab === 'matches' && (
            <BuyerMatchesView matches={matches} onRefresh={reloadAllData} />
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
                loading={inventoryLoading}
                onOpenAddModal={() => setIsAddModalOpen(true)}
                onOpenCsvModal={() => setIsCsvModalOpen(true)}
                onOpenEditModal={(item) => {
                  setItemToEdit(item)
                  setIsAddModalOpen(true)
                }}
                onOpenRecovery={(item) => setItemForRecovery(item)}
                onOpenMatches={() => setActiveTab('matches')}
                onArchiveItem={handleArchive}
                onOpenSkuDetail={(item) => setItemForSkuDetail(item)}
                onOpenExportReport={() => setIsExportReportOpen(true)}
                onOpenPublishMarketplace={(item) => setItemForMarketplacePublish(item)}
              />
            </div>
          )}

          {activeTab === 'marketplace' && (
            <MarketplaceView listings={marketplace} onRefresh={reloadAllData} />
          )}

          {activeTab === 'offers' && (
            <OffersManagement
              offers={offers}
              currentRole={role}
              onRefresh={reloadAllData}
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
          reloadAllData()
        }}
      />

      <CsvImportModal
        isOpen={isCsvModalOpen}
        onClose={() => setIsCsvModalOpen(false)}
        onSuccess={() => {
          showToast('Bulk import completed and risk scores analyzed.')
          reloadAllData()
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
          reloadAllData()
        }}
      />

      <ExportReportModal
        isOpen={isExportReportOpen}
        onClose={() => setIsExportReportOpen(false)}
        inventory={inventory}
      />

      {itemForRecovery && (
        <RecoveryDrawer
          isOpen={!!itemForRecovery}
          onClose={() => setItemForRecovery(null)}
          item={itemForRecovery}
          onExecuteStrategy={(strategy) => {
            showToast(`Recovery strategy '${strategy}' executed for SKU ${itemForRecovery.sku}.`)
            setItemForRecovery(null)
            reloadAllData()
          }}
        />
      )}

      <AIAssistantModal
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        inventory={inventory}
      />

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        inventory={inventory}
        marketplace={marketplace}
        onSelectInventory={(item) => {
          setItemForSkuDetail(item)
          setIsCommandPaletteOpen(false)
        }}
        onSelectMarketplace={(item) => {
          setActiveTab('marketplace')
          setIsCommandPaletteOpen(false)
        }}
        onNavigate={(tab) => {
          setActiveTab(tab)
          setIsCommandPaletteOpen(false)
        }}
      />

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center gap-2.5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 px-4 py-3 text-xs font-semibold text-zinc-900 dark:text-zinc-100 shadow-xl backdrop-blur-md animate-fade-in"
          >
            <CheckCircle2 className="h-4 w-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{toast.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

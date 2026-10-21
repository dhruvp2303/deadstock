'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Sparkles,
  CheckCircle2,
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
import { ImageSearchModal } from '@/components/marketplace/ImageSearchModal'
import { UserProfileModal } from '@/components/profile/UserProfileModal'

export default function DeadStockPlatform() {
  // App Navigation Flow: 'landing' | 'auth_signup' | 'auth_login' | 'onboarding' | 'app'
  const [appScreen, setAppScreen] = useState<'landing' | 'auth_signup' | 'auth_login' | 'onboarding' | 'app'>('landing')
  const [currentUser, setCurrentUser] = useState<any>(null)

  const [role, setRole] = useState<'seller' | 'buyer'>('seller')
  const [activeTab, setActiveTab] = useState<NavSection>('dashboard')

  // API State
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [matches, setMatches] = useState<BuyerMatchItem[]>([])
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([])
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
  const [isImageSearchGlobalOpen, setIsImageSearchGlobalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

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

      if (invRes && Array.isArray(invRes)) setInventory(invRes)
      if (matchRes && Array.isArray(matchRes)) setMatches(matchRes)
      if (mktRes && Array.isArray(mktRes)) setMarketplace(mktRes)
      if (offRes && Array.isArray(offRes)) setOffers(offRes)
      if (sumRes) setDashboardSummary(sumRes)
      if (notifRes && Array.isArray(notifRes)) setNotifications(notifRes)
    } catch (err) {
      console.warn('Failed fetching workspace data.', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') return
      const token = localStorage.getItem('deadstock_auth_token')
      const savedUser = localStorage.getItem('deadstock_user')
      const savedMode = localStorage.getItem('deadstock_view_mode')

      if (token) {
        if (savedUser) {
          try {
            setCurrentUser(JSON.parse(savedUser))
          } catch (e) {}
        }
        try {
          const me = await DeadStockAPI.getMe()
          if (me) {
            setCurrentUser(me)
            localStorage.setItem('deadstock_user', JSON.stringify(me))
            if (savedMode === 'app') {
              setAppScreen('app')
            }
          } else {
            // Token was invalid / expired
            localStorage.removeItem('deadstock_auth_token')
            localStorage.removeItem('deadstock_user')
            localStorage.removeItem('deadstock_view_mode')
            setCurrentUser(null)
            setAppScreen('landing')
          }
        } catch {
          if (savedMode === 'app' && savedUser) {
            setAppScreen('app')
          }
        }
      } else {
        // No token: strictly unauthenticated. Clean all keys and stay on landing.
        localStorage.removeItem('deadstock_user')
        localStorage.removeItem('deadstock_view_mode')
        setCurrentUser(null)
        setAppScreen('landing')
      }
    }
    initAuth()
  }, [])

  const handleStartDemoSession = async () => {
    setLoading(true)
    try {
      const res = await DeadStockAPI.startDemoSession()
      if (res?.token && res?.user) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('deadstock_auth_token', res.token)
          localStorage.setItem('deadstock_user', JSON.stringify(res.user))
          localStorage.setItem('deadstock_view_mode', 'app')
        }
        setCurrentUser(res.user)
        setRole('seller')
        setActiveTab('dashboard')
        setAppScreen('app')
        showToast('Demo exploration activated! Welcome to the showcase environment.')
        await loadData()
      } else {
        showToast('Unable to activate demo mode. Please try again.')
      }
    } catch (e: any) {
      showToast('Error connecting to demo session: ' + (e?.message || 'Server error'))
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await DeadStockAPI.logout()
    } catch (e) {
      console.warn('Logout API error:', e)
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('deadstock_auth_token')
        localStorage.removeItem('deadstock_user')
        localStorage.removeItem('deadstock_view_mode')
      }
      setCurrentUser(null)
      setInventory([])
      setMatches([])
      setMarketplace([])
      setOffers([])
      setDashboardSummary(null)
      setNotifications([])
      setAppScreen('landing')
      showToast('Signed out of DeadStock workspace.')
    }
  }

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
        currentUser={currentUser}
        onGetStarted={() => {
          if (currentUser) {
            setAppScreen('app')
            loadData()
          } else {
            setAppScreen('auth_signup')
          }
        }}
        onLogin={() => {
          if (currentUser) {
            setAppScreen('app')
            loadData()
          } else {
            setAppScreen('auth_login')
          }
        }}
        onExploreDemo={handleStartDemoSession}
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
        onExploreDemo={handleStartDemoSession}
        onSuccess={({ user, role: selectedRole, isNew }) => {
          setCurrentUser(user)
          setRole(selectedRole)
          if (typeof window !== 'undefined') {
            localStorage.setItem('deadstock_user', JSON.stringify(user))
            localStorage.setItem('deadstock_view_mode', 'app')
          }
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
        currentUser={currentUser}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <Header
          currentRole={role}
          currentUser={currentUser}
          onRoleChange={handleRoleChange}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
          onOpenAI={() => setIsAIOpen(true)}
          notifications={notifications}
          onRefreshNotifications={loadData}
          onSignOut={handleSignOut}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSettings={() => setActiveTab('settings')}
        />

        {/* Dynamic Toast Feedback */}
        {toastMessage && (
          <div className="fixed top-16 right-4 z-50 flex items-center gap-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2.5 text-xs font-semibold shadow-xl text-zinc-900 dark:text-zinc-100 animate-in slide-in-from-top duration-150">
            <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Scrollable Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
          {/* Quick Header Context */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-zinc-200/80 dark:border-zinc-800/80 pb-5">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-100">
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
                <span className="rounded-full bg-teal-500/10 border border-teal-500/20 px-2.5 py-0.5 text-[11px] font-mono font-bold text-[#0D9488] dark:text-[#14B8A6]">
                  {role === 'seller' ? 'SELLER_OPERATIONS' : 'BUYER_SOURCING'}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
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
                className="flex items-center gap-2 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 shadow-2xs hover:border-zinc-300 transition-all"
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
              onAddInventory={() => {
                setItemToEdit(null)
                setIsAddModalOpen(true)
              }}
              onImportCsv={() => setIsCsvModalOpen(true)}
              onBrowseMarketplace={() => {
                setRole('buyer')
                setActiveTab('marketplace')
              }}
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

          {activeTab === 'settings' && (
            <SettingsView
              currentUser={currentUser}
              onProfileUpdated={(updated) => {
                setCurrentUser(updated)
                loadData()
              }}
            />
          )}
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
          if (act === 'open_profile') setIsProfileModalOpen(true)
          if (act === 'open_image_search') setIsImageSearchGlobalOpen(true)
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

      <ImageSearchModal
        isOpen={isImageSearchGlobalOpen}
        onClose={() => setIsImageSearchGlobalOpen(false)}
        listings={marketplace}
        onSelectListing={(item) => {
          setRole('buyer')
          setActiveTab('marketplace')
        }}
        onMakeOffer={(item) => {
          setRole('buyer')
          setActiveTab('marketplace')
        }}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updated) => {
          setCurrentUser(updated)
          loadData()
        }}
        showToast={showToast}
      />
    </div>
  )
}

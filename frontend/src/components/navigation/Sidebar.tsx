'use client'

import React from 'react'
import {
  LayoutDashboard,
  Package,
  Sparkles,
  Users,
  BarChart3,
  Recycle,
  Inbox,
  ShoppingBag,
  Settings,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export type NavSection =
  | 'dashboard'
  | 'inventory'
  | 'matches'
  | 'recovery'
  | 'marketplace'
  | 'offers'
  | 'ledger'
  | 'analytics'
  | 'sustainability'
  | 'settings'

interface SidebarProps {
  currentRole: 'seller' | 'buyer'
  activeTab: NavSection
  onSelectTab: (tab: NavSection) => void
  totalAtRiskCount?: number
  pendingOffersCount?: number
  currentUser?: any
  onOpenProfile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentRole,
  activeTab,
  onSelectTab,
  totalAtRiskCount = 0,
  pendingOffersCount = 0,
  currentUser,
  onOpenProfile,
}) => {
  const getInitials = (fullName?: string) => {
    if (!fullName) return 'DS'
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const sellerNav = [
    { id: 'dashboard' as NavSection, label: 'Overview', icon: LayoutDashboard },
    {
      id: 'inventory' as NavSection,
      label: 'Inventory & Risk',
      icon: Package,
      badge: totalAtRiskCount > 0 ? `${totalAtRiskCount} High` : undefined,
      badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20',
    },
    { id: 'matches' as NavSection, label: 'Buyer Matches', icon: Users },
    { id: 'recovery' as NavSection, label: 'Recovery Center', icon: Sparkles },
    {
      id: 'offers' as NavSection,
      label: 'Inbound Offers',
      icon: Inbox,
      badge: pendingOffersCount > 0 ? `${pendingOffersCount}` : undefined,
      badgeColor: 'bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] border border-teal-500/20',
    },
    { id: 'ledger' as NavSection, label: 'Movement Ledger', icon: BarChart3 },
    { id: 'analytics' as NavSection, label: 'Analytics & Trends', icon: BarChart3 },
    { id: 'sustainability' as NavSection, label: 'Circular Impact', icon: Recycle },
  ]

  const buyerNav = [
    { id: 'marketplace' as NavSection, label: 'Surplus Catalog', icon: ShoppingBag },
    {
      id: 'offers' as NavSection,
      label: 'My Outgoing Bids',
      icon: Inbox,
      badge: pendingOffersCount > 0 ? `${pendingOffersCount}` : undefined,
      badgeColor: 'bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] border border-teal-500/20',
    },
    { id: 'matches' as NavSection, label: 'Recommended Deals', icon: Users },
    { id: 'ledger' as NavSection, label: 'Purchased Ledger', icon: BarChart3 },
    { id: 'analytics' as NavSection, label: 'Procurement Savings', icon: BarChart3 },
    { id: 'sustainability' as NavSection, label: 'Avoided Waste Log', icon: Recycle },
  ]

  const navItems = currentRole === 'seller' ? sellerNav : buyerNav

  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between border-r border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-950/70 p-4 select-none">
      <div className="space-y-5">
        {/* Brand Logo Header */}
        <div className="px-1 py-1">
          <Logo size="md" withTagline={true} />
        </div>

        {/* Section Heading */}
        <div className="px-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            {currentRole === 'seller' ? 'Seller Workspace' : 'Buyer Sourcing Workspace'}
          </span>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-[#0D9488] to-[#0F9D8D] text-white shadow-md shadow-teal-700/20 font-bold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100/90 dark:hover:bg-zinc-900/90 hover:text-zinc-900 dark:hover:text-zinc-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? 'text-white'
                        : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap shrink-0 ${
                      isActive ? 'bg-white/20 text-white' : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Bottom Profile & Target */}
      <div className="space-y-2 border-t border-zinc-200 dark:border-zinc-800 pt-3">
        {/* User Profile Pill Card */}
        <button
          type="button"
          onClick={() => {
            if (onOpenProfile) onOpenProfile()
            else onSelectTab('settings')
          }}
          className="group flex w-full items-center gap-2.5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50/70 dark:bg-zinc-900/40 p-2 text-left transition-all hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:border-teal-500/30"
        >
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-[11px] font-bold text-white shadow-xs">
            {getInitials(currentUser?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {currentUser?.name || (currentUser?.is_demo ? 'Demo Explorer' : 'Account User')}
              </span>
              <span className="rounded-md bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] text-[10px] px-1.5 py-0.5 font-mono uppercase font-bold whitespace-nowrap shrink-0">
                {currentUser?.role || (currentUser?.is_demo ? 'Demo' : 'Admin')}
              </span>
            </div>
            <span className="truncate text-[10px] text-zinc-400 block">
              {currentUser?.company?.name || (currentUser?.is_demo ? 'DeadStock Showcase Corp' : 'Your Company')}
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelectTab('settings')}
          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-colors ${
            activeTab === 'settings'
              ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-bold'
              : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Settings className="h-4 w-4 text-zinc-400" />
          <span>Workspace Settings</span>
        </button>

        <div className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 p-3 text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
            <span>Recovery Target</span>
            <span className="font-mono text-[#0D9488] dark:text-[#14B8A6]">82%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
            <div className="h-full bg-[#0D9488] rounded-full w-[82%]" />
          </div>
        </div>
      </div>
    </aside>
  )
}

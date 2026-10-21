'use client'

import React, { useState } from 'react'
import {
  Bell,
  Search,
  Sparkles,
  Building2,
  LogOut,
  User,
  Settings,
  ChevronDown,
} from 'lucide-react'
import { NotificationItem, DeadStockAPI } from '@/lib/api'
import { Logo } from '@/components/brand/Logo'

interface HeaderProps {
  currentRole: 'seller' | 'buyer'
  onRoleChange: (role: 'seller' | 'buyer') => void
  onOpenCommandPalette: () => void
  onOpenAI: () => void
  notifications: NotificationItem[]
  onRefreshNotifications: () => void
  onSignOut?: () => void
  onOpenProfile?: () => void
  onOpenSettings?: () => void
  currentUser?: any
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenCommandPalette,
  onOpenAI,
  notifications,
  onRefreshNotifications,
  onSignOut,
  onOpenProfile,
  onOpenSettings,
  currentUser,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'DS'
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const handleMarkRead = async (id: number) => {
    await DeadStockAPI.markNotificationRead(id)
    onRefreshNotifications()
  }

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/90 dark:bg-zinc-950/90 px-4 sm:px-6 backdrop-blur-md transition-all">
      {/* Left: Brand Logo (on mobile only) & Role Switcher */}
      <div className="flex items-center gap-3.5">
        <div className="pr-3 border-r border-zinc-200 dark:border-zinc-800 lg:hidden">
          <Logo size="sm" withTagline={false} />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-zinc-200/90 dark:border-zinc-800/90 bg-zinc-100/90 dark:bg-zinc-900/90 p-1 text-xs font-medium shadow-2xs">
          <button
            onClick={() => onRoleChange('seller')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all text-xs ${
              currentRole === 'seller'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentRole === 'seller' ? 'bg-[#0D9488]' : 'bg-transparent'}`} />
            Seller Operations
          </button>
          <button
            onClick={() => onRoleChange('buyer')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all text-xs ${
              currentRole === 'buyer'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentRole === 'buyer' ? 'bg-[#0D9488]' : 'bg-transparent'}`} />
            Buyer Marketplace
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-3.5">
          <Building2 className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-semibold text-zinc-800 dark:text-zinc-200">
            {currentUser?.company?.name || (currentUser?.is_demo ? 'DeadStock Showcase Corp' : 'Your Company')}
          </span>
          {currentUser?.name && (
            <>
              <span className="text-zinc-300 dark:text-zinc-700">•</span>
              <span className="text-zinc-500">{currentUser.name}</span>
            </>
          )}
        </div>

        {currentUser?.is_demo && (
          <div className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Showcase Demo Mode</span>
          </div>
        )}
      </div>

      {/* Right: Quick Search Ctrl+K, AI Trigger, Notifications & Sign Out */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 rounded-full border border-zinc-200/90 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors shadow-2xs"
        >
          <Search className="h-3.5 w-3.5 text-zinc-400" />
          <span className="hidden sm:inline">Search SKUs, buyers (⌘K)...</span>
        </button>

        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1.5 text-xs font-bold text-[#0D9488] dark:text-[#14B8A6] hover:bg-teal-500/20 transition-all shadow-2xs hover:scale-[1.02]"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Ask AI</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2 mb-2">
                <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">Live Notifications</span>
                <span className="text-[11px] text-zinc-500">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <div className="py-6 text-center text-xs text-zinc-400">No active alerts</div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleMarkRead(item.id)}
                      className={`cursor-pointer rounded-xl p-2.5 transition-colors text-xs ${
                        item.is_read
                          ? 'bg-zinc-50/50 dark:bg-zinc-900/30 text-zinc-500 opacity-75'
                          : 'bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200/80 dark:border-zinc-800/80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">{item.title}</span>
                        {!item.is_read && <span className="h-2 w-2 rounded-full bg-[#0D9488] mt-1 shrink-0" />}
                      </div>
                      <p className="mt-1 text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">{item.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowProfileMenu(!showProfileMenu)
              setShowNotifications(false)
            }}
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-1 pr-2.5 py-1 text-xs hover:border-zinc-300 dark:hover:border-zinc-700 transition-all group"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white shadow-xs">
              {getInitials(currentUser?.name)}
            </div>
            <span className="hidden md:inline font-semibold text-zinc-800 dark:text-zinc-200 max-w-[110px] truncate">
              {currentUser?.name || 'Profile'}
            </span>
            <ChevronDown className="h-3 w-3 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-transform" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center gap-3 p-2.5 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-600 text-xs font-bold text-white shadow-sm">
                  {getInitials(currentUser?.name)}
                </div>
                <div className="overflow-hidden text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate block">
                      {currentUser?.name || (currentUser?.is_demo ? 'Demo Explorer' : 'Account User')}
                    </span>
                    <span className="rounded-md bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] text-[10px] px-1.5 py-0.5 font-mono uppercase font-bold whitespace-nowrap shrink-0">
                      {currentUser?.role || (currentUser?.is_demo ? 'Demo' : 'Admin')}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-500 truncate block">
                    {currentUser?.email || (currentUser?.is_demo ? 'demo-explorer@deadstock.internal' : '')}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate block mt-0.5">
                    {currentUser?.company?.name || (currentUser?.is_demo ? 'DeadStock Showcase Corp' : 'Your Company')}
                  </span>
                </div>
              </div>

              <div className="py-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowProfileMenu(false)
                    onOpenProfile?.()
                  }}
                  className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-left"
                >
                  <User className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400" />
                  <span>User Profile & Account</span>
                </button>

                {onOpenSettings && (
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      onOpenSettings()
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors text-left"
                  >
                    <Settings className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Workspace Settings</span>
                  </button>
                )}
              </div>

              {onSignOut && (
                <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false)
                      onSignOut()
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors text-left"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

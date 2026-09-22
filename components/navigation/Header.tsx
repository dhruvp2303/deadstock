'use client'

import React, { useState } from 'react'
import {
  Bell,
  Search,
  Sparkles,
  Building2,
  LogOut,
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
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  onOpenCommandPalette,
  onOpenAI,
  notifications,
  onRefreshNotifications,
  onSignOut,
}) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const unreadCount = notifications.filter((n) => !n.is_read).length

  const handleMarkRead = async (id: number) => {
    await DeadStockAPI.markNotificationRead(id)
    onRefreshNotifications()
  }

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-950/95 px-4 backdrop-blur transition-colors">
      {/* Left: Official DeadStock Brand Logo & Role Switcher */}
      <div className="flex items-center gap-3">
        <div className="pr-3 border-r border-zinc-200 dark:border-zinc-800">
          <Logo size="sm" withTagline={false} />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900 p-0.5 text-xs font-medium">
          <button
            onClick={() => onRoleChange('seller')}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
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
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-all ${
              currentRole === 'buyer'
                ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs font-bold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${currentRole === 'buyer' ? 'bg-[#0D9488]' : 'bg-transparent'}`} />
            Buyer Marketplace
          </button>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 border-l border-zinc-200 dark:border-zinc-800 pl-3">
          <Building2 className="h-3.5 w-3.5 text-zinc-400" />
          <span className="font-medium text-zinc-800 dark:text-zinc-200">ABC Plastics Ltd.</span>
          <span className="text-zinc-400">•</span>
          <span className="text-zinc-500">Ahmedabad Depot</span>
        </div>
      </div>

      {/* Right: Quick Search Ctrl+K, AI Trigger, Notifications & Sign Out */}
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Search SKUs, buyers (⌘K)...</span>
        </button>

        <button
          onClick={onOpenAI}
          className="flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-3 py-1.5 text-xs font-bold text-[#0D9488] dark:text-[#14B8A6] hover:bg-teal-500/20 transition-all shadow-xs"
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

        {onSignOut && (
          <button
            onClick={onSignOut}
            title="Sign Out to Landing Page"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200 dark:border-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-zinc-400 hover:text-rose-600 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </header>
  )
}

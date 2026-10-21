'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, DashboardSummary } from '@/lib/api'
import { NavSection } from '@/components/navigation/Sidebar'

export type AppScreen = 'landing' | 'auth_login' | 'auth_signup' | 'onboarding' | 'app'

export interface ToastMessage {
  id: string
  text: string
}

export function useWorkspace() {
  const [appScreen, setAppScreen] = useState<AppScreen>('landing')
  const [role, setRole] = useState<'seller' | 'buyer'>('seller')
  const [activeTab, setActiveTab] = useState<NavSection>('dashboard')
  const [searchQuery, setSearchQuery] = useState('')
  const [toasts, setToasts] = useState<ToastMessage[]>([])
  const [dashboardSummary, setDashboardSummary] = useState<DashboardSummary | null>(null)
  const [loading, setLoading] = useState(false)

  const showToast = useCallback((text: string) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, text }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const fetchSummary = useCallback(async () => {
    setLoading(true)
    try {
      const data = await DeadStockAPI.getDashboardSummary()
      if (data) {
        setDashboardSummary(data)
      }
    } catch (err) {
      // Resilient fallback
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRoleChange = useCallback((newRole: 'seller' | 'buyer') => {
    setRole(newRole)
    if (newRole === 'buyer') {
      setActiveTab('marketplace')
    } else {
      setActiveTab('dashboard')
    }
  }, [])

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  return {
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
    setDashboardSummary,
    loading,
    refetchSummary: fetchSummary,
    handleRoleChange,
  }
}

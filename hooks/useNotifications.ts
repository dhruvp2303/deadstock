'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, NotificationItem } from '@/lib/api'

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    type: 'risk_alert',
    severity: 'critical',
    title: 'Critical Risk: PCB Control Module v2',
    message: 'SKU PCB-401 has reached 94% risk score. Holding cost exceeds acceptable margin.',
    action_label: 'View SKU',
    is_read: false,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    type: 'buyer_match',
    severity: 'warning',
    title: 'High Compatibility Match (93%)',
    message: 'ElectroTech Industries requires 3,000 units of Polymer Connectors.',
    action_label: 'Review Match',
    is_read: false,
    created_at: new Date(Date.now() - 3600000).toISOString(),
  },
]

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(DEFAULT_NOTIFICATIONS)
  const [loading, setLoading] = useState(false)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const data = await DeadStockAPI.getNotifications()
      if (data && data.length > 0) {
        setNotifications(data)
      }
    } catch (err) {
      // Keep resilient fallback state
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(async (id: number) => {
    try {
      await DeadStockAPI.markNotificationAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    } catch (err) {
      // Local optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      )
    }
  }, [])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  return {
    notifications,
    setNotifications,
    loading,
    refetch: fetchNotifications,
    markAsRead,
  }
}

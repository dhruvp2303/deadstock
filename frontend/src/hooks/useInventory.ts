'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, InventoryItem } from '@/lib/api'

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getInventory()
      if (Array.isArray(data)) {
        setInventory(data)
      } else {
        setInventory([])
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch inventory')
      setInventory([])
    } finally {
      setLoading(false)
    }
  }, [])

  const archiveItem = useCallback(async (item: InventoryItem) => {
    try {
      await DeadStockAPI.archiveInventory(item.id)
      setInventory((prev) => prev.filter((i) => i.id !== item.id))
      return true
    } catch (err) {
      return false
    }
  }, [])

  useEffect(() => {
    fetchInventory()
  }, [fetchInventory])

  return {
    inventory,
    setInventory,
    loading,
    error,
    refetch: fetchInventory,
    archiveItem,
  }
}

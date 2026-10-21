'use client'

import { useState, useCallback, useEffect } from 'react'
import { CategoryItem, DeadStockAPI, WarehouseItem } from '@/lib/api'

export function useMasterData() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([])
  const [loading, setLoading] = useState(false)

  const fetchMasterData = useCallback(async () => {
    setLoading(true)
    try {
      const [cats, whs] = await Promise.all([
        DeadStockAPI.getCategories(),
        DeadStockAPI.getWarehouses(),
      ])
      if (Array.isArray(cats)) setCategories(cats)
      if (Array.isArray(whs)) setWarehouses(whs)
    } catch (err) {
      // Keep state clean
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMasterData()
  }, [fetchMasterData])

  return {
    categories,
    warehouses,
    loading,
    refetch: fetchMasterData,
  }
}

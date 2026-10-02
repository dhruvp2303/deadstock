'use client'

import { useState, useCallback, useEffect } from 'react'
import { CategoryItem, DeadStockAPI, WarehouseItem } from '@/lib/api'

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 1, name: 'Mechanical Components', slug: 'mechanical-components', default_decay_rate: 0.08 },
  { id: 2, name: 'Electronics & PCB', slug: 'electronics-pcb', default_decay_rate: 0.15 },
  { id: 3, name: 'Packaging & Cartons', slug: 'packaging-cartons', default_decay_rate: 0.04 },
  { id: 4, name: 'Industrial Hardware', slug: 'industrial-hardware', default_decay_rate: 0.05 },
  { id: 5, name: 'Raw Materials & Polymers', slug: 'raw-materials-polymers', default_decay_rate: 0.06 },
]

export const DEFAULT_WAREHOUSES: WarehouseItem[] = [
  { id: 1, company_id: 1, name: 'Ahmedabad Depot', city: 'Ahmedabad', state: 'GJ' },
  { id: 2, company_id: 1, name: 'Surat Warehouse', city: 'Surat', state: 'GJ' },
  { id: 3, company_id: 1, name: 'Nagpur Center', city: 'Nagpur', state: 'MH' },
  { id: 4, company_id: 1, name: 'Pune Regional Hub', city: 'Pune', state: 'MH' },
]

export function useMasterData() {
  const [categories, setCategories] = useState<CategoryItem[]>(DEFAULT_CATEGORIES)
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>(DEFAULT_WAREHOUSES)
  const [loading, setLoading] = useState(false)

  const fetchMasterData = useCallback(async () => {
    setLoading(true)
    try {
      const [cats, whs] = await Promise.all([
        DeadStockAPI.getCategories(),
        DeadStockAPI.getWarehouses(),
      ])
      if (cats && cats.length > 0) setCategories(cats)
      if (whs && whs.length > 0) setWarehouses(whs)
    } catch (err) {
      // Fallback to default presets
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

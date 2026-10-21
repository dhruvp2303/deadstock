'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, MarketplaceItem } from '@/lib/api'

export function useMarketplace() {
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketplace = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getMarketplace()
      if (Array.isArray(data)) {
        setMarketplace(data)
      } else {
        setMarketplace([])
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch marketplace listings')
      setMarketplace([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMarketplace()
  }, [fetchMarketplace])

  return {
    marketplace,
    setMarketplace,
    loading,
    error,
    refetch: fetchMarketplace,
  }
}

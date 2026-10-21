'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, OfferItem } from '@/lib/api'

export function useOffers() {
  const [offers, setOffers] = useState<OfferItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getOffers()
      if (Array.isArray(data)) {
        setOffers(data)
      } else {
        setOffers([])
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch offers')
      setOffers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOffers()
  }, [fetchOffers])

  return {
    offers,
    setOffers,
    loading,
    error,
    refetch: fetchOffers,
  }
}

'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, BuyerMatchItem } from '@/lib/api'

export function useBuyerMatches() {
  const [matches, setMatches] = useState<BuyerMatchItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getMatches()
      if (Array.isArray(data)) {
        setMatches(data)
      } else {
        setMatches([])
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch matches')
      setMatches([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMatches()
  }, [fetchMatches])

  return {
    matches,
    setMatches,
    loading,
    error,
    refetch: fetchMatches,
  }
}

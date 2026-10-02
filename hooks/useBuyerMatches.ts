'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, BuyerMatchItem } from '@/lib/api'

export const DEFAULT_MATCHES: BuyerMatchItem[] = [
  {
    id: 1,
    name: 'ElectroTech Industries',
    match: '93%',
    match_score: 93,
    units: '3,000 units req',
    required_units: 3000,
    location: 'Ahmedabad Depot (Direct)',
    value: '₹2.4L deal',
    potential_deal_value: 240000,
    note: 'Verified compatibility with industrial connector batch.',
    tags: ['Direct Sourcing', 'High Velocity', 'Escrow Ready'],
    breakdown: {
      product_compatibility: '96%',
      quantity_compatibility: '92%',
      industry: '95%',
      location: '96%',
      price: '88%',
      overall: '93%',
    },
  },
  {
    id: 2,
    name: 'Nova Components Ltd.',
    match: '87%',
    match_score: 87,
    units: '1,200 units req',
    required_units: 1200,
    location: 'Bengaluru (Logistics Hub)',
    value: '₹1.9L deal',
    potential_deal_value: 190000,
    note: 'High demand for PCB modules.',
    tags: ['Verified Buyer', 'Regular Partner'],
    breakdown: {
      product_compatibility: '90%',
      quantity_compatibility: '85%',
      industry: '92%',
      location: '80%',
      price: '85%',
      overall: '87%',
    },
  },
  {
    id: 3,
    name: 'Apex Precision Controls',
    match: '81%',
    match_score: 81,
    units: '8,000 units req',
    required_units: 8000,
    location: 'Pune Center (Hub)',
    value: '₹1.4L deal',
    potential_deal_value: 140000,
    note: 'Immediate absorption capacity.',
    tags: ['Bulk Buyer'],
    breakdown: {
      product_compatibility: '84%',
      quantity_compatibility: '80%',
      industry: '88%',
      location: '75%',
      price: '80%',
      overall: '81%',
    },
  },
]

export function useBuyerMatches() {
  const [matches, setMatches] = useState<BuyerMatchItem[]>(DEFAULT_MATCHES)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMatches = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getMatches()
      if (data && data.length > 0) {
        setMatches(data)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch matches')
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

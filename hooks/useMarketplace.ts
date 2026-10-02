'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, MarketplaceItem } from '@/lib/api'

export const DEFAULT_MARKETPLACE: MarketplaceItem[] = [
  {
    id: 1,
    title: 'Surplus Precision Connectors Batch',
    category: 'Mechanical',
    units: '3,000 units',
    units_available: 3000,
    price: '₹1.1L',
    price_per_unit: 38,
    match: '93% match',
    location: 'Ahmedabad Warehouse',
    action: 'Buy Lot',
    condition: 'NEW_SEALED',
    seller_company: 'Apex Precision Engineering',
  },
  {
    id: 2,
    title: 'Excess PCB Control Sub-modules',
    category: 'Electronics',
    units: '1,200 units',
    units_available: 1200,
    price: '₹4.8L',
    price_per_unit: 400,
    match: '87% match',
    location: 'Surat Center',
    action: 'Make Offer',
    condition: 'OEM_OVERSTOCK',
    seller_company: 'Nexis Microelectronics',
  },
  {
    id: 3,
    title: 'Heavy Duty Industrial Cartons',
    category: 'Packaging',
    units: '10,000 units',
    units_available: 10000,
    price: '₹1.5L',
    price_per_unit: 15,
    match: '79% match',
    location: 'Nagpur Depot',
    action: 'Buy Lot',
    condition: 'EXCESS_SURPLUS',
    seller_company: 'Kiran Packaging Corp',
  },
]

export function useMarketplace() {
  const [marketplace, setMarketplace] = useState<MarketplaceItem[]>(DEFAULT_MARKETPLACE)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMarketplace = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getMarketplace()
      if (data && data.length > 0) {
        setMarketplace(data)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch marketplace listings')
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

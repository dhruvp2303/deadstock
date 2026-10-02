'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, OfferItem } from '@/lib/api'

export const DEFAULT_OFFERS: OfferItem[] = [
  {
    id: 1,
    listing_id: 1,
    seller_company_id: 1,
    buyer_company_id: 2,
    offered_price_per_unit: 38,
    offered_quantity: 3000,
    total_offer_amount: 114000,
    escrow_term: 'Standard (48h Escrow)',
    status: 'pending',
    notes: 'Urgent acquisition for assembly plant batch.',
    seller_company_name: 'Apex Precision Engineering',
    buyer_company_name: 'ElectroTech Industries',
    listing_title: 'Precision Polymer Connectors 20mm',
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    listing_id: 2,
    seller_company_id: 2,
    buyer_company_id: 3,
    offered_price_per_unit: 400,
    offered_quantity: 1200,
    total_offer_amount: 480000,
    escrow_term: 'Immediate Inspection Escrow',
    status: 'countered',
    counter_price: 420,
    notes: 'Counter offer proposed for complete lot pickup.',
    seller_company_name: 'Nexis Microelectronics',
    buyer_company_name: 'Nova Components Ltd.',
    listing_title: 'PCB Control Module v2 Surplus',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
]

export function useOffers() {
  const [offers, setOffers] = useState<OfferItem[]>(DEFAULT_OFFERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOffers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getOffers()
      if (data && data.length > 0) {
        setOffers(data)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch offers')
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

'use client'

import { useState, useCallback, useEffect } from 'react'
import { DeadStockAPI, InventoryItem } from '@/lib/api'

export const DEFAULT_INVENTORY: InventoryItem[] = [
  {
    id: 1,
    product: 'Precision Polymer Connector 20mm',
    sku: 'PC2048',
    qty: '4,500',
    quantity: 4500,
    value: '₹1.8L',
    current_value: 180000,
    unit_cost: 40,
    age: '11 mo',
    age_months: 11,
    demand: '1,100',
    monthly_demand: 1100,
    risk: '87%',
    risk_score: 87,
    risk_level: 'CRITICAL',
    action: 'Find Buyer',
    tone: 'red',
    category: 'Mechanical Components',
    warehouse: 'Ahmedabad Depot',
    ai_explanation: "This item's risk is 87 (CRITICAL) because stock quantity is 4.1x expected demand, inventory age has reached 11 months, and sales velocity dropped 62%.",
  },
  {
    id: 2,
    product: 'PCB Control Module v2',
    sku: 'PCB-401',
    qty: '1,200',
    quantity: 1200,
    value: '₹6.4L',
    current_value: 640000,
    unit_cost: 533.33,
    age: '14 mo',
    age_months: 14,
    demand: '480',
    monthly_demand: 480,
    risk: '94%',
    risk_score: 94,
    risk_level: 'CRITICAL',
    action: 'Urgent Liquidation',
    tone: 'red',
    category: 'Electronics & PCB',
    warehouse: 'Surat Warehouse',
    ai_explanation: "This item's risk is 94 (CRITICAL) because component obsolescence is imminent and stock exceeds 2.5x annual turnover.",
  },
  {
    id: 3,
    product: 'Heavy Duty Packaging Box',
    sku: 'PKG-118',
    qty: '12,000',
    quantity: 12000,
    value: '₹2.1L',
    current_value: 210000,
    unit_cost: 17.5,
    age: '8 mo',
    age_months: 8,
    demand: '5,200',
    monthly_demand: 5200,
    risk: '71%',
    risk_score: 71,
    risk_level: 'HIGH',
    action: 'Discount Sale',
    tone: 'amber',
    category: 'Packaging & Cartons',
    warehouse: 'Nagpur Center',
    ai_explanation: "This item's risk is 71 (HIGH) because storage holding costs exceed standard margin thresholds.",
  },
  {
    id: 4,
    product: 'Steel Bolt M8 High Tensile',
    sku: 'SBM8-22',
    qty: '8,200',
    quantity: 8200,
    value: '₹3.2L',
    current_value: 320000,
    unit_cost: 39,
    age: '5 mo',
    age_months: 5,
    demand: '3,400',
    monthly_demand: 3400,
    risk: '28%',
    risk_score: 28,
    risk_level: 'LOW',
    action: 'Monitor',
    tone: 'green',
    category: 'Industrial Hardware',
    warehouse: 'Ahmedabad Depot',
    ai_explanation: "This item's risk is 28 (LOW) because inventory velocity is within normal operational turnover.",
  },
]

export function useInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>(DEFAULT_INVENTORY)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInventory = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await DeadStockAPI.getInventory()
      if (data && data.length > 0) {
        setInventory(data)
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to fetch inventory')
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

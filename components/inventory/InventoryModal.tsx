'use client'

import React, { useState, useEffect } from 'react'
import { X, Sparkles, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react'
import { InventoryItem, DeadStockAPI } from '@/lib/api'
import { useMasterData } from '@/hooks/useMasterData'

interface InventoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  itemToEdit?: InventoryItem | null
}

export const InventoryModal: React.FC<InventoryModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  itemToEdit,
}) => {
  const { categories, warehouses } = useMasterData()

  const [sku, setSku] = useState('')
  const [productName, setProductName] = useState('')
  const [categoryId, setCategoryId] = useState<number | undefined>(1)
  const [categoryName, setCategoryName] = useState('Mechanical Components')
  const [warehouseId, setWarehouseId] = useState<number | undefined>(1)
  const [warehouseLocation, setWarehouseLocation] = useState('Ahmedabad Depot')
  const [quantity, setQuantity] = useState<number>(1000)
  const [unitCost, setUnitCost] = useState<number>(50)
  const [monthlyDemand, setMonthlyDemand] = useState<number>(150)
  const [ageMonths, setAgeMonths] = useState<number>(6)
  const [material, setMaterial] = useState('High Density Polymer')
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (itemToEdit) {
      setSku(itemToEdit.sku)
      setProductName(itemToEdit.product)
      setCategoryId(itemToEdit.category_id || categories[0]?.id || 1)
      setCategoryName(itemToEdit.category || categories[0]?.name || 'Mechanical Components')
      setWarehouseId(itemToEdit.warehouse_id || warehouses[0]?.id || 1)
      setWarehouseLocation(itemToEdit.warehouse || warehouses[0]?.name || 'Ahmedabad Depot')
      setQuantity(itemToEdit.quantity || 1000)
      setUnitCost(itemToEdit.unit_cost || 50)
      setMonthlyDemand(itemToEdit.monthly_demand || 150)
      setAgeMonths(itemToEdit.age_months || 6)
      setMaterial(itemToEdit.material || 'Standard Industrial Material')
    } else {
      setSku(`SKU-${Math.floor(1000 + Math.random() * 9000)}`)
      setProductName('')
      setCategoryId(categories[0]?.id || 1)
      setCategoryName(categories[0]?.name || 'Mechanical Components')
      setWarehouseId(warehouses[0]?.id || 1)
      setWarehouseLocation(warehouses[0]?.name || 'Ahmedabad Depot')
      setQuantity(2500)
      setUnitCost(45)
      setMonthlyDemand(200)
      setAgeMonths(8)
      setMaterial('ABS Molded Polymer')
    }
    setErrorMessage(null)
  }, [itemToEdit, isOpen, categories, warehouses])

  if (!isOpen) return null

  // Estimated Months of Supply
  const mos = monthlyDemand > 0 ? (quantity / monthlyDemand).toFixed(1) : '∞'
  const estimatedValuation = (quantity * unitCost).toLocaleString()

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value)
    setCategoryId(selectedId)
    const found = categories.find((c) => c.id === selectedId)
    if (found) setCategoryName(found.name)
  }

  const handleWarehouseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value)
    setWarehouseId(selectedId)
    const found = warehouses.find((w) => w.id === selectedId)
    if (found) setWarehouseLocation(found.name)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)

    try {
      if (itemToEdit) {
        const res = await DeadStockAPI.updateInventory(itemToEdit.id, {
          product_name: productName,
          category: categoryName,
          category_id: categoryId,
          quantity,
          unit_cost: unitCost,
          monthly_demand: monthlyDemand,
          age_months: ageMonths,
          material,
          warehouse_location: warehouseLocation,
          warehouse_id: warehouseId,
        })
        if (res?.success !== false) {
          onSuccess()
          onClose()
        } else {
          setErrorMessage(res?.message || 'Failed to update SKU')
        }
      } else {
        const res = await DeadStockAPI.addInventory({
          sku,
          product_name: productName,
          category: categoryName,
          category_id: categoryId,
          quantity,
          unit_cost: unitCost,
          monthly_demand: monthlyDemand,
          age_months: ageMonths,
          material,
          warehouse_location: warehouseLocation,
          warehouse_id: warehouseId,
        })
        if (res?.success !== false) {
          onSuccess()
          onClose()
        } else {
          setErrorMessage(res?.message || 'Failed to create SKU')
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {itemToEdit ? `Edit SKU: ${itemToEdit.sku}` : 'Add Inventory SKU'}
            </h3>
            <p className="text-xs text-zinc-500">
              {itemToEdit
                ? 'Update specifications to re-calculate risk scores & buyer fits.'
                : 'Enter stock attributes to automatically run AI dead-stock risk analysis.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {errorMessage && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                SKU Identifier *
              </label>
              <input
                type="text"
                required
                disabled={!!itemToEdit}
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Normalized Category *
              </label>
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.default_decay_rate ? `(${Math.round(c.default_decay_rate * 100)}% decay/mo)` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Precision Polymer Connector 20mm"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Quantity (Units) *
              </label>
              <input
                type="number"
                required
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Unit Cost (₹) *
              </label>
              <input
                type="number"
                required
                min={0.01}
                step={0.01}
                value={unitCost}
                onChange={(e) => setUnitCost(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Mo. Demand *
              </label>
              <input
                type="number"
                required
                min={0}
                value={monthlyDemand}
                onChange={(e) => setMonthlyDemand(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Stock Age (Months)
              </label>
              <input
                type="number"
                min={0}
                value={ageMonths}
                onChange={(e) => setAgeMonths(Number(e.target.value))}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-mono focus:border-zinc-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Assigned Warehouse
              </label>
              <select
                value={warehouseId}
                onChange={handleWarehouseChange}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:outline-none"
              >
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} {w.city ? `(${w.city})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Material Specification
            </label>
            <input
              type="text"
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              placeholder="e.g. ABS Molded Polymer / Stainless Steel 316"
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          {/* Real-time Indicator Preview */}
          <div className="rounded-lg border border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/30 p-3 text-xs">
            <div className="flex items-center justify-between text-indigo-900 dark:text-indigo-300 font-semibold mb-1">
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Live Parameter Analysis
              </span>
              <span className="font-mono">Total Value: ₹{estimatedValuation}</span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
              Supply buffer is estimated at <strong className="text-zinc-900 dark:text-zinc-100">{mos} months</strong> of inventory.
              Risk engine will compute velocity decay and buyer fit upon submission.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !productName}
              className="flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-1.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all disabled:opacity-50 shadow-sm"
            >
              {submitting ? (
                <>
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
                  <span>Analyzing...</span>
                </>
              ) : itemToEdit ? (
                'Save Changes'
              ) : (
                'Add SKU & Analyze'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

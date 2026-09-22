'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  RotateCcw,
  Tag,
  Recycle,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Building2,
} from 'lucide-react'
import { InventoryItem, DeadStockAPI } from '@/lib/api'

interface RecoveryDrawerProps {
  isOpen: boolean
  onClose: () => void
  item: InventoryItem | null
  onSuccess: () => void
}

export const RecoveryDrawer: React.FC<RecoveryDrawerProps> = ({
  isOpen,
  onClose,
  item,
  onSuccess,
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<string>('sell')
  const [dealAmount, setDealAmount] = useState<number>(0)
  const [recoverQty, setRecoverQty] = useState<number>(0)
  const [executing, setExecuting] = useState(false)
  const [executionResult, setExecutionResult] = useState<any | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (item) {
      const q = Number(item.quantity) || 1000
      const c = Number(item.unit_cost) || 50
      const baseVal = q * c
      setRecoverQty(q)
      setDealAmount(Math.round(baseVal * 0.9))
      setSelectedStrategy('sell')
      setExecutionResult(null)
      setErrorMessage(null)
    }
  }, [item, isOpen])

  if (!isOpen || !item) return null

  const unitCost = Number(item.unit_cost) || 40
  const qty = Number(item.quantity) || 1000
  const currentVal = qty * unitCost

  const strategies = [
    {
      id: 'sell',
      title: 'Sell (B2B Match)',
      multiplier: 0.92,
      timeline: '7-14 days',
      icon: DollarSign,
      color: 'emerald',
      description: 'Liquidate batch directly to high-confidence matched B2B manufacturing buyer.',
      recommended: true,
    },
    {
      id: 'transfer',
      title: 'Transfer (Branch)',
      multiplier: 0.85,
      timeline: '3-5 days',
      icon: Truck,
      color: 'blue',
      description: 'Relocate surplus to Ahmedabad or Pune warehouse with active regional consumption.',
      recommended: false,
    },
    {
      id: 'discount',
      title: 'Discount Flash Sale',
      multiplier: 0.75,
      timeline: '2-4 days',
      icon: Tag,
      color: 'amber',
      description: 'Publish on public DeadStock surplus marketplace at attractive 25% discount.',
      recommended: false,
    },
    {
      id: 'return',
      title: 'Supplier Restock',
      multiplier: 0.65,
      timeline: '14-21 days',
      icon: RotateCcw,
      color: 'zinc',
      description: 'Return to original component manufacturer under standard 35% restocking fee agreement.',
      recommended: false,
    },
    {
      id: 'recycle',
      title: 'Circular Recycle',
      multiplier: 0.35,
      timeline: '1-3 days',
      icon: Recycle,
      color: 'teal',
      description: 'Reclaim raw polymer/metal materials through accredited circular recycling partners.',
      recommended: false,
    },
  ]

  const activeStratObj = strategies.find((s) => s.id === selectedStrategy) || strategies[0]

  const handleStrategyChange = (stratId: string) => {
    setSelectedStrategy(stratId)
    const strat = strategies.find((s) => s.id === stratId)
    if (strat) {
      setDealAmount(Math.round(recoverQty * unitCost * strat.multiplier))
    }
  }

  const handleQtyChange = (newQty: number) => {
    const validQty = Math.max(1, Math.min(qty, newQty))
    setRecoverQty(validQty)
    setDealAmount(Math.round(validQty * unitCost * activeStratObj.multiplier))
  }

  const handleExecute = async () => {
    setExecuting(true)
    setErrorMessage(null)

    try {
      const res = await DeadStockAPI.executeRecovery({
        sku: item.sku,
        inventory_id: item.id,
        action_type: selectedStrategy,
        quantity: recoverQty,
        deal_amount: dealAmount,
        channel_notes: `Executed ${activeStratObj.title} for ${recoverQty} units.`,
      })

      if (res?.success) {
        setExecutionResult(res.data)
        onSuccess()
      } else {
        setErrorMessage(res?.message || 'Failed to complete recovery transaction.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred during transaction execution.')
    } finally {
      setExecuting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="h-full w-full max-w-xl border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-indigo-600 dark:text-indigo-400">
                  {item.sku}
                </span>
                <span className="text-xs text-zinc-500">• {item.category}</span>
              </div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1">
                {item.product}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
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

          {executionResult ? (
            /* Success View */
            <div className="mt-8 text-center space-y-4 animate-in fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Recovery Deal Completed
                </h4>
                <p className="text-xs text-zinc-500 mt-1">
                  ₹{dealAmount.toLocaleString()} recovered into company capital. Inventory decremented and movement logged.
                </p>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-500">Transaction Ref:</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
                    {executionResult.transaction?.reference_no || 'TXN-CONFIRMED'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Units Liquidated:</span>
                  <span className="font-mono">{recoverQty.toLocaleString()} units</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Remaining In Stock:</span>
                  <span className="font-mono">{executionResult.updated_inventory?.remaining_quantity ?? 0} units</span>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-lg bg-zinc-900 dark:bg-zinc-100 py-2.5 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
              >
                Close & Return to Dashboard
              </button>
            </div>
          ) : (
            /* Strategy Picker & Execution */
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Select Recovery Channel
                </label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {strategies.map((strat) => {
                    const Icon = strat.icon
                    const isSelected = selectedStrategy === strat.id
                    const estRecovery = Math.round(recoverQty * unitCost * strat.multiplier)

                    return (
                      <div
                        key={strat.id}
                        onClick={() => handleStrategyChange(strat.id)}
                        className={`cursor-pointer rounded-xl border p-3 transition-all ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50/40 dark:bg-indigo-950/40 shadow-xs'
                            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Icon className={`h-4 w-4 ${isSelected ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                            <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                              {strat.title}
                            </span>
                            {strat.recommended && (
                              <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                                AI Recommended
                              </span>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-mono font-bold text-zinc-900 dark:text-zinc-100">
                              ₹{estRecovery.toLocaleString()}
                            </span>
                            <span className="block text-[10px] text-zinc-400 font-mono">
                              ({Math.round(strat.multiplier * 100)}% recovery)
                            </span>
                          </div>
                        </div>
                        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                          {strat.description} • <strong className="text-zinc-700 dark:text-zinc-300">Timeline: {strat.timeline}</strong>
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Recovery Parameters Tuning */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-4 space-y-3">
                <div className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center justify-between">
                  <span>Execution Parameters</span>
                  <span className="text-[11px] text-zinc-500">Max in stock: {qty.toLocaleString()} units</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">Units to Recover</label>
                    <input
                      type="number"
                      min={1}
                      max={qty}
                      value={recoverQty}
                      onChange={(e) => handleQtyChange(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-500 mb-1">Deal Amount (₹)</label>
                    <input
                      type="number"
                      min={1}
                      value={dealAmount}
                      onChange={(e) => setDealAmount(Number(e.target.value))}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1.5 text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        {!executionResult && (
          <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">Total Capital Recovered</span>
              <span className="text-base font-mono font-bold text-zinc-900 dark:text-zinc-100">
                ₹{dealAmount.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={executing || recoverQty <= 0}
                onClick={handleExecute}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all disabled:opacity-50"
              >
                {executing ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Executing Transaction...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Execute Recovery Deal</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

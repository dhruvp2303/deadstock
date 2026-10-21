'use client'

import React, { useState } from 'react'
import {
  X,
  FileSpreadsheet,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Database,
} from 'lucide-react'
import { DeadStockAPI } from '@/lib/api'

interface CsvImportModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

interface ParsedRow {
  sku: string
  product_name: string
  category: string
  quantity: number
  unit_cost: number
  monthly_demand: number
  age_months: number
  warehouse: string
  isValid: boolean
  errorReason?: string
}

const SAMPLE_CSV_DATA = `SKU,Product Name,Category,Quantity,Unit Cost,Monthly Demand,Age Months,Warehouse
PC-8801,Precision Polymer Connector 20mm,Mechanical Components,4500,40,1100,11,Ahmedabad Depot
SBM8-22,Steel Bolt M8 High Tensile,Industrial Hardware,8200,39,3400,5,Ahmedabad Depot
PCB-401,PCB Control Module v2,Electronics & PCB,1200,533.33,480,14,Surat Warehouse
PKG-118,Heavy Duty Packaging Box,Packaging & Cartons,12000,17.5,5200,8,Nagpur Center
HYD-VALVE-09,Hydraulic Relief Valve 15mm,Mechanical Components,850,220,90,16,Ahmedabad Depot
EPX-RESIN-25,Epoxy Resin Sealant Grade-A,Plastic & Polymers,-200,150,50,4,Central Depot
RAW-COPPER-W,Braided Copper Ground Wire,Industrial Hardware,3200,0,800,2,Surat Warehouse`

export const CsvImportModal: React.FC<CsvImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [rawText, setRawText] = useState<string>(SAMPLE_CSV_DATA)
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importSummary, setImportSummary] = useState<any | null>(null)

  if (!isOpen) return null

  const handleParse = () => {
    const lines = rawText.trim().split('\n')
    if (lines.length <= 1) return

    const rows: ParsedRow[] = []
    const header = lines[0].split(',').map((h) => h.trim().toLowerCase())

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(',').map((c) => c.trim())
      if (cols.length < 5) continue

      const sku = cols[0] || `SKU-IMP-${i}`
      const productName = cols[1] || 'Imported SKU'
      const category = cols[2] || 'Mechanical Components'
      const quantity = parseFloat(cols[3] || '0')
      const unitCost = parseFloat(cols[4] || '0')
      const monthlyDemand = parseFloat(cols[5] || '100')
      const ageMonths = parseFloat(cols[6] || '6')
      const warehouse = cols[7] || 'Main Depot'

      let isValid = true
      let errorReason: string | undefined = undefined

      if (isNaN(quantity) || quantity <= 0) {
        isValid = false
        errorReason = `Invalid quantity (${cols[3]})`
      } else if (isNaN(unitCost) || unitCost <= 0) {
        isValid = false
        errorReason = `Invalid unit cost (${cols[4]})`
      } else if (!productName || productName.length < 2) {
        isValid = false
        errorReason = 'Missing product name'
      }

      rows.push({
        sku,
        product_name: productName,
        category,
        quantity: Math.max(0, quantity),
        unit_cost: Math.max(0, unitCost),
        monthly_demand: Math.max(0, monthlyDemand),
        age_months: Math.max(0, ageMonths),
        warehouse,
        isValid,
        errorReason,
      })
    }

    setParsedRows(rows)
    setStep(2)
  }

  const validRows = parsedRows.filter((r) => r.isValid)
  const invalidRows = parsedRows.filter((r) => !r.isValid)

  const handleConfirmImport = async () => {
    setImporting(true)
    setStep(3)

    try {
      const payload = validRows.map((r) => ({
        sku: r.sku,
        product_name: r.product_name,
        category: r.category,
        quantity: r.quantity,
        unit_cost: r.unit_cost,
        monthly_demand: r.monthly_demand,
        age_months: r.age_months,
        warehouse: r.warehouse,
      }))

      const res = await DeadStockAPI.importInventory(payload)
      if (res?.success) {
        setImportSummary(res.summary)
        setTimeout(() => {
          onSuccess()
        }, 800)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setImporting(false)
    }
  }

  const handleReset = () => {
    setStep(1)
    setImportSummary(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6]">
              <FileSpreadsheet className="h-4.5 w-4.5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Bulk Inventory Importer (CSV / ERP)
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">
                Validate row-by-row before executing background risk analysis.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step 1: Input / Paste CSV */}
        {step === 1 && (
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  CSV Raw Content (or paste from ERP exports)
                </label>
                <button
                  type="button"
                  onClick={() => setRawText(SAMPLE_CSV_DATA)}
                  className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Load Sample Dataset
                </button>
              </div>
              <textarea
                rows={8}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 font-mono text-xs text-zinc-800 dark:text-zinc-200 focus:border-zinc-500 focus:outline-none leading-relaxed"
                placeholder="Paste comma-separated data here..."
              />
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3">
              <span className="text-[11px] text-zinc-500">
                Supports columns: SKU, Product Name, Category, Quantity, Unit Cost, Demand, Age, Warehouse
              </span>
              <button
                type="button"
                onClick={handleParse}
                className="flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-4 py-2 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-sm"
              >
                <span>Validate & Preview Rows</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Row-level Validation Preview */}
        {step === 2 && (
          <div className="mt-4 space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-xs">
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="h-4 w-4" />
                <span>{validRows.length} Valid Rows</span>
              </div>
              {invalidRows.length > 0 && (
                <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-semibold border-l border-zinc-200 dark:border-zinc-700 pl-3">
                  <AlertCircle className="h-4 w-4" />
                  <span>{invalidRows.length} Invalid (Will be skipped)</span>
                </div>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto rounded-lg border border-zinc-200 dark:border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-100/70 dark:bg-zinc-900 text-zinc-500 font-semibold sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">SKU</th>
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3 text-right">Qty</th>
                    <th className="py-2 px-3 text-right">Cost</th>
                    <th className="py-2 px-3">Validation Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {parsedRows.map((r, i) => (
                    <tr
                      key={i}
                      className={r.isValid ? 'hover:bg-zinc-50 dark:hover:bg-zinc-900/50' : 'bg-rose-50/40 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300'}
                    >
                      <td className="py-2 px-3">
                        {r.isValid ? (
                          <span className="inline-flex items-center rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                            VALID
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400">
                            ERROR
                          </span>
                        )}
                      </td>
                      <td className="py-2 px-3 font-mono">{r.sku}</td>
                      <td className="py-2 px-3 font-medium">{r.product_name}</td>
                      <td className="py-2 px-3 text-right font-mono">{r.quantity.toLocaleString()}</td>
                      <td className="py-2 px-3 text-right font-mono">₹{r.unit_cost}</td>
                      <td className="py-2 px-3 text-[11px] text-zinc-500">
                        {r.errorReason || 'Ready for risk engine'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-3.5">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Back to Edit
              </button>
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={validRows.length === 0}
                className="flex items-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>Import {validRows.length} Rows & Run AI Analysis</span>
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Analysis & Complete Progress */}
        {step === 3 && (
          <div className="py-8 text-center space-y-4">
            {importing ? (
              <div className="flex flex-col items-center justify-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent" />
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Running Risk Index & Buyer Match Engine...
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Analyzing demand velocity, decay curves, and sourcing counterparty fit in background.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    Import & Risk Analysis Completed
                  </h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    {importSummary?.imported_count || validRows.length} SKUs imported into company inventory with active risk scoring.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200"
                >
                  View Inventory Dashboard
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

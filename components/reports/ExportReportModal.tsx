'use client'

import React, { useState } from 'react'
import { X, FileText, Download, Printer, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react'
import { InventoryItem } from '@/lib/api'
import { Logo } from '@/components/brand/Logo'

interface ExportReportModalProps {
  isOpen: boolean
  onClose: () => void
  inventory: InventoryItem[]
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  isOpen,
  onClose,
  inventory,
}) => {
  const [downloading, setDownloading] = useState(false)
  const [exported, setExported] = useState(false)

  if (!isOpen) return null

  const totalVal = inventory.reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const atRiskVal = inventory
    .filter((i) => i.risk_level === 'CRITICAL' || i.risk_level === 'HIGH')
    .reduce((acc, i) => acc + (Number(i.current_value) || 0), 0)
  const recoverableVal = Math.round(atRiskVal * 0.88)
  const criticalItems = inventory.filter((i) => i.risk_level === 'CRITICAL')

  const handlePrint = () => {
    window.print()
  }

  const handleDownloadJSON = () => {
    setDownloading(true)
    const reportData = {
      report_title: 'DeadStock Inventory Recovery & Risk Audit',
      generated_at: new Date().toISOString(),
      summary: {
        total_tracked_inventory_valuation: totalVal,
        at_risk_working_capital: atRiskVal,
        estimated_recoverable_capital: recoverableVal,
        total_skus: inventory.length,
        critical_risk_skus_count: criticalItems.length,
      },
      critical_inventory_items: criticalItems,
      all_inventory: inventory,
      sustainability: {
        scope3_solid_waste_avoided_tons: 14.8,
        circular_recovery_rate: '88.4%',
      },
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `DeadStock-Recovery-Audit-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    setTimeout(() => {
      setDownloading(false)
      setExported(true)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-teal-500/10 text-[#0D9488] flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Export Executive Recovery Audit Report
              </h3>
              <span className="text-xs text-zinc-400 font-mono">Scope-3 & Balance Sheet Audit</span>
            </div>
          </div>

          <button onClick={onClose} className="rounded-xl p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Printable Report Preview */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-6 space-y-5 text-xs">
          <div className="flex items-center justify-between border-b border-zinc-200/80 dark:border-zinc-800 pb-4">
            <Logo size="sm" withTagline={true} />
            <div className="text-right">
              <span className="font-mono text-[11px] text-zinc-400 block">AUDIT-REF: #DS-{Date.now().toString().slice(-6)}</span>
              <span className="text-[11px] text-zinc-500">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* Aggregated KPI Summary */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">Total Valuation</span>
              <span className="text-base font-bold font-mono text-zinc-900 dark:text-zinc-100">
                ₹{(totalVal / 100000).toFixed(2)}L
              </span>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200/80 dark:border-zinc-800">
              <span className="text-[10px] text-zinc-400 uppercase font-bold block">At-Risk Capital</span>
              <span className="text-base font-bold font-mono text-rose-600">
                ₹{(atRiskVal / 100000).toFixed(2)}L
              </span>
            </div>

            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-500/20">
              <span className="text-[10px] text-teal-700 dark:text-teal-400 uppercase font-bold block">Recoverable</span>
              <span className="text-base font-bold font-mono text-[#0D9488] dark:text-[#14B8A6]">
                ₹{(recoverableVal / 100000).toFixed(2)}L
              </span>
            </div>
          </div>

          {/* Top Critical Risk Items List */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 block">
              Prioritized Critical SKUs ({criticalItems.length})
            </span>
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-800">
              {criticalItems.map((item) => (
                <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <span>{item.product}</span>
                      <span className="font-mono text-[10px] text-[#0D9488]">({item.sku})</span>
                    </div>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {item.quantity?.toLocaleString()} units • {item.warehouse}
                    </span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-rose-600 block">{item.risk_score}% Risk</span>
                    <span className="text-[10px] text-zinc-500">₹{(Number(item.current_value) / 100000).toFixed(2)}L</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Export CTAs */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100"
          >
            <Printer className="h-4 w-4" />
            <span>Print Audit Summary</span>
          </button>

          <button
            type="button"
            disabled={downloading}
            onClick={handleDownloadJSON}
            className="flex items-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-teal-600/20 disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>{downloading ? 'Generating Report...' : 'Download Full Audit JSON'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Bot,
  BarChart3,
  Package,
  Users,
  ShoppingBag,
  RotateCcw,
  ReceiptText,
  Leaf,
  MessageSquareText,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Warehouse,
} from 'lucide-react'

export const DashboardPreview: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  const [activeTab, setActiveTab] = useState('Dashboard')
  const [expandedRow, setExpandedRow] = useState<number | null>(1)

  const navItems = [
    { label: 'Dashboard', icon: BarChart3 },
    { label: 'Inventory & Risk', icon: Package },
    { label: 'Buyer Matches', icon: Users },
    { label: 'Marketplace', icon: ShoppingBag },
    { label: 'Recovery Center', icon: RotateCcw },
    { label: 'Transactions', icon: ReceiptText },
    { label: 'Sustainability', icon: Leaf },
  ]

  const riskRows = [
    {
      id: 1,
      sku: 'PC2048',
      name: 'Precision Polymer Connector 20mm',
      category: 'Mechanical Components',
      riskScore: 91,
      riskLevel: 'CRITICAL',
      atRiskCapital: '₹3.2L',
      units: '4,500 units',
      demandMultiple: '4.1x monthly consumption',
      age: '11 months',
      velocityDrop: '-62% QoQ',
      holdingCost: '₹14,200/mo',
      sustainability: '4.2 Tons CO₂ offset',
      remediation: 'Match with ElectroTech (93% compatibility) or Discount Flash 15%.',
    },
    {
      id: 2,
      sku: 'PCB-401',
      name: 'PCB Control Module v2 Micro-Controller',
      category: 'Electronics & PCB',
      riskScore: 94,
      riskLevel: 'CRITICAL',
      atRiskCapital: '₹6.4L',
      units: '1,200 units',
      demandMultiple: '3.8x baseline demand',
      age: '14 months',
      velocityDrop: '-78% QoQ (Obsolescence Warning)',
      holdingCost: '₹22,800/mo',
      sustainability: '1.8 Tons E-waste Diverted',
      remediation: 'Initiate urgent B2B counterparty liquidation to Nova Components.',
    },
    {
      id: 3,
      sku: 'PKG-118',
      name: 'Heavy Duty Corrugated Carton Box 4-Ply',
      category: 'Packaging & Cartons',
      riskScore: 71,
      riskLevel: 'HIGH',
      atRiskCapital: '₹2.1L',
      units: '12,000 units',
      demandMultiple: '2.3x warehouse velocity',
      age: '8 months',
      velocityDrop: '-35% QoQ',
      holdingCost: '₹9,400/mo',
      sustainability: '8.6 Tons Cardboard Recycled',
      remediation: 'Distribute across regional Maharashtra packaging hubs.',
    },
  ]

  return (
    <section id="analytics" className="py-20 sm:py-28 px-4 sm:px-6 relative overflow-hidden bg-gradient-to-b from-[#DCE8F7] via-[#EBF3FC] to-[#DDEAF8] scroll-mt-24">
      {/* Soft atmospheric ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-blue-300/30 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1340px] mx-auto space-y-8 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-blue-600/10 text-blue-900 border border-blue-300/40 shadow-sm backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-blue-700" />
            Live Enterprise Workspace Preview
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#0B1E2D] tracking-tight">
            Inventory Health & Analytics Dashboard
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-lg mx-auto">
            Full transparency into why stock is at risk, instant B2B buyer matchmaking, and Scope-3 sustainability tracking.
          </p>
        </div>

        {/* ── Main Dashboard Window ── */}
        <div
          className="relative mx-auto rounded-[28px] sm:rounded-[32px] overflow-hidden bg-white shadow-[0_25px_70px_rgba(15,40,70,0.18)] border border-white/80 transition-all duration-500"
          style={{ backdropFilter: 'blur(24px)' }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[620px]">

            {/* Dark Navy Left Sidebar */}
            <div className="lg:col-span-3 bg-[#081827] text-white p-6 sm:p-7 flex flex-col justify-between border-r border-white/5">
              <div>
                {/* Brand diamond logo */}
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="h-3.5 w-3.5 rotate-45 bg-teal-400" />
                  <span className="font-black text-base tracking-tight text-white">DeadStock</span>
                  <span className="text-[10px] font-mono font-bold text-amber-300 bg-amber-400/20 px-1.5 py-0.5 rounded">
                    PRO
                  </span>
                </div>

                {/* Nav Links */}
                <div className="space-y-1.5">
                  {navItems.map((item) => {
                    const Icon = item.icon
                    const isActive = activeTab === item.label
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => setActiveTab(item.label)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-white text-[#081827] shadow-md font-bold'
                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <span className="flex items-center gap-2 truncate">
                          <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#081827]' : 'text-teal-400'}`} />
                          {item.label}
                        </span>
                        {isActive && <div className="h-1.5 w-1.5 rounded-full bg-[#081827] shrink-0 ml-2" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bottom sidebar info */}
              <div className="pt-6 border-t border-white/10 hidden sm:block">
                <div className="flex items-center gap-2 text-[11px] text-gray-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                  <span className="truncate">AI Risk Engine · Live Sync Active</span>
                </div>
              </div>
            </div>

            {/* Main Dashboard Canvas */}
            <div className="lg:col-span-9 bg-[#F8FAFC] p-6 sm:p-8 flex flex-col justify-between gap-6">

              {/* Top Bar: Title + "Ask DeadStock AI" Button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-[#0B1E2D] tracking-tight">
                    Operations & Risk Overview
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Real-time valuation across 4 enterprise depot centers
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onGetStarted}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#081827] hover:bg-[#132A3E] text-white text-xs font-bold shadow-md transition-all self-start sm:self-auto hover:scale-105 shrink-0"
                >
                  <Bot className="h-3.5 w-3.5 text-teal-400" />
                  <span>Ask DeadStock Copilot</span>
                </button>
              </div>

              {/* Top 4 Key KPI Cards (Total Inventory, At-Risk, Recovered, Sustainability) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                {/* 1. Total inventory */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-all">
                  <span className="text-[11px] font-semibold text-gray-500 block">Total Inventory Tracked</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#0B1E2D] mt-1 block">₹2.4 Cr</span>
                  <span className="text-[10px] text-gray-400 font-mono">1,840 Active SKUs</span>
                </div>

                {/* 2. At risk */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-rose-100 hover:border-rose-200 transition-all">
                  <span className="text-[11px] font-semibold text-rose-600 block">At-Risk Capital</span>
                  <span className="text-2xl sm:text-3xl font-black text-[#E11D48] mt-1 block">₹38.6 L</span>
                  <span className="text-[10px] text-rose-500 font-mono">32 Critical Items</span>
                </div>

                {/* 3. Recovered Value */}
                <div className="bg-[#081827] text-white rounded-2xl p-4 shadow-md transition-all hover:bg-[#0E2337] border border-white/10">
                  <span className="text-[11px] font-semibold text-teal-200 block">Recovered Capital</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1 block">₹12.4 L</span>
                  <span className="text-[10px] text-slate-300 font-mono">94.8% Realization</span>
                </div>

                {/* 4. Sustainability Metric */}
                <div className="bg-emerald-50/80 rounded-2xl p-4 shadow-sm border border-emerald-200/80 transition-all">
                  <span className="text-[11px] font-semibold text-emerald-800 block">Scope-3 CO₂ Diverted</span>
                  <span className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1 block">142.5 T</span>
                  <span className="text-[10px] text-emerald-600 font-mono">Zero Landfill Index</span>
                </div>
              </div>

              {/* Expandable Transparency Panel: Why is stock at risk? */}
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#0B1E2D] block">
                      Why Stock is Risky — Root Cause Transparency
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Click any SKU below to inspect detailed holding costs, consumption ratio & AI remediation.
                    </span>
                  </div>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-bold">
                    Automated Risk Analysis
                  </span>
                </div>

                <div className="divide-y divide-gray-100 text-xs space-y-1">
                  {riskRows.map((row) => {
                    const isExp = expandedRow === row.id
                    return (
                      <div key={row.id} className="pt-2">
                        <button
                          type="button"
                          onClick={() => setExpandedRow(isExp ? null : row.id)}
                          className="w-full py-2.5 px-3 flex flex-wrap items-center justify-between gap-3 rounded-xl hover:bg-gray-50 text-left transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-gray-900">{row.sku}</span>
                            <span className="font-medium text-gray-700">{row.name}</span>
                          </div>

                          <div className="flex items-center gap-4">
                            <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[11px]">
                              Risk: {row.riskScore}% {row.riskLevel}
                            </span>
                            <span className="font-mono font-bold text-gray-900">{row.atRiskCapital}</span>
                            {isExp ? (
                              <ChevronUp className="h-4 w-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-gray-400" />
                            )}
                          </div>
                        </button>

                        {/* Expandable Explanation Drawer */}
                        {isExp && (
                          <div className="p-4 mx-2 mb-2 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3 animate-in fade-in duration-200">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-semibold block">Demand Multiple</span>
                                <span className="font-bold text-gray-800">{row.demandMultiple}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-semibold block">Inventory Age</span>
                                <span className="font-bold text-gray-800">{row.age}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-semibold block">Velocity Drop</span>
                                <span className="font-bold text-rose-600">{row.velocityDrop}</span>
                              </div>
                              <div className="bg-white p-2.5 rounded-lg border border-gray-100">
                                <span className="text-[10px] text-gray-400 font-semibold block">Monthly Holding Cost</span>
                                <span className="font-bold text-amber-700">{row.holdingCost}</span>
                              </div>
                            </div>

                            <div className="bg-blue-50/70 border border-blue-200/60 p-3 rounded-lg flex items-start gap-2.5">
                              <Bot className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                              <div className="text-xs">
                                <span className="font-bold text-blue-900 block">AI Recovery Recommendation:</span>
                                <p className="text-blue-800 mt-0.5">{row.remediation}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  )
}



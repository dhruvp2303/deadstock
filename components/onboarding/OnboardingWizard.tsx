'use client'

import React, { useState } from 'react'
import {
  Building2,
  MapPin,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  PackagePlus,
  Users,
  TrendingUp,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

interface OnboardingWizardProps {
  role: 'seller' | 'buyer'
  initialCompanyName?: string
  onComplete: (data: { companyName: string; industry: string; location: string; currency: string }) => void
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  role,
  initialCompanyName = 'ABC Plastics Ltd.',
  onComplete,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [companyName, setCompanyName] = useState(initialCompanyName)
  const [industry, setIndustry] = useState('Industrial Plastics & Polymers')
  const [currency, setCurrency] = useState('INR (₹)')
  const [location, setLocation] = useState('Ahmedabad Central Depot')
  const [categories, setCategories] = useState<string[]>(['Mechanical Components', 'Plastic & Polymers'])

  const handleFinish = () => {
    onComplete({
      companyName,
      industry,
      location,
      currency,
    })
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="text-center mb-6">
          <Logo size="lg" withTagline={true} className="justify-center" />
        </div>

        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 sm:p-8 shadow-2xl">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 mb-2">
              <span>Step {step} of 3</span>
              <span className="text-[#0D9488] dark:text-[#14B8A6]">
                {step === 1 && 'Company Profile'}
                {step === 2 && (role === 'seller' ? 'Warehouse Locations' : 'Sourcing Preferences')}
                {step === 3 && 'Ready to Launch'}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-[#0D9488] rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Company Profile */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Setup your company workspace
              </h3>
              <p className="text-xs text-zinc-500">
                This information defines your multi-tenant organization boundary and invoice currency.
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Company Legal Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Industry Vertical
                  </label>
                  <input
                    type="text"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Base Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs"
                  >
                    <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                    <option value="USD ($)">USD ($) - US Dollar</option>
                    <option value="EUR (€)">EUR (€) - Euro</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Facility / Sourcing Setup */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                {role === 'seller' ? 'Warehouse & Depot Facilities' : 'Surplus Sourcing Interests'}
              </h3>
              <p className="text-xs text-zinc-500">
                {role === 'seller'
                  ? 'Set primary warehouse location for inventory logistics and buyer radius matching.'
                  : 'Select industrial categories you are actively seeking surplus stock for.'}
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Facility Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Ahmedabad Central Logistics Depot"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Categories in Focus
                  </label>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    {['Mechanical Components', 'Electronics & PCB', 'Plastic & Polymers', 'Packaging & Cartons'].map(
                      (cat) => (
                        <div
                          key={cat}
                          className="flex items-center gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-2.5 bg-zinc-50 dark:bg-zinc-900 text-[11px]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#0D9488]" />
                          <span>{cat}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2 text-xs font-bold text-white transition-all shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Quick Role Summary & Launch */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in">
              <div className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-[#0D9488] dark:text-[#14B8A6] mb-2">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Workspace Ready for Action
                </h3>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Here is how your {role === 'seller' ? 'Seller' : 'Buyer'} workspace operates:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                {role === 'seller' ? (
                  <>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                      <PackagePlus className="mx-auto h-5 w-5 text-[#0D9488] mb-1.5" />
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">Add Inventory</div>
                      <p className="text-[10px] text-zinc-500 mt-1">Upload CSV or add SKUs manually.</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                      <Users className="mx-auto h-5 w-5 text-[#0D9488] mb-1.5" />
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">Get Matched</div>
                      <p className="text-[10px] text-zinc-500 mt-1">AI pairs you with high-intent B2B buyers.</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                      <TrendingUp className="mx-auto h-5 w-5 text-[#0D9488] mb-1.5" />
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">Recover Capital</div>
                      <p className="text-[10px] text-zinc-500 mt-1">Accept offers & log circular savings.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                      <PackagePlus className="mx-auto h-5 w-5 text-[#0D9488] mb-1.5" />
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">Browse Listings</div>
                      <p className="text-[10px] text-zinc-500 mt-1">Filter by condition, category, city.</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                      <Users className="mx-auto h-5 w-5 text-[#0D9488] mb-1.5" />
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">Make Offers</div>
                      <p className="text-[10px] text-zinc-500 mt-1">Negotiate custom prices and batch sizes.</p>
                    </div>
                    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 text-center">
                      <TrendingUp className="mx-auto h-5 w-5 text-[#0D9488] mb-1.5" />
                      <div className="font-bold text-zinc-900 dark:text-zinc-100">Save Capital</div>
                      <p className="text-[10px] text-zinc-500 mt-1">Source surplus at 30-60% below list.</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-7 py-2.5 text-xs font-bold text-white transition-all shadow-md"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

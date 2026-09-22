'use client'

import React, { useState } from 'react'
import {
  Building2,
  MapPin,
  DollarSign,
  ShieldCheck,
  Bell,
  Users,
  CheckCircle2,
  Save,
  Plus,
} from 'lucide-react'

export const SettingsView: React.FC = () => {
  const [companyName, setCompanyName] = useState('ABC Plastics Ltd.')
  const [industry, setIndustry] = useState('Industrial Plastics & Polymers')
  const [currency, setCurrency] = useState('INR (₹)')
  const [locations, setLocations] = useState(['Ahmedabad Central Depot', 'Surat Branch Warehouse'])
  const [newLocation, setNewLocation] = useState('')
  const [saved, setSaved] = useState(false)

  const handleAddLocation = () => {
    if (newLocation.trim()) {
      setLocations([...locations, newLocation.trim()])
      setNewLocation('')
    }
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Building2 className="h-4 w-4 text-indigo-500" />
          <span>Company & Workspace Settings</span>
        </h3>
        <p className="text-xs text-zinc-500">
          Manage your organization profile, warehouse facilities, currencies, and multi-tenant parameters.
        </p>
      </div>

      {saved && (
        <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 animate-in fade-in">
          <CheckCircle2 className="h-4 w-4" />
          <span>Company settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Organization Profile</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Company Legal Name
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium"
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
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Operating Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
              </select>
            </div>
          </div>
        </div>

        {/* Warehouse Locations Card */}
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Warehouse & Depot Facilities</h4>
          <div className="space-y-2">
            {locations.map((loc, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-medium"
              >
                <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{loc}</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">Active Hub</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="text"
              placeholder="Add new facility e.g. Pune Logistics Park"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs text-zinc-900 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={handleAddLocation}
              className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Facility</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 px-5 py-2 text-xs font-semibold text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  )
}

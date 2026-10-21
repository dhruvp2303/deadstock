'use client'

import React, { useState, useEffect } from 'react'
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
  Lock,
  Layers,
  Sparkles,
  Database,
  Sliders,
  Check,
  Trash2,
  User,
  KeyRound,
  Mail,
  Phone,
  AlertCircle,
  Shield,
} from 'lucide-react'
import { DeadStockAPI, UserProfile } from '@/lib/api'

interface WarehouseFacility {
  id: string
  name: string
  location: string
  capacityUnits: number
  currentOccupancy: number
  utilizationPct: number
  status: 'ACTIVE' | 'MAINTENANCE'
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'Owner' | 'Admin' | 'Inventory Manager' | 'Sales Manager' | 'Warehouse Staff' | 'Finance' | 'Viewer'
  status: 'Active' | 'Invited'
}

interface SettingsViewProps {
  currentUser?: UserProfile | any
  onProfileUpdated?: (updated: UserProfile) => void
  initialSubTab?: 'user_profile' | 'company' | 'warehouses' | 'roles' | 'notifications' | 'security' | 'integrations' | 'billing'
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  onProfileUpdated,
  initialSubTab = 'user_profile',
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'user_profile' | 'company' | 'warehouses' | 'roles' | 'notifications' | 'security' | 'integrations' | 'billing'>(initialSubTab)
  const [selectedPlan, setSelectedPlan] = useState<'free' | 'business' | 'buyer_pro' | 'enterprise'>('business')

  // User Profile state
  const [userName, setUserName] = useState(currentUser?.name || '')
  const [userEmail, setUserEmail] = useState(currentUser?.email || '')
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '')
  const [userRole, setUserRole] = useState(currentUser?.role || 'admin')
  const [userPalette, setUserPalette] = useState('teal')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileFeedback, setProfileFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password state
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [passSaving, setPassSaving] = useState(false)
  const [passFeedback, setPassFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Organization state
  const [companyName, setCompanyName] = useState(currentUser?.company?.name || '')
  const [industry, setIndustry] = useState(currentUser?.company?.industry || '')
  const [currency, setCurrency] = useState('INR (₹)')
  const [gstin, setGstin] = useState('')
  const [cin, setCin] = useState('')

  // Warehouses state
  const [warehouses, setWarehouses] = useState<WarehouseFacility[]>([])
  const [newWhName, setNewWhName] = useState('')
  const [newWhLoc, setNewWhLoc] = useState('')
  const [newWhCap, setNewWhCap] = useState(25000)

  // Team state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [newMemberEmail, setNewMemberEmail] = useState('')
  const [newMemberRole, setNewMemberRole] = useState<TeamMember['role']>('Inventory Manager')

  useEffect(() => {
    try {
      const stored = typeof window !== 'undefined' ? localStorage.getItem('deadstock_user') : null
      const u = currentUser || (stored ? JSON.parse(stored) : null)
      if (u) {
        if (u.name) setUserName(u.name)
        if (u.email) setUserEmail(u.email)
        if (u.phone) setUserPhone(u.phone)
        if (u.role) setUserRole(u.role)
        if (u.profile_image) setUserPalette(u.profile_image)
        if (u.company?.name) setCompanyName(u.company.name)
        if (u.company?.industry) setIndustry(u.company.industry)
        if (u.name && u.email) {
          setTeamMembers([
            { id: `usr-${u.id || 1}`, name: u.name, email: u.email, role: 'Owner', status: 'Active' },
          ])
        }
      }
    } catch (e) {}

    DeadStockAPI.getWarehouses().then((whs) => {
      if (whs && Array.isArray(whs) && whs.length > 0) {
        setWarehouses(
          whs.map((w) => ({
            id: `wh-${w.id}`,
            name: w.name,
            location: `${w.city || ''}, ${w.state || ''}`.replace(/^, |, $/g, '') || 'India Depot',
            capacityUnits: w.capacity_sqft || 25000,
            currentOccupancy: (w.inventories_count || 0) * 100,
            utilizationPct: Math.min(100, Math.round(((w.inventories_count || 0) * 100 / (w.capacity_sqft || 25000)) * 100)),
            status: 'ACTIVE',
          }))
        )
      } else {
        setWarehouses([])
      }
    })
  }, [currentUser])

  const handleSaveUserProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileFeedback(null)
    try {
      const res = await DeadStockAPI.updateProfile({
        name: userName,
        phone: userPhone || null,
        profile_image: userPalette,
        company_name: companyName,
        industry,
      })
      const updatedUser: UserProfile = res || {
        ...currentUser,
        name: userName,
        phone: userPhone,
        profile_image: userPalette,
        company: {
          ...(currentUser?.company || {}),
          name: companyName,
          industry,
        },
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('deadstock_user', JSON.stringify(updatedUser))
      }
      if (onProfileUpdated) onProfileUpdated(updatedUser)
      setProfileFeedback({ type: 'success', text: 'Personal user profile updated live.' })
      showSavedFeedback()
    } catch (err: any) {
      setProfileFeedback({ type: 'error', text: err?.message || 'Failed to update user profile.' })
    } finally {
      setProfileSaving(false)
    }
  }

  const handleChangeUserPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPass) {
      setPassFeedback({ type: 'error', text: 'Please enter current password.' })
      return
    }
    if (newPass.length < 8) {
      setPassFeedback({ type: 'error', text: 'New password must be at least 8 characters.' })
      return
    }
    if (newPass !== confirmPass) {
      setPassFeedback({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    setPassSaving(true)
    setPassFeedback(null)
    try {
      await DeadStockAPI.changePassword({
        current_password: currentPass,
        password: newPass,
        password_confirmation: confirmPass,
      })
      setPassFeedback({ type: 'success', text: 'Password updated successfully.' })
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
      showSavedFeedback()
    } catch (err: any) {
      setPassFeedback({ type: 'error', text: err?.message || 'Failed to change password.' })
    } finally {
      setPassSaving(false)
    }
  }

  // Notifications state
  const [notifyRisk, setNotifyRisk] = useState(true)
  const [notifyMatches, setNotifyMatches] = useState(true)
  const [notifyOffers, setNotifyOffers] = useState(true)
  const [notifyDispatch, setNotifyDispatch] = useState(true)
  const [notifyRecovery, setNotifyRecovery] = useState(true)

  // Integrations state
  const [erpStatus, setErpStatus] = useState<Record<string, boolean>>({
    tally: true,
    sap: false,
    zoho: true,
    dynamics: false,
  })

  const [saved, setSaved] = useState(false)

  const handleAddWarehouse = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newWhName.trim() || !newWhLoc.trim()) return
    const newWh: WarehouseFacility = {
      id: `wh-${Date.now()}`,
      name: newWhName.trim(),
      location: newWhLoc.trim(),
      capacityUnits: Number(newWhCap) || 20000,
      currentOccupancy: 0,
      utilizationPct: 0,
      status: 'ACTIVE',
    }
    setWarehouses([...warehouses, newWh])
    setNewWhName('')
    setNewWhLoc('')
    showSavedFeedback()
  }

  const handleInviteMember = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberEmail.trim()) return
    const newM: TeamMember = {
      id: `usr-${Date.now()}`,
      name: newMemberEmail.split('@')[0],
      email: newMemberEmail.trim(),
      role: newMemberRole,
      status: 'Invited',
    }
    setTeamMembers([...teamMembers, newM])
    setNewMemberEmail('')
    showSavedFeedback()
  }

  const showSavedFeedback = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    showSavedFeedback()
  }

  return (
    <div className="max-w-5xl space-y-6">
      {/* Top Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-[#0D9488]" />
            <span>Workspace & Enterprise Organization Settings</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Manage multi-warehouse logistics facilities, RBAC roles, notifications, and ERP synchronization.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Settings synced live</span>
          </div>
        )}
      </div>

      {/* Sub-tabs navigation */}
      <div className="flex flex-wrap items-center gap-1.5 border-b border-zinc-200 dark:border-zinc-800 pb-2">
        {[
          { id: 'user_profile', label: 'User Profile & Account', icon: User },
          { id: 'company', label: 'Organization & Legal', icon: Building2 },
          { id: 'warehouses', label: `Warehouses (${warehouses.length})`, icon: MapPin },
          { id: 'roles', label: `Roles & Permissions (${teamMembers.length})`, icon: Users },
          { id: 'notifications', label: 'Alert Center', icon: Bell },
          { id: 'security', label: 'Security & SSO', icon: ShieldCheck },
          { id: 'integrations', label: 'ERP Integrations', icon: Database },
          { id: 'billing', label: 'Subscriptions & Revenue Fees', icon: DollarSign },
        ].map((tab) => {
          const Icon = tab.icon
          const isActive = activeSubTab === tab.id
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors ${
                isActive
                  ? 'bg-[#0D9488] text-white shadow-xs font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* TAB 0: User Profile & Account */}
      {activeSubTab === 'user_profile' && (
        <div className="space-y-6">
          {profileFeedback && (
            <div
              className={`flex items-center gap-2 rounded-2xl p-3 text-xs font-semibold border ${
                profileFeedback.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
            >
              {profileFeedback.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{profileFeedback.text}</span>
            </div>
          )}

          {/* Personal Info Card */}
          <form onSubmit={handleSaveUserProfile} className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-5">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-100 dark:border-zinc-800/80 pb-4">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-white font-mono text-base font-bold shadow-md">
                    {userName ? (userName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'DS') : 'DS'}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{userName || 'User Profile'}</h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{userEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 text-[10px] font-mono px-3 py-1 font-bold uppercase">
                    Role: {userRole}
                  </span>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono px-3 py-1 font-bold flex items-center gap-1">
                    <Check className="h-3 w-3" /> Active
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Account Email (Single Sign-On ID)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={userEmail}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 px-3.5 py-2 text-xs text-zinc-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Direct Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="tel"
                      value={userPhone}
                      onChange={(e) => setUserPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Organization Affiliation
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0F9D8D] transition-all disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{profileSaving ? 'Saving Changes...' : 'Save Profile Details'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Change Password Card */}
          <form onSubmit={handleChangeUserPassword} className="space-y-4">
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0D9488]" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Security & Password Management</h4>
              </div>

              {passFeedback && (
                <div
                  className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold border ${
                    passFeedback.type === 'success'
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {passFeedback.type === 'success' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  )}
                  <span>{passFeedback.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    required
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={passSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-2 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-white transition-all disabled:opacity-50"
                >
                  <KeyRound className="h-3.5 w-3.5" />
                  <span>{passSaving ? 'Updating...' : 'Update Password'}</span>
                </button>
              </div>
            </div>
          </form>

          {/* Session Security Details */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Session Security Context</span>
              <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-mono px-2 py-0.5 font-bold">
                Sanctum Authenticated
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 p-3">
                <span className="text-[11px] text-zinc-400 block mb-1">Logged IP Address</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">
                  {currentUser?.last_login_ip || '127.0.0.1 (Localhost / Secure VPC)'}
                </span>
              </div>
              <div className="rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/50 p-3">
                <span className="text-[11px] text-zinc-400 block mb-1">Last Login Timestamp</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">
                  {currentUser?.last_login_at
                    ? new Date(currentUser.last_login_at).toLocaleString()
                    : 'Active Session'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: Organization & Profile */}
      {activeSubTab === 'company' && (
        <form onSubmit={handleSave} className="space-y-4">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Company Legal Identity</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Legal Entity Name
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-semibold"
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
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  GSTIN / Tax Identification
                </label>
                <input
                  type="text"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-mono font-semibold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Operating Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-semibold"
                >
                  <option value="INR (₹)">INR (₹) - Indian Rupee (Default B2B)</option>
                  <option value="USD ($)">USD ($) - US Dollar</option>
                  <option value="EUR (€)">EUR (€) - Euro</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-6 py-2.5 text-xs font-bold text-white shadow-xs"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Save Organization Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Multi-Warehouse Management (Section 33) */}
      {activeSubTab === 'warehouses' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {warehouses.map((wh) => (
              <div
                key={wh.id}
                className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-300">
                    {wh.id.toUpperCase()}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 border border-emerald-500/20">
                    <CheckCircle2 className="h-3 w-3" />
                    {wh.status}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{wh.name}</h4>
                  <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="h-3 w-3" />
                    <span>{wh.location}</span>
                  </p>
                </div>

                <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-800/80 pt-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px]">Storage Capacity:</span>
                    <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-200">{wh.capacityUnits.toLocaleString()} units</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-zinc-400 text-[11px]">Occupancy:</span>
                    <span className="font-mono font-bold text-[#0D9488]">{wh.currentOccupancy.toLocaleString()} units ({wh.utilizationPct}%)</span>
                  </div>
                  <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1">
                    <div className="bg-[#0D9488] h-full rounded-full" style={{ width: `${wh.utilizationPct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Facility Form */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5 text-[#0D9488]" />
              <span>Register New Warehouse or Depot Facility</span>
            </h4>
            <form onSubmit={handleAddWarehouse} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Facility Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Pune Logistics Hub"
                  value={newWhName}
                  onChange={(e) => setNewWhName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Physical Location / Industrial Zone
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Chakan Phase II, Maharashtra"
                  value={newWhLoc}
                  onChange={(e) => setNewWhLoc(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Capacity (Units)
                </label>
                <input
                  type="number"
                  min={100}
                  value={newWhCap}
                  onChange={(e) => setNewWhCap(Number(e.target.value))}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-mono font-semibold"
                />
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Add Warehouse Facility
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: Roles & Permissions (Section 34) */}
      {activeSubTab === 'roles' && (
        <div className="space-y-6">
          {/* Members Table */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Team Members & Access Levels</h4>
                <p className="text-xs text-zinc-500">7 predefined enterprise roles based on operational responsibility.</p>
              </div>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50/70 dark:bg-zinc-900/50 text-zinc-500 font-semibold border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Member Name</th>
                  <th className="py-3 px-3">Email</th>
                  <th className="py-3 px-3">Assigned Role</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {teamMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-zinc-50/70 dark:hover:bg-zinc-900/40">
                    <td className="py-3 px-4 font-bold text-zinc-900 dark:text-zinc-100">{m.name}</td>
                    <td className="py-3 px-3 font-mono text-zinc-500">{m.email}</td>
                    <td className="py-3 px-3">
                      <span className="rounded-md bg-teal-500/10 px-2 py-0.5 text-[11px] font-bold text-[#0D9488]">
                        {m.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600">
                        {m.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Role Permissions Matrix Reference */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Role Permissions Matrix (Audit Spec)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Owner / Admin</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Full access: organization management, settings, billing, financial release.</span>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Inventory Manager</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Stock intake, risk analysis review, CSV imports, SKU management.</span>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Sales Manager</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Buyer matchmaking, marketplace publishing, offer negotiations.</span>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Warehouse Staff</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Physical stock movements, freight dispatch confirmations, check-in.</span>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Finance</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Escrow verification, recovery ledger audits, transactions settlement.</span>
              </div>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/30">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Viewer</span>
                <span className="text-[11px] text-zinc-500 mt-1 block">Read-only operational dashboards and analytics reports export.</span>
              </div>
            </div>
          </div>

          {/* Invite Form */}
          <form onSubmit={handleInviteMember} className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Invite New Enterprise User</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Corporate Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="colleague@company.com"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  Role Assignment
                </label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value as any)}
                  className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-2 text-xs font-semibold"
                >
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Sales Manager">Sales Manager</option>
                  <option value="Warehouse Staff">Warehouse Staff</option>
                  <option value="Finance">Finance</option>
                  <option value="Viewer">Viewer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-5 py-2 text-xs font-bold text-white shadow-xs"
                >
                  Send Role Invitation
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* TAB 4: Notifications Alert Center (Section 28) */}
      {activeSubTab === 'notifications' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Automated Notification Triggers</h4>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800 space-y-2">
            {[
              { id: 'risk', label: 'High-Risk & Critical Inventory Decay Alerts', state: notifyRisk, set: setNotifyRisk, desc: 'Receive immediate alerts when SKU age or demand drop pushes risk above 70%.' },
              { id: 'matches', label: 'New High-Compatibility Buyer Match (>85%)', state: notifyMatches, set: setNotifyMatches, desc: 'Get alerted when a verified manufacturing buyer searches for your stored SKUs.' },
              { id: 'offers', label: 'Inbound B2B Offers & Counter-Negotiations', state: notifyOffers, set: setNotifyOffers, desc: 'Real-time alert when a counterparty submits or counters a bid.' },
              { id: 'dispatch', label: 'Freight Dispatch & Delivery Milestone Confirmations', state: notifyDispatch, set: setNotifyDispatch, desc: 'Track truck dispatch, in-transit status, and facility receiving.' },
              { id: 'recovery', label: 'Recovery Completed & Capital Credit Log', state: notifyRecovery, set: setNotifyRecovery, desc: 'Notification when escrow funds are released and ledger is updated.' },
            ].map((n) => (
              <div key={n.id} className="pt-3 flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{n.label}</h5>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{n.desc}</p>
                </div>
                <input
                  type="checkbox"
                  checked={n.state}
                  onChange={() => {
                    n.set(!n.state)
                    showSavedFeedback()
                  }}
                  className="h-4 w-4 rounded border-zinc-300 text-[#0D9488] focus:ring-[#0D9488]"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Security & SSO (Section 4) */}
      {activeSubTab === 'security' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Enterprise Authentication & SSO</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <Lock className="h-4 w-4 text-[#0D9488]" />
                <span>Single Sign-On (Google & Microsoft Entra)</span>
              </span>
              <p className="text-[11px] text-zinc-500">Allow corporate users to authenticate using workspace email credentials.</p>
              <button
                type="button"
                onClick={showSavedFeedback}
                className="rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-600 border border-emerald-500/20"
              >
                Enabled (OAuth 2.0)
              </button>
            </div>

            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#0D9488]" />
                <span>Two-Factor Authentication (2FA)</span>
              </span>
              <p className="text-[11px] text-zinc-500">Mandate OTP / Authenticator app confirmation on financial deals.</p>
              <button
                type="button"
                onClick={showSavedFeedback}
                className="rounded-full bg-teal-500/10 px-3 py-1 text-[11px] font-bold text-[#0D9488] border border-teal-500/20"
              >
                Enforced for Admins
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: ERP & Data Integrations */}
      {activeSubTab === 'integrations' && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">ERP & Accounting Synchronization</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { id: 'tally', name: 'Tally Prime / ERP 9', desc: 'Sync inventory stock batches and automated sales vouchers.' },
              { id: 'zoho', name: 'Zoho Inventory & Books', desc: 'Bi-directional SKU balance and credit note sync.' },
              { id: 'sap', name: 'SAP S/4HANA & ECC', desc: 'Enterprise MM (Materials Management) connector.' },
              { id: 'dynamics', name: 'Microsoft Dynamics 365', desc: 'Supply chain warehouse lot synchronization.' },
            ].map((erp) => (
              <div
                key={erp.id}
                className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 flex items-center justify-between"
              >
                <div>
                  <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{erp.name}</h5>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{erp.desc}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setErpStatus((prev) => ({ ...prev, [erp.id]: !prev[erp.id] }))
                    showSavedFeedback()
                  }}
                  className={`rounded-full px-3 py-1 text-[11px] font-bold transition-colors ${
                    erpStatus[erp.id]
                      ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {erpStatus[erp.id] ? 'Connected' : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: Subscriptions & Platform Revenue Model */}
      {activeSubTab === 'billing' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Revenue Model Highlights Card */}
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-500/10 p-6 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0D9488]/20 px-3 py-0.5 text-[11px] font-mono font-bold text-[#0D9488]">
                  <Sparkles className="h-3.5 w-3.5" />
                  DEADSTOCK BUSINESS REVENUE ARCHITECTURE
                </span>
                <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mt-1.5">
                  Fair Liquidity, Low Transaction Fees & Listing Commitment Rebate
                </h4>
              </div>
              <div className="rounded-xl border border-teal-500/30 bg-white dark:bg-zinc-900 px-4 py-2 text-right">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">Commitment Wallet</span>
                <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">₹299.00 Available</span>
                <span className="text-[10px] text-zinc-500 block">100% credited against next deal fee</span>
              </div>
            </div>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Discovery and searching remain completely open. Serious sellers deposit a small listing commitment fee (₹99–₹499) that activates stock for 30 days and is <strong>fully credited back</strong> when you conclude a Deal Room transaction. Platform fees are only 0.5%–1% for sellers and 0.25%–0.75% for buyers upon realized deal settlement.
            </p>
          </div>

          {/* Subscription Tier Cards */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Active Membership Plans</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Plan 1: Seller Free */}
              <div className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                selectedPlan === 'free'
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/60 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500">Seller Basic</span>
                    <span className="rounded-full bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-mono font-bold">Standard</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">₹0 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
                  <p className="text-xs text-zinc-500">For occasional excess stock recovery.</p>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> Up to 3 active lots</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> Standard 1% transaction fee</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> Basic AI risk rating</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedPlan('free'); showSavedFeedback(); }}
                  className={`mt-4 w-full rounded-xl py-2 text-xs font-bold transition-all ${
                    selectedPlan === 'free'
                      ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900'
                      : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                  }`}
                >
                  {selectedPlan === 'free' ? 'Current Plan' : 'Select Free'}
                </button>
              </div>

              {/* Plan 2: Seller Business */}
              <div className={`rounded-2xl border-2 p-5 transition-all flex flex-col justify-between relative ${
                selectedPlan === 'business'
                  ? 'border-[#0D9488] bg-teal-500/5 dark:bg-teal-500/10 shadow-lg'
                  : 'border-teal-500/30 bg-white dark:bg-zinc-950'
              }`}>
                <div className="absolute -top-3 right-4 rounded-full bg-[#0D9488] px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                  Recommended
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0D9488]">Seller Business</span>
                    <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-[#0D9488]">Popular</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">₹999 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
                  <p className="text-xs text-zinc-500">For active manufacturers and distributors.</p>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> Unlimited active lots</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> <strong>Reduced 0.75% transaction fee</strong></li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> AI dead-stock prediction engine</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> Priority buyer matching alerts</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-teal-600" /> Bulk CSV & ERP lot sync</li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedPlan('business'); showSavedFeedback(); }}
                  className="mt-4 w-full rounded-xl bg-[#0D9488] hover:bg-teal-700 py-2 text-xs font-bold text-white shadow-xs transition-all"
                >
                  {selectedPlan === 'business' ? 'Active Business Plan' : 'Upgrade to Business (₹999/mo)'}
                </button>
              </div>

              {/* Plan 3: Buyer Pro */}
              <div className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                selectedPlan === 'buyer_pro'
                  ? 'border-zinc-900 dark:border-zinc-100 bg-zinc-50 dark:bg-zinc-900/60 shadow-md'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950'
              }`}>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-400">Buyer Pro</span>
                    <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[10px] font-mono font-bold text-purple-600">Demand Side</span>
                  </div>
                  <div className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">₹499 <span className="text-xs font-normal text-zinc-400">/mo</span></div>
                  <p className="text-xs text-zinc-500">For procurement teams hunting discounted lots.</p>
                  <ul className="text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Post unlimited "I Need Stock" requests</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Visual image search & CV matches</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> Instant price drop alerts</li>
                    <li className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-purple-600" /> <strong>Reduced 0.25% buyer fee</strong></li>
                  </ul>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedPlan('buyer_pro'); showSavedFeedback(); }}
                  className={`mt-4 w-full rounded-xl py-2 text-xs font-bold transition-all ${
                    selectedPlan === 'buyer_pro'
                      ? 'bg-purple-600 text-white'
                      : 'border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850'
                  }`}
                >
                  {selectedPlan === 'buyer_pro' ? 'Active Buyer Pro' : 'Activate Buyer Pro (₹499/mo)'}
                </button>
              </div>
            </div>
          </div>

          {/* Transparent Rate Matrix & Optional Services */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-xs space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Fee Schedule & Optional Value Add-ons</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Core Transaction Settlement</span>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Seller Transaction Fee:</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">0.5% - 1.0% (₹299 commitment credited)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Buyer Transaction Fee:</span>
                  <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">0.25% - 0.75%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Max Transaction Cap:</span>
                  <span className="font-mono font-bold text-emerald-600">₹25,000 / deal max cap</span>
                </div>
              </div>

              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-2">
                <span className="font-bold text-zinc-900 dark:text-zinc-100 block">Optional Services (Pay-As-You-Go)</span>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Featured Listing Boost:</span>
                  <span className="font-mono font-bold">₹199 – ₹999</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">Priority AI Buyer Push:</span>
                  <span className="font-mono font-bold">₹299</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-500">3rd-Party Physical Lot QC:</span>
                  <span className="font-mono font-bold">₹499+</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">DeadStock Partner Logistics:</span>
                  <span className="font-mono font-bold text-[#0D9488]">Direct freight rate + 5% referral margin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
  X,
  User,
  Shield,
  KeyRound,
  Building2,
  Mail,
  Phone,
  CheckCircle2,
  AlertCircle,
  Save,
  Lock,
  Sparkles,
  Calendar,
  Globe,
  Camera,
  Check,
} from 'lucide-react'
import { DeadStockAPI, UserProfile } from '@/lib/api'

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser: UserProfile | any
  onProfileUpdated: (updatedUser: UserProfile) => void
  showToast?: (message: string) => void
}

const AVATAR_PALETTES = [
  { id: 'teal', label: 'Teal', bg: 'bg-teal-600', ring: 'ring-teal-500', text: 'text-teal-400' },
  { id: 'indigo', label: 'Indigo', bg: 'bg-indigo-600', ring: 'ring-indigo-500', text: 'text-indigo-400' },
  { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-600', ring: 'ring-emerald-500', text: 'text-emerald-400' },
  { id: 'rose', label: 'Rose', bg: 'bg-rose-600', ring: 'ring-rose-500', text: 'text-rose-400' },
  { id: 'violet', label: 'Violet', bg: 'bg-violet-600', ring: 'ring-violet-500', text: 'text-violet-400' },
  { id: 'amber', label: 'Amber', bg: 'bg-amber-600', ring: 'ring-amber-500', text: 'text-amber-400' },
]

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onProfileUpdated,
  showToast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile')

  // Personal Info Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [industry, setIndustry] = useState('')
  const [locationCity, setLocationCity] = useState('')
  const [selectedColor, setSelectedColor] = useState('teal')

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // Preferences
  const [currency, setCurrency] = useState('INR (₹)')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [criticalRiskAlerts, setCriticalRiskAlerts] = useState(true)
  const [weeklyDigest, setWeeklyDigest] = useState(false)

  // Status
  const [isSaving, setIsSaving] = useState(false)
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Sync state when opened or currentUser changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '')
      setEmail(currentUser.email || '')
      setPhone(currentUser.phone || '')
      setCompanyName(currentUser.company?.name || '')
      setIndustry(currentUser.company?.industry || '')
      setLocationCity(currentUser.company?.location_city || '')
      if (currentUser.profile_image && AVATAR_PALETTES.some((p) => p.id === currentUser.profile_image)) {
        setSelectedColor(currentUser.profile_image)
      }
    }
    setStatusMessage(null)
  }, [currentUser, isOpen])

  if (!isOpen) return null

  const getInitials = (fullName: string) => {
    if (!fullName) return 'DS'
    const parts = fullName.trim().split(/\s+/)
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase()
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }

  const activePalette = AVATAR_PALETTES.find((p) => p.id === selectedColor) || AVATAR_PALETTES[0]

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setStatusMessage(null)

    try {
      const payload = {
        name,
        phone: phone || null,
        profile_image: selectedColor,
        company_name: companyName,
        industry,
        location_city: locationCity,
      }

      const res = await DeadStockAPI.updateProfile(payload)
      const updatedUser: UserProfile = res || {
        ...currentUser,
        name,
        phone,
        profile_image: selectedColor,
        company: {
          ...(currentUser?.company || {}),
          name: companyName,
          industry,
          location_city: locationCity,
        },
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('deadstock_user', JSON.stringify(updatedUser))
      }

      onProfileUpdated(updatedUser)
      setStatusMessage({ type: 'success', text: 'Profile updated successfully.' })
      if (showToast) showToast('Profile details updated live.')
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to update profile. Please check your connection.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password.' })
      return
    }
    if (newPassword.length < 8) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 8 characters long.' })
      return
    }
    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' })
      return
    }

    setIsSaving(true)
    setStatusMessage(null)

    try {
      await DeadStockAPI.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      })
      setStatusMessage({ type: 'success', text: 'Password changed successfully.' })
      if (showToast) showToast('Password updated securely.')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Failed to change password. Ensure current password is correct.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex w-full max-w-2xl flex-col max-h-[90vh] overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl">
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-teal-900/40 via-teal-800/20 to-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-full p-2 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Avatar Pill */}
            <div className="relative group">
              <div
                className={`flex h-16 w-16 items-center justify-center rounded-2xl ${activePalette.bg} text-white font-mono text-xl font-bold shadow-lg ring-4 ring-white/10`}
              >
                {getInitials(name || currentUser?.name)}
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow ring-2 ring-zinc-950">
                <Check className="h-3 w-3" />
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{name || 'User Profile'}</h3>
                <span className="rounded-full bg-teal-500/15 border border-teal-500/30 px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#0D9488] dark:text-[#14B8A6]">
                  {currentUser?.role || 'Admin'}
                </span>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-zinc-400" />
                <span>{email || 'user@deadstock.ai'}</span>
                <span>•</span>
                <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                <span>{companyName || 'Enterprise Account'}</span>
              </p>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'profile'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <User className="h-3.5 w-3.5" />
              <span>Personal Details</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'security'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <KeyRound className="h-3.5 w-3.5" />
              <span>Password & Security</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === 'preferences'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm font-bold'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {statusMessage && (
            <div
              className={`flex items-center gap-2 rounded-2xl p-3 text-xs font-semibold border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* TAB 1: Personal Details */}
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-5">
              {/* Avatar Color Picker */}
              <div>
                <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  Avatar Theme Color
                </label>
                <div className="flex items-center gap-3">
                  {AVATAR_PALETTES.map((pal) => (
                    <button
                      key={pal.id}
                      type="button"
                      onClick={() => setSelectedColor(pal.id)}
                      className={`h-7 w-7 rounded-full ${pal.bg} transition-all flex items-center justify-center text-white ${
                        selectedColor === pal.id
                          ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 ring-teal-500 scale-110'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      {selectedColor === pal.id && <Check className="h-3.5 w-3.5" />}
                    </button>
                  ))}
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
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dhruv Patel"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Account Email (Primary)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={email}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 px-3.5 py-2 text-xs text-zinc-500 cursor-not-allowed"
                  />
                  <p className="mt-1 text-[10px] text-zinc-400">Email is tied to your organization identity.</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Direct Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 pl-9 pr-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Primary Operational City
                  </label>
                  <input
                    type="text"
                    value={locationCity}
                    onChange={(e) => setLocationCity(e.target.value)}
                    placeholder="e.g. Mumbai, Pune, Ahmedabad"
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                  Company & Role Context
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Organization Name
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. DeadStock Enterprise"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Sector / Industry
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    >
                      <option value="Industrial Manufacturing">Industrial Manufacturing</option>
                      <option value="Electronics & Semiconductors">Electronics & Semiconductors</option>
                      <option value="Automotive & Parts">Automotive & Parts</option>
                      <option value="Polymer & Chemical Moldings">Polymer & Chemical Moldings</option>
                      <option value="Aerospace & Precision Machining">Aerospace & Precision Machining</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#0D9488] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0F9D8D] transition-all disabled:opacity-50"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: Password & Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    <Lock className="h-4 w-4 text-[#0D9488]" />
                    <span>Change Workspace Password</span>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        New Password (min 8 chars)
                      </label>
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-zinc-100 dark:text-zinc-900 px-4 py-1.5 text-xs font-bold hover:bg-zinc-800 dark:hover:bg-white transition-all disabled:opacity-50"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>{isSaving ? 'Updating...' : 'Update Password'}</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Security Audit Session */}
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Active Session Security</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-3">
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Last Logged IP</span>
                    <span className="font-mono text-zinc-800 dark:text-zinc-200 font-semibold">
                      {currentUser?.last_login_ip || '127.0.0.1 (Localhost / Secure VPC)'}
                    </span>
                  </div>
                  <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900 p-3">
                    <span className="text-[11px] text-zinc-400 block mb-0.5">Last Authenticated</span>
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

          {/* TAB 3: Preferences */}
          {activeTab === 'preferences' && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-4">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Regional & Currency Preference
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Operating Valuation Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full sm:w-64 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  >
                    <option value="INR (₹)">INR (₹) — Indian Rupee</option>
                    <option value="USD ($)">USD ($) — US Dollar</option>
                    <option value="EUR (€)">EUR (€) — Euro</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                  </select>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 space-y-3">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Notification Dispatch
                </span>
                <label className="flex items-center justify-between text-xs cursor-pointer py-1">
                  <div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Critical Inventory Degradation Alerts
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Receive immediate notifications when SKU holding costs breach critical risk.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={criticalRiskAlerts}
                    onChange={(e) => setCriticalRiskAlerts(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0D9488]"
                  />
                </label>

                <label className="flex items-center justify-between text-xs cursor-pointer py-1 border-t border-zinc-100 dark:border-zinc-800 pt-2">
                  <div>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                      Instant Counter-Offer Notifications
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      Alert immediately when a buyer submits a counter-offer or bids on your surplus lot.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 rounded accent-[#0D9488]"
                  />
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (showToast) showToast('Preferences updated successfully.')
                    onClose()
                  }}
                  className="rounded-xl bg-[#0D9488] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-[#0F9D8D] transition-all"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

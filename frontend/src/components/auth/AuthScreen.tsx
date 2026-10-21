'use client'

import React, { useState } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Lock,
  Mail,
  Building2,
  User,
  ShieldCheck,
  KeyRound,
  ArrowLeft,
} from 'lucide-react'
import { Logo } from '@/components/brand/Logo'
import { fetchApi } from '@/lib/api'

interface AuthScreenProps {
  initialMode?: 'signup' | 'login'
  onSuccess: (userData: { user: any; token: string; role: 'seller' | 'buyer'; isNew: boolean }) => void
  onCancel: () => void
  onExploreDemo?: () => void
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'signup',
  onSuccess,
  onCancel,
  onExploreDemo,
}) => {
  const [mode, setMode] = useState<'signup' | 'login' | 'forgot' | 'reset'>(initialMode)
  const [role, setRole] = useState<'seller' | 'buyer'>('seller')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [resetToken, setResetToken] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrorMessage(null)
    setInfoMessage(null)

    if (mode === 'signup' && !agreeTerms) {
      setErrorMessage('You must agree to the Terms & Conditions and Privacy Policy to create an account.')
      setSubmitting(false)
      return
    }

    try {
      if (mode === 'signup') {
        const res = await fetchApi<{ user: any; token: string; token_type: string }>('/auth/register', {
          method: 'POST',
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password,
            company_name: companyName.trim() || `${name.trim()}'s Enterprises`,
            industry: role === 'seller' ? 'Industrial Manufacturing' : 'B2B Procurement',
          }),
        })

        if (res?.token && res?.user) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('deadstock_auth_token', res.token)
            localStorage.setItem('deadstock_user', JSON.stringify(res.user))
          }
          onSuccess({
            user: res.user,
            token: res.token,
            role,
            isNew: true,
          })
        } else {
          setErrorMessage('Registration could not be completed. Please ensure your email is unique and password is at least 8 characters.')
        }
      } else if (mode === 'login') {
        const res = await fetchApi<{ user: any; token: string; token_type: string }>('/auth/login', {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            password,
          }),
        })

        if (res?.token && res?.user) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('deadstock_auth_token', res.token)
            localStorage.setItem('deadstock_user', JSON.stringify(res.user))
          }
          onSuccess({
            user: res.user,
            token: res.token,
            role,
            isNew: false,
          })
        } else {
          setErrorMessage('Invalid email or password. Please verify your credentials.')
        }
      } else if (mode === 'forgot') {
        const res = await fetchApi<{ email: string; reset_token: string }>('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        })

        if (res?.reset_token) {
          setResetToken(res.reset_token)
          setInfoMessage('Password reset token generated. Enter a new password below.')
          setMode('reset')
        } else {
          setErrorMessage('Email not found in our database.')
        }
      } else if (mode === 'reset') {
        if (password !== passwordConfirmation) {
          setErrorMessage('Passwords do not match. Please re-enter.')
          setSubmitting(false)
          return
        }

        const res = await fetchApi('/auth/reset-password', {
          method: 'POST',
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            token: resetToken.trim(),
            password,
            password_confirmation: passwordConfirmation,
          }),
        })

        setInfoMessage('Password reset successfully! You can now log in with your new password.')
        setPassword('')
        setPasswordConfirmation('')
        setResetToken('')
        setMode('login')
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Authentication error. Please check your network connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left Value Prop Panel */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 p-8 sm:p-10 text-white flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-800">
            <div>
              <Logo size="lg" withTagline={true} variant="dark" />

              <h2 className="text-2xl font-bold tracking-tight mt-8 text-zinc-100">
                Turn dead stock into business value.
              </h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Connect your inventory to intelligent risk detection, automated B2B buyer matching, and multi-channel liquidation.
              </p>

              <div className="mt-8 space-y-4 text-xs text-zinc-300">
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-[#14B8A6]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Instant 0–100 AI Risk Index on all SKUs</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-[#14B8A6]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Verified B2B direct buyer network in India</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-500/20 text-[#14B8A6]">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <span>Automated audit trail & circular sustainability metrics</span>
                </div>
              </div>
            </div>

            <div className="mt-10 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-500">
              Multi-tenant company data isolation guaranteed by Sanctum auth.
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-8 sm:p-10 flex flex-col justify-between bg-white dark:bg-zinc-950">
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
                  {mode === 'signup' && 'Create Your Account'}
                  {mode === 'login' && 'Welcome Back'}
                  {mode === 'forgot' && 'Reset Your Password'}
                  {mode === 'reset' && 'Set New Password'}
                </h3>
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100"
                >
                  Return to Home
                </button>
              </div>

              {errorMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {infoMessage && (
                <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3 text-xs text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{infoMessage}</span>
                </div>
              )}

              {/* Role Toggle on Sign Up */}
              {mode === 'signup' && (
                <div className="mb-4">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                    Select Primary Role
                  </label>
                  <div className="grid grid-cols-2 gap-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100/70 dark:bg-zinc-900 p-1">
                    <button
                      type="button"
                      onClick={() => setRole('seller')}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        role === 'seller'
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      I&apos;m selling surplus
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('buyer')}
                      className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                        role === 'buyer'
                          ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-xs'
                          : 'text-zinc-500'
                      }`}
                    >
                      I&apos;m sourcing surplus
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        Company Legal Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Registered business name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                      />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                  />
                </div>

                {mode === 'reset' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Reset Token *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Paste reset token from email"
                      value={resetToken}
                      onChange={(e) => setResetToken(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs font-mono text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>
                )}

                {(mode === 'signup' || mode === 'login' || mode === 'reset') && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                        {mode === 'reset' ? 'New Password *' : 'Password *'}
                        {mode === 'signup' && <span className="text-zinc-400 font-normal"> (min. 8 characters)</span>}
                      </label>
                      {mode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage(null)
                            setInfoMessage(null)
                            setMode('forgot')
                          }}
                          className="text-[11px] font-medium text-[#0D9488] hover:underline"
                        >
                          Forgot Password?
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>
                )}

                {mode === 'reset' && (
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      placeholder="••••••••"
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3.5 py-2 text-xs text-zinc-900 dark:text-zinc-100 focus:border-[#0D9488] focus:outline-none"
                    />
                  </div>
                )}

                {mode === 'signup' && (
                  <label className="flex items-start gap-2 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="mt-0.5 rounded border-zinc-300 text-[#0D9488] focus:ring-[#0D9488]"
                    />
                    <span>
                      I agree to the{' '}
                      <a href="/terms" target="_blank" className="text-[#0D9488] font-bold hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" target="_blank" className="text-[#0D9488] font-bold hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] py-2.5 text-xs font-bold text-white shadow-md transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span>Processing...</span>
                  ) : (
                    <>
                      {mode === 'signup' && <span>Create Account & Continue</span>}
                      {mode === 'login' && <span>Sign In</span>}
                      {mode === 'forgot' && <span>Send Password Reset Instructions</span>}
                      {mode === 'reset' && <span>Update Password</span>}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            <div className="mt-6 text-center text-xs text-zinc-500">
              {mode === 'signup' && (
                <p>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setInfoMessage(null)
                      setMode('login')
                    }}
                    className="font-semibold text-[#0D9488] hover:underline"
                  >
                    Log in here
                  </button>
                </p>
              )}

              {mode === 'login' && (
                <p>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setInfoMessage(null)
                      setMode('signup')
                    }}
                    className="font-semibold text-[#0D9488] hover:underline"
                  >
                    Sign up free
                  </button>
                </p>
              )}

              {(mode === 'forgot' || mode === 'reset') && (
                <p>
                  Remember your password?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null)
                      setInfoMessage(null)
                      setMode('login')
                    }}
                    className="font-semibold text-[#0D9488] hover:underline"
                  >
                    Back to Login
                  </button>
                </p>
              )}

              {onExploreDemo && (
                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80">
                  <button
                    type="button"
                    onClick={onExploreDemo}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 transition-colors"
                  >
                    <span>Want to test first?</span>
                    <span className="font-bold underline">Explore Demo Account →</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

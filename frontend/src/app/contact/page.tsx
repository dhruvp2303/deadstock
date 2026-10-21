'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Building2, Mail, Phone, ShieldCheck, MapPin, CheckCircle2, AlertCircle, Send, Clock, UserCheck } from 'lucide-react'
import { Logo } from '@/components/brand/Logo'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: 'general',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedTicket, setSubmittedTicket] = useState<{ id: string; sla: string } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'}/api/v1/support/ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmittedTicket({
          id: data.data.ticket_id,
          sla: data.data.sla_response_time,
        })
        setFormData({ name: '', email: '', subject: '', category: 'general', message: '' })
      } else {
        setErrorMessage(data.message || 'Unable to submit support ticket. Please verify your details.')
      }
    } catch {
      setErrorMessage('Network error occurred. Please check your internet connection or email support directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#080B10] text-[#E6EDF3] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between border-b border-[#21262D] pb-6 mb-8">
          <Logo size="md" variant="dark" withTagline={true} />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Platform
          </Link>
        </div>

        {/* Header */}
        <div className="pb-8 mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-[#0D9488]">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Contact & Support Centre</h1>
              <p className="text-sm text-[#8B949E]">Official B2B Support, Inquiries & Statutory Grievance Redressal</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column: Statutory and Corporate Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0D9488]" />
                Corporate Entity
              </h3>
              <div className="text-xs text-[#8B949E] space-y-2">
                <p className="text-white font-medium">DeadStock Technologies Pvt. Ltd.</p>
                <p>CIN: <span className="font-mono text-teal-400">U72900HR2026PTC109842</span></p>
                <div className="flex items-start gap-2 pt-2 text-[#8B949E]">
                  <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>DLF Cyber City, Phase 2, Gurugram, Haryana 122002, India</span>
                </div>
              </div>
            </div>

            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Direct Channels</h3>
              <div className="text-xs space-y-2.5">
                <div className="flex items-center gap-2.5 text-[#8B949E]">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <a href="mailto:support@deadstock.in" className="text-teal-300 hover:underline">support@deadstock.in</a>
                </div>
                <div className="flex items-center gap-2.5 text-[#8B949E]">
                  <Mail className="w-4 h-4 text-teal-400" />
                  <a href="mailto:billing@deadstock.in" className="text-teal-300 hover:underline">billing@deadstock.in</a>
                </div>
                <div className="flex items-center gap-2.5 text-[#8B949E]">
                  <Phone className="w-4 h-4 text-purple-400" />
                  <span>+91 124 489 2000 (Mon–Fri, 9AM–6PM IST)</span>
                </div>
              </div>
            </div>

            {/* Statutory Grievance Redressal */}
            <div className="bg-[#161B22]/70 border border-teal-500/20 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Grievance Officer
              </h3>
              <p className="text-[11px] text-[#8B949E] leading-relaxed">
                Appointed pursuant to Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021 & DPDP Act, 2023.
              </p>
              <div className="text-xs space-y-1">
                <p className="text-white font-medium">Mr. Rohan Sharma</p>
                <p className="text-[#8B949E]">Principal Grievance & Compliance Officer</p>
                <p className="text-teal-400 font-mono">grievance@deadstock.in</p>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-[#8B949E] pt-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Response within 24h • Resolution within 15 days</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Ticket / Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-[#0D1117] border border-[#21262D] rounded-2xl p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-2">Submit an Inquiry or Support Ticket</h2>
              <p className="text-xs text-[#8B949E] mb-6">
                Our operations, escrow arbitration, and technical support team respond within 24 business hours.
              </p>

              {submittedTicket ? (
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-2xl p-6 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-teal-400 mx-auto" />
                  <div>
                    <h3 className="text-base font-bold text-white">Ticket Submitted Successfully</h3>
                    <p className="text-xs text-[#8B949E] mt-1">Your verifiable support ticket reference ID is:</p>
                    <p className="text-lg font-mono font-bold text-teal-400 mt-2 bg-[#080B10] py-2 px-4 rounded-xl inline-block border border-teal-500/20">
                      {submittedTicket.id}
                    </p>
                  </div>
                  <p className="text-xs text-[#8B949E]">
                    Standard SLA Commitment: Response within {submittedTicket.sla}. Please preserve this ticket ID for correspondence.
                  </p>
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="text-xs font-semibold text-teal-400 hover:text-teal-300 underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rajesh Mehta"
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Official Work Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rajesh@enterprisecorp.com"
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-[#0D9488]"
                      >
                        <option value="general">General Business Inquiry</option>
                        <option value="billing_refund">Billing, Listing Fee Rebate & Invoicing</option>
                        <option value="listing_dispute">B2B Deal Escrow & Inspection Dispute</option>
                        <option value="grievance_dpdp">Statutory Grievance / DPDP Data Rights</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Subject *</label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        placeholder="e.g. Question regarding listing fee rebate"
                        className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-[#0D9488]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#8B949E] mb-1.5">Message / Case Details *</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please provide comprehensive context regarding your inquiry, lot reference, or dispute details..."
                      className="w-full bg-[#161B22] border border-[#30363D] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-[#484F58] focus:outline-none focus:border-[#0D9488]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-4 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] disabled:opacity-50 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#0D9488]/20"
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Support Ticket
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

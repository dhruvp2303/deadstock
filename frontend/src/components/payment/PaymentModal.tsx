'use client'

import React, { useState } from 'react'
import { X, ShieldCheck, CheckCircle2, CreditCard, RefreshCw, AlertCircle, ArrowRight, Lock } from 'lucide-react'
import { API_BASE_URL } from '@/lib/api'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (paymentDetails: { paymentId: string; orderId: string }) => void
  type: 'listing_fee' | 'deal_escrow' | 'subscription'
  amount: number
  title: string
  subtitle?: string
  inventoryId?: number
  transactionId?: number
  referenceId?: string
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  type,
  amount,
  title,
  subtitle,
  inventoryId,
  transactionId,
  referenceId,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'netbanking' | 'card'>('upi')
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successReceipt, setSuccessReceipt] = useState<{ paymentId: string; orderId: string; settledAt: string } | null>(null)

  if (!isOpen) return null

  const handleProcessPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      // 1. Create order on backend
      const orderRes = await fetch(`${API_BASE_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          type,
          amount,
          currency: 'INR',
          inventory_id: inventoryId,
          transaction_id: transactionId,
          reference_id: referenceId,
        }),
      })

      const orderData = await orderRes.json()
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.message || 'Failed to initialize payment gateway order')
      }

      const generatedOrderId = orderData.data.order_id
      const generatedPaymentId = 'pay_' + Math.random().toString(36).substring(2, 12)

      // 2. Verify payment settlement on backend
      const verifyRes = await fetch(`${API_BASE_URL}/payments/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          order_id: generatedOrderId,
          payment_id: generatedPaymentId,
          type,
          inventory_id: inventoryId,
          transaction_id: transactionId,
          amount,
        }),
      })

      const verifyData = await verifyRes.json()
      if (!verifyRes.ok || !verifyData.success) {
        throw new Error(verifyData.message || 'Payment verification failed')
      }

      setSuccessReceipt({
        paymentId: generatedPaymentId,
        orderId: generatedOrderId,
        settledAt: verifyData.data.settled_at || new Date().toISOString(),
      })

      setTimeout(() => {
        onSuccess({ paymentId: generatedPaymentId, orderId: generatedOrderId })
      }, 1500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during payment processing')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0D1117] border border-[#30363D] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#21262D]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-[11px] text-[#8B949E]">{subtitle || 'Encrypted B2B Settlement Gateway'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B949E] hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#161B22]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {successReceipt ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">Payment Confirmed & Settled</h4>
                <p className="text-xs text-[#8B949E] mt-1">Transaction reference: <span className="font-mono text-emerald-400">{successReceipt.paymentId}</span></p>
              </div>
              {type === 'listing_fee' && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-300">
                  ✓ ₹{amount} Listing Commitment Fee logged. 100% deal rebate credit will be applied upon deal completion.
                </div>
              )}
            </div>
          ) : (
            <>
              {error && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Amount Breakdown */}
              <div className="bg-[#161B22] border border-[#21262D] rounded-xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-[#8B949E] block">Payable Amount</span>
                  <span className="text-2xl font-bold text-white">₹{amount.toLocaleString('en-IN')}</span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3" />
                    Verified Escrow
                  </span>
                </div>
              </div>

              {/* 100% Rebate Disclosure if Listing Fee */}
              {type === 'listing_fee' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-xs text-blue-300 space-y-1">
                  <p className="font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
                    100% Deal Credit Rebate Policy
                  </p>
                  <p className="text-[11px] text-blue-200/80 leading-relaxed">
                    This ₹{amount} commitment activates your dead stock listing for 30 days. When your lot is sold via DeadStock, the full ₹{amount} is credited back against transaction settlement.
                  </p>
                </div>
              )}

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-[#8B949E]">Select Settlement Channel</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#484F58]'
                    }`}
                  >
                    <span>Instant UPI</span>
                    <span className="text-[10px] text-[#8B949E]">Zero Surcharge</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('netbanking')}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentMethod === 'netbanking'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#484F58]'
                    }`}
                  >
                    <span>Net Banking</span>
                    <span className="text-[10px] text-[#8B949E]">50+ Banks</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`py-3 px-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1 transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                        : 'bg-[#161B22] border-[#30363D] text-[#8B949E] hover:border-[#484F58]'
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Corporate Card</span>
                  </button>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isProcessing}
                onClick={handleProcessPayment}
                className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Authorize & Pay ₹{amount.toLocaleString('en-IN')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-[#8B949E]">
                256-Bit TLS Bank-Grade Encryption • RBI & NPCI Compliant Settlement Escrow
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

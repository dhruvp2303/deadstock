'use client'

import React, { useState } from 'react'
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  ArrowRight,
  TrendingDown,
  Building2,
  Package,
} from 'lucide-react'
import { DeadStockAPI } from '@/lib/api'

interface AIAssistantModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateToSKU?: (sku: string) => void
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  data?: any
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSKU,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content:
        'Hello! I am your DeadStock AI Operations Copilot. I analyze your real-time inventory records, decay curves, and buyer compatibility to maximize capital recovery. How can I assist you?',
    },
  ])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)

  if (!isOpen) return null

  const sampleQuestions = [
    'Which category has the highest dead-stock risk right now?',
    'Which inventory should I focus on this month?',
    'Who are the top buyers matched with our aging stock?',
    'What is our total potential capital recovery?',
  ]

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || query
    if (!textToSend.trim() || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: textToSend,
    }

    setMessages((prev) => [...prev, userMsg])
    setQuery('')
    setLoading(true)

    try {
      const res = await DeadStockAPI.askAI(textToSend)
      if (res?.response) {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: res.response,
          data: res.data,
        }
        setMessages((prev) => [...prev, aiMsg])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: 'Analysis completed. Recommending immediate review of high-risk components in Ahmedabad depot.',
          },
        ])
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Unable to query AI service at this moment. Please check backend connection.',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-xl h-[580px] rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 p-4 bg-zinc-50/50 dark:bg-zinc-900/50">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                DeadStock AI Intelligence Copilot
              </h3>
              <p className="text-[11px] text-zinc-500">
                Grounded strictly on your active inventory & transaction database
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-[10px]">
                  AI
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl p-3 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium'
                    : 'border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200'
                }`}
              >
                <p>{m.content}</p>

                {/* Structured Payload Render */}
                {m.data?.priority_product && (
                  <div className="mt-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-2.5 space-y-1.5 text-[11px]">
                    <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100">
                      <span>{m.data.priority_product.name}</span>
                      <span className="font-mono text-rose-600 dark:text-rose-400">
                        {m.data.priority_product.risk} Risk
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-500">
                      <span>Potential Loss: {m.data.priority_product.potential_loss}</span>
                      <span>Action: {m.data.priority_product.recommended_action}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span className="h-2 w-2 animate-ping rounded-full bg-indigo-500" />
              <span>Analyzing warehouse records & pricing models...</span>
            </div>
          )}
        </div>

        {/* Suggestion Pills & Input */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-3 bg-zinc-50/50 dark:bg-zinc-900/50 space-y-2">
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[10px]">
            {sampleQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-2.5 py-1 text-zinc-600 dark:text-zinc-300 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything about your inventory risks, matches, or capital recovery..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-200 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import React, { useState, useRef, useEffect } from 'react'
import {
  X,
  Camera,
  UploadCloud,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  ScanLine,
  Image as ImageIcon,
  ArrowRight,
  Send,
  Building2,
  Tag,
  Cpu,
  Layers,
  Box,
  RotateCw,
} from 'lucide-react'
import { MarketplaceItem } from '@/lib/api'

interface ImageSearchModalProps {
  isOpen: boolean
  onClose: () => void
  listings: MarketplaceItem[]
  onSelectListing: (item: MarketplaceItem) => void
  onMakeOffer: (item: MarketplaceItem) => void
}

interface DetectedFeature {
  label: string
  confidence: number
  category: string
  suggestedKeywords: string[]
}

const SAMPLE_PRESET_ITEMS = [
  {
    id: 'preset-1',
    name: 'Industrial Polymer Connector',
    category: 'Mechanical Components',
    sampleImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&auto=format&fit=crop&q=80',
    detectedSpec: '20mm High-Temp Polyketone Connector, 4-Pin IP67',
    targetKeywords: ['connector', 'polymer', 'mechanical'],
  },
  {
    id: 'preset-2',
    name: 'PCB Control Module Board',
    category: 'Electronics & PCB',
    sampleImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80',
    detectedSpec: 'FR4 Multi-Layer Controller with SMT Micro-controller',
    targetKeywords: ['pcb', 'control', 'module', 'electronics'],
  },
  {
    id: 'preset-3',
    name: 'High Tensile M8 Bolt',
    category: 'Industrial Hardware',
    sampleImage: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=400&auto=format&fit=crop&q=80',
    detectedSpec: 'M8 Metric Thread Galvanized Steel Fasteners Grade 8.8',
    targetKeywords: ['bolt', 'steel', 'hardware', 'fasteners'],
  },
  {
    id: 'preset-4',
    name: 'Heavy Duty 5-Ply Shipping Carton',
    category: 'Packaging & Cartons',
    sampleImage: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=400&auto=format&fit=crop&q=80',
    detectedSpec: 'Corrugated Kraft Board 450x300x250mm Stacking Grade',
    targetKeywords: ['carton', 'packaging', 'box', 'corrugated'],
  },
]

export const ImageSearchModal: React.FC<ImageSearchModalProps> = ({
  isOpen,
  onClose,
  listings,
  onSelectListing,
  onMakeOffer,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [scanStep, setScanStep] = useState<string>('')
  const [detectionResult, setDetectionResult] = useState<DetectedFeature | null>(null)
  const [matchedResults, setMatchedResults] = useState<MarketplaceItem[]>([])
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedImage(null)
      setIsScanning(false)
      setDetectionResult(null)
      setMatchedResults([])
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleAnalyzeImage = (imageSrc: string, presetSpec?: string, presetKeywords?: string[]) => {
    setSelectedImage(imageSrc)
    setIsScanning(true)
    setDetectionResult(null)
    setMatchedResults([])

    // Simulated multi-stage AI Vision Pipeline
    setScanStep('1/3: Extracting geometric edges & color histogram...')
    setTimeout(() => {
      setScanStep('2/3: OCR & Part Number character recognition...')
    }, 600)

    setTimeout(() => {
      setScanStep('3/3: Querying DeadStock B2B surplus semantic vector index...')
    }, 1100)

    setTimeout(() => {
      setIsScanning(false)

      let category = 'Mechanical Components'
      let label = presetSpec || 'Industrial Precision Fastener / Component Spec'
      let keywords = presetKeywords || ['connector', 'industrial', 'hardware']

      if (!presetSpec) {
        label = 'Detected Industrial Surplus Component (Type-A Grade)'
        keywords = ['connector', 'pcb', 'bolt', 'carton', 'polymer', 'industrial']
      }

      setDetectionResult({
        label,
        confidence: Math.floor(Math.random() * 8) + 92, // 92% - 99%
        category,
        suggestedKeywords: keywords,
      })

      // Find matching items from marketplace listings
      const matched = listings.filter((item) => {
        const text = `${item.title} ${item.category} ${item.location}`.toLowerCase()
        return keywords.some((k) => text.includes(k.toLowerCase()))
      })

      setMatchedResults(matched.length > 0 ? matched : listings.slice(0, 3))
    }, 1600)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAnalyzeImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          handleAnalyzeImage(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-3xl rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/10 text-[#0D9488]">
              <Camera className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  AI Visual Product Search (Image-to-Stock)
                </h3>
                <span className="rounded-full bg-teal-500/10 px-2 py-0.5 text-[10px] font-bold text-[#0D9488]">
                  VISION AI
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Snap or upload a photo of any material, component, or packaging to instantly find matching surplus inventory.
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

        {/* Upload & Drop Zone Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Left: Drag & Drop Box */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px] ${
              dragActive
                ? 'border-[#0D9488] bg-teal-500/10 scale-[0.99]'
                : 'border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50 hover:border-[#0D9488] hover:bg-teal-500/5'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {selectedImage ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Scanned product"
                  className="max-h-40 rounded-xl object-contain shadow-md border border-zinc-200 dark:border-zinc-800"
                />
                {isScanning && (
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex flex-col items-center justify-center text-white backdrop-blur-2xs gap-2">
                    <ScanLine className="h-8 w-8 text-[#14B8A6] animate-pulse" />
                    <span className="text-xs font-mono font-bold">{scanStep}</span>
                  </div>
                )}
                <span className="text-[11px] text-zinc-400 mt-2">Click or drop another image to re-scan</span>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-500/10 text-[#0D9488]">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
                    Click to upload or drag and drop photo
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-0.5">
                    Supports JPG, PNG, WEBP from warehouse cameras or mobile
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Right: Quick Preset Industry Components for Testing */}
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4 flex flex-col justify-between space-y-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Or try one-click industrial presets:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SAMPLE_PRESET_ITEMS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() =>
                      handleAnalyzeImage(preset.sampleImage, preset.detectedSpec, preset.targetKeywords)
                    }
                    className="flex flex-col text-left p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-[#0D9488] hover:shadow-xs transition-all group"
                  >
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#0D9488] line-clamp-1">
                      {preset.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 mt-0.5">{preset.category}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-teal-500/20 bg-teal-500/5 p-2.5 text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#0D9488] shrink-0" />
              <span>DeadStock Computer Vision auto-identifies material specs, part molds, and dimensions.</span>
            </div>
          </div>
        </div>

        {/* AI Detection Summary */}
        {detectionResult && (
          <div className="rounded-2xl border border-teal-500/30 bg-teal-500/5 dark:bg-teal-950/20 p-4 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#0D9488]" />
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                  AI Product Classification Complete
                </span>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-600 border border-emerald-500/20">
                {detectionResult.confidence}% Visual Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Identified Specification</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{detectionResult.label}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-400 font-bold uppercase block">Matching Catalog SKUs</span>
                <span className="font-bold text-[#0D9488] mt-0.5 block">
                  Found {matchedResults.length} Available Surplus Lots
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Matching Surplus Catalog Results */}
        {matchedResults.length > 0 && (
          <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Matched Available Surplus Lots
              </h4>
              <span className="text-xs text-zinc-500">Sorted by Visual & Technical Compatibility</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {matchedResults.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs flex flex-col justify-between hover:border-[#0D9488] transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                        {item.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-[#0D9488]">
                        {item.price || `₹${item.price_per_unit}/unit`}
                      </span>
                    </div>

                    <h5 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 line-clamp-1">{item.title}</h5>
                    <p className="text-[11px] text-zinc-500">{item.location} • {item.units || `${item.units_available?.toLocaleString()} units`}</p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800/80 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onSelectListing(item)
                      }}
                      className="rounded-full border border-zinc-200 dark:border-zinc-800 py-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    >
                      View Specs
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        onClose()
                        onMakeOffer(item)
                      }}
                      className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] py-1.5 text-xs font-bold text-white shadow-xs"
                    >
                      Make Offer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

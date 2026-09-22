'use client'

import React, { useState, useMemo } from 'react'
import {
  Search,
  Tag,
  MapPin,
  Sparkles,
  ShoppingBag,
  Send,
  SlidersHorizontal,
  CheckCircle2,
  Building2,
  X,
  AlertCircle,
  Star,
  Heart,
  ChevronRight,
  RotateCcw,
  Check,
} from 'lucide-react'
import { MarketplaceItem, DeadStockAPI } from '@/lib/api'

interface MarketplaceViewProps {
  listings: MarketplaceItem[]
  onRefresh: () => void
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  onRefresh,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [selectedConditions, setSelectedConditions] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<number[]>([])

  const [selectedListing, setSelectedListing] = useState<MarketplaceItem | null>(null)
  const [offerQty, setOfferQty] = useState<number>(1000)
  const [offerPrice, setOfferPrice] = useState<number>(30)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Filter Categories, Locations, etc.
  const categoriesList = ['Mechanical Components', 'Electronics & PCB', 'Plastic & Polymers', 'Packaging & Cartons', 'Industrial Hardware']
  const locationsList = ['Ahmedabad Depot', 'Surat Depot', 'Bengaluru Depot', 'Pune Center', 'Nagpur Center']
  const conditionsList = ['Factory Sealed Surplus', 'Overstock Excess', 'Reworked Certified']

  const toggleFilter = (list: string[], setList: (val: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter((i) => i !== item))
    } else {
      setList([...list, item])
    }
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setSelectedLocations([])
    setSelectedConditions([])
    setSearchTerm('')
  }

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
  }

  const filtered = useMemo(() => {
    return listings.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())

      const matchCat =
        selectedCategories.length === 0 ||
        (item.category && selectedCategories.includes(item.category))

      const matchLoc =
        selectedLocations.length === 0 ||
        selectedLocations.some((loc) => item.location.toLowerCase().includes(loc.toLowerCase().split(' ')[0]))

      let matchPrice = true
      const priceVal = item.price_per_unit || 30
      if (selectedPriceRanges.length > 0) {
        matchPrice = selectedPriceRanges.some((range) => {
          if (range === 'under_20') return priceVal < 20
          if (range === '20_50') return priceVal >= 20 && priceVal <= 50
          if (range === '50_100') return priceVal > 50 && priceVal <= 100
          if (range === '100_plus') return priceVal > 100
          return true
        })
      }

      return matchSearch && matchCat && matchLoc && matchPrice
    })
  }, [listings, searchTerm, selectedCategories, selectedLocations, selectedPriceRanges])

  const handleOpenOfferModal = (item: MarketplaceItem) => {
    setSelectedListing(item)
    setOfferQty(item.units_available || 2000)
    setOfferPrice(item.price_per_unit || 35)
    setNotes('')
    setSuccessMessage(null)
    setErrorMessage(null)
  }

  const handleSendOffer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedListing) return
    setSubmitting(true)
    setErrorMessage(null)

    try {
      const res = await DeadStockAPI.sendOffer({
        inventory_id: selectedListing.id,
        receiver_company_id: 1,
        offered_quantity: offerQty,
        offered_unit_price: offerPrice,
        notes: notes || `Direct B2B buyer offer submitted for ${offerQty} units at ₹${offerPrice}/unit.`,
      })

      if (res?.success) {
        setSuccessMessage('Offer submitted successfully! Seller has been notified.')
        setTimeout(() => {
          setSelectedListing(null)
          onRefresh()
        }, 1200)
      } else {
        setErrorMessage(res?.message || 'Failed to submit offer.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while submitting the offer.')
    } finally {
      setSubmitting(false)
    }
  }

  const activeFiltersCount =
    selectedCategories.length + selectedPriceRanges.length + selectedLocations.length + selectedConditions.length

  return (
    <div className="space-y-4">
      {/* Top Breadcrumb & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <ShoppingBag className="h-4 w-4 text-[#0D9488]" />
          <span>Marketplace</span>
          <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />
          <span className="text-zinc-900 dark:text-zinc-100 font-bold">Surplus Catalog</span>
        </div>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search surplus catalog (⌘F)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 py-1.5 pl-9 pr-4 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:border-[#0D9488] focus:outline-none"
          />
        </div>
      </div>

      {/* Main Grid + Filter Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Filter Sidebar */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-xs space-y-6 sticky top-20">
          <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-zinc-100">
              <SlidersHorizontal className="h-3.5 w-3.5 text-[#0D9488]" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-teal-500/10 px-1.5 py-0.2 text-[10px] font-mono text-[#0D9488]">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] font-semibold text-[#0D9488] hover:underline"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Category</label>
            <div className="space-y-1.5">
              {categoriesList.map((cat) => (
                <label key={cat} className="flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                    className="h-3.5 w-3.5 rounded border-zinc-300 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Unit Price</label>
            <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              {[
                { id: 'under_20', label: 'Under ₹20' },
                { id: '20_50', label: '₹20 – ₹50' },
                { id: '50_100', label: '₹50 – ₹100' },
                { id: '100_plus', label: '₹100+' },
              ].map((p) => (
                <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPriceRanges.includes(p.id)}
                    onChange={() => toggleFilter(selectedPriceRanges, setSelectedPriceRanges, p.id)}
                    className="h-3.5 w-3.5 rounded border-zinc-300 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <span>{p.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">Warehouse Origin</label>
            <div className="space-y-1.5 text-xs text-zinc-700 dark:text-zinc-300">
              {locationsList.map((loc) => (
                <label key={loc} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLocations.includes(loc)}
                    onChange={() => toggleFilter(selectedLocations, setSelectedLocations, loc)}
                    className="h-3.5 w-3.5 rounded border-zinc-300 text-[#0D9488] focus:ring-[#0D9488]"
                  />
                  <span>{loc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Product Grid (4-columns on wide screens) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Active Chips Strip */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {selectedCategories.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-1 text-[11px] font-medium text-[#0D9488] border border-teal-500/20"
                >
                  {c}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter(selectedCategories, setSelectedCategories, c)}
                  />
                </span>
              ))}
              {selectedLocations.map((l) => (
                <span
                  key={l}
                  className="inline-flex items-center gap-1 rounded-full bg-zinc-200/70 dark:bg-zinc-800 px-2.5 py-1 text-[11px] font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {l}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => toggleFilter(selectedLocations, setSelectedLocations, l)}
                  />
                </span>
              ))}
            </div>
          )}

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.length === 0 ? (
              <div className="col-span-full py-16 text-center text-zinc-400 bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                <ShoppingBag className="mx-auto h-10 w-10 text-zinc-300 dark:text-zinc-700 mb-2" />
                <h4 className="font-bold text-sm text-zinc-800 dark:text-zinc-200">No surplus lots matched your filters</h4>
                <p className="text-xs text-zinc-400 mt-1">Try resetting the filter criteria or search query.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-3 rounded-full bg-[#0D9488] px-4 py-1.5 text-xs font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              filtered.map((item) => {
                const isFav = wishlist.includes(item.id)
                return (
                  <div
                    key={item.id}
                    className="group rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-4 shadow-xs hover:border-[#0D9488]/40 hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Tag & Wishlist */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="rounded-md bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                          {item.category || 'Components'}
                        </span>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(item.id)}
                          className="text-zinc-400 hover:text-rose-500 transition-colors"
                        >
                          <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      {/* Title */}
                      <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-[#0D9488] transition-colors">
                        {item.title}
                      </h4>

                      {/* Meta info */}
                      <div className="mt-3 space-y-1.5 text-xs text-zinc-500">
                        <div className="flex items-center gap-1 text-[11px] text-amber-500 font-semibold">
                          <Star className="h-3 w-3 fill-amber-500" />
                          <span>4.8 (18 reviews)</span>
                          <span className="text-zinc-400 font-normal">• Verified Batch</span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-zinc-400">
                          <MapPin className="h-3 w-3" />
                          <span>{item.location}</span>
                        </div>

                        <div className="pt-2 flex items-baseline justify-between border-t border-zinc-100 dark:border-zinc-800/80">
                          <div>
                            <span className="text-[10px] text-zinc-400 block">Surplus Price</span>
                            <span className="text-base font-black font-mono text-[#0D9488] dark:text-[#14B8A6]">
                              {item.price || `₹${item.price_per_unit}/unit`}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-[10px] text-zinc-400 block">Volume</span>
                            <span className="text-xs font-mono font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.units || `${item.units_available?.toLocaleString()} units`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Teal Pill Button: Submit Offer */}
                    <div className="mt-4 pt-2">
                      <button
                        type="button"
                        onClick={() => handleOpenOfferModal(item)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] py-2 text-xs font-bold text-white shadow-xs transition-all hover:shadow-teal-500/20"
                      >
                        <Send className="h-3 w-3" />
                        <span>Submit Offer</span>
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      {/* Offer Submission Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  Submit B2B Offer
                </h3>
                <p className="text-xs text-zinc-500 line-clamp-1">{selectedListing.title}</p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/50 p-3 text-xs text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage ? (
              <div className="mt-6 py-4 text-center space-y-2">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-teal-500/10 text-[#0D9488]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{successMessage}</p>
              </div>
            ) : (
              <form onSubmit={handleSendOffer} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Offered Quantity
                    </label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={offerQty}
                      onChange={(e) => setOfferQty(Number(e.target.value))}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                      Offered Unit Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      min={0.01}
                      step={0.01}
                      value={offerPrice}
                      onChange={(e) => setOfferPrice(Number(e.target.value))}
                      className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono font-semibold text-[#0D9488]"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 flex items-center justify-between">
                  <span className="text-zinc-500">Total Proposed Capital:</span>
                  <span className="font-mono font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    ₹{(offerQty * offerPrice).toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    Notes & Logistics Terms
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Can arrange immediate truck pickup from Ahmedabad facility."
                    className="w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-zinc-100 dark:border-zinc-800 pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedListing(null)}
                    className="rounded-full border border-zinc-200 dark:border-zinc-800 px-4 py-1.5 text-xs font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || offerQty <= 0}
                    className="rounded-full bg-[#0D9488] hover:bg-[#0F9D8D] px-5 py-1.5 text-xs font-bold text-white shadow-xs disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Dispatch Offer'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

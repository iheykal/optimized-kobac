'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutGrid, List, RefreshCw, Filter, MapPin } from 'lucide-react'
import { Property, PropertyType } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'
import PropertyCard from './PropertyCard'
import PropertyModal from './PropertyModal'

// Generates the SEO slug for a property (must match PropertyCard logic)
function makePropertySlug(p: Property) {
    const type = (p.type || 'property').toLowerCase().replace(/\s+/g, '-')
    const district = (p.district || 'mogadishu').toLowerCase().replace(/\s+/g, '-')
    const listingType = (p.listingType || 'rent').toLowerCase() === 'sale' ? 'iib-ah' : 'kiro-ah'
    // Use seqId for clean URLs (e.g. KOB-20), fallback to full MongoDB id
    const idSegment = p.seqId ? `KOB-${p.seqId}` : (p.id || p._id)
    return `/p/${type}-${listingType}-${district}-${idSegment}`
}

export default function PropertyGrid({ properties }: { properties: Property[] }) {
    const router = useRouter()
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [filterType, setFilterType] = useState('')
    const [filterDistrict, setFilterDistrict] = useState('')
    const [selected, setSelected] = useState<Property | null>(null)
    const [key, setKey] = useState(0)

    // Derive filter options dynamically from real data
    const types = useMemo(() =>
        Array.from(new Set(properties.map(p => p.type))).sort(), [properties])

    const districts = useMemo(() =>
        Array.from(new Set(properties.map(p => p.district))).sort(), [properties])

    const filtered = useMemo(() =>
        properties.filter(p =>
            (!filterType || p.type === (filterType as PropertyType)) &&
            (!filterDistrict || p.district === filterDistrict)
        ), [properties, filterType, filterDistrict])

    const refresh = () => { setFilterType(''); setFilterDistrict(''); setKey(k => k + 1) }

    // When a property is selected, push the /p/[slug] URL so it's shareable
    const openProperty = useCallback((p: Property) => {
        setSelected(p)
        const url = makePropertySlug(p)
        // Silently update the URL bar without a page reload
        window.history.pushState({ propertyId: p.id || p._id }, '', url)
    }, [])

    // When modal closes, restore the homepage URL
    const closeProperty = useCallback(() => {
        setSelected(null)
        window.history.pushState({}, '', '/')
    }, [])

    // Handle browser Back button — if user presses Back while modal is open, just close modal
    useEffect(() => {
        const onPop = () => { setSelected(null) }
        window.addEventListener('popstate', onPop)
        return () => window.removeEventListener('popstate', onPop)
    }, [])

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Section heading */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Featured Properties</h2>
                    <p className="text-green-600 text-sm mt-0.5">Halkaan kadhex raadi guryaha xulka ah ee aan soo galinnay</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={refresh} className="flex items-center gap-1.5 border border-green-500 text-green-600 hover:bg-green-50 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                        <RefreshCw className="w-3.5 h-3.5" />Refresh
                    </button>
                    <button onClick={() => setViewMode('grid')} className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                        <LayoutGrid className="w-3.5 h-3.5" />Grid
                    </button>
                    <button onClick={() => setViewMode('list')} className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'border border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                        <List className="w-3.5 h-3.5" />List
                    </button>
                    <div className="flex items-center gap-1 border border-blue-300 text-blue-600 text-sm font-medium px-3 py-1.5 rounded-lg">
                        <MapPin className="w-3.5 h-3.5" /><span>Mogadishu</span>
                    </div>
                </div>
            </div>

            {/* Filter bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 mb-4 flex flex-wrap items-center gap-4">
                <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                    value={filterType}
                    onChange={e => {
                        const val = e.target.value
                        setFilterType(val)
                        if (val) trackEvent('search', { metadata: { type: val } })
                    }}
                    className="border-0 outline-none bg-transparent text-gray-700 text-sm font-medium cursor-pointer pr-2"
                >
                    <option value="">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="w-px h-5 bg-gray-200" />
                <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <select
                    value={filterDistrict}
                    onChange={e => {
                        const val = e.target.value
                        setFilterDistrict(val)
                        if (val) trackEvent('search', { district: val })
                    }}
                    className="border-0 outline-none bg-transparent text-gray-700 text-sm font-medium cursor-pointer pr-2"
                >
                    <option value="">All Districts</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            {/* Count */}


            {/* Cards */}
            <div key={key} className={viewMode === 'grid' ? 'grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5' : 'flex flex-col gap-4'}>
                {filtered.length === 0 ? (
                    <div className="col-span-3 py-20 text-center">
                        <p className="text-5xl mb-4">🏠</p>
                        <p className="font-semibold text-gray-500 text-lg">
                            {properties.length === 0 ? 'No properties available yet.' : 'No properties match your filters.'}
                        </p>
                        {filterType || filterDistrict ? (
                            <button onClick={refresh} className="mt-3 text-blue-600 text-sm underline">Clear filters</button>
                        ) : null}
                    </div>
                ) : (
                    filtered.map((p, i) => (
                        <PropertyCard key={p.id} property={p} viewMode={viewMode} index={i} onClick={() => openProperty(p)} />
                    ))
                )}
            </div>

            {selected && <PropertyModal property={selected} onClose={closeProperty} />}
        </section>
    )
}

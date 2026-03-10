'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, Calendar, Maximize2, RefreshCw, Share2, Link, Check } from 'lucide-react'
import { Property } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'
import AgentCard from './AgentCard'

export default function PropertyModal({ property, onClose, isStandalonePage = false }: { property: Property; onClose: () => void; isStandalonePage?: boolean }) {
    const [imgIdx, setImgIdx] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [showShare, setShowShare] = useState(false)
    const [copied, setCopied] = useState(false)
    // Store per-image aspect ratios {width, height} once each image loads
    const [imgRatios, setImgRatios] = useState<Record<number, { w: number; h: number }>>({})
    const total = property.images.length

    // Reset to first image when a new property is selected
    useEffect(() => {
        setImgIdx(0)
        setIsFullscreen(false)
        setImgRatios({})

        // Track modal view
        trackEvent('page_view', {
            propertyId: property.id || property._id,
            district: property.district,
            price: property.price
        })
    }, [property.id, property._id, property.district, property.price])

    const prev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setImgIdx(i => (i - 1 + total) % total)
        trackEvent('gallery_view', { propertyId: property.id || property._id })
    }, [total, property.id, property._id])

    const next = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation()
        setImgIdx(i => (i + 1) % total)
        trackEvent('gallery_view', { propertyId: property.id || property._id })
    }, [total, property.id, property._id])
    const toggleFullscreen = useCallback((e?: React.MouseEvent) => { e?.stopPropagation(); setIsFullscreen(v => !v) }, [])

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isFullscreen) setIsFullscreen(false)
                else onClose()
            }
            if (e.key === 'ArrowLeft') prev()
            if (e.key === 'ArrowRight') next()
        }
        document.addEventListener('keydown', handler)
        // Only lock scroll when used as a popup modal (not on standalone page)
        if (!isStandalonePage) {
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handler)
            if (!isStandalonePage) {
                document.body.style.overflow = ''
            }
        }
    }, [onClose, prev, next, isFullscreen, isStandalonePage])

    const listedDate = new Date(property.listedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // Compute container aspect ratio for the current image.
    // Falls back to 4/3 if not yet loaded.
    const currentRatio = imgRatios[imgIdx]
    const aspectRatio = currentRatio ? currentRatio.w / currentRatio.h : 4 / 3

    // For portrait images (taller than wide), we want a taller box.
    // We always fill the available width, then set height via paddingBottom trick.
    // On standalone page: use full natural aspect ratio (no height cap)
    // In modal: cap height at max 70vh so it never overflows the popup.
    const paddingBottom = isStandalonePage
        ? `${(1 / aspectRatio) * 100}%`
        : `min(${(1 / aspectRatio) * 100}%, 70vh)`

    return (
        <>
            {/* Main Modal or Standalone Container */}
            <div
                className={isStandalonePage ? `w-full transition-opacity ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}` : `fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={isStandalonePage ? undefined : onClose}
            >
                <div
                    className={isStandalonePage ? "bg-white w-full flex flex-col" : "bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"}
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header — hidden on standalone page since they have the browser back button */}
                    {!isStandalonePage && (
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-20">
                            <h2 className="font-bold text-gray-900 text-lg">Property Details</h2>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition-colors text-red-500 hover:text-red-700 border border-red-200"
                                title="Close"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row flex-1">
                        {/* Left: Image carousel — aspect-ratio adapts per image */}
                        <div className="md:w-[45%] flex-shrink-0 p-4">
                            {/*
                              Padding-bottom trick: the container's height = width × (1/aspectRatio).
                              This means portrait images (9:16) get a tall box,
                              landscape images (16:9) get a wide box.
                              "min(..., 70vh)" prevents it from being taller than the screen.
                            */}
                            <div
                                className="relative w-full rounded-xl overflow-hidden bg-gray-50 cursor-zoom-in group border border-gray-100"
                                style={{ paddingBottom, transition: 'padding-bottom 0.3s ease' }}
                                onClick={toggleFullscreen}
                            >
                                {/* Preloaded Image Stack */}
                                {property.images.map((src, i) => {
                                    // Optimization: Only render current, prev, and next images to save bandwidth
                                    const isVisible = Math.abs(i - imgIdx) <= 1 || (imgIdx === 0 && i === total - 1) || (imgIdx === total - 1 && i === 0);
                                    if (!isVisible) return null;

                                    return (
                                        <div
                                            key={src + i}
                                            style={{
                                                position: 'absolute',
                                                inset: 0,
                                                opacity: i === imgIdx ? 1 : 0,
                                                transition: 'opacity 0.2s ease',
                                                pointerEvents: i === imgIdx ? 'auto' : 'none',
                                            }}
                                        >
                                            {src.match(/\.(mp4|mov|webm)$/i) ? (
                                                <video
                                                    src={src}
                                                    controls
                                                    autoPlay={i === imgIdx}
                                                    muted
                                                    playsInline
                                                    loop
                                                    className="w-full h-full object-contain bg-black/5 rounded-2xl sm:rounded-l-3xl p-1"
                                                    onLoadedMetadata={(e) => {
                                                        const vid = e.currentTarget
                                                        setImgRatios(prev => ({
                                                            ...prev,
                                                            [i]: { w: vid.videoWidth, h: vid.videoHeight }
                                                        }))
                                                    }}
                                                />
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                                        <RefreshCw className="w-6 h-6 text-gray-300 animate-spin" />
                                                    </div>
                                                    <Image
                                                        src={src}
                                                        alt={`${property.title} – media ${i + 1}`}
                                                        fill
                                                        className="object-contain relative z-10"
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        priority={i === 0}
                                                        quality={80}
                                                        unoptimized={true}
                                                        onLoad={(e) => {
                                                            const img = e.currentTarget as HTMLImageElement
                                                            if (img.naturalWidth && img.naturalHeight) {
                                                                setImgRatios(prev => ({
                                                                    ...prev,
                                                                    [i]: { w: img.naturalWidth, h: img.naturalHeight }
                                                                }))
                                                            }
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    );
                                })}

                                {/* Overlay UI */}
                                {total > 1 && (
                                    <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full z-10 font-medium backdrop-blur-md">
                                        {imgIdx + 1}/{total}
                                    </span>
                                )}
                                <div className="absolute top-3 left-3 bg-black/50 text-white p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md hidden sm:flex">
                                    <Maximize2 className="w-4 h-4" />
                                </div>

                                {total > 1 && (
                                    <>
                                        <button
                                            onClick={prev}
                                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors md:opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={next}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white text-gray-800 rounded-full flex items-center justify-center shadow-lg z-10 transition-colors md:opacity-0 group-hover:opacity-100"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnail dots */}
                            {total > 1 && (
                                <div className="flex flex-wrap gap-1.5 justify-center mt-3 px-2">
                                    {property.images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                                            className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-blue-600 w-4' : 'bg-gray-300'}`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="flex-1 p-4 pt-2 md:pt-4">
                            {/* Type + District badge row — very prominent */}
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                    {property.type}
                                </span>
                                <span className="flex items-center gap-1 bg-green-50 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                    📍 {property.district} · Mogadishu
                                </span>
                            </div>

                            <h3 className="text-blue-600 font-bold text-2xl sm:text-3xl mb-1">{property.title}</h3>
                            <p className="text-green-600 font-bold text-2xl sm:text-3xl mb-4">
                                ${property.price.toLocaleString()}<span className="text-gray-400 font-normal text-sm ml-1">/{property.priceUnit}</span>
                            </p>

                            <div className="flex flex-col gap-2 mb-4">
                                {property.landmark ? (
                                    <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-fit">
                                        <span className="text-sm font-medium">📍 {property.landmark}</span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap items-center gap-2 mb-5">
                                <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />Lasoo dhigay {listedDate}
                                </span>

                                {/* SHARE BUTTON */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowShare(v => !v)}
                                        className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-bold px-3 py-1 rounded-full hover:bg-gray-700 transition-colors"
                                    >
                                        <Share2 className="w-3.5 h-3.5" /> Share
                                    </button>

                                    {/* Share popup */}
                                    {showShare && (() => {
                                        const propertyId = property.id || property._id
                                        const type = (property.type || 'property').toLowerCase().replace(/\s+/g, '-')
                                        const district = (property.district || 'mogadishu').toLowerCase().replace(/\s+/g, '-')
                                        const listingType = (property.listingType || 'rent') === 'sale' ? 'iib-ah' : 'kiro-ah'
                                        const shareUrl = typeof window !== 'undefined'
                                            ? `${window.location.origin}/p/${type}-${listingType}-${district}-${propertyId}`
                                            : ''
                                        const waText = encodeURIComponent(`🏠 *${property.title}*\n📍 ${property.district}, Mogadishu\n💰 $${property.price.toLocaleString()} / ${property.priceUnit}\n\nView full details: ${shareUrl}`)

                                        return (
                                            <div className="absolute left-0 top-8 bg-white border border-gray-200 rounded-2xl shadow-2xl p-3 z-50 w-52 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider px-1">Share this property</p>

                                                {/* WhatsApp */}
                                                <a
                                                    href={`https://wa.me/?text=${waText}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2.5 bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-sm px-3 py-2.5 rounded-xl transition-colors"
                                                >
                                                    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-600" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.554 4.122 1.523 5.855L.057 23.882l6.191-1.623A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.374l-.36-.214-3.727.977.997-3.645-.234-.374A9.818 9.818 0 112 12c0 5.414 4.404 9.818 9.818 9.818z" /></svg>
                                                    WhatsApp
                                                </a>

                                                {/* Copy Link */}
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(shareUrl)
                                                        setCopied(true)
                                                        setTimeout(() => { setCopied(false); setShowShare(false) }, 1800)
                                                    }}
                                                    className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-sm px-3 py-2.5 rounded-xl transition-colors"
                                                >
                                                    {copied ? <Check className="w-5 h-5 text-green-600" /> : <Link className="w-5 h-5" />}
                                                    {copied ? 'Copied!' : 'Copy Link'}
                                                </button>
                                            </div>
                                        )
                                    })()}
                                </div>
                            </div>

                            {/* Stats */}
                            {(property.bedrooms > 0 || property.bathrooms > 0) && (
                                <div className="grid grid-cols-2 gap-3 mb-5">
                                    {property.bedrooms > 0 && (
                                        <div className="bg-blue-50/60 rounded-xl p-3 flex flex-col items-center gap-1">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/icons/bed.webp" alt="Bedrooms" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                                            <span className="font-bold text-gray-900 text-xl">{property.bedrooms}</span>
                                            <span className="text-blue-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">Qol</span>
                                        </div>
                                    )}
                                    {property.bathrooms > 0 && (
                                        <div className="bg-blue-50/60 rounded-xl p-3 flex flex-col items-center gap-1">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src="/icons/shower.webp" alt="Bathrooms" style={{ width: 28, height: 28, objectFit: 'contain' }} />
                                            <span className="font-bold text-gray-900 text-xl">{property.bathrooms}</span>
                                            <span className="text-blue-600 text-[10px] sm:text-xs font-semibold uppercase tracking-wide">Suuli</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mb-2">
                                <h4 className="font-bold text-gray-900 mb-1 border-b border-gray-100 pb-2 text-sm uppercase tracking-wide">Faah-Faahin</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mt-2">{property.description}</p>
                            </div>

                            <div className="mt-6">
                                <AgentCard agent={property.agent} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FULLSCREEN IMAGE VIEWER */}
            {isFullscreen && (
                <div
                    className="fixed inset-0 z-[100] bg-black bg-opacity-95 backdrop-blur-3xl flex items-center justify-center animate-in fade-in duration-200"
                    onClick={toggleFullscreen}
                >
                    {/* Top Bar */}
                    <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/60 to-transparent">
                        <span className="text-white font-medium text-sm px-3 py-1 bg-white/10 rounded-full backdrop-blur-md border border-white/20">
                            {imgIdx + 1} / {total}
                        </span>
                        <button
                            onClick={toggleFullscreen}
                            className="bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full p-2 backdrop-blur-md transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Fullscreen Image Stack — always fits screen, respects ratio */}
                    <div className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center p-2 sm:p-10 pb-24 sm:pb-20">
                        {property.images.map((src, i) => {
                            // Fullscreen virtualization: only render current and neighbors
                            const isVisible = Math.abs(i - imgIdx) <= 1 || (imgIdx === 0 && i === total - 1) || (imgIdx === total - 1 && i === 0);
                            if (!isVisible) return null;

                            return (
                                <div
                                    key={"fs" + src + i}
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        opacity: i === imgIdx ? 1 : 0,
                                        transition: 'opacity 0.25s ease, transform 0.25s ease',
                                        transform: i === imgIdx ? 'scale(1)' : 'scale(0.97)',
                                        pointerEvents: i === imgIdx ? 'auto' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '16px',
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Image
                                        src={src}
                                        alt={`Fullscreen image ${i + 1}`}
                                        fill
                                        className="object-contain"
                                        sizes="100vw"
                                        quality={85}
                                        unoptimized={true}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Navigation Arrows */}
                    {total > 1 && (
                        <>
                            <button
                                onClick={prev}
                                className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 z-50"
                            >
                                <ChevronLeft className="w-8 h-8 -ml-1" />
                            </button>
                            <button
                                onClick={next}
                                className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/5 hover:bg-white/15 border border-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-105 active:scale-95 z-50"
                            >
                                <ChevronRight className="w-8 h-8 -mr-1" />
                            </button>
                        </>
                    )}

                    {/* Bottom Thumbnail Track */}
                    {total > 1 && (
                        <div
                            className="absolute bottom-6 inset-x-0 flex justify-center z-50 px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex gap-2 p-2 bg-black/50 backdrop-blur-xl border border-white/10 rounded-full max-w-full overflow-x-auto py-2 px-3">
                                {property.images.map((src, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImgIdx(i)}
                                        className={`relative w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx ? 'border-blue-500 scale-105 shadow-lg' : 'border-transparent opacity-50 hover:opacity-100'}`}
                                    >
                                        <Image src={src} alt="thumb" fill className="object-cover" sizes="64px" unoptimized />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    )
}

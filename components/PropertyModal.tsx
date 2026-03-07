'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Maximize2, RefreshCw } from 'lucide-react'
import { Property } from '@/lib/types'
import AgentCard from './AgentCard'

export default function PropertyModal({ property, onClose }: { property: Property; onClose: () => void }) {
    const [imgIdx, setImgIdx] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)
    // Store per-image aspect ratios {width, height} once each image loads
    const [imgRatios, setImgRatios] = useState<Record<number, { w: number; h: number }>>({})
    const total = property.images.length

    // Reset to first image when a new property is selected
    useEffect(() => {
        setImgIdx(0)
        setIsFullscreen(false)
        setImgRatios({})
    }, [property.id])

    const prev = useCallback((e?: React.MouseEvent) => { e?.stopPropagation(); setImgIdx(i => (i - 1 + total) % total) }, [total])
    const next = useCallback((e?: React.MouseEvent) => { e?.stopPropagation(); setImgIdx(i => (i + 1) % total) }, [total])
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
        document.body.style.overflow = 'hidden'
        return () => { document.removeEventListener('keydown', handler); document.body.style.overflow = '' }
    }, [onClose, prev, next, isFullscreen])

    const listedDate = new Date(property.listedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // Compute container aspect ratio for the current image.
    // Falls back to 4/3 if not yet loaded.
    const currentRatio = imgRatios[imgIdx]
    const aspectRatio = currentRatio ? currentRatio.w / currentRatio.h : 4 / 3

    // For portrait images (taller than wide), we want a taller box.
    // We always fill the available width, then set height via paddingBottom trick.
    // Cap height at max 70vh so it never overflows the modal.
    const paddingBottom = `min(${(1 / aspectRatio) * 100}%, 70vh)`

    return (
        <>
            {/* Main Modal */}
            <div
                className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-opacity ${isFullscreen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={onClose}
            >
                <div
                    className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-20">
                        <h2 className="font-bold text-gray-900 text-lg">Property Details</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

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
                            <h3 className="text-blue-600 font-bold text-2xl sm:text-3xl mb-1">{property.title}</h3>
                            <p className="text-green-600 font-bold text-2xl sm:text-3xl mb-4">
                                ${property.price}<span className="text-gray-400 font-normal text-sm ml-1">/{property.priceUnit}</span>
                            </p>

                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg w-fit">
                                    <MapPin className="w-4 h-4 text-green-600" />
                                    <span className="text-sm font-medium">{property.district}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg w-fit">
                                    <MapPin className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">{property.landmark}</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-5">
                                <span className="bg-amber-50 text-amber-700 text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />Lasoo dhigay {listedDate}
                                </span>
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

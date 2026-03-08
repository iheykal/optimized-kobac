'use client'

import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { Property } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'


interface PropertyCardProps {
    property: Property
    viewMode: 'grid' | 'list'
    onClick: () => void
    index?: number
}

export default function PropertyCard({ property, viewMode, onClick, index = 0 }: PropertyCardProps) {
    if (viewMode === 'list') {
        return (
            <div
                className="property-card card-appear bg-white rounded-xl shadow-sm border border-gray-100 cursor-pointer flex overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => {
                    trackEvent('property_click', {
                        propertyId: property.id || property._id,
                        district: property.district,
                        price: property.price
                    })
                    onClick()
                }}
            >
                <div className="relative w-48 flex-shrink-0">
                    <Image src={property.images[0]} alt={property.title} fill className="object-cover" loading="lazy" sizes="192px" unoptimized={true} />
                </div>
                <div className="p-4 flex flex-col justify-between flex-1">
                    <div>
                        <h3 className="font-bold text-gray-900 text-base mb-1">{property.title}</h3>
                        <div className="flex items-center gap-1 text-green-600 text-sm mb-0.5">
                            <MapPin className="w-3.5 h-3.5" /><span>{property.district}</span>
                        </div>
                        <p className="text-gray-400 text-xs uppercase tracking-wide">{property.landmark}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p>
                            <span className="text-green-600 font-bold text-lg">${property.price}</span>
                            <span className="text-gray-400 text-xs">/{property.priceUnit}</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex flex-col items-center gap-0.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/icons/bed.webp" alt="Bed" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                                <span className="font-semibold text-gray-900">{property.bedrooms > 0 ? property.bedrooms : '—'}</span>
                                <span className="text-blue-600">QOL</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/icons/shower.webp" alt="Shower" style={{ width: 18, height: 18, objectFit: 'contain' }} />
                                <span className="font-semibold text-gray-900">{property.bathrooms > 0 ? property.bathrooms : '—'}</span>
                                <span className="text-blue-600">Suuli</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    // Grid card
    return (
        <div
            className="property-card card-appear bg-white rounded-2xl shadow-sm border border-gray-100 cursor-pointer overflow-hidden"
            style={{ animationDelay: `${index * 60}ms` }}
            onClick={() => {
                trackEvent('property_click', {
                    propertyId: property.id || property._id,
                    district: property.district,
                    price: property.price
                })
                onClick()
            }}
        >
            {/* Property image — no ID badge */}
            <div className="relative h-32 sm:h-48 bg-gray-100">
                {property.images[0]?.match(/\.(mp4|mov|webm)$/i) ? (
                    <video
                        src={property.images[0]}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <Image
                        src={property.images[0]}
                        alt={property.title}
                        fill
                        className="object-cover"
                        loading={index < 4 ? 'eager' : 'lazy'}
                        priority={index < 4}
                        sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 33vw"
                        unoptimized={true}
                    />
                )}
            </div>

            {/* Card body — tighter on mobile for 2-col layout */}
            <div className="p-2.5 sm:p-4">
                <h3 className="font-bold text-gray-900 text-sm sm:text-lg mb-0.5 sm:mb-1 leading-snug line-clamp-1">{property.title}</h3>

                <div className="flex items-center gap-1 text-green-600 text-xs sm:text-sm mb-0.5 sm:mb-1">
                    <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                    <span className="truncate">{property.district}</span>
                </div>

                <p className="text-gray-400 text-[10px] sm:text-sm uppercase tracking-wide mb-1.5 sm:mb-2 truncate">{property.landmark}</p>

                <p className="mb-2 sm:mb-3">
                    <span className="text-green-600 font-bold text-base sm:text-xl">${property.price}</span>
                    <span className="text-gray-400 text-xs sm:text-sm">/{property.priceUnit}</span>
                </p>

                {/* Bed / Bathroom stats — always shown, even when 0 */}
                <div className="flex items-center gap-3 sm:gap-6 mb-2 sm:mb-3">
                    <div className="flex flex-col items-center gap-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icons/bed.webp" alt="Bedrooms" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{property.bedrooms > 0 ? property.bedrooms : '—'}</span>
                        <span className="text-blue-600 text-[9px] sm:text-xs font-medium">QOL</span>
                    </div>
                    <div className="flex flex-col items-center gap-0.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icons/shower.webp" alt="Bathrooms" style={{ width: 22, height: 22, objectFit: 'contain' }} />
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{property.bathrooms > 0 ? property.bathrooms : '—'}</span>
                        <span className="text-blue-600 text-[9px] sm:text-xs font-medium">Suuli</span>
                    </div>
                </div>

                {/* Agent */}
                <div className="border-t border-gray-100 pt-2 sm:pt-3 mt-1 flex items-center gap-2">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden flex-shrink-0 border border-gray-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icons/klogo.png" alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-gray-800 leading-none truncate">{property.agent.name}</p>
                        <p className="text-[10px] sm:text-xs text-gray-400">{property.agent.phone}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

const SLIDES = [
    { src: '/icons/happy-family.webp', label: 'Your Dream Home Awaits' },
    { src: '/icons/duwaq.webp', label: 'Premium Apartments in Mogadishu' },
    { src: '/icons/villa-2.webp', label: 'Stunning Villas for Sale & Rent' },
    { src: '/icons/yellow-villa.webp', label: 'Find Your Perfect Property' },
]

export default function HeroBanner() {
    const [current, setCurrent] = useState(0)
    // Use ref so the interval callback always reads the latest index
    const currentRef = useRef(0)

    const goTo = (next: number) => {
        currentRef.current = next
        setCurrent(next)
    }

    // Simple, no-closure-bug interval: just increment the ref each tick
    useEffect(() => {
        const id = setInterval(() => {
            const next = (currentRef.current + 1) % SLIDES.length
            goTo(next)
        }, 4000)
        return () => clearInterval(id)
    }, []) // empty deps — safe because we use ref inside

    return (
        <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden bg-gray-900">

            {/* SLIDES */}
            {SLIDES.map((slide, idx) => (
                <div
                    key={slide.src}
                    className="absolute inset-0 transition-all duration-700 ease-in-out"
                    style={{
                        transform: idx === current
                            ? 'translateX(0%)'
                            : idx < current
                                ? 'translateX(-100%)'
                                : 'translateX(100%)',
                        zIndex: idx === current ? 2 : 1,
                        opacity: idx === current ? 1 : 0.3,
                    }}
                >
                    <Image
                        src={slide.src}
                        alt={slide.label}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                        sizes="100vw"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                </div>
            ))}

            {/* TEXT OVERLAY */}
            <div className="relative z-10 flex flex-col items-center justify-end h-full text-white text-center px-4 pb-8">
                <h1
                    key={current}
                    className="text-2xl sm:text-4xl font-bold mb-2 drop-shadow-xl"
                    style={{ animation: 'fadeUp 0.6s ease forwards' }}
                >
                    {SLIDES[current].label}
                </h1>
                <p className="text-white/80 text-sm sm:text-base max-w-lg">
                    Verified listings, real prices — across all of Mogadishu.
                </p>

                <div className="mt-3 flex flex-wrap justify-center items-center gap-2 text-xs text-white/80">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🏠 Apartments</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🏡 Villas</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🏢 Offices</span>
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">🏪 Shops</span>
                </div>

                {/* Dot indicators */}
                <div className="flex gap-2 mt-4">
                    {SLIDES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => goTo(idx)}
                            className={`rounded-full transition-all duration-300 ${idx === current ? 'bg-white w-6 h-2' : 'bg-white/40 w-2 h-2'}`}
                        />
                    ))}
                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(10px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    )
}

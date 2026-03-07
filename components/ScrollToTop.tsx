'use client'

import { useEffect, useState } from 'react'
import { ChevronUp } from 'lucide-react'

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300)
        window.addEventListener('scroll', onScroll, { passive: true })
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    if (!visible) return null

    return (
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-11 h-11 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            aria-label="Scroll to top"
        >
            <ChevronUp className="w-5 h-5" />
        </button>
    )
}

import Link from 'next/link'
import { Phone, User } from 'lucide-react'

export default function Navbar() {
    return (
        <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/icons/klogo.png" alt="Kobac Property Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div className="hidden sm:block">
                            <p className="text-blue-600 font-bold text-lg leading-tight">Kobac Property</p>
                            <p className="text-gray-400 text-[11px] leading-tight">Helping you make the right property choice</p>
                        </div>
                    </Link>
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Properties</Link>
                        <Link href="/agents" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">Agents</Link>
                        <Link href="/about" className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">About</Link>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <a href="tel:0610251014" className="hidden lg:flex items-center gap-1.5 text-gray-700 text-sm font-medium hover:text-blue-600 transition-colors">
                            <Phone className="w-4 h-4" />0610251014
                        </a>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 text-sm transition-colors">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline text-sm">Account</span>
                        </button>
                        <Link href="/list-property" className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap">
                            List Your Property
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}

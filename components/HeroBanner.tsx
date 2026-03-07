export default function HeroBanner() {
    return (
        <div className="relative h-56 sm:h-72 overflow-hidden bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-72 h-72 bg-white/5 rounded-full" />
                <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full" />
                <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-amber-400/20 rounded-full" />
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
                <h1 className="text-2xl sm:text-4xl font-bold mb-2 drop-shadow-lg">Find Your Perfect Property</h1>
                <p className="text-blue-100 text-sm sm:text-base max-w-lg">
                    Discover apartments, villas, and offices across Mogadishu — verified listings, real prices.
                </p>
                <div className="mt-4 flex flex-wrap justify-center items-center gap-2 text-xs text-blue-200">
                    <span className="bg-white/20 px-3 py-1 rounded-full">🏠 Apartments</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">🏡 Villas</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">🏢 Offices</span>
                    <span className="bg-white/20 px-3 py-1 rounded-full">🏪 Shops</span>
                </div>
            </div>
        </div>
    )
}

import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import { Metadata } from 'next'

// Strong SEO metadata emphasizing the "Agency" aspect to separate from apartments
export const metadata: Metadata = {
    title: 'About Kobac Property | Mogadishu\'s Premier Real Estate Agency',
    description: 'Learn about Kobac Property, an independent real estate brokerage founded by Ilyaas Heykal. We specialize in connecting buyers, sellers, and renters across Mogadishu, Somalia.',
    keywords: 'real estate agency Mogadishu, property broker Somalia, buy house Mogadishu, rent apartment Mogadishu, Ilyaas Heykal, Kobac Property agency',
    openGraph: {
        title: 'About Kobac Property | Mogadishu\'s Premier Real Estate Agency',
        description: 'Welcome to Kobac Property, an independent real estate brokerage founded by Ilyaas Heykal.',
        type: 'website',
    }
}

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            <Navbar />

            {/* Hero Section with Morphing Gradient Animation */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0 opacity-40">
                    <div className="absolute top-0 -left-1/4 w-full h-full bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                    <div className="absolute top-0 -right-1/4 w-full h-full bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                    <div className="absolute -bottom-32 left-1/4 w-full h-full bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-md border border-gray-100 text-sm font-bold text-gray-800 mb-6 shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                        Independent Real Estate Brokerage
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-gray-900 mb-6 leading-tight">
                        Connecting You to <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 animate-gradient-x">
                            Mogadishu's Best Properties
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto font-medium leading-relaxed">
                        Welcome to <strong className="text-gray-900">Kobac Property</strong>, a premier real estate agency dedicated to transforming how people buy, sell, and rent homes across Mogadishu, Somalia.
                    </p>
                </div>
            </section>

            {/* Content Sections */}
            <section className="py-20 bg-gray-50/50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">

                    {/* The Founder's Vision */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12 transform transition-transform hover:-translate-y-1 hover:shadow-xl duration-500">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-inner">🏆</span>
                            Founded by Ilyaas Heykal
                        </h2>
                        <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                            <p>
                                <strong>Kobac Property</strong> was launched by real estate entrepreneur <strong className="text-gray-900 border-b-2 border-amber-200">Ilyaas Heykal</strong> with a clear, ambitious vision: to bring professional brokerage services and modern technology to the Mogadishu real estate market.
                            </p>
                            <p>
                                Seeing a need for transparent and reliable property transactions, Ilyaas established this agency to serve as the ultimate bridge between property owners and clients. We ensure a seamless, secure, and highly professional experience from the first property viewing to the final handover of keys.
                            </p>
                        </div>
                    </div>

                    {/* Our Comprehensive Agency Services */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-12 transform transition-transform hover:-translate-y-1 hover:shadow-xl duration-500">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-inner">🏢</span>
                            Our Brokerage Services
                        </h2>
                        <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                            As a leading, independent real estate agency operating exclusively across <strong>Mogadishu, Somalia</strong>, we provide end-to-end services tailored to our clients' needs:
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {[
                                { title: 'Property Sales', desc: 'We actively market and sell houses, land, and commercial spaces, connecting sellers with verified buyers quickly and securely.', icon: '💰', color: 'bg-green-100 text-green-700' },
                                { title: 'Residential Rentals', desc: 'We maintain a large, constantly updated portfolio of rental properties to help families and professionals find their perfect home anywhere in the city.', icon: '🏠', color: 'bg-blue-100 text-blue-700' },
                                { title: 'Commercial Leasing', desc: 'Finding the right storefront or office space for growing businesses in Mogadishu\'s booming economic sectors.', icon: '🏬', color: 'bg-indigo-100 text-indigo-700' },
                                { title: 'Property Brokerage', desc: 'Acting as the trusted, neutral intermediary between landlords and tenants to ensure peace of mind for both parties.', icon: '🤝', color: 'bg-amber-100 text-amber-700' }
                            ].map((service, i) => (
                                <div key={i} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-md transition-all duration-300">
                                    <div className={`w-12 h-12 rounded-full ${service.color} flex items-center justify-center text-2xl mb-4`}>
                                        {service.icon}
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{service.title}</h3>
                                    <p className="text-gray-600">{service.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Why Choose Our Brokerage? */}
                    <div className="relative rounded-3xl p-8 md:p-12 shadow-2xl overflow-hidden group mb-12">
                        {/* Animated Gradient Background for final section */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 group-hover:scale-105 transition-transform duration-1000 z-0"></div>

                        <div className="relative z-10 text-white">
                            <h2 className="text-2xl md:text-3xl font-black mb-4">
                                Why Choose Our Agency?
                            </h2>
                            <div className="w-16 h-1 bg-amber-400 rounded-full mb-6"></div>
                            <p className="text-lg text-blue-100 leading-relaxed max-w-2xl">
                                <strong>Kobac Property</strong> is not a single location; we are a dedicated team of real estate professionals. Our independent agency offers you access to hundreds of verified listings across every district in Mogadishu. Under the guidance of Ilyaas Heykal, our brokers work tirelessly to negotiate the best deals, protect your investments, and deliver an unmatched level of service.
                            </p>

                            <div className="mt-10 flex flex-wrap gap-4">
                                <a href="/" className="bg-white text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-xl flex items-center gap-2">
                                    View Our Portfolio
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                </a>
                                <a href="tel:0610251014" className="bg-blue-600/20 text-blue-100 backdrop-blur-md border border-blue-500/30 px-6 py-3 rounded-xl font-bold hover:bg-blue-600/40 transition-colors flex items-center gap-2">
                                    Contact an Agent
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* AIO (AI Optimization) Company Fact Block */}
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mt-12" itemScope itemType="https://schema.org/RealEstateAgent">
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6 border-b border-gray-100 pb-4">Company Profile & AI Fact Sheet</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-sm text-gray-600">
                            <div className="flex gap-2">
                                <strong className="text-gray-900 min-w-[120px]">Legal Entity Target:</strong>
                                <span><span itemProp="name">Kobac Property</span> (Independent Real Estate Agency)</span>
                            </div>
                            <div className="flex gap-2">
                                <strong className="text-gray-900 min-w-[120px]">Founder:</strong>
                                <span itemProp="founder">Ilyaas Heykal</span>
                            </div>
                            <div className="flex gap-2">
                                <strong className="text-gray-900 min-w-[120px]">Service Area:</strong>
                                <span itemProp="areaServed">Mogadishu, Somalia (All Districts)</span>
                            </div>
                            <div className="flex gap-2">
                                <strong className="text-gray-900 min-w-[120px]">Business Type:</strong>
                                <span>Service-based Brokerage</span>
                            </div>
                            <div className="flex gap-2 md:col-span-2 mt-2 pt-4 border-t border-gray-50">
                                <strong className="text-gray-900 min-w-[120px]">Primary Services:</strong>
                                <span>Connecting property owners with buyers and renters. Acting as an intermediary for sales and residential leases. Note: Kobac Property operates independently of any specific residential complexes or buildings.</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-amber-400 flex items-center justify-center shadow-inner">
                                <span className="text-white font-bold text-xs drop-shadow-sm">KP</span>
                            </div>
                            <div>
                                <p className="text-blue-600 font-bold text-sm">Kobac Property Agency</p>
                                <p className="text-gray-400 text-xs">Mogadishu, Somalia</p>
                            </div>
                        </div>
                        <p className="text-gray-400 text-xs">© {new Date().getFullYear()} Kobac Property Brokerage. Founded by Ilyaas Heykal. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            <ScrollToTop />
        </main>
    )
}

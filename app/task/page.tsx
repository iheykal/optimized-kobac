import { getDashboardStats } from '@/lib/dashboardData'
import { Flame, TrendingUp, Users, Eye, Target, MapPin, CalendarCheck } from 'lucide-react'
import Link from 'next/link'


// Quick server-side fetch on this page so it's always up to date
// without client-side loading spinners.

export default async function TaskDashboard() {
    const stats = await getDashboardStats()

    return (
        <div className="min-h-screen bg-gray-50 pt-8 pb-20">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-gray-200 pb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-3xl font-black text-gray-900 tracking-tight">CEO Mission Control</h1>
                            <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">Kobac Top Secret</span>
                        </div>
                        <p className="text-gray-500 font-medium text-sm">Your daily consistency scoreboard. Do not break the streak.</p>
                    </div>
                    <Link href="/kobac252" className="bg-black text-white px-5 py-2.5 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 w-fit">
                        + Upload Property
                    </Link>
                </div>

                {/* Top Metrics - The "Dopamine Hits" */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    {/* The Streak Card */}
                    <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-orange-500/20 transform transition-transform hover:scale-[1.02]">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                <Flame className="w-8 h-8 text-yellow-100" />
                            </div>
                            <span className="text-orange-100 font-bold text-sm tracking-wider uppercase">Consistency</span>
                        </div>
                        <p className="text-6xl font-black mb-1 drop-shadow-md">{stats.streakCount}<span className="text-2xl font-bold ml-1 opacity-80">Days</span></p>
                        <p className="text-orange-100 font-medium text-sm">Current upload streak. Don't skip today.</p>
                    </div>

                    {/* Leads Today Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-green-100 p-3 rounded-2xl">
                                <Users className="w-8 h-8 text-green-600" />
                            </div>
                            <span className="text-gray-400 font-bold text-sm tracking-wider uppercase">The Money</span>
                        </div>
                        <p className="text-5xl font-black text-gray-900 mb-2">{stats.leadsToday}</p>
                        <p className="text-green-600 font-bold text-sm flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4" /> WhatsApp Leads Today
                        </p>
                    </div>

                    {/* Views Today Card */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm transition-shadow hover:shadow-md">
                        <div className="flex items-start justify-between mb-4">
                            <div className="bg-blue-100 p-3 rounded-2xl">
                                <Eye className="w-8 h-8 text-blue-600" />
                            </div>
                            <span className="text-gray-400 font-bold text-sm tracking-wider uppercase">Attention</span>
                        </div>
                        <p className="text-5xl font-black text-gray-900 mb-2">{stats.profileViewsToday}</p>
                        <p className="text-blue-600 font-bold text-sm flex items-center gap-1.5">
                            <Target className="w-4 h-4" /> Property Clicks Today
                        </p>
                    </div>
                </div>

                {/* THE CONSISTENCY CALENDAR - HYPE MODE */}
                <div className="relative p-[2px] rounded-[2rem] bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 shadow-2xl mb-12 overflow-hidden group">
                    {/* Glowing background behind the card */}
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 opacity-20 blur-2xl group-hover:opacity-40 transition-opacity duration-1000 z-0"></div>

                    {/* Dark Card Interior */}
                    <div className="relative bg-gray-900 rounded-[2rem] p-6 lg:p-8 w-full h-full z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
                            <div>
                                <h3 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
                                    <span className="bg-green-500/20 text-green-400 p-2.5 rounded-2xl border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                                        <CalendarCheck className="w-6 h-6" />
                                    </span>
                                    The 30-Day Hustle Track
                                </h3>
                                <p className="text-gray-400 mt-2 font-medium">Earn your neon green squares. Blank days mean NO momentum.</p>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 select-none bg-black/50 px-5 py-2.5 rounded-2xl border border-gray-800 shadow-inner">
                                <span>LAZY</span>
                                <div className="flex gap-2">
                                    <div className="w-5 h-5 rounded-md bg-gray-800 border-b border-gray-700 shadow-inner"></div>
                                    <div className="w-5 h-5 rounded-md bg-green-500 border border-green-400 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse"></div>
                                </div>
                                <span className="text-green-400 drop-shadow-md">GRINDING</span>
                            </div>
                        </div>

                        {/* Desktop/Tablet Grid View */}
                        <div className="flex flex-wrap gap-2 md:gap-3">
                            {stats.history.map((day, i) => {
                                const dateObj = new Date(day.date)
                                const isToday = i === stats.history.length - 1

                                return (
                                    <div
                                        key={i}
                                        className={`relative group/node flex flex-col items-center justify-center w-[calc(14.28%-8px)] sm:w-12 h-14 sm:h-16 rounded-xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${day.active
                                            ? 'bg-gradient-to-br from-green-400 to-green-600 border border-green-300 text-white shadow-[0_0_20px_rgba(34,197,94,0.5)] z-20 hover:shadow-[0_0_30px_rgba(34,197,94,0.8)]'
                                            : isToday
                                                ? 'bg-gray-800 border-2 border-dashed border-orange-500 text-orange-400 animate-pulse hover:bg-gray-700 cursor-pointer'
                                                : 'bg-gray-800 border border-gray-700 text-gray-500 hover:bg-gray-700 cursor-default'
                                            }`}
                                    >
                                        <span className={`text-[10px] sm:text-xs font-black mb-1 ${day.active ? 'text-green-100' : 'opacity-50'}`}>
                                            {day.dayName}
                                        </span>
                                        {day.active ? (
                                            <svg className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : isToday ? (
                                            <div className="text-[9px] font-black tracking-widest uppercase">UP?</div>
                                        ) : null}

                                        {/* Insanely Cool Tooltip */}
                                        <div className="absolute -top-[3.5rem] left-1/2 -translate-x-1/2 bg-white text-gray-900 text-xs font-black px-4 py-2 rounded-xl opacity-0 group-hover/node:opacity-100 pointer-events-none whitespace-nowrap z-30 transition-all duration-200 shadow-2xl translate-y-2 group-hover/node:translate-y-0 before:content-[''] before:absolute before:-bottom-1.5 before:left-1/2 before:-translate-x-1/2 before:w-3 before:h-3 before:bg-white before:rotate-45">
                                            <div className="flex items-center gap-2">
                                                {dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                                {day.active ? (
                                                    <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded-md text-sm">🔥</span>
                                                ) : isToday ? (
                                                    <span className="bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-md text-sm">⏰</span>
                                                ) : (
                                                    <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md text-sm">😴</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* Secondary Metrics & Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Database Health */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <DatabaseIcon /> Platform Health
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Total Live Properties</span>
                                    <span className="text-2xl font-black text-gray-900">{stats.activeProperties}</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-black h-2.5 rounded-full" style={{ width: `${Math.min((stats.activeProperties / 100) * 100, 100)}%` }}></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2 font-medium">Goal: 100 Active Verified Properties</p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">30-Day Lead Quality</span>
                                    <span className="text-2xl font-black text-gray-900">{stats.totalLeads}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1 font-medium">Total WhatsApp clicks in the last month.</p>
                            </div>
                        </div>
                    </div>

                    {/* Market Intelligence */}
                    <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-gray-400" /> Where is the Demand?
                        </h3>

                        <div className="space-y-4">
                            {stats.popularDistricts.length === 0 ? (
                                <p className="text-sm text-gray-500 italic p-4 bg-gray-50 rounded-xl">No click data yet. Drive traffic to the site to see district demand!</p>
                            ) : (
                                stats.popularDistricts.map((district, idx) => {
                                    // Calculate rough percentage relative to the top district for the visual bar
                                    const maxCount = stats.popularDistricts[0].count;
                                    const percentage = (district.count / maxCount) * 100;

                                    return (
                                        <div key={district._id} className="relative mt-2">
                                            <div className="absolute inset-0 bg-blue-50/50 rounded-xl overflow-hidden pointer-events-none">
                                                <div
                                                    className="h-full bg-blue-100 transition-all duration-1000 ease-out"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <div className="flex justify-between items-center py-2.5 px-3 relative z-10">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-lg font-bold text-gray-300 w-4">{idx + 1}</span>
                                                    <span className="font-bold text-gray-800">{district._id}</span>
                                                </div>
                                                <span className="text-sm font-bold text-blue-600 bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-sm border border-blue-100">{district.count} clicks</span>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                        <p className="text-xs text-center text-gray-400 mt-6 font-medium">Use this data to tell your brokers what houses to find.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

function DatabaseIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <ellipse cx="12" cy="5" rx="9" ry="3" />
            <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
            <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
    )
}

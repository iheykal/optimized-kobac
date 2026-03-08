import { connectToDatabase } from '@/lib/mongoose'
import Analytics from '@/lib/models/Analytics'
import Property from '@/lib/models/Property'

interface DashboardStats {
    leadsToday: number
    totalLeads: number
    profileViewsToday: number
    activeProperties: number
    streakCount: number
    popularDistricts: { _id: string, count: number }[]
    history: { date: string, active: boolean, dayName: string }[]
}

export async function getDashboardStats(): Promise<DashboardStats> {
    await connectToDatabase()

    // Time boundaries
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000))

    // 1. Leads Today (WhatsApp clicks)
    const leadsTodayCount = await Analytics.countDocuments({
        event: 'whatsapp_lead',
        timestamp: { $gte: startOfToday }
    })

    // 2. Total Leads (last 30 days)
    const totalLeadsCount = await Analytics.countDocuments({
        event: 'whatsapp_lead',
        timestamp: { $gte: thirtyDaysAgo }
    })

    // 3. Profile/Property Views Today
    const profileViewsTodayCount = await Analytics.countDocuments({
        event: 'property_click',
        timestamp: { $gte: startOfToday }
    })

    // 4. Total Active Properties
    const activePropertiesCount = await Property.countDocuments()

    // 5. Popular Districts
    const popularDistrictsList = await Analytics.aggregate([
        { $match: { event: 'property_click', district: { $exists: true, $ne: null } } },
        { $group: { _id: '$district', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ])

    // 6. Streak Calculation (Consecutive days with at least one property upload)
    const recentUploads = await Property.find({}, 'listedAt').sort({ listedAt: -1 }).limit(30)

    let streak = 0
    const history = []

    // Default empty set if no uploads
    const uploadDates = new Set(recentUploads.map(p => {
        const d = new Date(p.listedAt)
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    }))

    // Calculate 30-day History Grid
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    for (let i = 29; i >= 0; i--) {
        const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000))
        const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
        history.push({
            date: d.toISOString(),
            dayName: daysOfWeek[d.getDay()],
            active: uploadDates.has(dateStr)
        })
    }

    if (recentUploads.length > 0) {
        let dayOffset = 0;
        let missedDaysInARow = 0;

        while (true) {
            const d = new Date(now.getTime() - (dayOffset * 24 * 60 * 60 * 1000))
            const dateStr = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`

            if (uploadDates.has(dateStr)) {
                streak++
                missedDaysInARow = 0 // Reset the missed days counter when you get a hit
            } else {
                missedDaysInARow++
                // If you miss 2 days in a row (e.g., didn't upload yesterday AND didn't upload today), the streak breaks.
                if (missedDaysInARow >= 2) {
                    break
                }
            }
            dayOffset++
        }
    }

    // Ensure plain objects for serialization
    return {
        leadsToday: leadsTodayCount,
        totalLeads: totalLeadsCount,
        profileViewsToday: profileViewsTodayCount,
        activeProperties: activePropertiesCount,
        streakCount: streak,
        history,
        popularDistricts: JSON.parse(JSON.stringify(popularDistrictsList))
    }
}

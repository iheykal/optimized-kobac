import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongoose'
import Analytics from '@/lib/models/Analytics'

export async function POST(req: Request) {
    try {
        await dbConnect()
        const body = await req.json()
        const { event, propertyId, district, price, metadata } = body

        if (!event) {
            return NextResponse.json({ error: 'Event name is required' }, { status: 400 })
        }

        const newEvent = await Analytics.create({
            event,
            propertyId,
            district,
            price,
            metadata: metadata || {}
        })

        return NextResponse.json({ success: true, id: newEvent._id })
    } catch (error) {
        console.error('[Analytics Error]', error)
        return NextResponse.json({ error: 'Failed to log event' }, { status: 500 })
    }
}

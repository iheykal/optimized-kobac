import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'

const R2_BASE = process.env.R2_PUBLIC_BASE_URL || ''

export const dynamic = 'force-dynamic'

function resolveImage(img: string) {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `${R2_BASE}/${img}`
}

export async function GET(request: NextRequest) {
    try {
        await connectToDatabase()

        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const district = searchParams.get('district')
        const limit = parseInt(searchParams.get('limit') || '200', 10)

        // No isActive filter — return all documents
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const query: Record<string, any> = {}
        if (type) query.type = type
        if (district) query.district = district

        const raw = await PropertyModel
            .find(query)
            .sort({ listedAt: -1, createdAt: -1 })
            .limit(limit)
            .lean()
            .exec()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = raw.map((p: any) => {
            const agentPhone = p.agent?.phone || p.agentPhone || '061 025 1014';
            const isDefaultAgent = agentPhone.replace(/\s+/g, '') === '0610251014' || agentPhone === '+252610251014';
            const agentName = isDefaultAgent ? 'Kobac Property' : (p.agent?.name || p.agentName || 'Kobac Property');

            return {
                id: p.kobacId != null ? String(p.kobacId) : '',  // stable stored ID — never shifts
                _mongoId: p._id?.toString() || '', // internal full ObjectId kept for API link-by-id
                title: p.title || p.name || 'Untitled',
                type: p.type || p.propertyType || 'Apartment',
                district: p.district || p.area || '',
                landmark: p.landmark || p.address || '',
                price: Number(p.price || 0),
                priceUnit: p.priceUnit || 'Bishii',
                listingType: p.listingType || 'rent',
                bedrooms: Number(p.bedrooms || p.beds || p.rooms || p.qol || p.numberOfBedrooms || 0),
                bathrooms: Number(p.bathrooms || p.baths || p.suuli || p.wc || p.numberOfBathrooms || 0),
                images: (p.images || p.photos || []).map(resolveImage).filter(Boolean),
                agent: {
                    name: agentName,
                    phone: agentPhone,
                    location: p.agent?.location || 'Mogadishu - Somalia',
                    verified: p.agent?.verified ?? true,
                },
                description: p.description || p.faahfaahin || '',
                listedAt: p.listedAt instanceof Date
                    ? p.listedAt.toISOString()
                    : p.createdAt instanceof Date
                        ? p.createdAt.toISOString()
                        : new Date().toISOString(),
            }
        })

        return NextResponse.json({ data, total: data.length })
    } catch (error) {
        console.error('[API /properties]', error)
        return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
    }
}

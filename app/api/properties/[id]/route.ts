import { NextRequest, NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'

const R2_BASE = process.env.R2_PUBLIC_BASE_URL || ''

function resolveImage(img: string) {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `${R2_BASE}/${img}`
}

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectToDatabase()

        const { id } = params

        // Support both ObjectId and numeric id
        const query = mongoose.isValidObjectId(id)
            ? { _id: id }
            : { id: parseInt(id, 10) }

        const p = await PropertyModel.findOne(query).lean().exec()

        if (!p) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 })
        }

        const agentPhone = p.agent?.phone || '061 025 1014';
        const isDefaultAgent = agentPhone.replace(/\s+/g, '') === '0610251014' || agentPhone === '+252610251014';
        const agentName = isDefaultAgent ? 'Kobac Property' : (p.agent?.name || 'Kobac Property');

        const data = {
            id: (p._id as { toString(): string }).toString(),
            title: p.title,
            type: p.type,
            district: p.district,
            landmark: p.landmark || '',
            price: p.price,
            priceUnit: p.priceUnit || 'Bishii',
            listingType: p.listingType || 'rent',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            bedrooms: Number((p as any).bedrooms || (p as any).beds || (p as any).rooms || (p as any).qol || (p as any).numberOfBedrooms || 0),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            bathrooms: Number((p as any).bathrooms || (p as any).baths || (p as any).suuli || (p as any).wc || (p as any).numberOfBathrooms || 0),
            images: (p.images || []).map(resolveImage).filter(Boolean),
            agent: {
                name: agentName,
                phone: agentPhone,
                location: p.agent?.location || 'Mogadishu - Somalia',
                verified: p.agent?.verified ?? true,
            },
            description: p.description || '',
            listedAt: p.listedAt instanceof Date ? p.listedAt.toISOString() : String(p.listedAt),
        }

        return NextResponse.json({ data })
    } catch (error) {
        console.error('[API /properties/:id]', error)
        return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 })
    }
}

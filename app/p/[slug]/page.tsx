import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'
import Navbar from '@/components/Navbar'
import ScrollToTop from '@/components/ScrollToTop'
import PropertyPageClient from '@/components/PropertyPageClient'

const R2_BASE = process.env.R2_PUBLIC_BASE_URL || ''

// Helper to resolve image paths
function resolveImage(img: string) {
    if (!img) return ''
    if (img.startsWith('http')) return img
    return `${R2_BASE}/${img}`
}

type Props = {
    params: { slug: string }
}

// 1. DYNAMIC SEO METADATA GENERATION
// This runs on the server before the page loads. It reads the ID from the URL, fetches the property,
// and injects the exact title, description, and image into the invisible <head> tags for Google/WhatsApp.
export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const slug = params.slug

    const parts = slug.split('-')
    const lastSegment = parts[parts.length - 1]
    const secondLast = parts[parts.length - 2]

    try {
        await connectToDatabase()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let raw: any = null

        if (secondLast === 'KOB') {
            // Stable kobacId lookup — this field is permanently stored on the document
            const kobacId = parseInt(lastSegment, 10)
            if (!isNaN(kobacId) && kobacId > 0) {
                raw = await PropertyModel.findOne({ kobacId }).lean().exec()
            }
        } else {
            // Legacy: full MongoDB ObjectId at the end of slug
            if (!lastSegment || lastSegment.length < 10) {
                return { title: 'Property Not Found | Kobac Property' }
            }
            raw = await PropertyModel.findById(lastSegment).lean().exec()
        }

        if (!raw) return { title: 'Property Not Found | Kobac Property' }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc = raw as any
        const title = doc.title || doc.name || 'Beautiful Property in Mogadishu'
        const district = doc.district || doc.area || doc.location || 'Mogadishu'
        const type = doc.type || doc.propertyType || 'Property'
        const listingType = doc.listingType === 'sale' ? 'for sale' : 'for rent'
        const price = `${doc.price || 0} / ${doc.priceUnit || 'Month'}`

        let imageUrl = ''
        if (doc.images && doc.images.length > 0) imageUrl = resolveImage(doc.images[0])
        else if (doc.photos && doc.photos.length > 0) imageUrl = resolveImage(doc.photos[0])

        return {
            title: `${title} - ${type} ${listingType} in ${district} | Kobac Property`,
            description: `Check out this ${type} located in ${district}, Mogadishu. Price: $${price}. ${doc.bedrooms ? doc.bedrooms + ' Beds, ' : ''}${doc.bathrooms ? doc.bathrooms + ' Baths.' : ''} Listed by Kobac Property Agency.`,
            openGraph: {
                title: `${title} | Kobac Property Mogadishu`,
                description: `Beautiful ${type} available ${listingType} in ${district} for $${price}. Click to view full details and photos.`,
                images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
            },
            twitter: {
                card: 'summary_large_image',
                title: `${title} in ${district}`,
                description: `Beautiful ${type} available ${listingType} in ${district} for $${price}.`,
                images: imageUrl ? [imageUrl] : [],
            }
        }
    } catch (e) {
        return { title: 'Property Details | Kobac Property' }
    }
}


// 2. THE PAGE RENDERER
export default async function PropertyPage({ params }: Props) {
    const slug = params.slug
    const parts = slug.split('-')
    const lastSegment = parts[parts.length - 1]
    const secondLast = parts[parts.length - 2]

    await connectToDatabase()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let raw: any = null

    if (secondLast === 'KOB') {
        // Stable kobacId lookup — this field is permanently stored on the document
        const kobacId = parseInt(lastSegment, 10)
        if (!isNaN(kobacId) && kobacId > 0) {
            raw = await PropertyModel.findOne({ kobacId }).lean().exec()
        }
    } else {
        // Legacy: full MongoDB ObjectId at the end of slug
        if (!lastSegment || lastSegment.length < 10) notFound()
        raw = await PropertyModel.findById(lastSegment).lean().exec()
    }

    if (!raw) notFound()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = raw as any
    const images: string[] = (doc.images || doc.photos || [])
        .map((img: string) => resolveImage(img))
        .filter(Boolean)

    const agentPhone = doc.agent?.phone || doc.agentPhone || '061 025 1014';
    const isDefaultAgent = agentPhone.replace(/\s+/g, '') === '0610251014' || agentPhone === '+252610251014';
    const agentName = isDefaultAgent ? 'Kobac Property' : (doc.agent?.name || doc.agentName || 'Kobac Property');

    // Format into our frontend Property type
    const property = {
        id: doc._id?.toString() || String(doc.id || ''),
        title: doc.title || doc.name || 'Untitled',
        type: doc.type || doc.propertyType || 'Apartment',
        district: doc.district || doc.area || doc.location || '',
        landmark: doc.landmark || doc.address || '',
        price: Number(doc.price || 0),
        priceUnit: doc.priceUnit || doc.priceLabel || 'Bishii',
        listingType: doc.listingType || 'rent',
        bedrooms: Number(doc.bedrooms || doc.beds || doc.rooms || doc.qol || doc.numberOfBedrooms || 0),
        bathrooms: Number(doc.bathrooms || doc.baths || doc.suuli || doc.wc || doc.numberOfBathrooms || 0),
        images: images.length > 0 ? images : ['/placeholder.jpg'], // fallback
        agent: {
            name: agentName,
            phone: agentPhone,
            location: doc.agent?.location || 'Mogadishu - Somalia',
            verified: doc.agent?.verified ?? true,
        },
        description: doc.description || doc.faahfaahin || '',
        listedAt: doc.listedAt instanceof Date
            ? doc.listedAt.toISOString()
            : doc.createdAt instanceof Date
                ? doc.createdAt.toISOString()
                : new Date().toISOString(),
    }

    return (
        <main className="min-h-screen bg-gray-50 pb-20">
            <Navbar />

            <div className="pt-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back button */}
                <a href="/" className="inline-flex items-center gap-2 text-blue-600 font-bold mb-6 hover:text-blue-800 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to All Properties
                </a>

                {/* Same exact card look as the modal: white bg, rounded-2xl, shadow-2xl */}
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
                    <PropertyPageClient property={property} />
                </div>
            </div>

            <ScrollToTop />
        </main>
    )
}

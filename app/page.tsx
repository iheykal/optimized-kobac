import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'
import { Property } from '@/lib/types'
import Navbar from '@/components/Navbar'
import HeroBanner from '@/components/HeroBanner'
import PropertyGrid from '@/components/PropertyGrid'
import ScrollToTop from '@/components/ScrollToTop'

const R2_BASE = process.env.R2_PUBLIC_BASE_URL || ''

// Revalidate every 5 minutes (300 seconds) for near-instant loads
export const revalidate = 300
// export const dynamic = 'force-dynamic' // Removed to allow caching

function resolveImage(img: string) {
  if (!img) return ''
  if (img.startsWith('http')) return img
  return `${R2_BASE}/${img}`
}

async function getProperties(): Promise<Property[]> {
  try {
    await connectToDatabase()

    // No isActive filter — return ALL documents regardless of fields
    const raw = await PropertyModel
      .find({})
      .sort({ listedAt: -1, createdAt: -1 })
      .limit(120)
      .lean()
      .exec()

    console.log(`[HomePage] Found ${raw.length} properties in MongoDB`)

    return raw.map((p, idx) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const doc = p as any
      const images: string[] = (doc.images || doc.photos || [])
        .map((img: string) => resolveImage(img))
        .filter(Boolean)

      const agentPhone = doc.agent?.phone || doc.agentPhone || '061 025 1014';
      const isDefaultAgent = agentPhone.replace(/\s+/g, '') === '0610251014' || agentPhone === '+252610251014';
      const agentName = isDefaultAgent ? 'Kobac Property' : (doc.agent?.name || doc.agentName || 'Kobac Property');

      // seqId: since sorted newest-first, oldest property = seqId 1, newest = total count
      const seqId = raw.length - idx

      return {
        id: doc._id?.toString() || String(doc.id || ''),
        seqId,
        title: doc.title || doc.name || 'Untitled',
        type: doc.type || doc.propertyType || 'Apartment',
        district: doc.district || doc.area || doc.location || '',
        landmark: doc.landmark || doc.address || '',
        price: Number(doc.price || 0),
        priceUnit: doc.priceUnit || doc.priceLabel || 'Bishii',
        listingType: doc.listingType || 'rent',
        bedrooms: Number(doc.bedrooms || doc.beds || doc.rooms || doc.qol || doc.numberOfBedrooms || 0),
        bathrooms: Number(doc.bathrooms || doc.baths || doc.suuli || doc.wc || doc.numberOfBathrooms || 0),
        images,
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
    })
  } catch (error) {
    console.error('[HomePage] MongoDB error:', error)
    return []
  }
}

export default async function HomePage() {
  const properties = await getProperties()

  return (
    <main>
      <Navbar />
      <HeroBanner />
      <PropertyGrid properties={properties} />
      <ScrollToTop />

      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-amber-400 flex items-center justify-center">
                <span className="text-white font-bold text-xs">KR</span>
              </div>
              <div>
                <p className="text-blue-600 font-bold text-sm">Kobac Property</p>
                <p className="text-gray-400 text-xs">Mogadishu, Somalia</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-900 transition-colors">Properties</a>
              <a href="/agents" className="hover:text-gray-900 transition-colors">Agents</a>
              <a href="/about" className="hover:text-gray-900 transition-colors">About</a>
              <a href="tel:0610251014" className="hover:text-gray-900 transition-colors">0610251014</a>
            </div>
            <p className="text-gray-400 text-xs">© 2026 Kobac Property. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

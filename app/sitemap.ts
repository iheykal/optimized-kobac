import { MetadataRoute } from 'next'
import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'

const BASE_URL = 'https://kobac.net'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // Base routes that are always present
    const routes: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${BASE_URL}/agents`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
    ]

    try {
        await connectToDatabase()

        // Fetch properties to generate dynamic routes
        const raw = await PropertyModel
            .find({})
            .sort({ listedAt: -1, createdAt: -1 })
            .lean()
            .exec()

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const propertyRoutes = (raw as any[])
            .filter((doc: any) => doc.kobacId != null) // only include properties with a stable ID
            .map((doc: any) => {
                const type = (doc.type || 'property').toLowerCase().replace(/\s+/g, '-')
                const district = (doc.district || 'mogadishu').toLowerCase().replace(/\s+/g, '-')
                const listingType = (doc.listingType || 'rent').toLowerCase() === 'sale' ? 'iib-ah' : 'kiro-ah'

                // kobacId is stored permanently on the document — never changes
                const idSegment = `KOB-${doc.kobacId}`
                const slug = `${type}-${listingType}-${district}-${idSegment}`

                return {
                    url: `${BASE_URL}/p/${slug}`,
                    lastModified: doc.listedAt instanceof Date
                        ? doc.listedAt
                        : doc.createdAt instanceof Date
                            ? doc.createdAt
                            : new Date(),
                    changeFrequency: 'weekly' as const,
                    priority: 0.6,
                }
            })

        return [...routes, ...propertyRoutes]
    } catch (error) {
        console.error('[Sitemap] Failed to generate dynamic routes:', error)
        // Return base routes even if db connection fails
        return routes
    }
}

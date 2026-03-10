import { MetadataRoute } from 'next'

const BASE_URL = 'https://kobac.net'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/api/',
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    }
}

/** @type {import('next').NextConfig} */
const config = {
    images: {
        remotePatterns: [
            // Cloudflare R2 public bucket
            {
                protocol: 'https',
                hostname: 'pub-126b4cc26d8041e99d7cc45ade6cfd3b.r2.dev',
            },
            // Fallback picsum for testing
            { protocol: 'https', hostname: 'picsum.photos' },
            { protocol: 'https', hostname: 'fastly.picsum.photos' },
            // DiceBear avatars
            { protocol: 'https', hostname: 'api.dicebear.com' },
        ],
        formats: ['image/avif', 'image/webp'],
        // Serve crisp images on high-DPI (retina) screens
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 720, 1080],
        // Default quality for all Next.js <Image> components (90 = sharp, near-lossless)
        // individual components can still override this with quality={n}
        minimumCacheTTL: 60 * 60 * 24 * 7, // 1 week
    },
    compress: true,
}

export default config


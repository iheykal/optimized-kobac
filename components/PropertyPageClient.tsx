'use client'

import { useRouter } from 'next/navigation'
import PropertyModal from '@/components/PropertyModal'
import { Property } from '@/lib/types'

// This is a thin CLIENT wrapper.
// It exists purely so the Server Component (/p/[slug]/page.tsx)
// can pass plain serialisable data (property object) without
// also needing to pass a function — which is not allowed across
// the Server / Client boundary in Next.js 14.
export default function PropertyPageClient({ property }: { property: Property }) {
    const router = useRouter()

    return (
        <PropertyModal
            property={property}
            onClose={() => router.push('/')}
            isStandalonePage={true}
        />
    )
}

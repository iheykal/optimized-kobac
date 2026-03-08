export type PropertyType = 'Apartment' | 'Villa' | 'Office' | 'Shop'
export type ListingType = 'rent' | 'sale'

export interface Agent {
    id?: string
    name: string
    phone: string
    location: string
    verified?: boolean
}

export interface Property {
    id: string          // MongoDB ObjectId as string
    _id?: string        // Fallback for MongoDB direct documents
    title: string
    type: PropertyType
    district: string
    landmark: string
    price: number
    priceUnit: string
    listingType: ListingType
    bedrooms: number
    bathrooms: number
    images: string[]    // Full R2 or external URLs
    agent: Agent
    description: string
    listedAt: string    // ISO string
}

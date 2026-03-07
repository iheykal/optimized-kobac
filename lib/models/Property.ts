import mongoose, { Schema, Document, Model, models } from 'mongoose'

export interface IProperty extends Document {
    title: string
    type: string
    district: string
    landmark: string
    price: number
    priceUnit: string
    listingType: string
    bedrooms: number
    bathrooms: number
    images: string[]
    agent: {
        name: string
        phone: string
        location: string
        verified: boolean
    }
    description: string
    listedAt: Date
    isActive: boolean
}

const PropertySchema = new Schema<IProperty>(
    {},
    {
        // strict:false accepts ANY fields from MongoDB — crucial for existing data
        strict: false,
        collection: 'properties',
        timestamps: true,
    }
)

const PropertyModel: Model<IProperty> =
    models.Property || mongoose.model<IProperty>('Property', PropertySchema)

export default PropertyModel

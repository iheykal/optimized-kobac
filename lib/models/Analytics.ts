import mongoose from 'mongoose'

const AnalyticsSchema = new mongoose.Schema({
    event: {
        type: String,
        required: true,
        enum: ['page_view', 'property_click', 'whatsapp_lead', 'search', 'gallery_view']
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: false
    },
    district: String,
    price: Number,
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

// Index for fast queries on trends
AnalyticsSchema.index({ event: 1, timestamp: -1 })
AnalyticsSchema.index({ propertyId: 1 })

export default mongoose.models.Analytics || mongoose.model('Analytics', AnalyticsSchema)

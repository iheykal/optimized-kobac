import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'
import crypto from 'crypto'

const R2_ENDPOINT = process.env.R2_ENDPOINT || ''
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || ''
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || ''
const R2_BUCKET = process.env.R2_BUCKET || ''
const R2_BASE = process.env.R2_PUBLIC_BASE_URL || ''

const s3Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
})

// Fixed admin password
const ADMIN_PWD = '10142003'

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()

        // 1. Password check
        const pwd = formData.get('password') as string
        if (pwd !== ADMIN_PWD) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        await connectToDatabase()

        // 2. Helper to upload file to R2
        const uploadFile = async (file: File, folder: string) => {
            if (!file || file.size === 0) return null

            const buffer = Buffer.from(await file.arrayBuffer())
            // Generate a unique filename while preserving the original extension
            let ext = ''
            if (file.name && file.name.includes('.')) {
                ext = file.name.split('.').pop() || 'jpg'
            } else {
                // Fallback based on mime type
                if (file.type.startsWith('video/')) ext = 'mp4'
                else ext = 'jpg'
            }

            const uniqueId = crypto.randomBytes(8).toString('hex')
            const timestamp = Date.now()
            const key = `properties/uploads/${uniqueId}-${timestamp}.${ext}`

            await s3Client.send(
                new PutObjectCommand({
                    Bucket: R2_BUCKET,
                    Key: key,
                    Body: buffer,
                    ContentType: file.type,
                })
            )

            // Return the full public URL
            return `${R2_BASE}/${key}`
        }

        // 3. Process files
        const thumbnailFile = formData.get('thumbnailImage') as File | null
        let thumbnailUrl = ''
        if (thumbnailFile && thumbnailFile.size > 0) {
            const url = await uploadFile(thumbnailFile, 'thumbnail')
            if (url) thumbnailUrl = url
        }

        const additionalImages: string[] = []
        // formData.getAll returns an array of FormDataEntryValue
        const fileEntries = formData.getAll('images')
        for (const entry of fileEntries) {
            const file = entry as File
            if (file && file.size > 0) {
                const url = await uploadFile(file, 'gallery')
                if (url) additionalImages.push(url)
            }
        }

        // Add thumbnail to images array if we have it
        const allImages = [...additionalImages]
        if (thumbnailUrl && !allImages.includes(thumbnailUrl)) {
            allImages.unshift(thumbnailUrl)
        }

        // 4. Extract text fields
        const propertyData = {
            title: (formData.get('title') as string) || 'Untitled Property',
            propertyType: (formData.get('propertyType') as string) || 'Villa',
            listingType: (formData.get('listingType') as string) || 'rent',
            sharciga: formData.get('sharciga') as string,
            measurement: formData.get('measurement') as string,
            price: Number(formData.get('price') || 0),
            location: formData.get('location') as string,
            district: formData.get('district') as string,
            beds: Number(formData.get('bedrooms') || 0),
            baths: Number(formData.get('bathrooms') || 0),
            description: formData.get('description') as string,

            thumbnailImage: thumbnailUrl,
            images: allImages,

            // Default agent data
            agent: {
                name: 'Kobac Property',
                phone: '+252610251014',
                location: 'Mogadishu - Somalia',
                verified: true
            },
            status: (formData.get('listingType') === 'sale') ? 'For Sale' : 'For Rent',
            createdAt: new Date(),
            listedAt: new Date()
        }

        // 5. Assign next stable kobacId
        const maxDoc = await PropertyModel
            .findOne({ kobacId: { $exists: true } })
            .sort({ kobacId: -1 })
            .select('kobacId')
            .lean()
            .exec() as any
        const nextKobacId = maxDoc?.kobacId ? maxDoc.kobacId + 1 : 1

        // 6. Save to MongoDB
        const newProperty = await PropertyModel.create({ ...propertyData, kobacId: nextKobacId })

        return NextResponse.json({ success: true, propertyId: newProperty._id, kobacId: nextKobacId })

    } catch (error: any) {
        console.error('[Admin Upload API Error]', error)
        return NextResponse.json({ error: 'Upload failed', details: error.message }, { status: 500 })
    }
}

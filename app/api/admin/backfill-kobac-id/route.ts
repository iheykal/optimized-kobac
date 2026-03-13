import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import PropertyModel from '@/lib/models/Property'

/**
 * ONE-TIME backfill: assigns a permanent `kobacId` to every property that
 * does not already have one.
 *
 * Strategy:
 *  - Sort all properties oldest-first (createdAt ASC)
 *  - The oldest property gets kobacId = 1, next gets 2, etc.
 *  - This means the HIGHEST number is always the NEWEST property — intuitive
 *    for users who see "KOB-1" through "KOB-250" grow over time.
 *
 * Run once after deployment:
 *   GET /api/admin/backfill-kobac-id
 *
 * Safe to call multiple times — only updates docs where kobacId is missing.
 */
export async function GET() {
    try {
        await connectToDatabase()

        // Fetch ALL properties sorted oldest → newest so we can assign ascending IDs
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const all: any[] = await PropertyModel
            .find({})
            .sort({ listedAt: 1, createdAt: 1, _id: 1 })
            .lean()
            .exec()

        let assigned = 0
        let skipped = 0

        for (let i = 0; i < all.length; i++) {
            const doc = all[i]
            if (doc.kobacId != null) {
                skipped++
                continue
            }
            const kobacId = i + 1 // 1-indexed, stable
            await PropertyModel.updateOne(
                { _id: doc._id },
                { $set: { kobacId } }
            )
            assigned++
        }

        return NextResponse.json({
            success: true,
            total: all.length,
            assigned,
            skipped,
            message: `Backfill complete. Assigned kobacId to ${assigned} properties, ${skipped} already had one.`,
        })
    } catch (error) {
        console.error('[backfill-kobac-id]', error)
        return NextResponse.json({ error: String(error) }, { status: 500 })
    }
}

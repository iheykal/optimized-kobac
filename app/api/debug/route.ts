import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const uri = process.env.MONGODB_URI
        if (!uri) {
            return NextResponse.json({ error: 'MONGODB_URI is undefined in process.env' }, { status: 500 })
        }

        try {
            await connectToDatabase()
        } catch (dbErr: any) {
            return NextResponse.json({
                error: 'Failed to connectToDatabase()',
                details: dbErr.message,
                stack: dbErr.stack
            }, { status: 500 })
        }

        const db = mongoose.connection.db
        if (!db) {
            return NextResponse.json({ error: 'Database not connected (mongoose.connection.db is null)' }, { status: 500 })
        }

        // List all collections in the database
        const collections = await db.listCollections().toArray()
        const collectionNames = collections.map(c => c.name)

        // Get sample documents from each collection
        const samples: Record<string, unknown[]> = {}
        for (const name of collectionNames) {
            const docs = await db.collection(name).find({}).limit(2).toArray()
            samples[name] = docs
        }

        return NextResponse.json({
            database: mongoose.connection.name,
            collections: collectionNames,
            samples,
        }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({
            error: 'Unexpected error in /api/debug',
            message: err.message,
            stack: err.stack
        }, { status: 500 })
    }
}

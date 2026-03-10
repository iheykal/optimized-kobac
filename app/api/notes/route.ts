import { NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongoose'
import Note from '@/lib/models/Note'

export async function GET() {
    try {
        await connectToDatabase()
        const notes = await Note.find().sort({ createdAt: -1 })
        return NextResponse.json(notes)
    } catch (error) {
        console.error('Notes GET Error:', error)
        return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { content, type } = body

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 })
        }

        await connectToDatabase()
        const newNote = await Note.create({ content, type: type || 'general' })

        return NextResponse.json(newNote, { status: 201 })
    } catch (error) {
        console.error('Notes POST Error:', error)
        return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
    }
}
export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ error: 'Note ID required' }, { status: 400 })

        await connectToDatabase()
        await Note.findByIdAndDelete(id)

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 })
    }
}

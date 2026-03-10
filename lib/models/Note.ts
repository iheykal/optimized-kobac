import mongoose, { Schema, Document } from 'mongoose'

export interface INote extends Document {
    content: string
    type: 'idea' | 'motivation' | 'tip' | 'trick' | 'general'
    createdAt: Date
    updatedAt: Date
}

const NoteSchema: Schema = new Schema(
    {
        content: { type: String, required: true },
        type: {
            type: String,
            enum: ['idea', 'motivation', 'tip', 'trick', 'general'],
            default: 'general',
        },
    },
    { timestamps: true }
)

export default mongoose.models.Note || mongoose.model<INote>('Note', NoteSchema)

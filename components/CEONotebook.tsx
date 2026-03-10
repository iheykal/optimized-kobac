'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, Trash2, Plus, Sparkles, BookOpen, PenTool } from 'lucide-react'

// Define the note type matching the Mongo schema
interface Note {
    _id: string
    content: string
    type: 'idea' | 'motivation' | 'tip' | 'trick' | 'general'
    createdAt: string
}

export default function CEONotebook() {
    const [notes, setNotes] = useState<Note[]>([])
    const [inputValue, setInputValue] = useState('')
    const [selectedType, setSelectedType] = useState<Note['type']>('idea')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    // Fetch notes on load
    useEffect(() => {
        fetchNotes()
    }, [])

    const fetchNotes = async () => {
        setIsLoading(true)
        try {
            const res = await fetch('/api/notes')
            if (res.ok) {
                const data = await res.json()
                setNotes(data)
            }
        } catch (error) {
            console.error('Failed to fetch notes', error)
        } finally {
            setIsLoading(false)
        }
    }

    const addNote = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!inputValue.trim()) return

        setIsSubmitting(true)
        try {
            const res = await fetch('/api/notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: inputValue, type: selectedType })
            })

            if (res.ok) {
                const newNote = await res.json()
                setNotes([newNote, ...notes]) // Add to top instantly
                setInputValue('') // clear input
            }
        } catch (error) {
            console.error('Failed to add note', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const deleteNote = async (id: string) => {
        // Optimistic delete
        const previousNotes = [...notes]
        setNotes(notes.filter(n => n._id !== id))

        try {
            const res = await fetch(`/api/notes?id=${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Delete failed')
        } catch (error) {
            // Revert on failure
            setNotes(previousNotes)
            console.error(error)
        }
    }

    // Colors and icons for different note types
    const getTypeConfig = (type: Note['type']) => {
        switch (type) {
            case 'idea': return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: <Lightbulb className="w-4 h-4" /> }
            case 'motivation': return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: <Sparkles className="w-4 h-4" /> }
            case 'tip': return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: <BookOpen className="w-4 h-4" /> }
            case 'trick': return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: <PenTool className="w-4 h-4" /> }
            default: return { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', icon: null }
        }
    }

    return (
        <div className="bg-white rounded-[2rem] p-6 lg:p-8 border border-gray-100 shadow-sm col-span-1 lg:col-span-2 relative overflow-hidden group">

            {/* Background flourish */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700 z-0"></div>

            <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                            CEO Notebook 📓
                        </h2>
                        <p className="text-gray-500 text-sm font-medium mt-1">Dump your ideas, marketing tips, and late-night motivation here.</p>
                    </div>
                </div>

                {/* The Input Form */}
                <form onSubmit={addNote} className="mb-8">
                    <div className="bg-gray-50 rounded-2xl p-2 border border-gray-200 shadow-inner flex flex-col sm:flex-row gap-2">
                        {/* Type Selector */}
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as Note['type'])}
                            className="bg-white border text-sm font-bold border-gray-200 text-gray-700 rounded-xl px-4 py-3 sm:w-40 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-sm"
                        >
                            <option value="idea">💡 Idea</option>
                            <option value="motivation">🔥 Motivation</option>
                            <option value="tip">📘 Strategy Tip</option>
                            <option value="trick">⚡ Growth Trick</option>
                        </select>

                        {/* Text Input */}
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="E.g., Try advertising to diaspora in Minnesota..."
                                className="w-full bg-white border border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                required
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting || !inputValue.trim()}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                <Plus className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </form>

                {/* The Notes List */}
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {isLoading ? (
                        <div className="text-center py-8 text-gray-400 font-medium text-sm animate-pulse">
                            Loading your brilliance...
                        </div>
                    ) : notes.length === 0 ? (
                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-500 font-medium">No notes yet. Start writing history.</p>
                        </div>
                    ) : (
                        notes.map((note) => {
                            const config = getTypeConfig(note.type)
                            const dateObj = new Date(note.createdAt)
                            const date = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
                            const time = dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

                            return (
                                <div key={note._id} className={`group/note relative flex flex-col gap-3 p-5 rounded-2xl border-2 ${config.bg} ${config.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 overflow-hidden`}>
                                    {/* Decorative background glow */}
                                    <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-40 mix-blend-multiply pointer-events-none ${config.text.replace('text-', 'bg-')}`}></div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`p-2 rounded-xl bg-white shadow-sm ring-1 ring-black/5 ${config.text}`}>
                                                {config.icon || <Lightbulb className="w-4 h-4" />}
                                            </div>
                                            <span className={`text-xs uppercase tracking-widest font-black ${config.text}`}>
                                                {note.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-500 font-semibold bg-white/50 px-2 py-1 rounded-md">
                                                {date} • {time}
                                            </span>
                                            <button
                                                onClick={() => deleteNote(note._id)}
                                                className="opacity-0 group-hover/note:opacity-100 flex-shrink-0 text-red-400 hover:bg-red-50 hover:text-red-600 p-1.5 rounded-lg transition-all border border-transparent hover:border-red-100"
                                                title="Delete note"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <p className="text-gray-800 font-medium text-base leading-relaxed relative z-10">
                                        {note.content}
                                    </p>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #e5e7eb;
                    border-radius: 20px;
                }
            `}</style>
        </div>
    )
}

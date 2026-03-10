'use client'

import { useState } from 'react'
import { Plus, KeyRound, ArrowRight } from 'lucide-react'
import AddPropertyModal from './AddPropertyModal'

export default function AdminPage() {
    const [password, setPassword] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [error, setError] = useState(false)

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password === '10142003') {
            setIsAuthenticated(true)
            setError(false)
        } else {
            setError(true)
            setPassword('')
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <KeyRound className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Access</h1>
                    <p className="text-gray-500 mb-8">Enter the master password to access the dashboard.</p>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <input
                                type="tel"
                                pattern="[0-9]*"
                                inputMode="numeric"
                                value={password}
                                onChange={e => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setPassword(val);
                                    setError(false);
                                }}
                                placeholder="Enter admin code"
                                className={`w-full px-4 py-3 rounded-xl border outline-none transition-colors text-center text-lg tracking-widest font-mono ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100'}`}
                            />
                            {error && <p className="text-red-500 text-sm mt-2 font-medium animate-in fade-in slide-in-from-top-1">Incorrect admin code</p>}
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
                        >
                            Log In <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Nav */}
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-black text-white font-bold flex items-center justify-center rounded-lg text-xs">
                            KR
                        </div>
                        <span className="font-bold text-gray-900">Kobac Admin Dashboard</span>
                    </div>
                    <button
                        onClick={() => setIsAuthenticated(false)}
                        className="text-sm text-gray-500 hover:text-gray-900"
                    >
                        Log out
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, Admin</h2>
                <p className="text-gray-500 mb-12">Click the floating plus button to add a new property listing.</p>

                <div className="p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50/50 flex flex-col items-center">
                    <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">No pending properties</h3>
                    <p className="text-gray-500 text-sm">You are completely caught up.</p>
                </div>
            </main>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 hover:bg-blue-700 hover:scale-105 active:scale-95 text-white rounded-2xl shadow-2xl shadow-blue-600/30 flex items-center justify-center transition-all z-40"
            >
                <Plus className="w-8 h-8" />
            </button>

            {/* Modal */}
            {isModalOpen && (
                <AddPropertyModal
                    password={password}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    )
}

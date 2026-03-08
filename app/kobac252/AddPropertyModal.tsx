'use client'

import { useState } from 'react'
import { X, ClipboardPaste, Info } from 'lucide-react'

// Simple helper to guess fields from pasted text
function parseSmartPaste(text: string) {
    const data: any = {}
    const t = text.toLowerCase()

    // Price
    const priceMatch = text.match(/\$\s*(\d+(?:,\d+)*)/)
    if (priceMatch) data.price = priceMatch[1].replace(/,/g, '')

    // Rooms
    const roomMatch = t.match(/(\d+)\s*qol/)
    if (roomMatch) data.bedrooms = roomMatch[1]

    // Bathrooms
    const bathMatch = t.match(/(\d+)\s*suuli/)
    if (bathMatch) data.bathrooms = bathMatch[1]

    // Type
    if (t.includes('villa') || t.includes('villo')) data.propertyType = 'Villo'
    if (t.includes('apartment') || t.includes('dabaq')) data.propertyType = 'Apartment'
    if (t.includes('office')) data.propertyType = 'Office'
    if (t.includes('shop') || t.includes('dukaan')) data.propertyType = 'Shop'

    // Listing
    if (t.includes('kiro')) data.listingType = 'rent'
    if (t.includes('iib')) data.listingType = 'sale'

    return data
}

export default function AddPropertyModal({ onClose, password }: { onClose: () => void, password: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [pasteText, setPasteText] = useState('')

    // Form fields
    const [formData, setFormData] = useState({
        propertyType: 'Villo',
        listingType: 'sale',
        sharciga: '',
        length: '',
        width: '',
        price: '',
        location: '',
        district: '',
        bedrooms: '',
        bathrooms: '',
        description: ''
    })

    const [thumbnail, setThumbnail] = useState<File | null>(null)
    const [images, setImages] = useState<FileList | null>(null)

    const handlePaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const text = e.target.value
        setPasteText(text)

        const parsed = parseSmartPaste(text)
        setFormData(prev => ({ ...prev, ...parsed }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const data = new FormData()
            data.append('password', password)
            data.append('title', `${formData.propertyType} ${formData.listingType === 'sale' ? 'iib' : 'kiro'} ah`)
            data.append('propertyType', formData.propertyType)
            data.append('listingType', formData.listingType)

            if (formData.listingType === 'sale') {
                data.append('sharciga', formData.sharciga)
                // Format measurement as "length x width"
                if (formData.length || formData.width) {
                    data.append('measurement', `${formData.length} x ${formData.width}`)
                }
            } else {
                // If it's rent, measurement and sharciga shouldn't be required or added
                data.append('sharciga', '')
                data.append('measurement', '')
            }

            data.append('price', formData.price)
            data.append('location', formData.location)
            data.append('district', formData.district)
            data.append('bedrooms', formData.bedrooms)
            data.append('bathrooms', formData.bathrooms)
            data.append('description', formData.description || pasteText)

            if (thumbnail) data.append('thumbnailImage', thumbnail)
            if (images) {
                Array.from(images).forEach(file => {
                    data.append('images', file)
                })
            }

            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: data // Don't set Content-Type, browser sets it with boundary for FormData
            })

            if (res.ok) {
                alert('Property uploaded successfully!')
                onClose()
            } else {
                const err = await res.json()
                alert(`Error: ${err.error || 'Failed to upload'}`)
            }
        } catch (error) {
            console.error(error)
            alert('Something went wrong.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
                        <p className="text-gray-500 text-sm">Create a new property listing for your portfolio</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">

                    {/* Smart Paste */}
                    <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-5">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="bg-blue-600 text-white p-1.5 rounded-lg">
                                <ClipboardPaste className="w-4 h-4" />
                            </div>
                            <h3 className="font-bold text-gray-900">Smart Paste</h3>
                            <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">New</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">Paste property details from WhatsApp or Facebook to auto-fill the form instantly!</p>
                        <textarea
                            value={pasteText}
                            onChange={handlePaste}
                            placeholder="Paste text here (e.g. #GURI KIRO_AH #DABAQ 2qol...)"
                            className="w-full border border-gray-200 rounded-xl p-3 text-sm min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        />
                        <div className="flex items-center gap-1.5 mt-2 text-blue-600 text-xs font-medium">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            System automatically detects: Rooms, Price, District, Location & Type
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Property Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
                            <select
                                required
                                value={formData.propertyType}
                                onChange={e => setFormData({ ...formData, propertyType: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="Villo">Villo</option>
                                <option value="Apartment">Apartment</option>
                                <option value="Office">Office</option>
                                <option value="Shop">Shop</option>
                            </select>
                        </div>

                        {/* Listing Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Listing Type *</label>
                            <select
                                required
                                value={formData.listingType}
                                onChange={e => setFormData({ ...formData, listingType: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="sale">Iib (Sale)</option>
                                <option value="rent">Kiro (Rent)</option>
                            </select>
                        </div>

                        {/* Sharciga */}
                        {formData.listingType === 'sale' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sharciga (Document Type)</label>
                                <select
                                    value={formData.sharciga}
                                    onChange={e => setFormData({ ...formData, sharciga: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select document type</option>
                                    <option value="Siyaad Barre">Siyaad Barre</option>
                                    <option value="Koofi">Koofi</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        )}

                        {/* Cabirka */}
                        {formData.listingType === 'sale' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cabirka (Measurement) *</label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="number"
                                        placeholder="20"
                                        required
                                        value={formData.length}
                                        onChange={e => setFormData({ ...formData, length: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-center outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="text-gray-400 font-medium">×</span>
                                    <input
                                        type="number"
                                        placeholder="20"
                                        required
                                        value={formData.width}
                                        onChange={e => setFormData({ ...formData, width: e.target.value })}
                                        className="w-full border border-gray-200 rounded-xl p-3 text-center outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1.5">Enter length and width measurements (e.g., 20 × 20)</p>
                            </div>
                        )}

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Price *</label>
                            <input
                                type="number"
                                required
                                placeholder="Kuqor Qiimaha"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-500">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Enter location"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    className="w-full border border-gray-200 rounded-xl p-3 pl-10 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        {/* District */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">District *</label>
                            <select
                                required
                                value={formData.district}
                                onChange={e => setFormData({ ...formData, district: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Select a district</option>
                                <option value="Hodan">Hodan</option>
                                <option value="Hawl-Wadaag">Hawl-Wadaag</option>
                                <option value="Wardhiigley">Wardhiigley</option>
                                <option value="Waberi">Waberi</option>
                                <option value="Hamar Weyne">Hamar Weyne</option>
                                <option value="Hamar Jajab">Hamar Jajab</option>
                                <option value="Karan">Karan</option>
                                <option value="Yaqshid">Yaqshid</option>
                                <option value="Dharkenley">Dharkenley</option>
                                <option value="Wadajir">Wadajir</option>
                                <option value="Heliwa">Heliwa</option>
                                <option value="Daynile">Daynile</option>
                                <option value="Kahda">Kahda</option>
                                <option value="Darussalam">Darussalam</option>
                                <option value="Garasebaley">Garasebaley</option>
                                <option value="Gubadley">Gubadley</option>
                            </select>
                        </div>

                        {/* Bedrooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Qol (Bedrooms) (Optional)</label>
                            <input
                                type="number"
                                placeholder="Number of bedrooms"
                                value={formData.bedrooms}
                                onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Bathrooms */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">Suuli (Bathrooms) (Optional)</label>
                            <input
                                type="number"
                                placeholder="Number of bathrooms"
                                value={formData.bathrooms}
                                onChange={e => setFormData({ ...formData, bathrooms: e.target.value })}
                                className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Description (Optional)</label>
                        <textarea
                            placeholder="Enter property description"
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl p-3 min-h-[100px] outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Thumbnail Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                            🖼️ Thumbnail Image (Main/Featured Image) *
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors">
                                Choose File
                                <input
                                    type="file"
                                    required
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={e => setThumbnail(e.target.files?.[0] || null)}
                                />
                            </label>
                            <span className="text-gray-500 text-sm">
                                {thumbnail ? thumbnail.name : 'No file chosen'}
                            </span>
                        </div>
                    </div>

                    {/* Additional Images */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-1">
                            📸 Additional Property Images
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="bg-green-50 hover:bg-green-100 text-green-600 px-4 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-colors">
                                Choose Files
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="hidden"
                                    onChange={e => setImages(e.target.files)}
                                />
                            </label>
                            <span className="text-gray-500 text-sm">
                                {images && images.length > 0
                                    ? `${images.length} file(s) chosen`
                                    : 'No file chosen'}
                            </span>
                        </div>
                    </div>

                    <div className="border-t border-gray-100 pt-6 mt-6 pb-2 flex justify-end gap-3 sticky bottom-0 bg-white z-10">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-xl transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center gap-2 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                'Uploading...'
                            ) : (
                                <>
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                    Upload Property
                                </>
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

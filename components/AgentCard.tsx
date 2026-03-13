'use client'

import { Phone, User } from 'lucide-react'
import { Agent } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'

export default function AgentCard({ agent }: { agent: Agent }) {
    const whatsappUrl = `https://wa.me/${agent.phone.replace(/\s/g, '')}`

    return (
        <div className="rounded-xl overflow-hidden border border-gray-200 mt-5">
            <div className="bg-blue-600 px-3 py-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                    <Phone className="w-3.5 h-3.5 text-white flex-shrink-0" />
                    <span className="text-white text-[10px] font-bold uppercase tracking-wider">LAXIRIIR WAKIILKEENA</span>
                    <span className="text-blue-200 text-[10px] font-semibold truncate">{agent.name}</span>
                </div>
                <User className="w-4 h-4 text-blue-300 flex-shrink-0" />
            </div>
            <div className="bg-white p-4">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/icons/klogo.png" alt="Kobac Property Logo" className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <div className="flex items-center gap-1">
                            <span className="font-bold text-gray-900 text-sm">{agent.name}</span>
                            {agent.verified && (
                                <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" aria-label="Verified">
                                    <circle cx="12" cy="12" r="12" fill="#1877F2" />
                                    <path d="M6.5 12.5l3.5 3.5 7.5-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                                </svg>
                            )}
                        </div>
                        <p className="text-gray-500 text-xs">{agent.location}</p>
                    </div>
                </div>
                <a href={`tel:${agent.phone}`} className="flex items-center justify-center gap-2 w-full border border-gray-300 rounded-lg py-2.5 text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors mb-2">
                    <Phone className="w-4 h-4" />{agent.phone}
                </a>
                <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full border border-green-500 rounded-lg py-2.5 text-green-600 font-semibold text-sm hover:bg-green-50 transition-colors"
                    onClick={() => {
                        trackEvent('whatsapp_lead', {
                            metadata: { agentName: agent.name, agentPhone: agent.phone }
                        })
                    }}
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp Now
                </a>
                <div className="flex items-center justify-center gap-4 mt-3">
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        <span className="text-gray-400 text-[11px]">Available 24/7</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-gray-400 text-[11px]">Quick Response</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

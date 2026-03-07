import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kobac Property — Find Your Perfect Home in Somalia',
  description: 'Kobac Property helps you find apartments, villas, and offices for rent in Mogadishu, Somalia. Over 200 verified property listings.',
  keywords: 'real estate, property, apartment, villa, Mogadishu, Somalia, kiro, rent',
  metadataBase: new URL('https://kobac.net'),
  icons: {
    icon: '/icons/klogo.png',
    shortcut: '/icons/klogo.png',
    apple: '/icons/klogo.png',
  },
  openGraph: {
    title: 'Kobac Property',
    description: 'Find your perfect property in Mogadishu, Somalia.',
    type: 'website',
    images: [{ url: '/icons/klogo.png' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="so" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  )
}

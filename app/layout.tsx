import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CookieConsent } from '@/components/ui/CookieConsent'

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://deadstock.io'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'DeadStock — Global Surplus Inventory Recovery & B2B Marketplace',
    template: '%s | DeadStock',
  },
  description:
    'Turn dead stock into cash. AI spots slow stock early, matches it with verified industrial buyers across 80+ sectors, and coordinates escrow delivery.',
  keywords: [
    'dead stock marketplace',
    'surplus inventory liquidation',
    'excess inventory recovery',
    'B2B surplus stock buyers',
    'industrial inventory optimization',
    'slow moving stock AI',
  ],
  authors: [{ name: 'DeadStock Technologies Inc.' }],
  creator: 'DeadStock Technologies Inc.',
  publisher: 'DeadStock Technologies Inc.',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'DeadStock — Global Surplus Inventory Recovery Platform',
    description:
      'AI spots risky inventory early and matches it with verified industrial buyers before it turns into a loss.',
    url: siteUrl,
    siteName: 'DeadStock',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeadStock — Global Surplus Inventory Marketplace',
    description:
      'Turn dead stock into cash. Buy and sell surplus, unsold and excess inventory worldwide.',
    creator: '@deadstock_io',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#072433',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-white text-[#0A0A0A] selection:bg-teal-500 selection:text-white">
        {children}
        <CookieConsent />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}


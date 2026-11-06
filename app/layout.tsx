import type { Metadata } from 'next'
import { IBM_Plex_Mono, Jost, Libre_Baskerville, Public_Sans, Quicksand } from 'next/font/google'
import './globals.css'

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-body',
})

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-display',
})

const libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  variable: '--font-serif',
})

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-mono-display',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-rounded',
})

export const metadata: Metadata = {
  title: 'BakerLinks – Your Links, Your Identity',
  description: 'Create your free link in bio page in minutes. Share one link everywhere.',
  icons: {
    icon: '/bakerlinks-logo-A.svg',
    shortcut: '/bakerlinks-logo-A.svg',
    apple: '/bakerlinks-logo-A.svg',
  },
  openGraph: {
    title: 'BakerLinks – Your Links, Your Identity',
    description: 'Create your free link-in-bio page in minutes. Share one link everywhere.',
    url: 'https://bakerlinks.com',
    siteName: 'BakerLinks',
    images: [{ url: 'https://bakerlinks.com/bakerlinks-logo-A.svg', width: 400, height: 400 }],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'BakerLinks',
    description: 'Create your free link-in-bio page in minutes. Share one link everywhere.',
    images: ['https://bakerlinks.com/bakerlinks-logo-A.svg'],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${publicSans.variable} ${jost.variable} ${libreBaskerville.variable} ${plexMono.variable} ${quicksand.variable} font-body antialiased`}>
        
        <a  href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-semibold"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}

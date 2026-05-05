import type { Metadata } from 'next'
import { Space_Grotesk, Syne } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
})

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-display',
})

export const metadata: Metadata = {
  title: 'BakerLinks – Your Links, Your Identity',
  description: 'Create your free link-in-bio page in minutes. Share one link everywhere.',
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
      <body className={`${spaceGrotesk.variable} ${syne.variable} font-body antialiased`}>
  
    <a href="#main-content"
    className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-xl focus:text-sm focus:font-semibold"
  >
    Skip to main content
  </a>
  {children}
</body>
    </html>
  )
}

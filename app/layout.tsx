import type { Metadata } from 'next'
import { Barlow, DM_Sans, IBM_Plex_Mono, IBM_Plex_Sans, Inter, JetBrains_Mono, Jost, Libre_Baskerville, Lora, Manrope, Public_Sans, Quicksand, Source_Sans_3, Source_Serif_4, Space_Mono, Work_Sans } from 'next/font/google'
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

// Profile alternatives are self-hosted, but fetched only when used (or previewed).
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', preload: false })
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans', preload: false })
const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', preload: false })
const sourceSans = Source_Sans_3({ subsets: ['latin'], variable: '--font-source-sans', preload: false })
const workSans = Work_Sans({ subsets: ['latin'], variable: '--font-work-sans', preload: false })
const barlow = Barlow({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-barlow', preload: false })
const plexSans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-plex-sans', preload: false })
const lora = Lora({ subsets: ['latin'], variable: '--font-lora', preload: false })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], variable: '--font-source-serif', preload: false })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', preload: false })
const spaceMono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-space-mono', preload: false })
const profileFontVariables = [inter, dmSans, manrope, sourceSans, workSans, barlow, plexSans, lora, sourceSerif, jetbrains, spaceMono].map(font => font.variable).join(' ')

export const metadata: Metadata = {
  title: 'BakerLinks – Your Links, Your Identity',
  description: 'Create your free link in bio page in minutes. Share one link everywhere.',
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
      <body className={`${publicSans.variable} ${jost.variable} ${libreBaskerville.variable} ${plexMono.variable} ${quicksand.variable} ${profileFontVariables} font-body antialiased`}>
        
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

'use client'

import { useState, useEffect } from 'react'
import { Profile, Link as LinkType } from '@/lib/types'
import { themes } from '@/lib/themes'
import CardLayout from '@/components/layouts/CardLayout'
import ImmersiveLayout from '@/components/layouts/ImmersiveLayout'

export default function PublicProfile({
  profile,
  links,
}: {
  profile: Profile
  links: LinkType[]
}) {
  const theme = themes[profile.theme] ?? themes.electric
  const [activeTab, setActiveTab] = useState<'links' | 'about'>('links')

  useEffect(() => {
    const themeMap: Record<string, { bg: string; scheme: string; scrollClass: string }> = {
      electric: { bg: '#0a0a0f', scheme: 'dark',  scrollClass: '' },
      neon:     { bg: '#050510', scheme: 'dark',  scrollClass: '' },
      earthy:   { bg: '#0d1f0f', scheme: 'dark',  scrollClass: '' },
      light:    { bg: '#fffbf0', scheme: 'light', scrollClass: 'light-scrollbar' },
      pastel:   { bg: '#ddeeff', scheme: 'light', scrollClass: 'light-scrollbar' },
    }
    const t = themeMap[profile.theme] ?? themeMap.electric
    document.documentElement.style.backgroundColor = t.bg
    document.documentElement.style.colorScheme = t.scheme
    if (t.scrollClass) document.documentElement.classList.add(t.scrollClass)
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.documentElement.style.colorScheme = ''
      document.documentElement.classList.remove('light-scrollbar')
    }
  }, [profile.theme])

  const layoutProps = {
    profile,
    links,
    theme,
    activeTab,
    onTabChange: setActiveTab,
  }

  const layout = profile.layout ?? 'card'

  return (
    <main className={`min-h-screen ${layout === 'immersive' ? '' : `${theme.bg} ${theme.isDark ? 'noise' : ''}`}`}>
      {layout === 'immersive' ? (
        <ImmersiveLayout {...layoutProps} />
      ) : (
        <CardLayout {...layoutProps} />
      )}
    </main>
  )
}

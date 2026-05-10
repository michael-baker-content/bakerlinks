'use client'

import { useState, useEffect } from 'react'
import { Profile, Link as LinkType } from '@/lib/types'
import CardLayout from '@/components/layouts/CardLayout'
import ImmersiveLayout from '@/components/layouts/ImmersiveLayout'
import MinimalLayout from '@/components/layouts/MinimalLayout'
import { themes, buildCustomTheme } from '@/lib/themes'
import { getLayout } from '@/lib/layouts'
import { isColorDark } from '@/components/layouts/shared'

export default function PublicProfile({
  profile,
  links,
}: {
  profile: Profile
  links: LinkType[]
}) {
  const theme = profile.theme === 'custom' && profile.custom_theme
    ? buildCustomTheme(profile.custom_theme)
    : themes[profile.theme] ?? themes.electric
  const c = theme.customColors
  const [activeTab, setActiveTab] = useState<'links' | 'about'>('links')
  const layoutConfig = getLayout(profile.layout ?? 'card')
  const layout = layoutConfig.id

  useEffect(() => {
    const themeMap: Record<string, { bg: string; scheme: string; scrollClass: string }> = {
      electric: { bg: '#0a0a0f', scheme: 'dark',  scrollClass: '' },
      neon:     { bg: '#050510', scheme: 'dark',  scrollClass: '' },
      earthy:   { bg: '#0d1f0f', scheme: 'dark',  scrollClass: '' },
      light:    { bg: '#fffbf0', scheme: 'light', scrollClass: 'light-scrollbar' },
      pastel:   { bg: '#ddeeff', scheme: 'light', scrollClass: 'light-scrollbar' },
    }
    const t = c
      ? {
          bg: c.bg,
          scheme: isColorDark(c.bg) ? 'dark' : 'light',
          scrollClass: isColorDark(c.bg) ? '' : 'light-scrollbar',
        }
      : (themeMap[profile.theme] ?? themeMap.electric)

    document.documentElement.style.backgroundColor = t.bg
    document.documentElement.style.colorScheme = t.scheme
    if (t.scrollClass) document.documentElement.classList.add(t.scrollClass)
    return () => {
      document.documentElement.style.backgroundColor = ''
      document.documentElement.style.colorScheme = ''
      document.documentElement.classList.remove('light-scrollbar')
    }
  }, [profile.theme, c?.bg])

  const layoutProps = {
    profile,
    links,
    theme,
    activeTab,
    onTabChange: setActiveTab,
  }

  return (
    <main
      className={`min-h-screen ${layout === 'immersive' ? '' : `${c ? '' : theme.bg} ${theme.isDark ? 'noise' : ''}`}`}
      style={c ? { backgroundColor: c.bg } : {}}
    >
      {layout === 'immersive' ? (
        <ImmersiveLayout {...layoutProps} />
      ) : layout === 'minimal' ? (
        <MinimalLayout {...layoutProps} />
      ) : (
        <CardLayout {...layoutProps} />
      )}
    </main>
  )
}
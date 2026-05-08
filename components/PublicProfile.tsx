'use client'

import { useState, useEffect } from 'react'
import { Profile, Link as LinkType } from '@/lib/types'
import CardLayout from '@/components/layouts/CardLayout'
import ImmersiveLayout from '@/components/layouts/ImmersiveLayout'
import { themes, buildCustomTheme, ThemeConfig } from '@/lib/themes'

function customStyle(theme: ThemeConfig): React.CSSProperties {
  if (!theme.customColors) return {}
  return {
    '--custom-bg': theme.customColors.bg,
    '--custom-card-bg': theme.customColors.cardBg,
    '--custom-card-border': theme.customColors.cardBorder,
    '--custom-text': theme.customColors.text,
    '--custom-text-muted': theme.customColors.textMuted,
    '--custom-text-heading': theme.customColors.textHeading,
    '--custom-accent': theme.customColors.accentHex,
    '--custom-avatar-ring': theme.customColors.avatarRing,
    '--custom-button-bg': theme.customColors.buttonBg,
    '--custom-button-text': theme.customColors.buttonText,
  } as React.CSSProperties
}

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
    <main
  className={`min-h-screen ${layout === 'immersive' ? '' : `${theme.bg} ${theme.isDark ? 'noise' : ''}`}`}
  style={c ? { backgroundColor: c.bg } : {}}>
      {layout === 'immersive' ? (
        <ImmersiveLayout {...layoutProps} />
      ) : (
        <CardLayout {...layoutProps} />
      )}
    </main>
  )
}

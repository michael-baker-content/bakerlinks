'use client'

import { useState } from 'react'
import { Profile, Link as LinkType } from '@/lib/types'
import { ThemeConfig } from '@/lib/themes'
import SocialLinksDisplay from '@/components/SocialLinksDisplay'
import { ProfileHeader, TabBar, LinksList, AboutContent, ProfileFooter, getFontClasses } from './shared'

interface Props {
  profile: Profile
  links: LinkType[]
  theme: ThemeConfig
  activeTab: 'links' | 'about'
  onTabChange: (tab: 'links' | 'about') => void
}

export default function MinimalLayout({ profile, links, theme, activeTab, onTabChange }: Props) {
  const c = theme.customColors
  const [hoveredTab, setHoveredTab] = useState<'links' | 'about' | null>(null)
  const fontClasses = getFontClasses(profile.font ?? 'default')

  return (
    <div className={`${fontClasses.body} ${c ? '' : theme.bg}`} style={c ? { backgroundColor: c.bg } : {}}>

      <div className="max-w-sm mx-auto px-4 pt-16 pb-8">
        <ProfileHeader profile={profile} theme={theme} fontClasses={fontClasses} />

        {profile.social_links_position === 'top' && (
          <SocialLinksDisplay links={profile.social_links} theme={profile.theme} customAccent={c?.accentHex} />
        )}

        {profile.about_enabled && (
          <TabBar
            profile={profile}
            theme={theme}
            activeTab={activeTab}
            onTabChange={onTabChange}
            hoveredTab={hoveredTab}
            onHover={setHoveredTab}
          />
        )}

        {activeTab === 'links' && (
          <LinksList profile={profile} links={links} theme={theme} />
        )}

        {activeTab === 'about' && profile.about_enabled && (
          <AboutContent profile={profile} theme={theme} contentBgHex={c?.bg} />
        )}

        {profile.social_links_position === 'bottom' && (
          <SocialLinksDisplay links={profile.social_links} theme={profile.theme} customAccent={c?.accentHex} />
        )}

        <ProfileFooter theme={theme} />
      </div>
    </div>
  )
}

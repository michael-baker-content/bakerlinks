'use client'

import { useState } from 'react'
import { Profile, Link as LinkType } from '@/lib/types'
import { ThemeConfig } from '@/lib/themes'
import SocialLinksDisplay from '@/components/SocialLinksDisplay'
import ProfileMotionBackground from '@/components/ProfileMotionBackground'
import { getProfileBackground } from '@/lib/profile-backgrounds'
import { ProfileHeader, TabBar, LinksList, AboutContent, ProfileFooter, getFontClasses } from './shared'

interface Props {
  profile: Profile
  links: LinkType[]
  theme: ThemeConfig
  activeTab: 'links' | 'about'
  onTabChange: (tab: 'links' | 'about') => void
  preview?: boolean
}

export default function CardLayout({ profile, links, theme, activeTab, onTabChange, preview }: Props) {
  const c = theme.customColors
  const [hoveredTab, setHoveredTab] = useState<'links' | 'about' | null>(null)
  const fontClasses = getFontClasses(profile.font ?? 'default')
  const animated = getProfileBackground(profile.animated_background)
  const hasBackground = !!animated || !!profile.background_url

  return (
    <div className={`${fontClasses.body} ${c ? '' : theme.bg}`} style={c ? { backgroundColor: c.bg } : {}}>

      {/* Background image or spacer */}
      {hasBackground ? (
        <div className={`relative w-full h-48 ${preview ? '' : 'sm:h-64'} overflow-hidden`}>
          {animated ? <ProfileMotionBackground backgroundId={animated.id} /> : (
          <img
            src={profile.background_url!}
            alt="Profile background"
            className="w-full h-full object-cover"
          />
          )}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent to-black/60" />
          {!animated && profile.background_attribution && (
            <div className="absolute top-2 right-3 text-white/40 text-xs">
              Photo by{' '}
              <a href={profile.background_attribution.photographer_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70">
                {profile.background_attribution.photographer_name}
              </a>
              {' '}on{' '}
              <a href={profile.background_attribution.unsplash_url} target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70">
                Unsplash
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className={`h-24 ${c ? '' : theme.bg}`} style={c ? { backgroundColor: c.bg } : {}} />
      )}

      <div className="relative max-w-sm mx-auto px-4">
        <div className={`${hasBackground ? '-mt-12' : 'mt-8'}`}>
          <ProfileHeader profile={profile} theme={theme} fontClasses={fontClasses} />
        </div>

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
          <LinksList links={links} theme={theme} />
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

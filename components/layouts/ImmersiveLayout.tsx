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

export default function ImmersiveLayout({ profile, links, theme, activeTab, onTabChange }: Props) {
  const c = theme.customColors
  const [hoveredTab, setHoveredTab] = useState<'links' | 'about' | null>(null)
  const fontClasses = getFontClasses(profile.font ?? 'default')
  const hasBg = !!profile.background_url
  const contentBgHex = c?.contentBg || c?.cardBg

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Full screen background */}
      {hasBg ? (
        <>
          <div className="fixed inset-0 z-0">
            <img src={profile.background_url!} alt="Profile background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          {profile.background_attribution && (
            <div className="fixed top-3 right-3 z-10 text-white/40 text-xs">
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
        </>
      ) : (
        <div className={`fixed inset-0 z-0 ${c ? '' : theme.bg}`} style={c ? { backgroundColor: c.bg } : {}} />
      )}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-16">
        <div className="w-full max-w-sm">
          <div
            className="backdrop-blur-md rounded-3xl p-6 mb-4"
            style={{
              backgroundColor: c
                ? `${contentBgHex}80`
                : `${theme.bgHex}99`
            }}
          >
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
                containerStyle={{ backgroundColor: c ? `${c.cardBg}80` : theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)' }}
              />
            )}

            {activeTab === 'links' && (
              <LinksList
                profile={profile}
                links={links}
                theme={theme}
                immersive
                linkCardClass={theme.card}
              />
            )}

            {activeTab === 'about' && profile.about_enabled && (
              <AboutContent profile={profile} theme={theme} contentBgHex={contentBgHex ?? theme.bgHex} />
            )}

            {profile.social_links_position === 'bottom' && (
              <SocialLinksDisplay links={profile.social_links} theme={profile.theme} customAccent={c?.accentHex} />
            )}

            <ProfileFooter theme={theme} />
          </div>
        </div>
      </div>
    </div>
  )
}

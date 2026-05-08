'use client'

import { useState } from 'react'
import { Profile, Link as LinkType } from '@/lib/types'
import { ThemeConfig } from '@/lib/themes'
import { ExternalLink } from 'lucide-react'
import SocialLinksDisplay from '@/components/SocialLinksDisplay'
import { createClient } from '@/lib/supabase/client'

interface Props {
  profile: Profile
  links: LinkType[]
  theme: ThemeConfig
  activeTab: 'links' | 'about'
  onTabChange: (tab: 'links' | 'about') => void
}

function adjustColor(hex: string, isDark: boolean): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  const amount = luminance < 0.3 ? 60 : -60
  const nr = Math.max(0, Math.min(255, r + amount))
  const ng = Math.max(0, Math.min(255, g + amount))
  const nb = Math.max(0, Math.min(255, b + amount))
  return `#${nr.toString(16).padStart(2, '0')}${ng.toString(16).padStart(2, '0')}${nb.toString(16).padStart(2, '0')}`
}

function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

export default function ImmersiveLayout({ profile, links, theme, activeTab, onTabChange }: Props) {
  const supabase = createClient()
  const c = theme.customColors
  const [hoveredTab, setHoveredTab] = useState<'links' | 'about' | null>(null)
  const contentBgHex = c?.contentBg || c?.cardBg
const contentIsDark = contentBgHex ? isColorDark(contentBgHex) : theme.isDark
const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  const initials = (profile.display_name || profile.username)
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const hasBg = !!profile.background_url

  function tabStyle(tab: 'links' | 'about') {
    if (!c) return undefined
    const isActive = activeTab === tab
    const isHovered = hoveredTab === tab
    if (isActive) {
      return {
        backgroundColor: isHovered ? adjustColor(c.buttonBg, theme.isDark) : c.buttonBg,
        color: c.buttonText,
      }
    }
    return {
      backgroundColor: isHovered ? adjustColor(c.cardBg, theme.isDark) : 'transparent',
      color: c.textMuted,
    }
  }

  function tabClass(tab: 'links' | 'about', extra: string) {
    if (c) return `${extra} rounded-lg text-sm font-medium transition-all`
    const isActive = activeTab === tab
    return `${extra} rounded-lg text-sm font-medium transition-all ${
      isActive
        ? theme.buttonPrimary
        : `${theme.textMuted} hover:${theme.text} ${theme.isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`
    }`
  }

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
    ? `${c.contentBg || c.cardBg}99`
    : theme.isDark ? 'rgba(0,0,0,0.30)' : 'rgba(255,255,255,0.40)'
}}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  className={`w-24 h-24 rounded-full object-cover mb-4 shadow-2xl ${c ? '' : `ring-4 ${theme.avatarRing}`}`}
                  style={c ? { boxShadow: `0 0 0 4px ${c.avatarRing}` } : {}}
                />
              ) : (
                <div
                  className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-2xl mb-4 shadow-2xl ${c ? '' : `ring-4 ${theme.avatarRing}`}`}
                  style={c ? { boxShadow: `0 0 0 4px ${c.avatarRing}` } : {}}
                >
                  {initials}
                </div>
              )}
              <h1
                className={`font-display text-2xl font-bold mb-1 ${c ? '' : theme.textHeading}`}
                style={c ? { color: c.textHeading } : {}}
              >
                {profile.display_name || profile.username}
              </h1>
              <p className={`text-sm ${c ? '' : theme.textMuted}`} style={c ? { color: c.textMuted } : {}}>
                @{profile.username}
              </p>
              {profile.bio && (
                <p className={`text-sm text-center mt-3 max-w-xs leading-relaxed ${c ? '' : theme.textMuted}`} style={c ? { color: c.textMuted } : {}}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Social links - top */}
            {profile.social_links_position === 'top' && (
              <SocialLinksDisplay links={profile.social_links} theme={profile.theme} customAccent={c?.accentHex} />
            )}

            {/* Tabs if about is enabled */}
            {profile.about_enabled && (
              <div
                className="flex rounded-xl p-1 mb-4"
                style={{ backgroundColor: c ? `${c.cardBg}80` : theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)' }}
              >
                <button
                  onClick={() => onTabChange('links')}
                  onMouseEnter={() => setHoveredTab('links')}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={tabClass('links', 'w-1/2 py-2 text-center')}
                  style={tabStyle('links')}
                >
                  Links
                </button>
                <button
                  onClick={() => onTabChange('about')}
                  onMouseEnter={() => setHoveredTab('about')}
                  onMouseLeave={() => setHoveredTab(null)}
                  className={tabClass('about', 'w-1/2 py-2 px-2 truncate min-w-0 text-center')}
                  style={tabStyle('about')}
                >
                  {profile.about_title || 'About'}
                </button>
              </div>
            )}

            {/* Links tab */}
            {activeTab === 'links' && (
              <div className="space-y-3 pb-4">
                {links.length === 0 && (
                  <p className={`text-center text-sm py-8 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textFaint } : {}}>No links yet.</p>
                )}
                {links.map((link, i) => (
                  <a
                    key={link.id}
  href={link.url}
  target="_blank"
  rel="noopener noreferrer"
  onMouseEnter={() => c && setHoveredLink(link.id)}
  onMouseLeave={() => c && setHoveredLink(null)}
  onClick={() => {
    supabase.rpc('increment_link_clicks', { link_id: link.id })
    supabase.from('link_click_events').insert({ link_id: link.id, user_id: profile.id })
  }}
  className={`block w-full text-left px-5 py-4 rounded-2xl border transition-all group ${
    c ? '' : theme.card
  }`}
  style={c ? {
    backgroundColor: hoveredLink === link.id
      ? adjustColor(c.cardBg, theme.isDark)
      : c.cardBg,
    borderColor: hoveredLink === link.id
      ? adjustColor(c.cardBorder, theme.isDark)
      : c.cardBorder,
    animationDelay: `${i * 60}ms`,
  } : { animationDelay: `${i * 60}ms` }}
>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {link.icon && (
                          <img src={link.icon} alt="" className="w-4 h-4 rounded-sm flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`font-semibold text-sm truncate ${c ? '' : theme.text}`} style={c ? { color: c.text } : {}}>{link.title}</p>
                          {link.description && (
                            <p className={`text-xs mt-0.5 line-clamp-2 ${c ? '' : theme.textMuted}`} style={c ? { color: c.textMuted } : {}}>{link.description}</p>
                          )}
                        </div>
                      </div>
                      <ExternalLink size={14} className={`ml-3 flex-shrink-0 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textMuted } : {}} />
                    </div>
                  </a>
                ))}
              </div>
            )}

            {/* About tab */}
            {activeTab === 'about' && profile.about_enabled && (
              <div className="pb-4">
                {profile.about_content ? (
                  <div style={c ? {
  '--tw-prose-body': c.text,
  '--tw-prose-headings': c.textHeading,
  '--tw-prose-bold': c.text,
  '--tw-prose-links': c.accentHex,
  '--tw-prose-bullets': contentIsDark ? '#9ca3af' : '#4b5563',
  '--tw-prose-counters': contentIsDark ? '#9ca3af' : '#4b5563',
} as React.CSSProperties : {}}>
                    <div
  className={`prose prose-sm max-w-none ${contentIsDark ? 'prose-invert' : ''}`}
  dangerouslySetInnerHTML={{ __html: profile.about_content }}
/>
                  </div>
                ) : (
                  <p className={`text-sm text-center py-8 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textFaint } : {}}>Nothing here yet.</p>
                )}
              </div>
            )}

            {/* Social links - bottom */}
            {profile.social_links_position === 'bottom' && (
              <SocialLinksDisplay links={profile.social_links} theme={profile.theme} customAccent={c?.accentHex} />
            )}

            {/* Footer */}
            <div className="text-center mt-4">
              <a
                href="/"
  className={`text-xs transition-colors ${c ? '' : theme.footerText}`}
  style={c ? { color: c.textMuted } : {}}
>
  Powered by <span className="font-display font-semibold">BakerLinks</span>
</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

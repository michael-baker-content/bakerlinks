'use client'

import { Profile, Link as LinkType } from '@/lib/types'
import { ThemeConfig } from '@/lib/themes'
import { ExternalLink } from 'lucide-react'
import SocialLinksDisplay from '@/components/SocialLinksDisplay'
import { createClient } from '@/lib/supabase/client'

// ── Helpers ────────────────────────────────────────────────────

export function isColorDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance < 0.5
}

export function adjustColor(hex: string): string {
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

export function getInitials(profile: Profile): string {
  return (profile.display_name || profile.username)
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getFontClasses(font: string): { heading: string; body: string } {
  switch (font) {
    case 'serif':   return { heading: 'font-serif-display', body: 'font-serif-body' }
    case 'mono':    return { heading: 'font-mono-display',  body: 'font-mono-display' }
    case 'rounded': return { heading: 'font-rounded',       body: 'font-rounded' }
    default:        return { heading: 'font-display',       body: 'font-body' }
  }
}

// ── Profile Header ─────────────────────────────────────────────

interface HeaderProps {
  profile: Profile
  theme: ThemeConfig
  fontClasses: { heading: string; body: string }
  size?: 'full' | 'preview'
}

export function ProfileHeader({ profile, theme, fontClasses, size = 'full' }: HeaderProps) {
  const c = theme.customColors
  const initials = getInitials(profile)
  const isPreview = size === 'preview'

  const avatarSize = isPreview ? 'w-14 h-14' : 'w-24 h-24'
  const avatarText = isPreview ? 'text-lg' : 'text-2xl'
  const avatarRing = isPreview ? 'ring-2' : 'ring-4'
  const avatarMb = isPreview ? 'mb-2' : 'mb-4'
  const nameSize = isPreview ? 'text-sm' : 'text-2xl'
  const handleSize = isPreview ? 'text-xs' : 'text-sm'
  const bioSize = isPreview ? 'text-xs mt-1 line-clamp-2' : 'text-sm mt-3'
  const wrapperMb = isPreview ? 'mb-3' : 'mb-6'

  return (
    <div className={`flex flex-col items-center ${wrapperMb}`}>
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={profile.display_name || profile.username}
          className={`${avatarSize} rounded-full object-cover ${avatarMb} ${c ? '' : `${avatarRing} ${theme.avatarRing}`}`}
          style={c ? { boxShadow: `0 0 0 ${isPreview ? '2px' : '4px'} ${c.avatarRing}` } : {}}
        />
      ) : (
        <div
          className={`${avatarSize} rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold ${avatarText} ${avatarMb} ${c ? '' : `${avatarRing} ${theme.avatarRing}`}`}
          style={c ? { boxShadow: `0 0 0 ${isPreview ? '2px' : '4px'} ${c.avatarRing}` } : {}}
        >
          {initials}
        </div>
      )}
      <p
        className={`${fontClasses.heading} ${nameSize} font-bold text-center ${isPreview ? '' : 'mb-1'} ${c ? '' : theme.textHeading}`}
        style={c ? { color: c.textHeading } : {}}
      >
        {profile.display_name || profile.username || 'Your name'}
      </p>
      <p
        className={`${handleSize} ${c ? '' : theme.textMuted}`}
        style={c ? { color: c.textMuted } : {}}
      >
        @{profile.username}
      </p>
      {profile.bio && (
        <p
          className={`${bioSize} text-center max-w-xs leading-relaxed ${c ? '' : theme.textMuted}`}
          style={c ? { color: c.textMuted } : {}}
        >
          {profile.bio}
        </p>
      )}
    </div>
  )
}

// ── Tab Bar ────────────────────────────────────────────────────

interface TabBarProps {
  profile: Profile
  theme: ThemeConfig
  activeTab: 'links' | 'about'
  onTabChange: (tab: 'links' | 'about') => void
  hoveredTab: 'links' | 'about' | null
  onHover: (tab: 'links' | 'about' | null) => void
  containerStyle?: React.CSSProperties
  size?: 'full' | 'preview'
}

export function TabBar({ profile, theme, activeTab, onTabChange, hoveredTab, onHover, containerStyle, size = 'full' }: TabBarProps) {
  const c = theme.customColors
  const isPreview = size === 'preview'

  function tabStyle(tab: 'links' | 'about') {
    if (!c) return undefined
    const isActive = activeTab === tab
    const isHovered = hoveredTab === tab
    if (isActive) {
      return {
        backgroundColor: isHovered ? adjustColor(c.buttonBg) : c.buttonBg,
        color: c.buttonText,
      }
    }
    return {
      backgroundColor: isHovered ? adjustColor(c.cardBg) : 'transparent',
      color: c.textMuted,
    }
  }

  function tabClass(tab: 'links' | 'about', extra: string) {
    if (c) return `${extra} rounded-lg font-medium transition-all ${isPreview ? 'text-xs' : 'text-sm'}`
    const isActive = activeTab === tab
    return `${extra} rounded-lg font-medium transition-all ${isPreview ? 'text-xs' : 'text-sm'} ${
      isActive
        ? theme.buttonPrimary
        : `${theme.textMuted} hover:${theme.text} ${theme.isDark ? 'hover:bg-white/10' : 'hover:bg-black/10'}`
    }`
  }

  return (
    <div
      className={`flex rounded-xl p-1 ${isPreview ? 'mb-2' : 'mb-4'}`}
      style={containerStyle ?? { backgroundColor: c ? `${c.cardBg}80` : theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)' }}
    >
      <button
        onClick={() => onTabChange('links')}
        onMouseEnter={() => onHover('links')}
        onMouseLeave={() => onHover(null)}
        className={tabClass('links', `w-1/2 ${isPreview ? 'py-1' : 'py-2'} text-center`)}
        style={tabStyle('links')}
      >
        Links
      </button>
      <button
        onClick={() => onTabChange('about')}
        onMouseEnter={() => onHover('about')}
        onMouseLeave={() => onHover(null)}
        className={tabClass('about', `w-1/2 ${isPreview ? 'py-1' : 'py-2'} px-2 truncate min-w-0 text-center`)}
        style={tabStyle('about')}
      >
        {profile.about_title || 'About'}
      </button>
    </div>
  )
}

// ── Links List ─────────────────────────────────────────────────

interface LinksListProps {
  profile: Profile
  links: LinkType[]
  theme: ThemeConfig
  linkCardClass?: string
  linkCardStyle?: (link: LinkType, i: number) => React.CSSProperties
  immersive?: boolean
}

export function LinksList({ profile, links, theme, linkCardClass, linkCardStyle, immersive }: LinksListProps) {
  const supabase = createClient()
  const c = theme.customColors
  const [hoveredLink, setHoveredLink] = React.useState<string | null>(null)

  const defaultCardStyle = (link: LinkType, i: number): React.CSSProperties => {
    if (!c) return { animationDelay: `${i * 60}ms` }
    const isHovered = hoveredLink === link.id
    const bg = isHovered ? adjustColor(c.cardBg) : c.cardBg
    return {
      backgroundColor: immersive ? `${bg}99` : bg,
      borderColor: isHovered ? adjustColor(c.cardBorder) : c.cardBorder,
      animationDelay: `${i * 60}ms`,
    }
  }

  return (
    <div className="space-y-3 pb-4">
      {links.length === 0 && (
        <p className={`text-center text-sm py-8 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textFaint } : {}}>
          No links yet.
        </p>
      )}
      {links.map((link, i) => (
        <a
          key={link.id}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHoveredLink(link.id)}
          onMouseLeave={() => setHoveredLink(null)}
          onClick={() => {
            const linkId = link.id
            const userId = profile.id
            setTimeout(() => {
              supabase.rpc('increment_link_clicks', { link_id: linkId })
              supabase.from('link_click_events').insert({ link_id: linkId, user_id: userId })
            }, 0)
          }}
          className={`block w-full text-left px-5 py-4 rounded-2xl border link-card transition-all group ${
            c ? '' : (linkCardClass ?? theme.card)
          }`}
          style={linkCardStyle ? linkCardStyle(link, i) : defaultCardStyle(link, i)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {link.icon && (
                <img src={link.icon} alt="" className="w-4 h-4 rounded-sm flex-shrink-0" onError={e => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${c ? '' : theme.text}`} style={c ? { color: c.text } : {}}>{link.title}</p>
                {link.description && (
                  <p className={`text-xs mt-0.5 ${c ? '' : theme.textMuted}`} style={c ? { color: c.textMuted } : {}}>{link.description}</p>
                )}
              </div>
            </div>
            <ExternalLink size={14} className={`ml-3 flex-shrink-0 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textMuted } : {}} />
          </div>
        </a>
      ))}
    </div>
  )
}

// ── About Content ──────────────────────────────────────────────

interface AboutContentProps {
  profile: Profile
  theme: ThemeConfig
  contentBgHex?: string
}

export function AboutContent({ profile, theme, contentBgHex }: AboutContentProps) {
  const c = theme.customColors
  const isDark = contentBgHex ? isColorDark(contentBgHex) : theme.isDark
  const [hovered, setHovered] = React.useState(false)

  if (!profile.about_content) {
    return (
      <p className={`text-sm text-center py-8 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textFaint } : {}}>
        Nothing here yet.
      </p>
    )
  }

  return (
    <div
      className={`px-5 py-4 rounded-2xl border mb-4 ${c ? '' : theme.card}`}
      onMouseEnter={() => c && setHovered(true)}
      onMouseLeave={() => c && setHovered(false)}
      style={c ? {
        backgroundColor: hovered ? adjustColor(c.cardBg) : c.cardBg,
        borderColor: hovered ? adjustColor(c.cardBorder) : c.cardBorder,
      } : {}}
    >
      <div style={c ? {
        '--tw-prose-body': c.text,
        '--tw-prose-headings': c.textHeading,
        '--tw-prose-bold': c.text,
        '--tw-prose-links': c.accentHex,
        '--tw-prose-bullets': isDark ? '#9ca3af' : '#4b5563',
        '--tw-prose-counters': isDark ? '#9ca3af' : '#4b5563',
      } as React.CSSProperties : {}}>
        <div
          className={`prose prose-sm max-w-none ${isDark ? 'prose-invert' : ''}`}
          dangerouslySetInnerHTML={{ __html: profile.about_content }}
        />
      </div>
    </div>
  )
}

// ── Profile Footer ─────────────────────────────────────────────

interface FooterProps {
  theme: ThemeConfig
}

export function ProfileFooter({ theme }: FooterProps) {
  const c = theme.customColors
  return (
    <div className="pb-8 text-center mt-4">
      <a
        href="/"
        className={`text-xs transition-colors ${c ? '' : theme.footerText}`}
        style={c ? { color: c.textMuted } : {}}
      >
        Powered by <span className="font-display font-semibold">BakerLinks</span>
      </a>
    </div>
  )
}

// Need React for useState in LinksList and AboutContent
import React from 'react'

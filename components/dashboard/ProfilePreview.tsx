'use client'

import { useState } from 'react'
import { Profile } from '@/lib/types'
import { themes, buildCustomTheme } from '@/lib/themes'
import SocialIcon from '@/components/SocialIcon'
import { getPlatform } from '@/lib/social-platforms'
import { ExternalLink } from 'lucide-react'
import { getFontClasses, getInitials, adjustColor, ProfileHeader, TabBar } from '@/components/layouts/shared'

interface Props {
  profile: Profile
}

const placeholderLinks = [
  { id: '1', title: 'My Portfolio', description: 'Design work & case studies' },
  { id: '2', title: 'Latest Blog Post', description: 'Thoughts on design and tech' },
  { id: '3', title: 'Get in Touch', description: null },
]

export default function ProfilePreview({ profile }: Props) {
  const theme = profile.theme === 'custom' && profile.custom_theme
    ? buildCustomTheme(profile.custom_theme)
    : themes[profile.theme] ?? themes.electric
  const layout = profile.layout ?? 'card'
  const c = theme.customColors
  const fontClasses = getFontClasses(profile.font ?? 'default')
  const socialLinks = profile.social_links ?? []
  const socialPosition = profile.social_links_position ?? 'bottom'
  const [previewTab, setPreviewTab] = useState<'links' | 'about'>('links')
  const [hoveredTab, setHoveredTab] = useState<'links' | 'about' | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const [hoveredAbout, setHoveredAbout] = useState(false)

  const SocialIcons = () => socialLinks.length > 0 ? (
    <div className="flex justify-center gap-2 my-2">
      {socialLinks.map(link => {
        const platform = getPlatform(link.platform)
        if (!platform) return null
        return (
          <div
            key={link.platform}
            className="p-1.5 rounded-lg border"
            style={{
              borderColor: c ? `${c.cardBorder}80` : undefined,
              backgroundColor: c ? `${c.cardBg}40` : undefined,
            }}
          >
            <SocialIcon iconName={platform.icon} size={14} color={c ? c.accentHex : theme.accentHex} />
          </div>
        )
      })}
    </div>
  ) : null

  const LinkCards = () => (
    <div className="space-y-1.5">
      {placeholderLinks.map(link => {
        const isHovered = hoveredLink === link.id
        const bg = c ? (isHovered ? adjustColor(c.cardBg) : c.cardBg) : undefined
        const border = c ? (isHovered ? adjustColor(c.cardBorder) : c.cardBorder) : undefined
        return (
          <div
            key={link.id}
            className={`px-3 py-2 rounded-xl border flex items-center justify-between ${c ? '' : theme.card}`}
            onMouseEnter={() => setHoveredLink(link.id)}
            onMouseLeave={() => setHoveredLink(null)}
            style={c ? {
              backgroundColor: layout === 'immersive' ? `${bg}99` : bg,
              borderColor: border,
            } : {}}
          >
            <div className="flex-1 min-w-0">
              <p className={`${c ? '' : theme.text} text-xs font-medium truncate`} style={c ? { color: c.text } : {}}>
                {link.title}
              </p>
              {link.description && (
                <p className={`text-xs ${c ? '' : theme.textMuted}`} style={c ? { color: c.textMuted } : {}}>
                  {link.description}
                </p>
              )}
            </div>
            <ExternalLink size={10} className={`ml-2 flex-shrink-0 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textFaint } : {}} />
          </div>
        )
      })}
    </div>
  )

  const AboutPlaceholder = () => (
    <div
      className={`px-3 py-3 rounded-xl border mb-2 ${c ? '' : theme.card}`}
      onMouseEnter={() => c && setHoveredAbout(true)}
      onMouseLeave={() => c && setHoveredAbout(false)}
      style={c ? {
        backgroundColor: layout === 'immersive'
          ? `${hoveredAbout ? adjustColor(c.cardBg) : c.cardBg}99`
          : hoveredAbout ? adjustColor(c.cardBg) : c.cardBg,
        borderColor: hoveredAbout ? adjustColor(c.cardBorder) : c.cardBorder,
      } : {}}
    >
      {profile.about_content ? (
        <div className="space-y-1.5">
          <div className="h-1.5 rounded w-full" style={{ backgroundColor: c ? `${c.text}30` : theme.isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)' }} />
          <div className="h-1.5 rounded w-4/5" style={{ backgroundColor: c ? `${c.text}20` : theme.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)' }} />
          <div className="h-1.5 rounded w-full" style={{ backgroundColor: c ? `${c.text}15` : theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)' }} />
          <div className="h-1.5 rounded w-3/5" style={{ backgroundColor: c ? `${c.text}15` : theme.isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.06)' }} />
          <div className="h-1.5 rounded w-4/5" style={{ backgroundColor: c ? `${c.text}10` : theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' }} />
        </div>
      ) : (
        <p className={`text-xs text-center py-2 ${c ? '' : theme.textFaint}`} style={c ? { color: c.textFaint } : {}}>
          No content yet
        </p>
      )}
    </div>
  )

  const Content = () => (
    <>
      {socialPosition === 'top' && <SocialIcons />}
      {profile.about_enabled && (
        <TabBar
          profile={profile}
          theme={theme}
          activeTab={previewTab}
          onTabChange={setPreviewTab}
          hoveredTab={hoveredTab}
          onHover={setHoveredTab}
          size="preview"
        />
      )}
      {previewTab === 'links' ? <LinkCards /> : <AboutPlaceholder />}
      {socialPosition === 'bottom' && <SocialIcons />}
      <p className={`text-center text-xs mt-3 ${c ? '' : theme.footerText}`} style={c ? { color: c.textMuted } : {}}>
        Powered by <span className="font-display font-semibold">BakerLinks</span>
      </p>
    </>
  )

  return (
    <div>
      <p className="text-white/30 text-xs uppercase tracking-widest mb-4 text-center">Preview</p>

      {/* Phone frame */}
      <div
        className={`relative w-full max-w-[260px] mx-auto rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10 ${fontClasses.body}`}
        style={layout !== 'immersive' && c ? { backgroundColor: c.bg } : {}}
      >
        {layout === 'immersive' ? (
          <div className="relative min-h-[420px]">
            {profile.background_url ? (
              <div className="absolute inset-0">
                <img src={profile.background_url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            ) : (
              <div className={`absolute inset-0 ${c ? '' : theme.bg}`} style={c ? { backgroundColor: c.bg } : {}} />
            )}
            <div className="relative z-10 flex justify-center pt-3">
              <div className="w-16 h-1.5 rounded-full bg-white/20" />
            </div>
            <div
              className="relative z-10 m-3 mt-4 rounded-2xl p-4 backdrop-blur-md"
              style={c ? { backgroundColor: `${c.contentBg || c.cardBg}99` } : { backgroundColor: `${theme.bgHex}99` }}
            >
              <ProfileHeader profile={profile} theme={theme} fontClasses={fontClasses} size="preview" />
              <Content />
            </div>
          </div>

        ) : layout === 'minimal' ? (
          <div
            className={`${c ? '' : theme.bg} px-4 pt-6 pb-4`}
            style={c ? { backgroundColor: c.bg } : {}}
          >
            <div className="relative z-10 flex justify-center mb-3">
              <div className="w-16 h-1.5 rounded-full bg-white/20" />
            </div>
            <ProfileHeader profile={profile} theme={theme} fontClasses={fontClasses} size="preview" />
            <Content />
          </div>

        ) : (
          <>
            <div className="relative">
              {profile.background_url ? (
                <div className="relative w-full h-20 overflow-hidden">
                  <img src={profile.background_url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
                </div>
              ) : (
                <div className={`w-full h-20 ${c ? '' : theme.bg}`} style={c ? { backgroundColor: c.bg } : {}} />
              )}
              <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
                <div className="w-16 h-1.5 rounded-full bg-white/20" />
              </div>
            </div>
            <div className={`${c ? '' : theme.bg} px-4 pb-4`} style={c ? { backgroundColor: c.bg } : {}}>
              <div className="-mt-7 relative z-10">
                <ProfileHeader profile={profile} theme={theme} fontClasses={fontClasses} size="preview" />
              </div>
              <Content />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

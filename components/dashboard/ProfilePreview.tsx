'use client'

import { Profile } from '@/lib/types'
import { themes, buildCustomTheme } from '@/lib/themes'
import SocialIcon from '@/components/SocialIcon'
import { getPlatform } from '@/lib/social-platforms'
import { ExternalLink } from 'lucide-react'
import { getFontClasses, getInitials } from '@/components/layouts/shared'

interface Props {
  profile: Profile
}

export default function ProfilePreview({ profile }: Props) {
  const theme = profile.theme === 'custom' && profile.custom_theme
    ? buildCustomTheme(profile.custom_theme)
    : themes[profile.theme] ?? themes.electric
  const layout = profile.layout ?? 'card'
  const c = theme.customColors
  const fontClasses = getFontClasses(profile.font ?? 'default')
  const initials = getInitials(profile)
  const socialLinks = profile.social_links ?? []
  const socialPosition = profile.social_links_position ?? 'bottom'

  const Avatar = () => profile.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt={profile.display_name || profile.username}
      className="w-14 h-14 rounded-full object-cover mb-2"
      style={{ boxShadow: `0 0 0 2px ${c ? c.avatarRing : theme.accentHex}` }}
    />
  ) : (
    <div
      className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-lg mb-2"
      style={{ boxShadow: `0 0 0 2px ${c ? c.avatarRing : theme.accentHex}` }}
    >
      {initials}
    </div>
  )

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
      {[1, 2, 3].map(i => (
        <div
          key={i}
          className="px-3 py-2 rounded-xl border flex items-center justify-between"
          style={c ? {
            backgroundColor: layout === 'immersive' ? `${c.cardBg}99` : c.cardBg,
            borderColor: c.cardBorder,
          } : {
            backgroundColor: layout === 'immersive' ? (theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)') : undefined,
          }}
        >
          <p className={`${c ? '' : theme.text} text-xs font-medium`} style={c ? { color: c.text } : {}}>
            Your link {i}
          </p>
          <ExternalLink size={10} style={c ? { color: c.textFaint } : {}} className={c ? '' : theme.textFaint} />
        </div>
      ))}
    </div>
  )

  const ProfileInfo = () => (
    <div className="flex flex-col items-center mb-3">
      <Avatar />
      <p
        className={`${fontClasses.heading} text-sm font-bold text-center ${c ? '' : theme.textHeading}`}
        style={c ? { color: c.textHeading } : {}}
      >
        {profile.display_name || profile.username || 'Your name'}
      </p>
      <p className={`text-xs ${c ? '' : theme.textMuted}`} style={c ? { color: c.textMuted } : {}}>
        @{profile.username}
      </p>
      {profile.bio && (
        <p
          className={`text-xs text-center mt-1 leading-relaxed line-clamp-2 ${c ? '' : theme.textMuted}`}
          style={c ? { color: c.textMuted } : {}}
        >
          {profile.bio}
        </p>
      )}
    </div>
  )

  const Footer = () => (
    <p className={`text-center text-xs mt-3 ${c ? '' : theme.footerText}`} style={c ? { color: c.textMuted } : {}}>
      Powered by <span className="font-display font-semibold">BakerLinks</span>
    </p>
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
          <div className="relative">
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
              style={c ? { backgroundColor: `${c.contentBg || c.cardBg}99` } : { backgroundColor: theme.isDark ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)' }}
            >
              <ProfileInfo />
              {socialPosition === 'top' && <SocialIcons />}
              <LinkCards />
              {socialPosition === 'bottom' && <SocialIcons />}
              <Footer />
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
            <ProfileInfo />
            {socialPosition === 'top' && <SocialIcons />}
            <LinkCards />
            {socialPosition === 'bottom' && <SocialIcons />}
            <Footer />
          </div>

        ) : (
          <>
            {/* Card layout */}
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
              <div className="flex flex-col items-center -mt-7 mb-3 relative z-10">
                <ProfileInfo />
              </div>
              {socialPosition === 'top' && <SocialIcons />}
              <LinkCards />
              {socialPosition === 'bottom' && <SocialIcons />}
              <Footer />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

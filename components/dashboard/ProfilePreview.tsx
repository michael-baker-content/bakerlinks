'use client'

import { Profile } from '@/lib/types'
import { themes } from '@/lib/themes'
import SocialIcon from '@/components/SocialIcon'
import { getPlatform } from '@/lib/social-platforms'
import { ExternalLink } from 'lucide-react'

interface Props {
  profile: Profile
}

export default function ProfilePreview({ profile }: Props) {
  const theme = themes[profile.theme] ?? themes.electric

  const initials = (profile.display_name || profile.username)
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const socialLinks = profile.social_links ?? []
  const socialPosition = profile.social_links_position ?? 'bottom'

  return (
    <div>
      <p className="text-white/30 text-xs uppercase tracking-widest mb-4 text-center">Preview</p>

      {/* Phone frame */}
      <div className="relative w-full max-w-[260px] mx-auto rounded-[2.5rem] border-2 border-white/10 overflow-hidden shadow-2xl shadow-purple-500/10">

        {/* Background fills from top, notch superimposed */}
        <div className="relative">
          {profile.background_url ? (
            <div className="relative w-full h-20 overflow-hidden">
              <img
                src={profile.background_url}
                alt="Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
            </div>
          ) : (
            <div className={`w-full h-20 ${theme.bg}`} />
          )}
          {/* Notch superimposed over background */}
          <div className="absolute top-3 left-0 right-0 flex justify-center z-10">
            <div className="w-16 h-1.5 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Content */}
        <div className={`${theme.bg} px-4 pb-6`}>
          {/* Avatar */}
          <div className="flex flex-col items-center -mt-7 mb-3 relative z-10">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.display_name || profile.username}
                className={`w-14 h-14 rounded-full object-cover ring-2 ${theme.avatarRing} mb-2`}
              />
            ) : (
              <div className={`w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-lg mb-2 ring-2 ${theme.avatarRing}`}>
                {initials}
              </div>
            )}
            <p className={`font-display text-sm font-bold ${theme.textHeading} text-center`}>
              {profile.display_name || profile.username || 'Your name'}
            </p>
            <p className={`${theme.textMuted} text-xs`}>@{profile.username}</p>
            {profile.bio && (
              <p className={`${theme.textMuted} text-xs text-center mt-1 leading-relaxed line-clamp-2`}>
                {profile.bio}
              </p>
            )}
          </div>

          {/* Social links top */}
          {socialPosition === 'top' && socialLinks.length > 0 && (
            <div className="flex justify-center gap-2 mb-3">
              {socialLinks.map(link => {
                const platform = getPlatform(link.platform)
                if (!platform) return null
                return (
                  <div
                    key={link.platform}
                    className={`p-1.5 rounded-lg border ${theme.border} ${theme.isDark ? 'bg-white/5' : 'bg-white/60'}`}
                  >
                    <SocialIcon iconName={platform.icon} size={14} color={theme.accentHex} />
                  </div>
                )
              })}
            </div>
          )}

          {/* Links placeholder */}
          <div className="space-y-1.5">
            {[1, 2, 3].map(i => (
              <div
                key={i}
                className={`px-3 py-2 rounded-xl border ${theme.card} flex items-center justify-between`}
              >
                <p className={`${theme.text} text-xs font-medium`}>Your link {i}</p>
                <ExternalLink size={10} className={theme.textFaint} />
              </div>
            ))}
          </div>

          {/* Social links bottom */}
          {socialPosition === 'bottom' && socialLinks.length > 0 && (
            <div className="flex justify-center gap-2 mt-3">
              {socialLinks.map(link => {
                const platform = getPlatform(link.platform)
                if (!platform) return null
                return (
                  <div
                    key={link.platform}
                    className={`p-1.5 rounded-lg border ${theme.border} ${theme.isDark ? 'bg-white/5' : 'bg-white/60'}`}
                  >
                    <SocialIcon iconName={platform.icon} size={14} color={theme.accentHex} />
                  </div>
                )
              })}
            </div>
          )}

          <p className={`text-center ${theme.footerText} text-xs mt-4`}>
            Powered by <span className="font-display font-semibold">BakerLinks</span>
          </p>
        </div>
      </div>
    </div>
  )
}

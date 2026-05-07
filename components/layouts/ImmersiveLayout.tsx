'use client'

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

export default function ImmersiveLayout({ profile, links, theme, activeTab, onTabChange }: Props) {
  const supabase = createClient()

  const initials = (profile.display_name || profile.username)
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  const hasBg = !!profile.background_url

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Full screen background */}
      {hasBg ? (
        <>
          <div className="fixed inset-0 z-0">
            <img
              src={profile.background_url!}
              alt="Profile background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
          {profile.background_attribution && (
            <div className="fixed top-3 right-3 z-10 text-white/40 text-xs">
              Photo by{' '}
              <a
                href={profile.background_attribution.photographer_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70"
              >
                {profile.background_attribution.photographer_name}
              </a>
              {' '}on{' '}
              <a
                href={profile.background_attribution.unsplash_url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-white/70"
              >
                Unsplash
              </a>
            </div>
          )}
        </>
      ) : (
        <div className={`fixed inset-0 z-0 ${theme.bg}`} />
      )}

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 py-16">
        <div className="w-full max-w-sm">
          <div className={`${theme.isDark ? 'bg-black/30' : 'bg-white/40'} backdrop-blur-md rounded-3xl p-6 mb-4`}>

            {/* Avatar */}
            <div className="flex flex-col items-center mb-6">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.display_name || profile.username}
                  className={`w-24 h-24 rounded-full object-cover ring-4 ${theme.avatarRing} mb-4 shadow-2xl`}
                />
              ) : (
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-2xl mb-4 ring-4 ${theme.avatarRing} shadow-2xl`}>
                  {initials}
                </div>
              )}
              <h1 className={`font-display text-2xl font-bold ${theme.textHeading} mb-1`}>
                {profile.display_name || profile.username}
              </h1>
              <p className={`${theme.textMuted} text-sm`}>@{profile.username}</p>
              {profile.bio && (
                <p className={`${theme.textMuted} text-sm text-center mt-3 max-w-xs leading-relaxed`}>
                  {profile.bio}
                </p>
              )}
            </div>

            {/* Social links - top */}
            {profile.social_links_position === 'top' && (
              <SocialLinksDisplay links={profile.social_links} theme={profile.theme} />
            )}

            {/* Tabs if about is enabled */}
            {profile.about_enabled && (
              <div className={`flex rounded-xl p-1 mb-4 ${theme.isDark ? 'bg-white/5' : 'bg-black/5'}`}>
                {(['links', 'about'] as const).map(t => (
                    <button
                    key={t}
                    onClick={() => onTabChange(t)}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === t
                        ? theme.buttonPrimary
                        : `${theme.textMuted} hover:${theme.text}`
                    }`}
                    >
                    {t === 'links' ? 'Links' : profile.about_title || 'About'}
                    </button>
                ))}
                </div>
            )}

            {/* Links tab */}
            {activeTab === 'links' && (
              <div className="space-y-3 pb-4">
                {links.length === 0 && (
                  <p className={`text-center ${theme.textFaint} text-sm py-8`}>No links yet.</p>
                )}
                {links.map((link, i) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      supabase.rpc('increment_link_clicks', { link_id: link.id })
                      supabase.from('link_click_events').insert({ link_id: link.id, user_id: profile.id })
                    }}
                    className={`block w-full text-left px-5 py-4 rounded-2xl border transition-all group ${
                      theme.isDark
                        ? 'border-white/20 bg-white/10 hover:bg-white/20'
                        : 'border-black/10 bg-black/5 hover:bg-black/10'
                    }`}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div className="flex items-center justify-between">
  <div className="flex items-center gap-3 flex-1 min-w-0">
    {link.icon && (
      <img
        src={link.icon}
        alt=""
        className="w-4 h-4 rounded-sm flex-shrink-0"
        onError={e => (e.currentTarget.style.display = 'none')}
      />
    )}
    <div className="flex-1 min-w-0">
      <p className={`${theme.text} font-semibold text-sm truncate`}>{link.title}</p>
      {link.description && (
        <p className={`${theme.textMuted} text-xs mt-0.5 line-clamp-2`}>{link.description}</p>
      )}
    </div>
  </div>
  <ExternalLink size={14} className={`${theme.textFaint} group-hover:${theme.textMuted} transition-colors ml-3 flex-shrink-0`} />
</div>
                  </a>
                ))}
              </div>
            )}

            {/* About tab */}
            {activeTab === 'about' && profile.about_enabled && (
              <div className="pb-4">
                {profile.about_content ? (
                  <div
                    className={`prose prose-sm max-w-none ${theme.isDark ? 'prose-invert' : ''}`}
                    dangerouslySetInnerHTML={{ __html: profile.about_content }}
                  />
                ) : (
                  <p className={`${theme.textFaint} text-sm text-center py-8`}>Nothing here yet.</p>
                )}
              </div>
            )}

            {/* Social links - bottom */}
            {profile.social_links_position === 'bottom' && (
              <SocialLinksDisplay links={profile.social_links} theme={profile.theme} />
            )}

            {/* Footer */}
            <div className="text-center mt-4">
              <a href="/" className={`${theme.footerText} text-xs hover:${theme.textMuted} transition-colors`}>
                Powered by <span className="font-display font-semibold">BakerLinks</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

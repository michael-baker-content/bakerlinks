'use client'

import { Profile, Link as LinkType } from '@/lib/types'
import { themes } from '@/lib/themes'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink } from 'lucide-react'
import SocialLinksDisplay from '@/components/SocialLinksDisplay'

export default function PublicProfile({
  profile,
  links,
}: {
  profile: Profile
  links: LinkType[]
}) {
  const theme = themes[profile.theme] ?? themes.electric
  const supabase = createClient()

  async function handleLinkClick(link: LinkType) {
    await supabase.rpc('increment_link_clicks', { link_id: link.id })
    window.open(link.url, '_blank', 'noopener,noreferrer')
  }

  const initials = (profile.display_name || profile.username)
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <main className={`min-h-screen ${theme.bg} noise`}>
      {/* Background image or ambient glow */}
      {profile.background_url ? (
        <div className="relative w-full h-48 sm:h-64 overflow-hidden">
          <img
            src={profile.background_url}
            alt="Profile background"
            className="w-full h-full object-cover"
          />
          {profile.background_attribution && (
  <div className="absolute top-2 right-3 text-white/40 text-xs">
    Photo by{' '}
    
    <a  href={profile.background_attribution.photographer_url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-white/70"
    >
      {profile.background_attribution.photographer_name}
    </a>
    {' '}on{' '}
    
    <a  href={profile.background_attribution.unsplash_url}
      target="_blank"
      rel="noopener noreferrer"
      className="underline hover:text-white/70"
    >
      Unsplash
    </a>
  </div>
)}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
        </div>
      ) : (
        <div className="h-24" />
      )}

      <div className="relative max-w-sm mx-auto px-4">
        {/* Avatar */}
        <div className={`flex flex-col items-center ${profile.background_url ? '-mt-12' : 'mt-8'} mb-6`}>
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.display_name || profile.username}
              className="w-24 h-24 rounded-full object-cover ring-4 ring-black/40 mb-4"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-2xl mb-4 ring-4 ring-black/40">
              {initials}
            </div>
          )}

          <h1 className="font-display text-2xl font-bold text-white mb-1">
            {profile.display_name || profile.username}
          </h1>
          <p className="text-white/40 text-sm">@{profile.username}</p>
          {profile.bio && (
            <p className="text-white/60 text-sm text-center mt-3 max-w-xs leading-relaxed">
              {profile.bio}
            </p>
          )}
        </div>
{/* Social links - top position */}
{profile.social_links_position === 'top' && (
  <SocialLinksDisplay links={profile.social_links} theme={profile.theme} />
)}
        {/* Links */}
        <div className="space-y-3 pb-16">
          {links.length === 0 && (
            <p className="text-center text-white/20 text-sm py-8">No links yet.</p>
          )}
          {links.map((link, i) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link)}
              className={`w-full text-left px-5 py-4 rounded-2xl border link-card glow-hover ${theme.card} transition-all group`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{link.title}</p>
                  {link.description && (
                    <p className="text-white/40 text-xs mt-0.5 truncate">{link.description}</p>
                  )}
                </div>
                <ExternalLink
                  size={14}
                  className="text-white/20 group-hover:text-white/60 transition-colors ml-3 flex-shrink-0"
                />
              </div>
            </button>
          ))}
        </div>

        {/* Social links - bottom position */}
{profile.social_links_position === 'bottom' && (
  <SocialLinksDisplay links={profile.social_links} theme={profile.theme} />
)}

        {/* Footer */}
        <div className="pb-8 text-center">
          <a
            href="/"
            className="text-white/20 text-xs hover:text-white/40 transition-colors"
          >
            Powered by <span className="font-display font-semibold">BakerLinks</span>
          </a>
        </div>
      </div>
    </main>
  )
}

'use client'

import { Profile, Link as LinkType } from '@/lib/types'
import { themes } from '@/lib/themes'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink } from 'lucide-react'

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
    // Fire-and-forget click tracking
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
    <main className={`min-h-screen ${theme.bg} noise flex flex-col items-center justify-start py-16 px-4`}>
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)' }}
      />

      <div className="relative w-full max-w-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center text-white font-display font-bold text-2xl mb-4 ring-4 ring-white/5">
            {initials}
          </div>
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

        {/* Links */}
        <div className="space-y-3">
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

        {/* Footer */}
        <div className="mt-12 text-center">
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

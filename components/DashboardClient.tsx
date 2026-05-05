'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Link as LinkType } from '@/lib/types'
import { X } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import LinksTab from '@/components/dashboard/LinksTab'
import ProfileTab from '@/components/dashboard/ProfileTab'
import AnalyticsTab from '@/components/dashboard/AnalyticsTab'

interface Props {
  initialProfile: Profile
  initialLinks: LinkType[]
  userId: string
  provider: string
  showWelcome?: boolean
}

export default function DashboardClient({
  initialProfile,
  initialLinks,
  userId,
  provider,
  showWelcome,
}: Props) {
  const [tab, setTab] = useState<'links' | 'profile' | 'analytics'>('links')
  const [copied, setCopied] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(showWelcome ?? false)
  const supabase = createClient()

  function copyLink() {
    const url = `${window.location.origin}/${initialProfile.username}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div id="main-content"  className="min-h-screen bg-[#0a0a0f] noise">
      {welcomeVisible && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-purple-600 text-white shadow-2xl shadow-purple-500/30">
          <span className="text-lg">🎉</span>
          <div>
            <p className="font-semibold text-sm">Welcome to BakerLinks!</p>
            <p className="text-white/70 text-xs">Your account is confirmed. Start building your page.</p>
          </div>
          <button onClick={() => setWelcomeVisible(false)} className="ml-2 text-white/50 hover:text-white">
            <X size={16} />
          </button>
        </div>
      )}

      <DashboardHeader
        username={initialProfile.username}
        onCopy={copyLink}
        onSignOut={signOut}
        copied={copied}
      />

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 rounded-xl bg-white/5 p-1 w-fit">
          {(['links', 'profile', 'analytics'] as const).map(t => (
  <button
    key={t}
    onClick={() => setTab(t)}
    className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
      tab === t ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white'
    }`}
  >
    {t}
  </button>
))}
        </div>

        {tab === 'links' && (
          <LinksTab initialLinks={initialLinks} userId={userId} />
        )}

        {tab === 'profile' && (
          <ProfileTab
            initialProfile={initialProfile}
            userId={userId}
            provider={provider}
          />
        )}
        {tab === 'analytics' && (
  <AnalyticsTab userId={userId} />
)}
      </div>
    </div>
  )
}
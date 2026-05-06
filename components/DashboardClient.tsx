'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Link as LinkType } from '@/lib/types'
import { X, ExternalLink } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import LinksTab from '@/components/dashboard/LinksTab'
import ProfileTab from '@/components/dashboard/ProfileTab'
import AnalyticsTab from '@/components/dashboard/AnalyticsTab'
import ProfilePreview from '@/components/dashboard/ProfilePreview'

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
  const [profile, setProfile] = useState(initialProfile)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
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
    <div id="main-content" className="min-h-screen bg-[#0a0a0f] noise flex flex-col">
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

      <div className={`flex-1 mx-auto w-full px-4 py-8 ${tab === 'profile' ? 'max-w-5xl' : 'max-w-2xl'}`}>
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
  <>
    {/* Mobile/narrow preview modal */}
    {showPreviewModal && (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-semibold">Profile preview</span>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="text-white/40 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
          <ProfilePreview profile={profile} />
        </div>
      </div>
    )}

    <div className="flex gap-8 items-start">
      <div className="flex-1 min-w-0">
        <div className="lg:hidden flex justify-end mb-4">
  <button
    onClick={() => setShowPreviewModal(true)}
    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all"
  >
    <ExternalLink size={14} />
    Preview
  </button>
</div>
        <ProfileTab
          initialProfile={initialProfile}
          profile={profile}
          onProfileChange={setProfile}
          userId={userId}
          provider={provider}
        />
      </div>
      <div className="hidden lg:block w-72 flex-shrink-0 relative">
  <div className="fixed" style={{ width: '288px' }}>
    <ProfilePreview profile={profile} />
  </div>
</div>
    </div>
  </>
)}
        {tab === 'analytics' && (
  <AnalyticsTab userId={userId} />
)}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Profile, Link as LinkType } from '@/lib/types'
import { X, ExternalLink } from 'lucide-react'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
import styles from '@/app/dashboard/dashboard.module.css'
import ContentTab from '@/components/dashboard/ContentTab'
import ProfileTab from '@/components/dashboard/ProfileTab'
import StyleTab from '@/components/dashboard/StyleTab'
import AnalyticsTab from '@/components/dashboard/AnalyticsTab'
import ProfilePreview from '@/components/dashboard/ProfilePreview'

interface Props {
  initialProfile: Profile
  initialLinks: LinkType[]
  userId: string
  provider: string
  showWelcome?: boolean
  isAdmin: boolean
}

const tabs = [
  { id: 'content', label: 'Content' },
  { id: 'profile', label: 'Profile' },
  { id: 'style', label: 'Style' },
  { id: 'analytics', label: 'Analytics' },
] as const

type Tab = (typeof tabs)[number]['id']

export default function DashboardClient({
  initialProfile,
  initialLinks,
  userId,
  provider,
  showWelcome,
  isAdmin,
}: Props) {
  const selectedTab = useSearchParams().get('tab')
  const tab = tabs.find(option => option.id === selectedTab)?.id ?? 'content'
  const [copied, setCopied] = useState(false)
  const [welcomeVisible, setWelcomeVisible] = useState(showWelcome ?? false)
  const [profile, setProfile] = useState(initialProfile)
  const [directoryOptIn, setDirectoryOptIn] = useState(initialProfile.directory_opt_in)
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

  function selectTab(nextTab: Tab) {
    if (nextTab === tab) return

    const url = new URL(window.location.href)
    if (nextTab === 'content') url.searchParams.delete('tab')
    else url.searchParams.set('tab', nextTab)
    window.history.pushState(null, '', url)
  }

  const showPreview = tab === 'profile' || tab === 'style'

  return (
    <div className={styles.admin}>
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
        username={profile.username}
        onCopy={copyLink}
        onSignOut={signOut}
        copied={copied}
      />

      <main id="main-content" tabIndex={-1} className={`flex-1 mx-auto w-full px-4 py-8 ${showPreview ? 'max-w-5xl' : 'max-w-2xl'}`}>
        {/* Tabs */}
        <div className="overflow-x-auto mb-8">
          <div className={styles.dashboardTabs}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => selectTab(t.id)}
                aria-pressed={tab === t.id}
              >
                {t.label}
              </button>
            ))}
            {isAdmin && <Link href="/dashboard/admin">Validation</Link>}
          </div>
        </div>

        {/* Content */}
        {tab === 'content' && (
          <ContentTab
            initialLinks={initialLinks}
            userId={userId}
            profile={profile}
            onProfileChange={setProfile}
          />
        )}

        {(tab === 'profile' || tab === 'style') && (
          <>
            {/* Mobile preview modal */}
            {showPreviewModal && (
              <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="w-full max-w-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white font-semibold">Profile preview</span>
                    <button onClick={() => setShowPreviewModal(false)} className="text-white/40 hover:text-white">
                      <X size={20} />
                    </button>
                  </div>
                  <ProfilePreview profile={profile} />
                </div>
              </div>
            )}

            <div className="flex gap-8 items-start">
              <div className="flex-1 min-w-0">
                {/* Preview button for narrow screens */}
                <div className="lg:hidden flex justify-end mb-4">
                  <button
                    onClick={() => setShowPreviewModal(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all"
                  >
                    <ExternalLink size={14} />
                    Preview
                  </button>
                </div>

                {tab === 'profile' && (
                  <ProfileTab
                    initialProfile={initialProfile}
                    profile={profile}
                    onProfileChange={setProfile}
                    userId={userId}
                    provider={provider}
                    directoryOptIn={directoryOptIn}
                    onDirectoryOptInChange={setDirectoryOptIn}
                  />
                )}

                {tab === 'style' && (
                  <StyleTab
                    profile={profile}
                    onProfileChange={setProfile}
                    userId={userId}
                  />
                )}
              </div>

              {/* Desktop preview */}
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
      </main>
      <DashboardFooter label="BakerLinks dashboard" />
    </div>
  )
}

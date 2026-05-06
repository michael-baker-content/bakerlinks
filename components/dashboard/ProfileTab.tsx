'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, SocialLink } from '@/lib/types'
import { themes } from '@/lib/themes'
import ImageUpload from '@/components/ImageUpload'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import EmailSection from '@/components/dashboard/EmailSection'
import PasswordSection from '@/components/dashboard/PasswordSection'
import DeleteAccountSection from '@/components/dashboard/DeleteAccountSection'

interface Attribution {
  photographer_name: string
  photographer_url: string
  unsplash_url: string
  download_url: string
}

interface Props {
  initialProfile: Profile
  profile: Profile
  onProfileChange: (profile: Profile) => void
  userId: string
  provider: string
}

export default function ProfileTab({ initialProfile, profile, onProfileChange, userId, provider }: Props) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function saveProfile() {
    setSaving(true)
    const { data: updated } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        theme: profile.theme,
        avatar_url: profile.avatar_url,
        background_url: profile.background_url,
        background_attribution: profile.background_attribution,
        social_links: profile.social_links,
        social_links_position: profile.social_links_position,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()
    if (updated) onProfileChange(updated)
    setSaving(false)
  }

  function handleAvatarUpload(url: string) {
  onProfileChange({ ...profile, avatar_url: url || null })
}

  function handleBackgroundUpload(url: string, attribution?: Attribution | null) {
    onProfileChange({
    ...profile,
    background_url: url || null,
    background_attribution: attribution ?? null,
  })
}

  function handleSocialLinksChange(links: SocialLink[], position: 'top' | 'bottom') {
  onProfileChange({ ...profile, social_links: links, social_links_position: position })
}

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-bold text-white">Profile settings</h2>

      <div className="space-y-4">
        {/* Username */}
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Username</label>
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            <span className="px-4 py-3 text-white/30 text-sm border-r border-white/10">bakerlinks.com/</span>
            <input
              value={profile.username}
              onChange={e => onProfileChange({ ...profile, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              className="flex-1 px-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder-white/20"
            />
          </div>
          {profile.username !== initialProfile.username && (
            <p className="text-yellow-400 text-xs mt-2 flex items-center gap-1.5">
              <span>⚠️</span>
              Changing your username will break your existing link. Anyone using your old URL will get a 404.
            </p>
          )}
        </div>

        {/* Display name */}
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Display name</label>
          <input
            value={profile.display_name ?? ''}
            onChange={e => onProfileChange(({ ...profile, display_name: e.target.value }))}
            placeholder="Your Name"
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Bio</label>
          <textarea
            value={profile.bio ?? ''}
            onChange={e => onProfileChange(({ ...profile, bio: e.target.value }))}
            placeholder="A short bio…"
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm resize-none"
          />
        </div>

        {/* Images */}
        <div className="grid grid-cols-1 gap-4">
          <ImageUpload
            bucket="avatars"
            userId={userId}
            currentUrl={profile.avatar_url}
            onUpload={handleAvatarUpload}
            label="Profile picture"
            aspectHint="Square image recommended. Max 2MB."
          />
          <ImageUpload
            bucket="backgrounds"
            userId={userId}
            currentUrl={profile.background_url}
            onUpload={handleBackgroundUpload}
            label="Background image"
            aspectHint="Wide image recommended (1500×500px). Max 5MB."
          />
        </div>

        {/* Social links */}
        <SocialLinksEditor
          value={profile.social_links ?? []}
          position={profile.social_links_position ?? 'bottom'}
          onChange={handleSocialLinksChange}
        />

        {/* Theme */}
        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Theme</label>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(themes).map(([key, t]) => (
              <button
                key={key}
                onClick={() => onProfileChange(({ ...profile, theme: key }))}
                className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                  profile.theme === key
                    ? 'border-purple-500 bg-purple-500/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Save profile */}
      <button
        onClick={saveProfile}
        disabled={saving}
        className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
      >
        {saving ? 'Saving…' : 'Save profile'}
      </button>

      <EmailSection provider={provider} />
      <PasswordSection provider={provider} />
      <DeleteAccountSection username={profile.username} />
    </div>
  )
}
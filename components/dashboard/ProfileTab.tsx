'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, SocialLink } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import EmailSection from '@/components/dashboard/EmailSection'
import PasswordSection from '@/components/dashboard/PasswordSection'
import DeleteAccountSection from '@/components/dashboard/DeleteAccountSection'
import DirectoryPreference from '@/components/dashboard/DirectoryPreference'
import FittedTextField from './FittedTextField'
import { useProfileTextFit } from './useProfileTextFit'

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
  directoryOptIn?: boolean
  onDirectoryOptInChange: (optedIn: boolean) => void
}

export default function ProfileTab({ initialProfile, profile, onProfileChange, userId, provider, directoryOptIn, onDirectoryOptInChange }: Props) {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const fit = useProfileTextFit(profile)
  const invalid = fit.ready && (!fit.fits(profile.display_name || profile.username, 'displayName') || !fit.fits(profile.bio ?? '', 'bio'))
  const supabase = createClient()

  async function saveProfile() {
    if (!fit.ready || invalid) return
    setSaving(true)
    setError('')
    const { data: updated, error: saveError } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        avatar_url: profile.avatar_url,
        background_url: profile.background_url,
        background_attribution: profile.background_attribution,
        animated_background: profile.animated_background ?? null,
        social_links: profile.social_links,
        social_links_position: profile.social_links_position,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()
    if (updated) onProfileChange({ ...updated, font: profile.font, layout: profile.layout, theme: profile.theme, custom_theme: profile.custom_theme })
    if (saveError) setError('Could not save your profile. Please try again.')
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
      animated_background: null,
    })
  }

  function handleSocialLinksChange(links: SocialLink[], position: 'top' | 'bottom') {
    onProfileChange({ ...profile, social_links: links, social_links_position: position })
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-lg font-bold text-white">Profile</h2>

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
            <p className="text-yellow-400/80 text-xs mt-2 flex items-center gap-1.5">
              <span>⚠️</span>
              Changing your username will break your existing link. Anyone using your old URL will get a 404.
            </p>
          )}
        </div>

        {/* Display name */}
          <FittedTextField label="Display name" field="displayName" profile={profile}
            value={profile.display_name ?? ''}
            onChange={value => onProfileChange({ ...profile, display_name: value })}
            placeholder="Your Name"
          />

        {/* Bio */}
          <FittedTextField label="Bio" field="bio" profile={profile} multiline
            value={profile.bio ?? ''}
            onChange={value => onProfileChange({ ...profile, bio: value })}
            placeholder="A short bio…"
          />

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
          <p className="text-white/40 text-xs">Choose animated backgrounds in the Style tab. Saving a new background photo switches animation off. Video uploads are not supported.</p>
        </div>

        {/* Social links */}
        <SocialLinksEditor
          value={profile.social_links ?? []}
          position={profile.social_links_position ?? 'bottom'}
          onChange={handleSocialLinksChange}
        />
      </div>

      {/* Save profile */}
      <button
        onClick={saveProfile}
        disabled={saving || !fit.ready || invalid}
        className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
      >
        {saving ? 'Saving…' : 'Save profile'}
      </button>
      {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}

      {typeof directoryOptIn === 'boolean' && (
        <DirectoryPreference userId={userId} optedIn={directoryOptIn} onChange={onDirectoryOptInChange} />
      )}
      <EmailSection provider={provider} />
      <PasswordSection provider={provider} />
      <DeleteAccountSection username={profile.username} />
    </div>
  )
}

'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Link as LinkType } from '@/lib/types'
import { themes, buildCustomTheme } from '@/lib/themes'
import { layouts } from '@/lib/layouts'
import { fonts } from '@/lib/fonts'
import CustomThemeEditor from '@/components/dashboard/CustomThemeEditor'
import type { CustomTheme } from '@/lib/types'
import AnimatedBackgroundPicker from './AnimatedBackgroundPicker'
import { useProfileTextFit } from './useProfileTextFit'
import { profileTextIssues } from '@/lib/profile-text-fit'

interface Props {
  profile: Profile
  onProfileChange: (profile: Profile) => void
  userId: string
  links: LinkType[]
  onStyleSaved: () => void
}

export default function StyleTab({ profile, onProfileChange, userId, links, onStyleSaved }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const supabase = createClient()
  const fit = useProfileTextFit(profile)
  const issues = fit.ready ? profileTextIssues(profile, links) : []

  async function saveStyle() {
    if (!fit.ready || issues.length) return
    setSaving(true)
    setSaved(false)
    setError('')
    const updated = profile

    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        theme: updated.theme,
        layout: updated.layout,
        font: updated.font,
        custom_theme: updated.custom_theme,
        animated_background: updated.animated_background ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select('id')
      .single()

    setSaving(false)
    if (saveError) {
      const missingBackgroundSetup = ['42703', 'PGRST204'].includes(saveError.code) && saveError.message.includes('animated_background')
      setError(missingBackgroundSetup
        ? 'Animated backgrounds are not available on this site yet. Please contact support. Your style was not saved.'
        : 'Could not save your style. Your changes are still in the preview. Please try again.')
      return
    }
    onProfileChange(updated)
    onStyleSaved()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleCustomThemeChange(customTheme: CustomTheme) {
    onProfileChange({ ...profile, custom_theme: customTheme })
  }

  function handleThemeChange(theme: string) {
    onProfileChange({ ...profile, theme })
  }

  function handleLayoutChange(layout: string) {
    onProfileChange({ ...profile, layout })
  }

  function handleFontChange(font: string) {
    onProfileChange({ ...profile, font })
  }

  const currentTheme = profile.theme === 'custom' && profile.custom_theme
    ? buildCustomTheme(profile.custom_theme)
    : themes[profile.theme] ?? themes.electric

  return (
    <div className="space-y-8 min-w-0 w-full">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-white">Style</h2>
        {saving && <span className="text-white/30 text-xs">Saving…</span>}
        {saved && !saving && <span className="text-green-400 text-xs">Saved</span>}
      </div>
      <p className="text-white/50 text-sm">Changes appear in your preview. Choose Save style to publish them.</p>
      {issues.length > 0 && (
        <div role="status" className="rounded-xl border border-amber-300/30 bg-amber-300/5 p-4 text-amber-200 text-sm">
          <p>Some text needs shortening for this font and layout. Your text has been preserved. Edit and save these fields, then return here to save your style:</p>
          <ul className="mt-2 list-disc pl-5 space-y-1">{issues.map((issue, i) => <li key={i} className="break-words">{issue}</li>)}</ul>
        </div>
      )}
      {/* Prevent overlapping saves from restoring an older selection. */}
      <fieldset disabled={saving} className="space-y-8 min-w-0 disabled:opacity-70">

      {/* Layout picker */}
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wider mb-4 block">Layout</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {layouts.map(layout => (
            <button
              key={layout.id}
              onClick={() => handleLayoutChange(layout.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                profile.layout === layout.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              {/* Layout preview illustration */}
              <div className="w-full h-20 rounded-xl mb-3 overflow-hidden border border-white/10">
                {layout.id === 'card' && (
                  <div className="w-full h-full bg-[#0a0a0f] flex flex-col">
                    <div className="h-8 bg-purple-900/40" />
                    <div className="flex-1 flex flex-col items-center justify-center gap-1 px-2">
                      <div className="w-6 h-6 rounded-full bg-purple-500/60" />
                      <div className="w-16 h-1.5 rounded bg-white/20" />
                      <div className="w-full h-3 rounded-lg bg-white/10 mt-1" />
                      <div className="w-full h-3 rounded-lg bg-white/10" />
                    </div>
                  </div>
                )}
                {layout.id === 'immersive' && (
                  <div className="w-full h-full relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-2">
                      <div className="w-6 h-6 rounded-full bg-white/40" />
                      <div className="w-16 h-1.5 rounded bg-white/40" />
                      <div className="w-full h-3 rounded-lg bg-white/20 mt-1" />
                      <div className="w-full h-3 rounded-lg bg-white/20" />
                    </div>
                  </div>
                )}
                {layout.id === 'minimal' && (
                  <div className="w-full h-full bg-[#0a0a0f] flex flex-col items-center justify-center gap-1 px-2">
                    <div className="w-6 h-6 rounded-full bg-purple-500/60" />
                    <div className="w-16 h-1.5 rounded bg-white/20" />
                    <div className="w-full h-3 rounded-lg bg-white/10 mt-1" />
                    <div className="w-full h-3 rounded-lg bg-white/10" />
                  </div>
                )}
              </div>
              <p className={`text-sm font-semibold mb-1 ${profile.layout === layout.id ? 'text-white' : 'text-white/70'}`}>
                {layout.name}
              </p>
              <p className="text-white/40 text-xs leading-relaxed">{layout.description}</p>
            </button>
          ))}
        </div>

        {/* Background image warning for Minimal */}
        {profile.layout === 'minimal' && (profile.background_url || profile.animated_background) && (
          <p className="text-yellow-400/70 text-xs mt-3 flex items-center gap-1.5">
            <span>ⓘ</span>
            Your background is saved but not shown in Minimal layout. Switch to Card or Immersive to use it.
          </p>
        )}
      </div>

      <AnimatedBackgroundPicker value={profile.animated_background} onChange={id => onProfileChange({ ...profile, animated_background: id })} />

      {/* Font picker */}
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wider mb-4 block">Font</label>
        <div className="space-y-5">
          {(['Sans-serif', 'Serif', 'Mono'] as const).map(category => (
            <fieldset key={category}>
              <legend className="mb-2 text-white/60 text-xs">{category}</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fonts.filter(font => font.category === category).map(font => (
            <button
              key={font.id}
              type="button"
              aria-label={font.name}
              aria-pressed={(profile.font ?? 'default') === font.id}
              onClick={() => handleFontChange(font.id)}
              className={`p-3 rounded-xl border text-left transition-all ${
                (profile.font ?? 'default') === font.id
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }`}
            >
              <p className={`text-sm font-semibold mb-0.5 ${(profile.font ?? 'default') === font.id ? 'text-white' : 'text-white/70'} ${font.headingClass}`}>
                {font.name}
              </p>
              <p className={`text-white/70 text-base font-bold break-words mt-2 ${font.headingClass}`}>{profile.display_name || profile.username || 'Your name'}</p>
              <p className={`text-white/40 text-xs mt-1 break-words line-clamp-2 ${font.bodyClass}`}>{profile.bio || 'A place for your work, links, and story.'}</p>
            </button>
          ))}
              </div>
            </fieldset>
          ))}
        </div>
      </div>

      {/* Theme picker */}
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wider mb-4 block">Theme</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {Object.entries(themes).map(([key, t]) => (
            <button
              key={key}
              onClick={() => handleThemeChange(key)}
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

        {profile.theme === 'custom' && (
          <CustomThemeEditor
            value={profile.custom_theme ?? null}
            onChange={handleCustomThemeChange}
            layout={profile.layout ?? 'card'}
          />
        )}

        {/* Theme color preview */}
        {profile.theme !== 'custom' && (
          <div className="mt-4 p-4 rounded-2xl border border-white/10 overflow-hidden relative">
            <div
              className="absolute inset-0 opacity-20"
              style={{ background: currentTheme.accentHex }}
            />
            <div className="relative flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0"
                style={{ background: currentTheme.accentHex }}
              />
              <div>
                <p className="text-white text-sm font-semibold">{currentTheme.name}</p>
                <p className="text-white/40 text-xs">{currentTheme.isDark ? 'Dark mode' : 'Light mode'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      </fieldset>
      <button type="button" onClick={() => void saveStyle()} disabled={saving || !fit.ready || issues.length > 0}
        className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold">
        {saving ? 'Saving…' : 'Save style'}
      </button>
      {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
      {saved && !saving && <p role="status" className="text-green-400 text-sm">Style saved. Your public profile now uses these settings.</p>}
      {issues.length > 0 && <p className="text-amber-200 text-xs">Style cannot be saved yet. Shorten the fields listed above for this font and layout.</p>}
      {!fit.ready && <p role="status" className="text-white/50 text-xs">{fit.error ? 'Could not load this font. Choose another font or reload.' : 'Loading font to check text fit…'}</p>}
    </div>
  )
}

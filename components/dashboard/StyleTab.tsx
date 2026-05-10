'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile } from '@/lib/types'
import { themes, buildCustomTheme } from '@/lib/themes'
import { layouts } from '@/lib/layouts'
import { fonts } from '@/lib/fonts'
import CustomThemeEditor from '@/components/dashboard/CustomThemeEditor'
import type { CustomTheme } from '@/lib/types'

interface Props {
  profile: Profile
  onProfileChange: (profile: Profile) => void
  userId: string
}

export default function StyleTab({ profile, onProfileChange, userId }: Props) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  async function saveStyle(updates: Partial<Profile>) {
    setSaving(true)
    const updated = { ...profile, ...updates }
    onProfileChange(updated)

    await supabase
      .from('profiles')
      .update({
        theme: updated.theme,
        layout: updated.layout,
        font: updated.font,
        custom_theme: updated.custom_theme,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handleCustomThemeChange(customTheme: CustomTheme) {
    saveStyle({ custom_theme: customTheme })
  }

  function handleThemeChange(theme: string) {
    saveStyle({ theme })
  }

  function handleLayoutChange(layout: string) {
    saveStyle({ layout })
  }

  function handleFontChange(font: string) {
    saveStyle({ font })
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
        {profile.layout === 'minimal' && profile.background_url && (
          <p className="text-yellow-400/70 text-xs mt-3 flex items-center gap-1.5">
            <span>ⓘ</span>
            Your background image is saved but not shown in Minimal layout. Switch to Card or Immersive to use it.
          </p>
        )}
      </div>

      {/* Font picker */}
      <div>
        <label className="text-white/50 text-xs uppercase tracking-wider mb-4 block">Font</label>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map(font => (
            <button
              key={font.id}
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
              <p className={`text-white/40 text-xs ${font.bodyClass}`}>Aa Bb Cc</p>
            </button>
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
    </div>
  )
}

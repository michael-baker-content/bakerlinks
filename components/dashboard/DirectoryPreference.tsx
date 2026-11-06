'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function DirectoryPreference({ userId, optedIn, onChange }: {
  userId: string
  optedIn: boolean
  onChange: (optedIn: boolean) => void
}) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  async function setListingPreference() {
    setSaving(true)
    setMessage('')

    try {
      const { data, error } = await createClient()
        .from('profiles')
        .update({ directory_opt_in: !optedIn })
        .eq('id', userId)
        .select('directory_opt_in')
        .single()

      if (error || !data) {
        setMessage('Could not save your directory preference. Try again.')
        return
      }

      onChange(data.directory_opt_in)
      setMessage(data.directory_opt_in ? 'Directory opt-in saved.' : 'You’ve opted out of the directory.')
    } catch {
      setMessage('Could not save your directory preference. Try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="space-y-3 border-t border-white/10 pt-4" aria-labelledby="directory-preference-title">
      <h3 id="directory-preference-title" className="font-semibold text-white">Verified profile directory</h3>
      <p className="text-sm text-white/70">
        If an admin verifies your profile, opting in lists your name, username, profile picture, and bio in the public directory.
        You can opt out at any time. Your public profile stays accessible by its direct link.
      </p>
      <button
        type="button"
        onClick={setListingPreference}
        disabled={saving}
        className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 disabled:opacity-50"
      >
        {saving ? 'Saving…' : optedIn ? 'Opt out of the directory' : 'Opt in to the directory'}
      </button>
      <p role="status" className="text-sm text-white/70">{message}</p>
    </section>
  )
}

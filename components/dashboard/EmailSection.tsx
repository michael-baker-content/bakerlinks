'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

function OAuthProviderMessage({ provider, feature }: { provider: string; feature: string }) {
  const name = provider.charAt(0).toUpperCase() + provider.slice(1)
  return (
    <p className="text-white/30 text-sm">
      You signed in with {name} — {feature} changes are managed through your {name} account.
    </p>
  )
}

interface Props {
  provider: string
}

export default function EmailSection({ provider }: Props) {
  const [newEmail, setNewEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function changeEmail() {
    if (!newEmail.trim()) { setError('Please enter a new email address.'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/auth/callback` }
    )
    if (error) setError(error.message)
    else setSuccess('Confirmation sent! Check your new email address to confirm the change.')
    setSaving(false)
  }

  return (
    <div className="pt-4 border-t border-white/10">
      <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Email address</h3>
      {provider === 'email' ? (
        <div className="space-y-3">
  <div>
    <label htmlFor="new-email" className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">
      New email address
    </label>
    <input
      id="new-email"
      type="email"
      value={newEmail}
      onChange={e => setNewEmail(e.target.value)}
      placeholder="you@example.com"
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
    />
  </div>
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>
          )}
          <button
            onClick={changeEmail}
            disabled={saving || !newEmail}
            className="w-full py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white rounded-xl font-semibold transition-all text-sm"
          >
            {saving ? 'Sending…' : 'Update email'}
          </button>
        </div>
      ) : (
        <OAuthProviderMessage provider={provider} feature="email" />
      )}
    </div>
  )
}
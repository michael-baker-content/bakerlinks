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

export default function PasswordSection({ provider }: Props) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  async function changePassword() {
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setError(error.message)
    else {
      setSuccess('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSaving(false)
  }

  return (
    <div className="pt-4 border-t border-white/10">
      <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Password</h3>
      {provider === 'email' ? (
        <div className="space-y-3">
          <input
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            placeholder="New password"
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            minLength={6}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
          />
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
          )}
          {success && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{success}</p>
          )}
          <button
            onClick={changePassword}
            disabled={saving || !newPassword || !confirmPassword}
            className="w-full py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white rounded-xl font-semibold transition-all text-sm"
          >
            {saving ? 'Updating…' : 'Update password'}
          </button>
        </div>
      ) : (
        <OAuthProviderMessage provider={provider} feature="password" />
      )}
    </div>
  )
}
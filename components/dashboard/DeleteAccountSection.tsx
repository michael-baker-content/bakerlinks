'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  username: string
}

export default function DeleteAccountSection({ username }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [deleting, setDeleting] = useState(false)
  const supabase = createClient()

  async function deleteAccount() {
    if (confirmText !== username) return
    setDeleting(true)
    const res = await fetch('/api/delete-account', { method: 'DELETE' })
    const data = await res.json()
    if (data.error) {
      setDeleting(false)
      alert(data.error)
      return
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="pt-4 border-t border-red-500/20">
      <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Danger zone</h3>
      {!showConfirm ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="w-full py-3 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 rounded-xl text-sm font-semibold transition-all"
        >
          Delete account
        </button>
      ) : (
        <div className="space-y-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
          <p className="text-red-400 text-sm font-medium">This will permanently delete your account and all your links. This cannot be undone.</p>
          <p className="text-white/40 text-xs">Type your username <span className="text-white font-mono">{username}</span> to confirm:</p>
          <input
            type="text"
            value={confirmText}
            onChange={e => setConfirmText(e.target.value)}
            placeholder={username}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-red-500/30 text-white placeholder-white/20 focus:outline-none focus:border-red-500/60 text-sm font-mono"
          />
          <div className="flex gap-2">
            <button
              onClick={() => { setShowConfirm(false); setConfirmText('') }}
              className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={deleteAccount}
              disabled={confirmText !== username || deleting}
              className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all"
            >
              {deleting ? 'Deleting…' : 'Delete forever'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
'use client'

import { Suspense, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

function ResetPageInner() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Handle hash fragment from Supabase reset email
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const accessToken = hashParams.get('access_token')
    const type = hashParams.get('type')
    const errorCode = hashParams.get('error')
    const errorDescription = hashParams.get('error_description')

    if (errorCode) {
      setError(errorDescription?.replace(/\+/g, ' ') ?? 'Link is invalid or has expired.')
      return
    }

    if (accessToken && type === 'recovery') {
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: hashParams.get('refresh_token') ?? '',
      }).then(({ error }) => {
        if (error) setError(error.message)
        else setReady(true)
      })
      return
    }

    // Fall back to auth state change for PKCE flow
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.updateUser({ password })
    if (error) setError(error.message)
    else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#05050a] noise flex flex-col items-center justify-center px-4 relative">
      <div className="absolute top-[-20%] left-[30%] w-[400px] h-[400px] rounded-full bg-purple-600/10 blur-[100px] pointer-events-none" />

      <Link href="/" className="font-display text-2xl font-bold text-white tracking-tight mb-12">
        Baker<span className="text-purple-400">Links</span>
      </Link>

      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8">
          <h1 className="font-display text-2xl font-bold text-white mb-2">Set new password</h1>
          <p className="text-white/60 text-sm mb-6">Enter your new password below.</p>

          {!ready && !success && !error && (
            <p className="text-white/40 text-sm text-center py-4">Verifying your reset link…</p>
          )}

          {error && (
            <div className="space-y-4">
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{error}</p>
              <p className="text-white/40 text-sm text-center">
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Request a new reset link
                </button>
              </p>
            </div>
          )}

          {success && (
            <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">
              Password updated! Redirecting to dashboard…
            </p>
          )}

          {ready && !success && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="new-password" className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">
                  New password
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 transition-colors text-sm"
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="text-white/50 text-xs font-medium mb-1.5 block uppercase tracking-wider">
                  Confirm password
                </label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 transition-colors text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
              >
                {loading ? 'Updating…' : 'Update password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}

export default function ResetPage() {
  return (
    <Suspense>
      <ResetPageInner />
    </Suspense>
  )
}

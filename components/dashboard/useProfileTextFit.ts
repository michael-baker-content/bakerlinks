'use client'

import { useEffect, useState } from 'react'
import { loadProfileFont, profileTextFits, type ProfileTextField, type TextProfile } from '@/lib/profile-text-fit'

export function useProfileTextFit({ font, layout, linkIcon }: TextProfile) {
  const key = `${font || 'default'}:${layout || 'card'}`
  const [loaded, setLoaded] = useState('')
  const [failed, setFailed] = useState('')
  useEffect(() => {
    let cancelled = false
    loadProfileFont({ font, layout }).then(() => { if (!cancelled) { setLoaded(key); setFailed('') } })
      .catch(() => { if (!cancelled) setFailed(key) })
    return () => { cancelled = true }
  }, [key, font, layout])
  return {
    ready: loaded === key,
    error: failed === key,
    fits: (value: string, field: ProfileTextField) => loaded === key && profileTextFits(value, field, { font, layout, linkIcon }),
  }
}

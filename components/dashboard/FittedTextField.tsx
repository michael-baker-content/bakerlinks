'use client'

import { useId, useRef, useState } from 'react'
import { fitTextEdit, textLineLimits, type ProfileTextField, type TextProfile } from '@/lib/profile-text-fit'
import { useProfileTextFit } from './useProfileTextFit'

interface Props {
  label: string
  value: string
  onChange: (value: string) => void
  field: ProfileTextField
  profile: TextProfile
  placeholder?: string
  multiline?: boolean
  required?: boolean
  autoFocus?: boolean
}

export default function FittedTextField({ label, value, onChange, field, profile, placeholder, multiline, required, autoFocus }: Props) {
  const id = useId()
  const input = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)
  const composing = useRef(false)
  const [composition, setComposition] = useState<string | null>(null)
  const [limited, setLimited] = useState(false)
  const { ready, error, fits } = useProfileTextFit(profile)
  const tooLong = ready && !fits(value, field)
  const lines = textLineLimits[field]

  function commit(proposed: string) {
    if (!ready) return
    const result = fitTextEdit(value, proposed, text => fits(text, field))
    setLimited(result.value !== proposed)
    onChange(result.value)
    if (result.caret !== null) {
      // Also reset the native value when a blocked edit leaves React's value unchanged.
      if (input.current) input.current.value = result.value
      requestAnimationFrame(() => input.current?.setSelectionRange(result.caret, result.caret))
    }
  }

  const className = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm disabled:opacity-50'
  const props = {
    id, value: composition ?? value, placeholder, required, autoFocus,
    disabled: !ready,
    'aria-describedby': `${id}-hint`,
    'aria-invalid': tooLong,
    ref: (element: HTMLInputElement | HTMLTextAreaElement | null) => { input.current = element },
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (composing.current) setComposition(event.target.value)
      else commit(event.target.value)
    },
    onCompositionStart: () => { composing.current = true },
    onCompositionEnd: (event: React.CompositionEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      composing.current = false
      setComposition(null)
      commit(event.currentTarget.value)
    },
  }

  return (
    <div>
      <label htmlFor={id} className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">{label}</label>
      {multiline ? <textarea {...props} rows={2} className={`${className} resize-none`} /> : <input {...props} className={className} />}
      <p id={`${id}-hint`} aria-live="polite" className={`text-xs mt-1.5 ${tooLong || limited || error ? 'text-amber-300' : 'text-white/40'}`}>
        {error ? 'Could not load this font. Reload to check text fit.' : !ready ? 'Loading font…' : tooLong
          ? `This text exceeds ${lines === 1 ? 'one line' : 'two lines'} in the current font and layout. Shorten it before saving.`
          : limited ? `${lines === 1 ? 'One-line' : 'Two-line'} limit reached. Extra text was not added.`
          : `${lines === 1 ? 'One line' : 'Up to two lines'} on a narrow mobile profile. The limit follows your font and layout.`}
      </p>
    </div>
  )
}

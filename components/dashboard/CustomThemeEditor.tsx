'use client'

import { useState, useEffect } from 'react'
import { CustomTheme } from '@/lib/types'

interface Props {
  value: CustomTheme | null
  onChange: (theme: CustomTheme) => void
  layout: string
}

const defaultCustomTheme: CustomTheme = {
  bg: '#0a0a0f',
  contentBg: '#0a0a0f',
  cardBg: '#1e1e2e',
  cardBorder: '#7c3aed',
  text: '#ffffff',
  textMuted: '#999999',
  textFaint: '#555555',
  textHeading: '#ffffff',
  accentHex: '#a78bfa',
  avatarRing: '#7c3aed',
  buttonBg: '#7c3aed',
  buttonText: '#ffffff',
}
interface ColorField {
  key: keyof CustomTheme
  label: string
  hint: string
}

const fields: ColorField[] = [
  { key: 'bg', label: 'Background', hint: 'Page background color' },
  { key: 'contentBg', label: 'Content area', hint: 'Background behind avatar, links, and social icons' },
  { key: 'cardBg', label: 'Card background', hint: 'Link card fill color' },
  { key: 'cardBorder', label: 'Card border', hint: 'Link card border color' },
  { key: 'textHeading', label: 'Heading text', hint: 'Display name color' },
  { key: 'text', label: 'Body text', hint: 'Link title color' },
  { key: 'textMuted', label: 'Muted text', hint: 'Secondary text color' },
  { key: 'accentHex', label: 'Accent', hint: 'Social icons and highlights' },
  { key: 'avatarRing', label: 'Avatar ring', hint: 'Border around profile picture' },
  { key: 'buttonBg', label: 'Button color', hint: 'Primary button background' },
  { key: 'buttonText', label: 'Button text', hint: 'Primary button text color' },
]

function contrastRatio(hex1: string, hex2: string): number {
  function luminance(hex: string): number {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const toLinear = (c: number) => c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
  }
  const l1 = luminance(hex1)
  const l2 = luminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

function isValidHex(hex: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(hex)
}

function ContrastBadge({ ratio }: { ratio: number }) {
  if (ratio >= 4.5) return <span className="text-green-400 text-xs">AA ✓</span>
  if (ratio >= 3) return <span className="text-yellow-400 text-xs">AA Large</span>
  return <span className="text-red-400 text-xs">Poor</span>
}

export default function CustomThemeEditor({ value, onChange, layout }: Props) {
  const [theme, setTheme] = useState<CustomTheme>(value ?? defaultCustomTheme)
  const visibleFields = fields.filter(f => f.key !== 'contentBg' || layout === 'immersive')

 useEffect(() => {
  if (value) setTheme({ ...defaultCustomTheme, ...value })
}, [value])

  function handleChange(key: keyof CustomTheme, color: string) {
    const updated = { ...theme, [key]: color }
    setTheme(updated)
    if (isValidHex(color)) {
      onChange(updated)
    }
  }

  const textContrast = isValidHex(theme.text) && isValidHex(theme.cardBg)
    ? contrastRatio(theme.text, theme.cardBg)
    : null

  const headingContrast = isValidHex(theme.textHeading) && isValidHex(theme.bg)
    ? contrastRatio(theme.textHeading, theme.bg)
    : null

  const buttonContrast = isValidHex(theme.buttonText) && isValidHex(theme.buttonBg)
    ? contrastRatio(theme.buttonText, theme.buttonBg)
    : null

  return (
    <div className="space-y-4 pt-4 border-t border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-white/50 text-xs uppercase tracking-wider">Custom theme</label>
        <button
          onClick={() => { setTheme(defaultCustomTheme); onChange(defaultCustomTheme) }}
          className="text-white/30 text-xs hover:text-white/60 transition-colors"
        >
          Reset to default
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {visibleFields.map(({ key, label, hint }) => (
          <div key={key} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <input
  type="color"
  value={theme[key] || '#000000'}
  onChange={e => handleChange(key, e.target.value)}
  className="w-10 h-10 rounded-xl cursor-pointer border border-white/10 bg-transparent p-0.5"
  style={{ colorScheme: 'dark' }}
/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium">{label}</p>
              <p className="text-white/30 text-xs">{hint}</p>
            </div>
            <input
  type="text"
  value={theme[key] || '#000000'}
  onChange={e => handleChange(key, e.target.value)}
  maxLength={7}
  className="w-24 px-2 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500/60"
/>
          </div>
        ))}
      </div>

      {/* Accessibility warnings */}
      <div className="p-3 rounded-xl border border-white/10 bg-white/5 space-y-2">
        <p className="text-white/50 text-xs uppercase tracking-wider mb-2">Contrast check</p>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">Body text on card</span>
          {textContrast && <ContrastBadge ratio={textContrast} />}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">Heading on background</span>
          {headingContrast && <ContrastBadge ratio={headingContrast} />}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-white/50 text-xs">Button text on button</span>
          {buttonContrast && <ContrastBadge ratio={buttonContrast} />}
        </div>
        <p className="text-white/20 text-xs pt-1 border-t border-white/10">
          AA requires 4.5:1 for normal text. You can still use any colors you like.
        </p>
      </div>
    </div>
  )
}

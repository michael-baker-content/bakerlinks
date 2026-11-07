import { getFontClasses } from './fonts'
import type { Profile, Link } from './types'
import textStyles from '@/components/profile-text.module.css'

export type ProfileTextField = 'displayName' | 'bio' | 'linkTitle' | 'linkDescription' | 'aboutTitle'
export const textLineLimits: Record<ProfileTextField, number> = { displayName: 2, bio: 2, linkTitle: 2, linkDescription: 2, aboutTitle: 1 }
export type TextProfile = Pick<Profile, 'font' | 'layout'> & { linkIcon?: boolean }
const MAX_GRAPHEMES = 1000
const graphemeSegmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })

export function graphemes(value: string): string[] {
  return Array.from(graphemeSegmenter.segment(value), part => part.segment)
}

function createProbe(profile: TextProfile, field: ProfileTextField) {
  const probe = document.createElement('div')
  const font = getFontClasses(profile.font)
  probe.className = `${textStyles.measure} ${textStyles[field]} ${field === 'displayName' ? font.heading : font.body}`
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
  // Reference the narrowest supported phone: 320 CSS px, with the actual layout padding.
  const contentWidth = 320 - 2 * rem - (profile.layout === 'immersive' ? 3 * rem : 0)
  let width = contentWidth
  // Reserve the favicon, its gap, card padding/border, external arrow and its margin.
  if (field === 'linkTitle' || field === 'linkDescription') width -= 2.5 * rem + 2 + (profile.linkIcon === false ? 0 : 1.75 * rem) + 14 + .75 * rem
  if (field === 'aboutTitle') width = (contentWidth - .5 * rem) / 2 - rem
  probe.style.width = `${width - 2}px` // Small margin for fractional rendering differences.
  probe.setAttribute('aria-hidden', 'true')
  document.body.appendChild(probe)
  return probe
}

const fontLoads = new Map<string, Promise<void>>()
export function loadProfileFont(profile: TextProfile) {
  const key = profile.font || 'default'
  const existing = fontLoads.get(key)
  if (existing) return existing
  const loading = Promise.all((['displayName', 'bio', 'linkTitle', 'aboutTitle'] as const).map(async field => {
    const probe = createProbe(profile, field)
    probe.textContent = 'Aa Wm 0123'
    const css = getComputedStyle(probe)
    const families = css.fontFamily.split(',').map(name => name.trim().replace(/["']/g, ''))
    try {
      await document.fonts.load(`${css.fontWeight} ${css.fontSize} ${css.fontFamily}`, 'Aa Wm 0123')
      // Load this family's other Unicode ranges too, before measuring accented or non-Latin input.
      await Promise.all(Array.from(document.fonts).filter(face => families.includes(face.family.replace(/["']/g, ''))).map(face => face.load()))
    }
    finally { probe.remove() }
  })).then(() => undefined).catch(error => { fontLoads.delete(key); throw error })
  fontLoads.set(key, loading)
  return loading
}

export function profileTextFits(value: string, field: ProfileTextField, profile: TextProfile) {
  if (!value) return true
  if (graphemes(value).length > MAX_GRAPHEMES) return false
  const probe = createProbe(profile, field)
  try {
    probe.textContent = value + '\u200b' // Count an explicitly entered final newline as a line.
    const lineHeight = parseFloat(getComputedStyle(probe).lineHeight)
    return probe.getBoundingClientRect().height <= lineHeight * textLineLimits[field] + .5
      && probe.scrollWidth <= probe.clientWidth + 1
  } finally { probe.remove() }
}

// Preserve text outside the edited selection, and never split an emoji or combining sequence.
export function fitTextEdit(previous: string, proposed: string, fits: (value: string) => boolean) {
  if (fits(proposed) || (!fits(previous) && graphemes(proposed).length < graphemes(previous).length)) return { value: proposed, caret: null }
  const before = graphemes(previous)
  const after = graphemes(proposed)
  let start = 0
  while (start < before.length && start < after.length && before[start] === after[start]) start++
  let end = 0
  while (end < before.length - start && end < after.length - start && before[before.length - 1 - end] === after[after.length - 1 - end]) end++
  const prefix = after.slice(0, start).join('')
  const suffix = end ? after.slice(after.length - end).join('') : ''
  const inserted = after.slice(start, after.length - end)
  let low = 0
  let high = Math.min(inserted.length, MAX_GRAPHEMES)
  if (!fits(prefix + suffix)) return { value: previous, caret: prefix.length }
  while (low < high) {
    const middle = Math.ceil((low + high) / 2)
    if (fits(prefix + inserted.slice(0, middle).join('') + suffix)) low = middle
    else high = middle - 1
  }
  const accepted = prefix + inserted.slice(0, low).join('')
  return { value: accepted + suffix, caret: accepted.length }
}

export function profileTextIssues(profile: Profile, links: Link[]) {
  const issues: string[] = []
  if (!profileTextFits(profile.display_name || profile.username, 'displayName', profile)) issues.push('Display name (Profile tab)')
  if (!profileTextFits(profile.bio ?? '', 'bio', profile)) issues.push('Bio (Profile tab)')
  if (profile.about_enabled && !profileTextFits(profile.about_title ?? '', 'aboutTitle', profile)) issues.push('About tab label (Content tab)')
  for (const link of links) {
    const linkProfile = { ...profile, linkIcon: !!link.icon }
    if (!profileTextFits(link.title, 'linkTitle', linkProfile)) issues.push(`Link title: ${link.title}`)
    if (!profileTextFits(link.description ?? '', 'linkDescription', linkProfile)) issues.push(`Link description: ${link.title}`)
  }
  return issues
}

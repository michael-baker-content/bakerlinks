export interface FontOption {
  id: string
  name: string
  category: 'Sans-serif' | 'Serif' | 'Mono'
  headingClass: string
  bodyClass: string
}

// Preserve the original IDs so existing profiles keep their fonts.
export const fonts: FontOption[] = [
  { id: 'default', name: 'Jost + Public Sans', category: 'Sans-serif', headingClass: 'font-display', bodyClass: 'font-body' },
  { id: 'inter', name: 'Inter', category: 'Sans-serif', headingClass: 'font-inter', bodyClass: 'font-inter' },
  { id: 'dm-sans', name: 'DM Sans', category: 'Sans-serif', headingClass: 'font-dm-sans', bodyClass: 'font-dm-sans' },
  { id: 'manrope', name: 'Manrope', category: 'Sans-serif', headingClass: 'font-manrope', bodyClass: 'font-manrope' },
  { id: 'source-sans', name: 'Source Sans 3', category: 'Sans-serif', headingClass: 'font-source-sans', bodyClass: 'font-source-sans' },
  { id: 'work-sans', name: 'Work Sans', category: 'Sans-serif', headingClass: 'font-work-sans', bodyClass: 'font-work-sans' },
  { id: 'barlow', name: 'Barlow', category: 'Sans-serif', headingClass: 'font-barlow', bodyClass: 'font-barlow' },
  { id: 'plex-sans', name: 'IBM Plex Sans', category: 'Sans-serif', headingClass: 'font-plex-sans', bodyClass: 'font-plex-sans' },
  { id: 'rounded', name: 'Quicksand', category: 'Sans-serif', headingClass: 'font-rounded', bodyClass: 'font-rounded' },
  { id: 'serif', name: 'Libre Baskerville', category: 'Serif', headingClass: 'font-serif-display', bodyClass: 'font-serif-body' },
  { id: 'lora', name: 'Lora', category: 'Serif', headingClass: 'font-lora', bodyClass: 'font-lora' },
  { id: 'source-serif', name: 'Source Serif 4', category: 'Serif', headingClass: 'font-source-serif', bodyClass: 'font-source-serif' },
  { id: 'mono', name: 'IBM Plex Mono', category: 'Mono', headingClass: 'font-mono-display', bodyClass: 'font-mono-display' },
  { id: 'jetbrains', name: 'JetBrains Mono', category: 'Mono', headingClass: 'font-jetbrains', bodyClass: 'font-jetbrains' },
  { id: 'space-mono', name: 'Space Mono', category: 'Mono', headingClass: 'font-space-mono', bodyClass: 'font-space-mono' },
]

export function getFontClasses(id: string | null | undefined) {
  const font = fonts.find(option => option.id === id) ?? fonts[0]
  return { heading: font.headingClass, body: font.bodyClass }
}

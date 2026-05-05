export interface ThemeConfig {
  name: string
  isDark: boolean
  bg: string
  card: string
  text: string
  textMuted: string
  textFaint: string
  accent: string
  accentHex: string
  border: string
  buttonPrimary: string
  buttonSecondary: string
  avatarRing: string
  footerText: string
  fontClass: string
}

export const themes: Record<string, ThemeConfig> = {
  electric: {
    name: 'Electric',
    isDark: true,
    bg: 'bg-[#0a0a0f]',
    card: 'border-[#7c3aed]/40 hover:border-[#7c3aed] bg-[#13131f] hover:bg-[#1a1a2e]',
    text: 'text-white',
    textMuted: 'text-white/50',
    textFaint: 'text-white/20',
    accent: 'text-[#a78bfa]',
    accentHex: '#a78bfa',
    border: 'border-[#7c3aed]/20',
    buttonPrimary: 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white',
    buttonSecondary: 'bg-white/5 hover:bg-white/10 border border-white/10 text-white',
    avatarRing: 'ring-black/40',
    footerText: 'text-white/20',
    fontClass: 'font-body',
  },
  neon: {
    name: 'Neon',
    isDark: true,
    bg: 'bg-[#050510]',
    card: 'border-[#00f5ff]/30 hover:border-[#00f5ff] bg-[#0a0a1f] hover:bg-[#0d0d25]',
    text: 'text-[#ff006e]',
    textMuted: 'text-white/50',
    textFaint: 'text-white/20',
    accent: 'text-[#00f5ff]',
    accentHex: '#00f5ff',
    border: 'border-[#00f5ff]/20',
    buttonPrimary: 'bg-[#ff006e] hover:bg-[#e6005f] text-white',
    buttonSecondary: 'bg-white/5 hover:bg-white/10 border border-[#00f5ff]/20 text-[#00f5ff]',
    avatarRing: 'ring-[#1d4efc]',
    footerText: 'text-white/20',
    fontClass: 'font-body',
  },
  earthy: {
    name: 'Earthy',
    isDark: true,
    bg: 'bg-[#0d1f0f]',
    card: 'border-[#c2855a]/30 hover:border-[#c2855a] bg-[#111f13] hover:bg-[#162817]',
    text: 'text-[#f5e6d0]',
    textMuted: 'text-[#f5e6d0]/50',
    textFaint: 'text-[#f5e6d0]/20',
    accent: 'text-[#e8a265]',
    accentHex: '#e8a265',
    border: 'border-[#c2855a]/20',
    buttonPrimary: 'bg-[#c2855a] hover:bg-[#b07348] text-white',
    buttonSecondary: 'bg-white/5 hover:bg-white/10 border border-[#c2855a]/20 text-[#e8a265]',
    avatarRing: 'ring-[#903929]',
    footerText: 'text-[#f5e6d0]/20',
    fontClass: 'font-body',
  },
  light: {
    name: 'Light',
    isDark: false,
    bg: 'bg-[#fffbf0]',
    card: 'border-[#f59e0b] hover:border-[#d97706] bg-white hover:bg-amber-50 shadow-md',
    text: 'text-[#1c1917]',
    textMuted: 'text-[#1c1917]/55',
    textFaint: 'text-[#1c1917]/25',
    accent: 'text-[#d97706]',
    accentHex: '#d97706',
    border: 'border-[#f59e0b]',
    buttonPrimary: 'bg-[#1c1917] hover:bg-[#292524] text-white',
    buttonSecondary: 'bg-white hover:bg-amber-50 border-2 border-[#f59e0b] text-[#d97706]',
    avatarRing: 'ring-[#f59e0b]',
    footerText: 'text-[#1c1917]/25',
    fontClass: 'font-body',
  },
  pastel: {
    name: 'Pastel',
    isDark: false,
    bg: 'bg-[#ddeeff]',
    card: 'border-[#f9a8d4]/50 hover:border-[#f472b6] bg-white/80 hover:bg-white shadow-sm',
    text: 'text-[#1e3a5f]',
    textMuted: 'text-[#1e3a5f]/60',
    textFaint: 'text-[#1e3a5f]/30',
    accent: 'text-[#f472b6]',
    accentHex: '#f472b6',
    border: 'border-[#f9a8d4]/40',
    buttonPrimary: 'bg-[#a78bfa] hover:bg-[#8b5cf6] text-white',
    buttonSecondary: 'bg-white hover:bg-[#f0f7ff] border border-[#f472b6] text-[#f472b6]',
    avatarRing: 'ring-[#ff9f5a]/60',
    footerText: 'text-[#1e3a5f]/30',
    fontClass: 'font-body',
  },
}

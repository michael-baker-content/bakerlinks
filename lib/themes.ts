import type { ThemeConfig } from './types'

export const themes: Record<string, ThemeConfig> = {
  electric: {
    name: 'Electric',
    bg: 'bg-[#0a0a0f]',
    card: 'bg-[#13131f] border-[#7c3aed]/40 hover:border-[#7c3aed] hover:bg-[#1a1a2e]',
    text: 'text-white',
    accent: 'text-[#a78bfa]',
    border: 'border-[#7c3aed]/20',
  },
  lava: {
    name: 'Lava',
    bg: 'bg-[#0f0500]',
    card: 'bg-[#1a0800] border-[#ea580c]/40 hover:border-[#ea580c] hover:bg-[#250d00]',
    text: 'text-white',
    accent: 'text-[#fb923c]',
    border: 'border-[#ea580c]/20',
  },
  forest: {
    name: 'Forest',
    bg: 'bg-[#020f05]',
    card: 'bg-[#061208] border-[#16a34a]/40 hover:border-[#16a34a] hover:bg-[#0a1f0e]',
    text: 'text-white',
    accent: 'text-[#4ade80]',
    border: 'border-[#16a34a]/20',
  },
  ocean: {
    name: 'Ocean',
    bg: 'bg-[#00050f]',
    card: 'bg-[#000d1a] border-[#0ea5e9]/40 hover:border-[#0ea5e9] hover:bg-[#00162b]',
    text: 'text-white',
    accent: 'text-[#38bdf8]',
    border: 'border-[#0ea5e9]/20',
  },
  void: {
    name: 'Void',
    bg: 'bg-[#080808]',
    card: 'bg-[#111] border-[#ec4899]/40 hover:border-[#ec4899] hover:bg-[#1a0010]',
    text: 'text-white',
    accent: 'text-[#f472b6]',
    border: 'border-[#ec4899]/20',
  },
}

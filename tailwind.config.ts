import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['var(--font-body)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        'serif-display': ['var(--font-serif)', 'serif'],
        'serif-body': ['var(--font-serif)', 'serif'],
        'mono-display': ['var(--font-mono-display)', 'monospace'],
        mono: ['var(--font-mono-display)', 'monospace'],
        rounded: ['var(--font-rounded)', 'sans-serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        'dm-sans': ['var(--font-dm-sans)', 'sans-serif'],
        manrope: ['var(--font-manrope)', 'sans-serif'],
        'source-sans': ['var(--font-source-sans)', 'sans-serif'],
        'work-sans': ['var(--font-work-sans)', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'sans-serif'],
        'plex-sans': ['var(--font-plex-sans)', 'sans-serif'],
        lora: ['var(--font-lora)', 'serif'],
        'source-serif': ['var(--font-source-serif)', 'serif'],
        jetbrains: ['var(--font-jetbrains)', 'monospace'],
        'space-mono': ['var(--font-space-mono)', 'monospace'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config

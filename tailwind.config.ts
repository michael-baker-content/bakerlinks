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
        'serif-display': ['var(--font-serif-display)', 'serif'],
        'serif-body': ['var(--font-serif-body)', 'serif'],
        'mono-display': ['var(--font-mono-display)', 'monospace'],
        rounded: ['var(--font-rounded)', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
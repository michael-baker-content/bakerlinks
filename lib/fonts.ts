export interface FontOption {
    id: string
    name: string
    headingClass: string
    bodyClass: string
    googleFonts?: string
}

export const fonts: FontOption[] = [
    {
        id: 'default',
        name: 'Default',
        headingClass: 'font-display',
        bodyClass: 'font-body',
    },
    {
        id: 'serif',
        name: 'Serif',
        headingClass: 'font-serif-display',
        bodyClass: 'font-serif-body',
        googleFonts: 'Playfair+Display:wght@700&family=Lora',
    },
    {
        id: 'mono',
        name: 'Mono',
        headingClass: 'font-mono-display',
        bodyClass: 'font-mono',
        googleFonts: 'JetBrains+Mono:wght@400;700',
    },
    {
        id: 'rounded',
        name: 'Rounded',
        headingClass: 'font-rounded',
        bodyClass: 'font-rounded',
        googleFonts: 'Nunito:wght@400;700;800',
    },
]

// fallow-ignore-next-line dead-code
export function getFont(id: string): FontOption {
    return fonts.find(f => f.id === id) ?? fonts[0]
}
export interface FontOption {
    id: string
    name: string
    headingClass: string
    bodyClass: string
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
    },
    {
        id: 'mono',
        name: 'Mono',
        headingClass: 'font-mono-display',
        bodyClass: 'font-mono',
    },
    {
        id: 'rounded',
        name: 'Rounded',
        headingClass: 'font-rounded',
        bodyClass: 'font-rounded',
    },
]

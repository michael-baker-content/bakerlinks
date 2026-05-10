export interface LayoutConfig {
    id: string
    name: string
    description: string
    supportsBackground: boolean
}

export const layouts: LayoutConfig[] = [
    {
        id: 'card',
        name: 'Card',
        description: 'Background image at the top, content in a card below.',
        supportsBackground: true,
    },
    {
        id: 'immersive',
        name: 'Immersive',
        description: 'Full-screen background image with content floating above.',
        supportsBackground: true,
    },
    {
        id: 'minimal',
        name: 'Minimal',
        description: 'Clean, centered content with no background image.',
        supportsBackground: false,
    },
]

export function getLayout(id: string): LayoutConfig {
    return layouts.find(l => l.id === id) ?? layouts[0]
}
export interface SocialPlatform {
    id: string
    name: string
    urlTemplate: string
    icon: string
}

export const themeIconColors: Record<string, string> = {
    electric: '#a78bfa',
    lava: '#fb923c',
    forest: '#4ade80',
    ocean: '#38bdf8',
    void: '#f472b6',
}

export const socialPlatforms: SocialPlatform[] = [
    { id: 'twitter', name: 'X / Twitter', urlTemplate: 'https://x.com/{username}', icon: 'FaXTwitter' },
    { id: 'instagram', name: 'Instagram', urlTemplate: 'https://instagram.com/{username}', icon: 'FaInstagram' },
    { id: 'tiktok', name: 'TikTok', urlTemplate: 'https://tiktok.com/@{username}', icon: 'FaTiktok' },
    { id: 'youtube', name: 'YouTube', urlTemplate: 'https://youtube.com/@{username}', icon: 'FaYoutube' },
    { id: 'github', name: 'GitHub', urlTemplate: 'https://github.com/{username}', icon: 'FaGithub' },
    { id: 'linkedin', name: 'LinkedIn', urlTemplate: 'https://linkedin.com/in/{username}', icon: 'FaLinkedin' },
    { id: 'facebook', name: 'Facebook', urlTemplate: 'https://facebook.com/{username}', icon: 'FaFacebook' },
    { id: 'twitch', name: 'Twitch', urlTemplate: 'https://twitch.tv/{username}', icon: 'FaTwitch' },
    { id: 'pinterest', name: 'Pinterest', urlTemplate: 'https://pinterest.com/{username}', icon: 'FaPinterest' },
    { id: 'reddit', name: 'Reddit', urlTemplate: 'https://reddit.com/u/{username}', icon: 'FaReddit' },
    { id: 'spotify', name: 'Spotify', urlTemplate: 'https://open.spotify.com/user/{username}', icon: 'FaSpotify' },
    { id: 'soundcloud', name: 'SoundCloud', urlTemplate: 'https://soundcloud.com/{username}', icon: 'FaSoundcloud' },
    { id: 'behance', name: 'Behance', urlTemplate: 'https://behance.net/{username}', icon: 'FaBehance' },
    { id: 'dribbble', name: 'Dribbble', urlTemplate: 'https://dribbble.com/{username}', icon: 'FaDribbble' },
    { id: 'medium', name: 'Medium', urlTemplate: 'https://medium.com/@{username}', icon: 'FaMedium' },
    { id: 'substack', name: 'Substack', urlTemplate: 'https://{username}.substack.com', icon: 'SiSubstack' },
    { id: 'patreon', name: 'Patreon', urlTemplate: 'https://patreon.com/{username}', icon: 'FaPatreon' },
    { id: 'snapchat', name: 'Snapchat', urlTemplate: 'https://snapchat.com/add/{username}', icon: 'FaSnapchat' },
]

export function getPlatform(id: string): SocialPlatform | undefined {
    return socialPlatforms.find(p => p.id === id)
}

export function buildUrl(platform: SocialPlatform, username: string): string {
    return platform.urlTemplate.replace('{username}', username)
}
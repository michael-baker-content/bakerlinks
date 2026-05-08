export interface CustomTheme {
  bg: string
  contentBg: string
  cardBg: string
  cardBorder: string
  text: string
  textMuted: string
  textFaint: string
  textHeading: string
  accentHex: string
  avatarRing: string
  buttonBg: string
  buttonText: string
}

export interface Profile {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
  background_url: string | null
  background_attribution: {
    photographer_name: string
    photographer_url: string
    unsplash_url: string
    download_url: string
  } | null
  social_links: SocialLink[]
  social_links_position: 'top' | 'bottom'
  theme: string
  layout: string
  custom_theme: CustomTheme | null
  about_enabled: boolean
  about_title: string | null
  about_content: string | null
  about_markdown: string | null
  created_at: string
  updated_at: string
}

export interface Link {
  id: string
  user_id: string
  title: string
  url: string
  description: string | null
  icon: string | null
  position: number
  active: boolean
  clicks: number
  created_at: string
  updated_at: string
}

export interface SocialLink {
  platform: string
  username: string
}

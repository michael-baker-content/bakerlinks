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
  theme: string
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

export type Theme = 'electric' | 'lava' | 'forest' | 'ocean' | 'void'

export interface ThemeConfig {
  name: string
  bg: string
  card: string
  text: string
  accent: string
  border: string
}

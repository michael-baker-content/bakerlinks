import { SocialLink } from '@/lib/types'
import { getPlatform, buildUrl } from '@/lib/social-platforms'
import { themes } from '@/lib/themes'
import SocialIcon from '@/components/SocialIcon'

interface Props {
  links: SocialLink[]
  theme: string
  customAccent?: string
}

export default function SocialLinksDisplay({ links, theme: themeName, customAccent }: Props) {
  if (!links || links.length === 0) return null

  const theme = themes[themeName] ?? themes.electric
  const color = customAccent ?? theme.accentHex

  return (
    <div className="flex justify-center gap-4 my-4">
      {links.map(link => {
        const platform = getPlatform(link.platform)
        if (!platform) return null
        const url = buildUrl(platform, link.username)
        return (
          <a
            key={link.platform}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${platform.name}: ${link.username}`}
            className={`p-2.5 rounded-xl border ${theme.border} ${theme.isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-white/60 hover:bg-white'} transition-all hover:scale-110`}
          >
            <SocialIcon iconName={platform.icon} size={22} color={color} />
          </a>
        )
      })}
    </div>
  )
}

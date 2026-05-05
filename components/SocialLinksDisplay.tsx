import { SocialLink } from '@/lib/types'
import { getPlatform, buildUrl, themeIconColors } from '@/lib/social-platforms'
import SocialIcon from '@/components/SocialIcon'

interface Props {
  links: SocialLink[]
  theme: string
}

export default function SocialLinksDisplay({ links, theme }: Props) {
  if (!links || links.length === 0) return null

  const color = themeIconColors[theme] ?? '#a78bfa'

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
            className="p-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all hover:scale-110"
          >
            <SocialIcon iconName={platform.icon} size={22} color={color} />
          </a>
        )
      })}
    </div>
  )
}
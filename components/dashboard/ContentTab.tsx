'use client'

import { Profile, Link as LinkType } from '@/lib/types'
import LinksTab from '@/components/dashboard/LinksTab'
import AboutEditor from '@/components/dashboard/AboutEditor'

interface Props {
  initialLinks: LinkType[]
  userId: string
  profile: Profile
  onProfileChange: (profile: Profile) => void
}

export default function ContentTab({ initialLinks, userId, profile, onProfileChange }: Props) {
  return (
    <div className="space-y-8">
      <LinksTab initialLinks={initialLinks} userId={userId} />

      <div className="border-t border-white/10 pt-8">
        <AboutEditor
          userId={userId}
          initialEnabled={profile.about_enabled ?? false}
          initialTitle={profile.about_title}
          initialMarkdown={profile.about_markdown ?? null}
          onChange={updates => onProfileChange({ ...profile, ...updates })}
        />
      </div>
    </div>
  )
}

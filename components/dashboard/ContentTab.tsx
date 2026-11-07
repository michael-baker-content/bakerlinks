'use client'

import { Profile, Link as LinkType } from '@/lib/types'
import LinksTab from '@/components/dashboard/LinksTab'
import AboutEditor from '@/components/dashboard/AboutEditor'
import type { Dispatch, SetStateAction } from 'react'

interface Props {
  links: LinkType[]
  onLinksChange: Dispatch<SetStateAction<LinkType[]>>
  userId: string
  profile: Profile
  onProfileChange: (profile: Profile) => void
}

export default function ContentTab({ links, onLinksChange, userId, profile, onProfileChange }: Props) {
  return (
    <div className="space-y-8">
      <LinksTab links={links} onLinksChange={onLinksChange} userId={userId} profile={profile} />

      <div className="border-t border-white/10 pt-8">
        <AboutEditor
          profile={profile}
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

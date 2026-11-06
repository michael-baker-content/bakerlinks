'use client'

import { useState } from 'react'
import Image from 'next/image'
import { getProfileInitials } from '@/lib/profile-initials'
import styles from '../../home.module.css'

export default function DirectoryAvatar({ name, url }: { name: string; url: string | null }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = url && /^https?:\/\//i.test(url) && url !== failedUrl

  return (
    <span className={styles.directoryAvatar} aria-hidden="true">
      {showImage ? (
        <Image
          src={url}
          width={80}
          height={80}
          alt=""
          unoptimized
          referrerPolicy="no-referrer"
          onError={() => setFailedUrl(url)}
        />
      ) : (
        getProfileInitials(name)
      )}
    </span>
  )
}

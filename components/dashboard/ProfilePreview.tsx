'use client'

import { useEffect, useRef, useState } from 'react'
import type { Profile, Link } from '@/lib/types'
import PublicProfile from '@/components/PublicProfile'

export default function ProfilePreview({ profile, links = [] }: { profile: Profile; links?: Link[] }) {
  const frame = useRef<HTMLDivElement>(null)
  const content = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ scale: .8, height: 416 })
  useEffect(() => {
    const update = () => {
      if (!frame.current || !content.current) return
      const scale = frame.current.clientWidth / 320
      setDimensions({ scale, height: content.current.offsetHeight * scale })
    }
    const observer = new ResizeObserver(update)
    if (frame.current) observer.observe(frame.current)
    if (content.current) observer.observe(content.current)
    update()
    return () => observer.disconnect()
  }, [])

  function preventNavigation(event: React.MouseEvent) {
    if ((event.target as HTMLElement).closest('a')) {
      event.preventDefault()
      event.stopPropagation()
    }
  }

  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-2 text-center">Mobile preview</p>
      <p className="text-white/30 text-xs mb-4 text-center">Your actual page, scaled from 320px</p>
      <div ref={frame} className="relative w-full max-w-[260px] mx-auto rounded-[2rem] border-2 border-white/10 overflow-hidden shadow-2xl"
        style={{ height: dimensions.height + 4 }} onClickCapture={preventNavigation} onAuxClickCapture={preventNavigation}>
        <div ref={content} className="absolute top-0 left-0 w-[320px] origin-top-left" style={{ transform: `scale(${dimensions.scale})` }}>
          <PublicProfile profile={profile} links={links} preview />
        </div>
      </div>
    </div>
  )
}

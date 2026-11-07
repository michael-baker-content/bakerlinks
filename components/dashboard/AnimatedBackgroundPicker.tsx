'use client'

import { profileBackgrounds } from '@/lib/profile-backgrounds'
import ProfileMotionBackground from '@/components/ProfileMotionBackground'

interface Props {
  value: string | null | undefined
  onChange: (id: string | null) => void
}

export default function AnimatedBackgroundPicker({ value, onChange }: Props) {
  return (
    <fieldset className="min-w-0">
      <legend className="text-white/50 text-xs uppercase tracking-wider mb-2">Animated background</legend>
      <p className="text-white/50 text-xs mb-4 leading-relaxed">A little atmosphere for your page. Choose from five abstract designs and five scenery loops.</p>
      <button type="button" aria-pressed={!value} onClick={() => onChange(null)}
        className={`w-full mb-3 px-4 py-3 rounded-xl border text-left text-sm ${!value ? 'border-purple-400 bg-purple-500/20 text-white' : 'border-white/10 text-white/60 hover:bg-white/5'}`}>
        No animation <span className="text-white/40 text-xs">— use your photo or theme</span>
      </button>
      <div className="grid grid-cols-2 gap-3">
        {profileBackgrounds.map(background => (
          <button key={background.id} type="button" aria-pressed={value === background.id} onClick={() => onChange(background.id)}
            className={`overflow-hidden rounded-xl border text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-purple-300 ${value === background.id ? 'border-purple-400 bg-purple-500/20' : 'border-white/10 bg-white/5 hover:border-white/30'}`}>
            <span className="relative block h-24 overflow-hidden"><ProfileMotionBackground backgroundId={background.id} thumbnail /></span>
            <span className="block px-3 py-2.5">
              <span className="block text-white text-xs font-semibold">{background.name}</span>
              <span className="block mt-1 text-white/50 text-[11px]">{background.kind === 'video' ? 'Scenery' : 'Abstract'}{value === background.id ? ' · Selected' : ''}</span>
            </span>
          </button>
        ))}
      </div>
      <p className="text-white/40 text-xs mt-3 leading-relaxed">Shown in Card and Immersive layouts. Your photo stays saved. Visitors can pause motion; reduced-motion preferences are respected.</p>
    </fieldset>
  )
}

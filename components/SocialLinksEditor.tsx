'use client'

import { useState } from 'react'
import { socialPlatforms, getPlatform } from '@/lib/social-platforms'
import { SocialLink } from '@/lib/types'
import SocialIcon from '@/components/SocialIcon'
import { Plus, Trash2 } from 'lucide-react'

interface Props {
  value: SocialLink[]
  position: 'top' | 'bottom'
  onChange: (links: SocialLink[], position: 'top' | 'bottom') => void
}

const MAX_SOCIAL_LINKS = 6

export default function SocialLinksEditor({ value, position, onChange }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const availablePlatforms = socialPlatforms.filter(
    p => !value.find(v => v.platform === p.id)
  )

  function addLink() {
    if (!selectedPlatform) { setError('Please select a platform.'); return }
    if (!username.trim()) { setError('Please enter a username.'); return }
    if (value.length >= MAX_SOCIAL_LINKS) { setError(`Maximum ${MAX_SOCIAL_LINKS} social links allowed.`); return }

    setError('')
    onChange([...value, { platform: selectedPlatform, username: username.trim() }], position)
    setSelectedPlatform('')
    setUsername('')
  }

  function removeLink(platform: string) {
    onChange(value.filter(l => l.platform !== platform), position)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-white/50 text-xs uppercase tracking-wider">Social links</label>
        <span className="text-white/30 text-xs">{value.length}/{MAX_SOCIAL_LINKS}</span>
      </div>

      {/* Position toggle */}
      <div className="flex rounded-xl bg-white/5 p-1 w-fit">
        {(['top', 'bottom'] as const).map(p => (
          <button
            key={p}
            onClick={() => onChange(value, p)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
              position === p ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            {p === 'top' ? 'Above links' : 'Below links'}
          </button>
        ))}
      </div>

      {/* Existing social links */}
      {value.length > 0 && (
        <div className="space-y-2">
          {value.map(link => {
            const platform = getPlatform(link.platform)
            if (!platform) return null
            return (
              <div
                key={link.platform}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5"
              >
                <SocialIcon iconName={platform.icon} size={16} color="#a78bfa" />
                <span className="text-white text-sm flex-1">{platform.name}</span>
                <span className="text-white/40 text-xs">@{link.username}</span>
                <button
                  onClick={() => removeLink(link.platform)}
                  className="p-1 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add new */}
      {value.length < MAX_SOCIAL_LINKS && (
        <div className="space-y-2">
          <select
            value={selectedPlatform}
            onChange={e => setSelectedPlatform(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-purple-500/60 text-sm"
          >
            <option value="" className="bg-[#0e0e1a]">Select a platform…</option>
            {availablePlatforms.map(p => (
              <option key={p.id} value={p.id} className="bg-[#0e0e1a]">{p.name}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Username"
              onKeyDown={e => e.key === 'Enter' && addLink()}
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
            />
            <button
              onClick={addLink}
              className="px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all"
            >
              <Plus size={16} />
            </button>
          </div>

          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      )}
    </div>
  )
}
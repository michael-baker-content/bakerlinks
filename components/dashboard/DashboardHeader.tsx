'use client'

import { useState } from 'react'
import { Copy, Check, ExternalLink, LogOut } from 'lucide-react'

interface Props {
  username: string
  onCopy: () => void
  onSignOut: () => void
  copied: boolean
}

export default function DashboardHeader({ username, onCopy, onSignOut, copied }: Props) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="border-b border-white/5 px-6 py-4">
  <div className="max-w-2xl mx-auto flex items-center justify-between">
    <span className="font-display text-xl font-bold text-white">
      Baker<span className="text-purple-400">Links</span>
    </span>

      {/* Desktop buttons */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={onCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all"
        >
          {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : username}</span>
        </button>
        
        <a  href={`/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm"
        >
          <ExternalLink size={16} />
          <span>View profile</span>
        </a>
        <button
          onClick={onSignOut}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm"
        >
          <LogOut size={16} />
          <span>Sign out</span>
        </button>
      </div>

      {/* Mobile menu */}
      <div className="relative sm:hidden">
        <button
          onClick={() => setShowMenu(m => !m)}
          className="p-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="2" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="14" cy="8" r="1.5"/>
          </svg>
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-12 z-50 w-52 rounded-2xl border border-white/10 bg-[#0e0e1a] shadow-2xl overflow-hidden">
              <button
                onClick={() => { onCopy(); setShowMenu(false) }}
                className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors"
              >
                {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              
              <a  href={`/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors"
              >
                <ExternalLink size={16} />
                View profile
              </a>
              <div className="h-px bg-white/10 mx-4" />
              <button
                onClick={() => { onSignOut(); setShowMenu(false) }}
                className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 text-sm transition-colors"
              >
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
      </div>
    </header>
  )
}
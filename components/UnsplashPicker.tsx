'use client'

import { useState } from 'react'
import { Search, Loader2, X } from 'lucide-react'

interface UnsplashPhoto {
  id: string
  urls: { regular: string; small: string }
  links: { download_location: string }
  user: {
    name: string
    links: { html: string }
  }
}

interface Attribution {
  photographer_name: string
  photographer_url: string
  unsplash_url: string
  download_url: string
}

interface Props {
  onSelect: (url: string, attribution: Attribution) => void
  onClose: () => void
}

export default function UnsplashPicker({ onSelect, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [photos, setPhotos] = useState<UnsplashPhoto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function search(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12&orientation=landscape`,
        {
          headers: {
            Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
          },
        }
      )
      const data = await res.json()
      if (data.errors) {
        setError(data.errors[0])
      } else {
        setPhotos(data.results)
      }
    } catch {
      setError('Failed to search Unsplash. Please try again.')
    }
    setLoading(false)
  }

  async function handleSelect(photo: UnsplashPhoto) {
    // Trigger download event as required by Unsplash API guidelines
    await fetch(
      `${photo.links.download_location}&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
    )

    const attribution: Attribution = {
      photographer_name: photo.user.name,
      photographer_url: `${photo.user.links.html}?utm_source=bakerlinks&utm_medium=referral`,
      unsplash_url: 'https://unsplash.com/?utm_source=bakerlinks&utm_medium=referral',
      download_url: photo.links.download_location,
    }

    onSelect(photo.urls.regular, attribution)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0e0e1a] border border-white/10 rounded-2xl p-6 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg font-bold text-white">Search Unsplash</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={search} className="flex gap-2 mb-4">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search for images..."
            className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl transition-all"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm mb-4">{error}</p>
        )}

        <div className="overflow-y-auto flex-1">
          {photos.length === 0 && !loading && (
            <p className="text-white/30 text-sm text-center py-8">Search for a background image above.</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {photos.map(photo => (
              <button
                key={photo.id}
                onClick={() => handleSelect(photo)}
                className="relative group rounded-xl overflow-hidden aspect-video"
              >
                <img
                  src={photo.urls.small}
                  alt={`Photo by ${photo.user.name}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end p-2 opacity-0 group-hover:opacity-100">
                  <p className="text-white text-xs truncate">
                    {photo.user.name}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="text-white/20 text-xs mt-4 text-center">
          Photos from{' '}
          
           <a href="https://unsplash.com/?utm_source=bakerlinks&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white/40"
          >
            Unsplash
          </a>
        </p>
      </div>
    </div>
  )
}
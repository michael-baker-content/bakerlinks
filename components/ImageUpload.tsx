'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'
import UnsplashPicker from '@/components/UnsplashPicker'



interface Attribution {
  photographer_name: string
  photographer_url: string
  unsplash_url: string
  download_url: string
}

interface Props {
  bucket: 'avatars' | 'backgrounds'
  userId: string
  currentUrl: string | null
  onUpload: (url: string, attribution?: Attribution | null) => void
  label: string
  aspectHint?: string
}

export default function ImageUpload({ bucket, userId, currentUrl, onUpload, label, aspectHint }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [showUnsplash, setShowUnsplash] = useState(false)
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()
  useEffect(() => {
  setPreview(currentUrl)
}, [currentUrl])

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
  const MAX_SIZE = bucket === 'avatars' ? 2 * 1024 * 1024 : 5 * 1024 * 1024

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setError('')

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError('Only JPEG, PNG, and WebP images are allowed.')
      return
    }

    if (file.size > MAX_SIZE) {
      setError(`File must be under ${bucket === 'avatars' ? '2MB' : '5MB'}.`)
      return
    }

    setUploading(true)

    const ext = file.name.split('.').pop()
    const path = `${userId}/${bucket === 'avatars' ? 'avatar' : 'background'}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, file, { upsert: true })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    const url = `${data.publicUrl}?t=${Date.now()}`

    setPreview(url)
    onUpload(url)
    setUploading(false)
  }

  async function handleRemove() {
    if (!preview) return
    setUploading(true)

    // Only delete from storage if it's not an Unsplash URL
    if (!preview.includes('unsplash.com')) {
        const ext = preview.split('.').pop()?.split('?')[0]
        const path = `${userId}/${bucket === 'avatars' ? 'avatar' : 'background'}.${ext}`
        await supabase.storage.from(bucket).remove([path])
    }

  setPreview(null)
  onUpload('', null)
    setUploading(false)
  }

  return (
    <div>
      <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">{label}</label>
      {aspectHint && <p className="text-white/30 text-xs mb-2">{aspectHint}</p>}
{preview && (
  <div className="relative rounded-xl overflow-visible border border-white/10">
    <img
      src={preview}
      alt={label}
      className={`w-full object-contain ${bucket === 'avatars' ? 'h-24 w-24 rounded-full' : 'h-32'}`}
    />
    <div className="absolute top-2 right-2 flex gap-1">
      <button
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="px-2 py-1 rounded-lg bg-black/60 hover:bg-purple-600/80 text-white text-xs transition-colors"
      >
        Replace
      </button>
      {bucket === 'backgrounds' && (
        <button
          onClick={() => setShowUnsplash(true)}
          disabled={uploading}
          className="px-2 py-1 rounded-lg bg-black/60 hover:bg-purple-600/80 text-white text-xs transition-colors"
        >
          Unsplash
        </button>
      )}
      <button
        onClick={handleRemove}
        disabled={uploading}
        className="p-1.5 rounded-lg bg-black/60 hover:bg-red-500/80 text-white transition-colors"
      >
        <X size={14} />
      </button>
    </div>
  </div>
)}
      {!preview && (
        <div className="flex flex-col gap-2">
            <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="w-full flex flex-col items-center justify-center gap-2 py-6 rounded-xl border border-dashed border-white/20 hover:border-purple-500/50 hover:bg-white/5 transition-all text-white/40 hover:text-white/70"
            >
            {uploading ? (
                <Loader2 size={20} className="animate-spin" />
            ) : (
                <Upload size={20} />
            )}
            <span className="text-xs">{uploading ? 'Uploading…' : `Upload ${label.toLowerCase()}`}</span>
            </button>
            {bucket === 'backgrounds' && (
            <button
                onClick={() => setShowUnsplash(true)}
                className="w-full py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white text-xs transition-all"
            >
                Search Unsplash
            </button>
            )}
        </div>
        )}

        {showUnsplash && (
        <UnsplashPicker
            onSelect={(url, attribution) => {
            setPreview(url)
            onUpload(url, attribution)
            }}
            onClose={() => setShowUnsplash(false)}
        />
        )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  )
}
'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Upload, X, Loader2 } from 'lucide-react'

interface Props {
  bucket: 'avatars' | 'backgrounds'
  userId: string
  currentUrl: string | null
  onUpload: (url: string) => void
  label: string
  aspectHint?: string
}

export default function ImageUpload({ bucket, userId, currentUrl, onUpload, label, aspectHint }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(currentUrl)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

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

    const ext = preview.split('.').pop()?.split('?')[0]
    const path = `${userId}/${bucket === 'avatars' ? 'avatar' : 'background'}.${ext}`

    await supabase.storage.from(bucket).remove([path])
    setPreview(null)
    onUpload('')
    setUploading(false)
  }

  return (
    <div>
      <label className="text-white/50 text-xs uppercase tracking-wider mb-2 block">{label}</label>
      {aspectHint && <p className="text-white/30 text-xs mb-2">{aspectHint}</p>}

      {preview ? (
        <div className="relative rounded-xl overflow-hidden border border-white/10">
          <img
            src={preview}
            alt={label}
            className={`w-full object-cover ${bucket === 'avatars' ? 'h-24 w-24 rounded-full' : 'h-32'}`}
          />
          <button
            onClick={handleRemove}
            disabled={uploading}
            className="absolute top-2 right-2 p-1 rounded-full bg-black/60 hover:bg-red-500/80 text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
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
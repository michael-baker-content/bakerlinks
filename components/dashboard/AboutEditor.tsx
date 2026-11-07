'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { marked } from 'marked'
import { X } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Profile } from '@/lib/types'
import FittedTextField from './FittedTextField'
import { useProfileTextFit } from './useProfileTextFit'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

interface Props {
  profile: Profile
  userId: string
  initialEnabled: boolean
  initialTitle: string | null
  initialMarkdown: string | null
  onChange: (updates: { about_enabled: boolean; about_title: string | null; about_content: string | null; about_markdown: string | null }) => void
}

function parseMarkdown(md: string): string {
  marked.use({
    renderer: {
      link() { return '' },
      image() { return '' },
      html() { return '' },
    }
  })
  return marked.parse(md) as string
}

export default function AboutEditor({ profile, userId, initialEnabled, initialTitle, initialMarkdown, onChange }: Props) {
  const [enabled, setEnabled] = useState(initialEnabled)
  const [title, setTitle] = useState(initialTitle ?? '')
  const [content, setContent] = useState(initialMarkdown ?? '')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false)
  const supabase = createClient()
  const fit = useProfileTextFit(profile)

  async function save() {
    if (!fit.ready || !fit.fits(title, 'aboutTitle')) return
    setSaving(true)
    setError('')
    const html = content ? parseMarkdown(content) : null

    const { error: saveError } = await supabase
      .from('profiles')
      .update({
        about_enabled: enabled,
        about_title: title || null,
        about_content: html,
        about_markdown: content,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)

    if (saveError) {
      setSaving(false)
      setError('Could not save your About page. Please try again.')
      return
    }

    onChange({
      about_enabled: enabled,
      about_title: title || null,
      about_content: html,
      about_markdown: content,
    })

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  async function handleToggle() {
    const newEnabled = !enabled
    setEnabled(newEnabled)

    await supabase
      .from('profiles')
      .update({ about_enabled: newEnabled, updated_at: new Date().toISOString() })
      .eq('id', userId)

    onChange({
      about_enabled: newEnabled,
      about_title: title || null,
      about_content: content ? parseMarkdown(content) : null,
      about_markdown: content || null,
    })
  }

  return (
    <>
      {showMarkdownHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0e0e1a] border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-bold text-white">Markdown Guide</h3>
              <button onClick={() => setShowMarkdownHelp(false)} className="text-white/40 hover:text-white">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              {[
                { syntax: '# Heading 1', result: 'Large heading' },
                { syntax: '## Heading 2', result: 'Medium heading' },
                { syntax: '**bold text**', result: 'Bold text' },
                { syntax: '*italic text*', result: 'Italic text' },
                { syntax: '- item', result: 'Bullet list item' },
                { syntax: '1. item', result: 'Numbered list item' },
                { syntax: '> quote', result: 'Blockquote' },
              ].map(({ syntax, result }) => (
                <div key={syntax} className="flex items-center justify-between gap-4">
                  <code className="text-purple-300 bg-white/5 px-2 py-1 rounded text-xs font-mono">{syntax}</code>
                  <span className="text-white/50 text-xs">{result}</span>
                </div>
              ))}
              <p className="text-white/30 text-xs pt-2 border-t border-white/10">Links and images are not supported.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-white font-semibold text-sm">About Page</h3>
            <p className="text-white/40 text-xs mt-0.5">Add a second tab to your profile with info about you.</p>
          </div>
          <button
            onClick={handleToggle}
            className={`relative inline-flex items-center w-11 h-6 rounded-full transition-colors flex-shrink-0 ${enabled ? 'bg-purple-600' : 'bg-white/10'}`}
            aria-label={enabled ? 'Disable About Page' : 'Enable About Page'}
          >
            <span
              className={`inline-block w-4 h-4 rounded-full bg-white transition-transform ml-1 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}
            />
          </button>
        </div>

        {enabled && (
          <>
                <FittedTextField label="Tab Title" field="aboutTitle" profile={profile}
                  value={title}
                  onChange={setTitle}
                  placeholder="About"
                />

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-white/50 text-xs uppercase tracking-wider">Content</label>
                <button
                  onClick={() => setShowMarkdownHelp(true)}
                  className="text-white/30 hover:text-white/60 text-xs flex items-center gap-1 transition-colors"
                >
                  <span>ⓘ</span> Markdown Guide
                </button>
              </div>
              <div data-color-mode="dark">
                <MDEditor
                  value={content}
                  onChange={v => setContent(v ?? '')}
                  preview="edit"
                  hideToolbar={false}
                  height={300}
                  visibleDragbar={false}
                  commands={[]}
                  extraCommands={[]}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '14px',
                  }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                {success && <span className="text-green-400 text-xs">Saved!</span>}
              </div>
              <button
                onClick={save}
                disabled={saving || !fit.ready || !fit.fits(title, 'aboutTitle')}
                className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all"
              >
                {saving ? 'Saving…' : 'Save About Page'}
              </button>
            </div>
            {error && <p role="alert" className="text-red-300 text-sm">{error}</p>}
          </>
        )}
      </div>
    </>
  )
}

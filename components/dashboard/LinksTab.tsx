'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
import { Link as LinkType } from '@/lib/types'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus, Pencil, Trash2, GripVertical,
  Eye, EyeOff, BarChart2, X, ArrowUp, ArrowDown,
} from 'lucide-react'

// ── Sortable Link Row ──────────────────────────────────────────
function SortableLink({
  link,
  onEdit,
  onDelete,
  onToggle,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  link: LinkType
  onEdit: (l: LinkType) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  isFirst: boolean
  isLast: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 p-4 rounded-xl border transition-all ${
        link.active
          ? 'border-white/10 bg-white/5 hover:bg-white/8'
          : 'border-white/5 bg-white/2 opacity-50'
      }`}
    >
      <button
  {...attributes}
  {...listeners}
  suppressHydrationWarning
  className="text-white/20 hover:text-white/50 cursor-grab drag-handle"
  aria-label="Drag to reorder"
>
        <GripVertical size={16} />
      </button>

      <div className="flex flex-col gap-0.5 [@media(hover:hover)]:hidden">
        <button
          onClick={() => onMoveUp(link.id)}
          disabled={isFirst}
          className="p-1 rounded text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          aria-label="Move link up"
        >
          <ArrowUp size={12} />
        </button>
        <button
          onClick={() => onMoveDown(link.id)}
          disabled={isLast}
          className="p-1 rounded text-white/30 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          aria-label="Move link down"
        >
          <ArrowDown size={12} />
        </button>
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{link.title}</p>
        <p className="text-white/40 text-xs truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-1 text-white/30 text-xs">
        <BarChart2 size={12} />
        <span>{link.clicks}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 [@media(hover:none)]:opacity-100 transition-opacity">
        <button
  onClick={() => onToggle(link.id, !link.active)}
  className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
  aria-label={link.active ? 'Hide link' : 'Show link'}
>
  {link.active ? <Eye size={14} /> : <EyeOff size={14} />}
</button>
        <button
  onClick={() => onEdit(link)}
  className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
  aria-label="Edit link"
>
  <Pencil size={14} />
</button>
        <button
  onClick={() => onDelete(link.id)}
  className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
  aria-label="Delete link"
>
  <Trash2 size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Link Form Modal ────────────────────────────────────────────
function LinkModal({
  link,
  onSave,
  onClose,
}: {
  link: Partial<LinkType> | null
  onSave: (data: { title: string; url: string; description: string; icon: string | null }) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(link?.title ?? '')
  const [url, setUrl] = useState(link?.url ?? '')
  const [description, setDescription] = useState(link?.description ?? '')
  const titleInputRef = useRef<HTMLInputElement>(null)

useEffect(() => {
  titleInputRef.current?.focus()
}, [])
useEffect(() => {
  const modal = document.querySelector('[role="dialog"]') as HTMLElement
  if (!modal) return

  const focusable = modal.querySelectorAll<HTMLElement>(
    'button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  )
  const first = focusable[0]
  const last = focusable[focusable.length - 1]

  function handleTab(e: KeyboardEvent) {
    if (e.key !== 'Tab') return
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  document.addEventListener('keydown', handleTab)
  return () => document.removeEventListener('keydown', handleTab)
}, [])
  const [favicon, setFavicon] = useState<string | null>(() => {
    if (link?.url) {
      try {
        const parsed = new URL(link.url)
        return `https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`
      } catch {
        return null
      }
    }
    return null
  })

  function handleUrlChange(val: string) {
    setUrl(val)
    try {
      const parsed = new URL(val)
      setFavicon(`https://www.google.com/s2/favicons?domain=${parsed.hostname}&sz=32`)
    } catch {
      setFavicon(null)
    }
  }

  function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  onSave({ title, url, description, icon: favicon })
}

  return (
  <div
    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    role="dialog"
    aria-modal="true"
    aria-labelledby="link-modal-title"
    onKeyDown={e => e.key === 'Escape' && onClose()}
  >
    <div className="w-full max-w-md bg-[#0e0e1a] border border-white/10 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 id="link-modal-title" className="font-display text-lg font-bold text-white">
          {link?.id ? 'Edit link' : 'Add link'}
        </h2>
        <button onClick={onClose} className="text-white/40 hover:text-white" aria-label="Close dialog">
          <X size={18} />
        </button>
      </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
  <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Title</label>
  <div className="relative">
    <input
      ref={titleInputRef}
      value={title}
      onChange={e => setTitle(e.target.value)}
      required
      maxLength={34}
      placeholder="My Portfolio"
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm pr-16"
    />
    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 text-xs">
      {title.length}/34
    </span>
  </div>
</div>
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">URL</label>
            <div className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 focus-within:border-purple-500/60 transition-colors overflow-hidden">
              {favicon && (
                <img
                  src={favicon}
                  alt="site icon"
                  className="w-5 h-5 ml-3 rounded-sm flex-shrink-0"
                  onError={() => setFavicon(null)}
                />
              )}
              <input
                value={url}
                onChange={e => handleUrlChange(e.target.value)}
                required
                type="url"
                placeholder="https://example.com"
                className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/20 focus:outline-none text-sm"
              />
            </div>
          </div>
          <div>
  <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Description (optional)</label>
  <div className="relative">
    <textarea
      value={description}
      onChange={e => setDescription(e.target.value)}
      placeholder="A short description"
      maxLength={96}
      rows={2}
      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm resize-none"
    />
    <span className="absolute right-3 bottom-3 text-white/20 text-xs">
      {description.length}/96
    </span>
  </div>
</div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 border border-white/10 text-white/50 hover:text-white rounded-xl text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all"
            >
              {link?.id ? 'Save changes' : 'Add link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Links Tab ──────────────────────────────────────────────────
interface Props {
  initialLinks: LinkType[]
  userId: string
}

export default function LinksTab({ initialLinks, userId }: Props) {
  const [links, setLinks] = useState(initialLinks)
  const [editingLink, setEditingLink] = useState<Partial<LinkType> | null | false>(false)
  const addLinkButtonRef = useRef<HTMLButtonElement>(null)
  const supabase = createClient()
  const sensors = useSensors(useSensor(PointerSensor))

async function saveLink(data: { title: string; url: string; description: string; icon: string | null }) {
  if (!editingLink) return
  if ((editingLink as LinkType).id) {
    const { data: updated } = await supabase
      .from('links')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', (editingLink as LinkType).id)
      .select()
      .single()
    if (updated) setLinks(ls => ls.map(l => l.id === updated.id ? updated : l))
  } else {
    const position = links.length
    const { data: inserted } = await supabase
      .from('links')
      .insert({ ...data, user_id: userId, position })
      .select()
      .single()
    if (inserted) setLinks(ls => [...ls, inserted])
  }
  setEditingLink(false)
}

  async function deleteLink(id: string) {
    if (!confirm('Delete this link?')) return
    await supabase.from('links').delete().eq('id', id)
    setLinks(ls => ls.filter(l => l.id !== id))
  }

  async function toggleLink(id: string, active: boolean) {
    await supabase.from('links').update({ active }).eq('id', id)
    setLinks(ls => ls.map(l => l.id === id ? { ...l, active } : l))
  }

  async function moveLink(id: string, direction: 'up' | 'down') {
    const index = links.findIndex(l => l.id === id)
    if (direction === 'up' && index === 0) return
    if (direction === 'down' && index === links.length - 1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    const reordered = arrayMove(links, index, newIndex)
    setLinks(reordered)

    await Promise.all(
      reordered.map((link, i) =>
        supabase.from('links').update({ position: i }).eq('id', link.id)
      )
    )
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = links.findIndex(l => l.id === active.id)
    const newIndex = links.findIndex(l => l.id === over.id)
    const reordered = arrayMove(links, oldIndex, newIndex)
    
    setLinks(reordered)
    await Promise.all(
      reordered.map((link, i) =>
        supabase.from('links').update({ position: i }).eq('id', link.id)
      )
    )
  }

  return (
    <div>
      {editingLink !== false && (
        <LinkModal
          link={editingLink}
          onSave={async (data) => {
  await saveLink(data)
  setTimeout(() => addLinkButtonRef.current?.focus(), 0)
}}
          onClose={() => {
  setEditingLink(false)
  setTimeout(() => addLinkButtonRef.current?.focus(), 0)
}}
        />
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-lg font-bold text-white">Your links</h2>
        <button
  ref={addLinkButtonRef}
  onClick={() => setEditingLink({})}
  className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-medium transition-all hover:scale-105 active:scale-95"
>
          <Plus size={16} />
          Add link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-purple-500/20 rounded-2xl bg-purple-500/5">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
            <Plus size={24} className="text-purple-400" />
          </div>
          <h3 className="font-display text-lg font-bold text-white mb-2">Welcome to BakerLinks!</h3>
          <p className="text-white/40 text-sm max-w-xs mx-auto mb-6 leading-relaxed">
            Your page is ready. Add your first link to get started — a portfolio, social profile, or anything you want to share.
          </p>
          <button
            onClick={() => setEditingLink({})}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-semibold transition-all hover:scale-105 active:scale-95"
          >
            Add your first link
          </button>
          <p className="text-white/20 text-xs mt-4">
            You can also add social icons and customize your profile in the Profile tab.
          </p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {links.map((link, index) => (
                <SortableLink
                  key={link.id}
                  link={link}
                  onEdit={l => setEditingLink(l)}
                  onDelete={deleteLink}
                  onToggle={toggleLink}
                  onMoveUp={(id) => moveLink(id, 'up')}
                  onMoveDown={(id) => moveLink(id, 'down')}
                  isFirst={index === 0}
                  isLast={index === links.length - 1}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}
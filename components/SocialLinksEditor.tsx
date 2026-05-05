'use client'

import { useState } from 'react'
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
import { socialPlatforms, getPlatform } from '@/lib/social-platforms'
import { SocialLink } from '@/lib/types'
import SocialIcon from '@/components/SocialIcon'
import { Plus, Trash2, GripVertical } from 'lucide-react'

interface Props {
  value: SocialLink[]
  position: 'top' | 'bottom'
  onChange: (links: SocialLink[], position: 'top' | 'bottom') => void
}

const MAX_SOCIAL_LINKS = 6

function SortableSocialLink({
  link,
  onRemove,
}: {
  link: SocialLink
  onRemove: (platform: string) => void
}) {
  const platform = getPlatform(link.platform)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.platform })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  if (!platform) return null

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/10 bg-white/5"
    >
      <button
        {...attributes}
        {...listeners}
        suppressHydrationWarning
        className="text-white/20 hover:text-white/50 cursor-grab drag-handle"
      >
        <GripVertical size={14} />
      </button>
      <SocialIcon iconName={platform.icon} size={16} color="#a78bfa" />
      <span className="text-white text-sm flex-1">{platform.name}</span>
      <span className="text-white/40 text-xs">@{link.username}</span>
      <button
        onClick={() => onRemove(link.platform)}
        className="p-1 rounded-lg hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-colors"
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

export default function SocialLinksEditor({ value, position, onChange }: Props) {
  const [selectedPlatform, setSelectedPlatform] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState('')

  const sensors = useSensors(useSensor(PointerSensor))

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = value.findIndex(l => l.platform === active.id)
    const newIndex = value.findIndex(l => l.platform === over.id)
    onChange(arrayMove(value, oldIndex, newIndex), position)
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

      {/* Sortable existing social links */}
      {value.length > 0 && (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={value.map(l => l.platform)} strategy={verticalListSortingStrategy}>
            <div className="space-y-2">
              {value.map(link => (
                <SortableSocialLink
                  key={link.platform}
                  link={link}
                  onRemove={removeLink}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
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

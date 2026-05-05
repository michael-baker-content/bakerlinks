'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Profile, Link as LinkType, SocialLink } from '@/lib/types'
import ImageUpload from '@/components/ImageUpload'
import SocialLinksEditor from '@/components/SocialLinksEditor'
import { themes } from '@/lib/themes'
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
  Plus, ExternalLink, Pencil, Trash2, GripVertical,
  Eye, EyeOff, LogOut, Copy, Check, BarChart2, X
} from 'lucide-react'

interface Attribution {
  photographer_name: string
  photographer_url: string
  unsplash_url: string
  download_url: string
}

// ── Sortable Link Row ──────────────────────────────────────────
function SortableLink({
  link,
  onEdit,
  onDelete,
  onToggle,
}: {
  link: LinkType
  onEdit: (l: LinkType) => void
  onDelete: (id: string) => void
  onToggle: (id: string, active: boolean) => void
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
        className="text-white/20 hover:text-white/50 cursor-grab drag-handle"
      >
        <GripVertical size={16} />
      </button>

      <div className="flex-1 min-w-0">
        <p className="text-white font-medium text-sm truncate">{link.title}</p>
        <p className="text-white/40 text-xs truncate">{link.url}</p>
      </div>

      <div className="flex items-center gap-1 text-white/30 text-xs">
        <BarChart2 size={12} />
        <span>{link.clicks}</span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onToggle(link.id, !link.active)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          title={link.active ? 'Hide link' : 'Show link'}
        >
          {link.active ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
        <button
          onClick={() => onEdit(link)}
          className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(link.id)}
          className="p-1.5 rounded-lg hover:bg-red-500/20 text-white/50 hover:text-red-400 transition-colors"
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
  onSave: (data: { title: string; url: string; description: string }) => void
  onClose: () => void
}) {
  const [title, setTitle] = useState(link?.title ?? '')
  const [url, setUrl] = useState(link?.url ?? '')
  const [description, setDescription] = useState(link?.description ?? '')
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
    onSave({ title, url, description })
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#0e0e1a] border border-white/10 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-lg font-bold text-white">
            {link?.id ? 'Edit link' : 'Add link'}
          </h2>
          <button onClick={onClose} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              placeholder="My Portfolio"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
            />
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
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="A short description"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
            />
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

// ── Main Dashboard ─────────────────────────────────────────────
export default function DashboardClient({
  initialProfile,
  initialLinks,
  userId,
  provider,
  showWelcome,
}: {
  initialProfile: Profile
  initialLinks: LinkType[]
  userId: string
  provider: string
  showWelcome?: boolean
}) {
  const [profile, setProfile] = useState(initialProfile)
  const [links, setLinks] = useState(initialLinks)
  const [editingLink, setEditingLink] = useState<Partial<LinkType> | null | false>(false)
  const [copied, setCopied] = useState(false)
  const [savingProfile, setSavingProfile] = useState(false)
  const [tab, setTab] = useState<'links' | 'profile'>('links')
  const supabase = createClient()
  const [welcomeVisible, setWelcomeVisible] = useState(showWelcome ?? false)

  // Password
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  // Email
  const [newEmail, setNewEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailSuccess, setEmailSuccess] = useState('')
  const [savingEmail, setSavingEmail] = useState(false)

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const [deletingAccount, setDeletingAccount] = useState(false)

  const profileUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/${profile.username}`
    : `/${profile.username}`

  const sensors = useSensors(useSensor(PointerSensor))

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  function copyLink() {
    navigator.clipboard.writeText(profileUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function saveLink(data: { title: string; url: string; description: string }) {
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

  async function changeEmail() {
    if (!newEmail.trim()) { setEmailError('Please enter a new email address.'); return }
    setSavingEmail(true)
    setEmailError('')
    setEmailSuccess('')
    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: `${window.location.origin}/auth/callback` }
    )
    if (error) setEmailError(error.message)
    else setEmailSuccess('Confirmation sent! Check your new email address to confirm the change.')
    setSavingEmail(false)
  }

  async function changePassword() {
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return }
    if (newPassword.length < 6) { setPasswordError('Password must be at least 6 characters'); return }
    setSavingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')
    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) setPasswordError(error.message)
    else {
      setPasswordSuccess('Password updated successfully!')
      setNewPassword('')
      setConfirmPassword('')
    }
    setSavingPassword(false)
  }

  async function saveProfile() {
    setSavingProfile(true)
    const { data: updated } = await supabase
      .from('profiles')
      .update({
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio,
        theme: profile.theme,
        avatar_url: profile.avatar_url,
        background_url: profile.background_url,
        background_attribution: profile.background_attribution,
        social_links: profile.social_links,
        social_links_position: profile.social_links_position,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()
    if (updated) setProfile(updated)
    setSavingProfile(false)
  }

  function handleAvatarUpload(url: string) {
    setProfile(p => ({ ...p, avatar_url: url || null }))
  }

  function handleBackgroundUpload(url: string, attribution?: Attribution | null) {
    setProfile(p => ({
      ...p,
      background_url: url || null,
      background_attribution: attribution ?? null,
    }))
  }

  function handleSocialLinksChange(links: SocialLink[], position: 'top' | 'bottom') {
    setProfile(p => ({ ...p, social_links: links, social_links_position: position }))
  }

  async function deleteAccount() {
    if (deleteConfirmText !== profile.username) return
    setDeletingAccount(true)
    const res = await fetch('/api/delete-account', { method: 'DELETE' })
    const data = await res.json()
    if (data.error) {
      setDeletingAccount(false)
      alert(data.error)
      return
    }
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const theme = themes[profile.theme] ?? themes.electric

  return (
    
    <div className={`min-h-screen ${theme.bg} noise`}>
      {editingLink !== false && (
        <LinkModal
          link={editingLink}
          onSave={saveLink}
          onClose={() => setEditingLink(false)}
        />
      )}
{welcomeVisible && (
  <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl bg-purple-600 text-white shadow-2xl shadow-purple-500/30 animate-fade-in">
    <span className="text-lg">🎉</span>
    <div>
      <p className="font-semibold text-sm">Welcome to BakerLinks!</p>
      <p className="text-white/70 text-xs">Your account is confirmed. Start building your page.</p>
    </div>
    <button onClick={() => setWelcomeVisible(false)} className="ml-2 text-white/50 hover:text-white">
      <X size={16} />
    </button>
  </div>
)}
      {/* Top bar */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <span className="font-display text-xl font-bold text-white">
          Baker<span className="text-purple-400">Links</span>
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={copyLink}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all"
          >
            {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            <span className="hidden sm:block">{copied ? 'Copied!' : profile.username}</span>
          </button>
          <a
            href={`/${profile.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm"
          >
            <ExternalLink size={16} />
            <span className="hidden sm:block">View profile</span>
          </a>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all text-sm"
          >
            <LogOut size={16} />
            <span className="hidden sm:block">Sign out</span>
          </button>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 rounded-xl bg-white/5 p-1 w-fit">
          {(['links', 'profile'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                tab === t ? 'bg-purple-600 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── LINKS TAB ── */}
        {tab === 'links' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-bold text-white">Your links</h2>
              <button
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
                    {links.map(link => (
                      <SortableLink
                        key={link.id}
                        link={link}
                        onEdit={l => setEditingLink(l)}
                        onDelete={deleteLink}
                        onToggle={toggleLink}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}

        {/* ── PROFILE TAB ── */}
        {tab === 'profile' && (
          <div className="space-y-6">
            <h2 className="font-display text-lg font-bold text-white">Profile settings</h2>

            <div className="space-y-4">
              {/* Username */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Username</label>
                <div className="flex items-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                  <span className="px-4 py-3 text-white/30 text-sm border-r border-white/10">bakerlinks.com/</span>
                  <input
                    value={profile.username}
                    onChange={e => setProfile(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') }))}
                    className="flex-1 px-4 py-3 bg-transparent text-white text-sm focus:outline-none placeholder-white/20"
                  />
                </div>
                {profile.username !== initialProfile.username && (
                  <p className="text-yellow-400/80 text-xs mt-2 flex items-center gap-1.5">
                    <span>⚠️</span>
                    Changing your username will break your existing link. Anyone using your old URL will get a 404.
                  </p>
                )}
              </div>

              {/* Display name */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Display name</label>
                <input
                  value={profile.display_name ?? ''}
                  onChange={e => setProfile(p => ({ ...p, display_name: e.target.value }))}
                  placeholder="Your Name"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Bio</label>
                <textarea
                  value={profile.bio ?? ''}
                  onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                  placeholder="A short bio…"
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm resize-none"
                />
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 gap-4">
                <ImageUpload
                  bucket="avatars"
                  userId={userId}
                  currentUrl={profile.avatar_url}
                  onUpload={handleAvatarUpload}
                  label="Profile picture"
                  aspectHint="Square image recommended. Max 2MB."
                />
                <ImageUpload
                  bucket="backgrounds"
                  userId={userId}
                  currentUrl={profile.background_url}
                  onUpload={handleBackgroundUpload}
                  label="Background image"
                  aspectHint="Wide image recommended (1500×500px). Max 5MB."
                />
              </div>

              {/* Social links */}
              <SocialLinksEditor
                value={profile.social_links ?? []}
                position={profile.social_links_position ?? 'bottom'}
                onChange={handleSocialLinksChange}
              />

              {/* Theme */}
              <div>
                <label className="text-white/50 text-xs uppercase tracking-wider mb-3 block">Theme</label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(themes).map(([key, t]) => (
                    <button
                      key={key}
                      onClick={() => setProfile(p => ({ ...p, theme: key }))}
                      className={`p-3 rounded-xl border text-xs font-medium transition-all ${
                        profile.theme === key
                          ? 'border-purple-500 bg-purple-500/20 text-white'
                          : 'border-white/10 bg-white/5 text-white/50 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Save profile */}
            <button
              onClick={saveProfile}
              disabled={savingProfile}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
            >
              {savingProfile ? 'Saving…' : 'Save profile'}
            </button>

            {/* Email change */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Email address</h3>
              {provider === 'email' ? (
                <div className="space-y-3">
                  <input
                    type="email"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    placeholder="New email address"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
                  />
                  {emailError && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{emailError}</p>
                  )}
                  {emailSuccess && (
                    <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{emailSuccess}</p>
                  )}
                  <button
                    onClick={changeEmail}
                    disabled={savingEmail || !newEmail}
                    className="w-full py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white rounded-xl font-semibold transition-all text-sm"
                  >
                    {savingEmail ? 'Sending…' : 'Update email'}
                  </button>
                </div>
              ) : (
                <p className="text-white/30 text-sm">
                  You signed in with {provider.charAt(0).toUpperCase() + provider.slice(1)} — email changes are managed through your {provider.charAt(0).toUpperCase() + provider.slice(1)} account.
                </p>
              )}
            </div>

            {/* Password change */}
            <div className="pt-4 border-t border-white/10">
              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Password</h3>
              {provider === 'email' ? (
                <div className="space-y-3">
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="New password"
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
                  />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    minLength={6}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20 focus:outline-none focus:border-purple-500/60 text-sm"
                  />
                  {passwordError && (
                    <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">{passwordError}</p>
                  )}
                  {passwordSuccess && (
                    <p className="text-green-400 text-sm bg-green-500/10 border border-green-500/20 rounded-xl px-4 py-3">{passwordSuccess}</p>
                  )}
                  <button
                    onClick={changePassword}
                    disabled={savingPassword || !newPassword || !confirmPassword}
                    className="w-full py-3 bg-white/10 hover:bg-white/15 disabled:opacity-50 text-white rounded-xl font-semibold transition-all text-sm"
                  >
                    {savingPassword ? 'Updating…' : 'Update password'}
                  </button>
                </div>
              ) : (
                <p className="text-white/30 text-sm">
                  You signed in with {provider.charAt(0).toUpperCase() + provider.slice(1)} — password changes are managed through your {provider.charAt(0).toUpperCase() + provider.slice(1)} account.
                </p>
              )}
            </div>

            {/* Delete account */}
            <div className="pt-4 border-t border-red-500/20">
              <h3 className="text-white/50 text-xs uppercase tracking-wider mb-4">Danger zone</h3>
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 border border-red-500/30 hover:border-red-500/60 hover:bg-red-500/10 text-red-400 rounded-xl text-sm font-semibold transition-all"
                >
                  Delete account
                </button>
              ) : (
                <div className="space-y-3 p-4 rounded-xl border border-red-500/30 bg-red-500/5">
                  <p className="text-red-400 text-sm font-medium">This will permanently delete your account and all your links. This cannot be undone.</p>
                  <p className="text-white/40 text-xs">Type your username <span className="text-white font-mono">{profile.username}</span> to confirm:</p>
                  <input
                    type="text"
                    value={deleteConfirmText}
                    onChange={e => setDeleteConfirmText(e.target.value)}
                    placeholder={profile.username}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-red-500/30 text-white placeholder-white/20 focus:outline-none focus:border-red-500/60 text-sm font-mono"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowDeleteConfirm(false); setDeleteConfirmText('') }}
                      className="flex-1 py-2.5 border border-white/10 text-white/50 hover:text-white rounded-xl text-sm transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={deleteAccount}
                      disabled={deleteConfirmText !== profile.username || deletingAccount}
                      className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all"
                    >
                      {deletingAccount ? 'Deleting…' : 'Delete forever'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

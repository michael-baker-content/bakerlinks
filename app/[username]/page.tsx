import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import PublicProfile from '@/components/PublicProfile'

interface Props {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, bio, username, avatar_url')
    .ilike('username', username)
    .single()

  if (!profile) return { title: 'Not found' }

  const title = `${profile.display_name || profile.username} | BakerLinks`
  const description = profile.bio || `Check out ${profile.username}'s links on BakerLinks`
  const url = `https://bakerlinks.com/${profile.username}`
  const image = profile.avatar_url || 'https://bakerlinks.com/bakerlinks-logo-A.svg'

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'BakerLinks',
      images: [{ url: image, width: 400, height: 400, alt: profile.display_name || profile.username }],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title,
      description,
      images: [image],
    },
  }
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', username)
    .single()

  if (!profile) notFound()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .eq('active', true)
    .order('position', { ascending: true })

  return <PublicProfile profile={profile} links={links ?? []} />
}
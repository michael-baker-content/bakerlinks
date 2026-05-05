import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>
}) {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('position', { ascending: true })

  const { welcome } = await searchParams

  return (
    <DashboardClient
      initialProfile={profile}
      initialLinks={links ?? []}
      userId={user.id}
      provider={user.app_metadata.provider ?? 'email'}
      showWelcome={welcome === 'true'}
    />
  )
}
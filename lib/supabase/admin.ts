import 'server-only'

import { createClient as createServiceClient } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { createClient } from './server'

export function isAdmin(userId: string) {
  return (process.env.BAKERLINKS_ADMIN_USER_IDS ?? '')
    .split(',')
    .some(id => id.trim().toLowerCase() === userId.toLowerCase())
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')
  if (!isAdmin(user.id)) notFound()
  return user.id
}

export function createAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

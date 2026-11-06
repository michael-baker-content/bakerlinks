import 'server-only'

import { createClient as createServiceClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { notFound, redirect } from 'next/navigation'
import { createClient } from './server'

export function isAdmin(user: Pick<User, 'id' | 'app_metadata'>) {
  const grant = user.app_metadata.bakerlinks_admin
  if (typeof grant === 'boolean') return grant

  return (process.env.BAKERLINKS_ADMIN_USER_IDS ?? '')
    .split(',')
    .some(id => id.trim().toLowerCase() === user.id.toLowerCase())
}

export async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')
  if (!isAdmin(user)) notFound()
  return user.id
}

export function createAdminClient() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  )
}

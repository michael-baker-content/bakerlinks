'use server'

import { redirect } from 'next/navigation'
import { createAdminClient, requireAdmin } from '@/lib/supabase/admin'

export async function setProfileVerification(
  profileId: string,
  verified: boolean,
  page: number,
  search: string,
) {
  await requireAdmin()

  const verifications = createAdminClient().from('profile_verifications')
  const { error } = verified
    ? await verifications.upsert({ profile_id: profileId }, { onConflict: 'profile_id', ignoreDuplicates: true })
    : await verifications.delete().eq('profile_id', profileId)

  const params = new URLSearchParams({
    page: String(page),
    result: error ? 'error' : verified ? 'verified' : 'revoked',
  })
  if (search) params.set('q', search)

  redirect(`/dashboard/admin?${params}`)
}

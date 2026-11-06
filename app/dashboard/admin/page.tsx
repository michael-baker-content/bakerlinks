import Link from 'next/link'
import { Search } from 'lucide-react'
import { createAdminClient, requireAdmin } from '@/lib/supabase/admin'
import { readPage } from '@/lib/pagination'
import { setProfileVerification } from './actions'
import styles from '../dashboard.module.css'

export const metadata = { title: 'Profile verification | BakerLinks' }

const pageSize = 20
const profileFields = 'id, username, display_name, directory_opt_in'
const messages: Record<string, string> = {
  verified: 'Profile verified.',
  revoked: 'Verification revoked.',
  error: 'Could not save the verification change. Try again.',
}

export default async function AdminPage({ searchParams }: {
  searchParams: Promise<{ q?: string; page?: string; result?: string }>
}) {
  const adminId = await requireAdmin()

  const { q, page: requestedPage, result } = await searchParams
  const search = typeof q === 'string' ? q.trim().slice(0, 80) : ''
  const page = readPage(requestedPage)
  const start = (page - 1) * pageSize
  const admin = createAdminClient()
  let query = admin.from('profiles').select(profileFields, { count: 'exact' })

  if (search) query = query.ilike('username', `%${search.replace(/[\\%_]/g, '\\$&')}%`)

  const [{ data: profiles, count, error }, { data: ownProfile }] = await Promise.all([
    query.order('username').range(start, start + pageSize - 1),
    admin.from('profiles').select(profileFields).eq('id', adminId).maybeSingle(),
  ])
  const profileIds = new Set(profiles?.map(profile => profile.id))
  if (ownProfile) profileIds.add(ownProfile.id)
  const { data: verifications, error: verificationError } = profileIds.size
    ? await admin.from('profile_verifications').select('profile_id').in('profile_id', [...profileIds])
    : { data: [], error: null }
  const verifiedIds = new Set(verifications?.map(verification => verification.profile_id))
  const unavailable = (error && error.code !== 'PGRST103') || verificationError
  const statusMessage = result && Object.hasOwn(messages, result) ? messages[result] : null

  function pageHref(next: number) {
    return `/dashboard/admin?${new URLSearchParams({ page: String(next), q: search })}`
  }

  function profileRow(profile: NonNullable<typeof ownProfile>, own = false) {
    const verified = verifiedIds.has(profile.id)
    const actionLabel = verified ? 'Revoke verification' : own ? 'Approve my profile' : 'Verify profile'

    return (
      <li key={profile.id}>
        <div className={styles.profileIdentity}>
          <Link href={`/${encodeURIComponent(profile.username)}`}>
            {profile.display_name || profile.username}
          </Link>
          <p>@{profile.username}</p>
        </div>
        <div className={styles.profileStatus}>
          <span data-verified={verified}>{verified ? 'Verified' : 'Unverified'}</span>
          <span>{profile.directory_opt_in ? 'Opted in' : 'Opted out'}</span>
        </div>
        <form action={setProfileVerification.bind(null, profile.id, !verified, page, search)}>
          <button
            type="submit"
            aria-label={own ? actionLabel : `${verified ? 'Revoke verification for' : 'Verify'} @${profile.username}`}
            className={verified ? styles.revoke : styles.verify}
          >
            {actionLabel}
          </button>
        </form>
      </li>
    )
  }

  return (
    <main id="main-content" className={styles.shell + ' ' + styles.main} tabIndex={-1}>
      <div className={styles.intro}>
        <div>
          <h1>Profile verification</h1>
          <p>Verified profiles appear in the public directory only after their owners opt in.</p>
        </div>
        <svg className={styles.illustration} viewBox="0 0 192 112" aria-hidden="true">
          <path d="M16 16h72v72H16z" fill="#b77765" />
          <circle cx="120" cy="48" r="40" fill="#b79855" />
          <path d="M72 56h104v48H72z" fill="#9f8bb1" />
          <path d="M40 50h112v24H40z" fill="#463254" />
          <path d="m122 61 6 6 11-12" fill="none" stroke="#f4e9db" strokeWidth="4" />
        </svg>
      </div>

      {statusMessage && <p role="status" className={styles.message}>{statusMessage}</p>}

      {ownProfile && !verificationError && (
        <section className={styles.ownProfile} aria-labelledby="own-profile-title">
          <h2 id="own-profile-title">Your profile</h2>
          <ul className={styles.profileList}>{profileRow(ownProfile, true)}</ul>
          {verifiedIds.has(ownProfile.id) && ownProfile.directory_opt_in && (
            <p>Listed in the <Link className="underline underline-offset-4" href="/site/directory">public directory</Link>.</p>
          )}
        </section>
      )}

      <section aria-labelledby="profile-list-title">
        <div className={styles.toolbar}>
          <div>
            <h2 id="profile-list-title">Profiles</h2>
            {!unavailable && count !== null && <p>{count.toLocaleString()} {count === 1 ? 'profile' : 'profiles'}{search && ' found'}</p>}
          </div>
          <form action="/dashboard/admin" className={styles.searchForm}>
            <label htmlFor="profile-search">Search by username</label>
            <div>
              <input id="profile-search" name="q" type="search" defaultValue={search} maxLength={80} />
              <button type="submit"><Search size={16} aria-hidden="true" /> Search</button>
            </div>
          </form>
        </div>

        {unavailable ? (
          <p role="alert" className={styles.message}>Could not load verification records. Check that the directory database setup has been applied.</p>
        ) : profiles?.length ? (
          <ul className={styles.profileList}>
            {profiles.map(profile => profileRow(profile))}
          </ul>
        ) : (
          <p className={styles.message}>No profiles found on this page.</p>
        )}

        {!unavailable && (page > 1 || (count ?? 0) > start + pageSize) && (
          <nav aria-label="Profile pages" className={styles.pagination}>
            {page > 1 && <Link href={pageHref(page - 1)}>Previous</Link>}
            {(count ?? 0) > start + pageSize && <Link href={pageHref(page + 1)}>Next</Link>}
          </nav>
        )}
      </section>
    </main>
  )
}

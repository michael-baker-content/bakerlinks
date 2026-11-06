import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Search } from 'lucide-react'
import { readPage } from '@/lib/pagination'
import { createClient } from '@/lib/supabase/server'
import styles from '../../home.module.css'
import DirectoryAvatar from './DirectoryAvatar'

export const metadata: Metadata = {
  title: 'Meet the people | BakerLinks',
  description: 'Discover what people on BakerLinks are making, writing, and sharing.',
}

const pageSize = 24
const directoryPath = '/site/directory'

export default async function DirectoryPage({ searchParams }: {
  searchParams: Promise<{ page?: string; q?: string; about?: string; socials?: string }>
}) {
  const params = await searchParams
  const search = typeof params.q === 'string' ? params.q.trim().slice(0, 100) : ''
  const about = params.about === '1'
  const socials = params.socials === '1'
  const filtered = Boolean(search || about || socials)
  const page = readPage(params.page)
  const start = (page - 1) * pageSize
  const supabase = await createClient()
  let query = supabase
    .from('profiles')
    .select('username, display_name, bio, avatar_url, profile_verifications!inner(profile_id)', { count: 'exact' })
    .eq('directory_opt_in', true)

  const term = search.replace(/^@/, '').trim()
  if (term) {
    // Escape the database regex and the quoted PostgREST filter value separately.
    const literal = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const pattern = `"${literal.replace(/[\\"]/g, '\\$&')}"`
    query = query.or(`username.imatch.${pattern},display_name.imatch.${pattern},bio.imatch.${pattern}`)
  }
  if (about) query = query.eq('about_enabled', true)
  if (socials) query = query.not('social_links->0', 'is', null)

  const { data: profiles, count, error } = await query
    .order('username')
    .range(start, start + pageSize - 1)
  const unavailable = error && error.code !== 'PGRST103'

  const filters = new URLSearchParams()
  if (search) filters.set('q', search)
  if (about) filters.set('about', '1')
  if (socials) filters.set('socials', '1')

  function pageHref(next: number) {
    const nextParams = new URLSearchParams(filters)
    nextParams.set('page', String(next))
    return `${directoryPath}?${nextParams}`
  }

  return (
    <>
      <h1>Meet the people behind the links.</h1>
      <p>See what people are making, writing, and sharing. Open a profile to explore their work and find ways to connect.</p>

      <form key={filters.toString()} action={directoryPath} role="search" className={styles.directorySearch}>
        <label htmlFor="directory-query">Search by name, username, or bio</label>
        <div className={styles.directorySearchRow}>
          <input id="directory-query" name="q" type="search" defaultValue={search} maxLength={100} />
          <button className={styles.primary} type="submit"><Search size={17} aria-hidden="true" /> Search</button>
        </div>
        <fieldset className={styles.directoryFilters}>
          <legend className="sr-only">Filter profiles</legend>
          <label><input type="checkbox" name="about" value="1" defaultChecked={about} /> Has an About tab</label>
          <label><input type="checkbox" name="socials" value="1" defaultChecked={socials} /> Has social links</label>
          {filtered && <Link href={directoryPath}>Clear search and filters</Link>}
        </fieldset>
      </form>

      {unavailable ? (
        <p role="status">The directory is unavailable right now. Please try again later.</p>
      ) : profiles?.length ? (
        <>
          {filtered && count !== null && <p>{count.toLocaleString()} {count === 1 ? 'profile' : 'profiles'} found</p>}
          <ul className={styles.directoryList}>
            {profiles.map(profile => {
              const name = profile.display_name?.trim() || profile.username

              return (
                <li key={profile.username}>
                  <Link
                    className={styles.directoryCard}
                    href={`/${encodeURIComponent(profile.username)}`}
                    aria-label={`View ${name} (@${profile.username})`}
                  >
                    <DirectoryAvatar name={name} url={profile.avatar_url} />
                    <div>
                      <h2>{name}</h2>
                      <p>@{profile.username}</p>
                      {profile.bio && <p>{profile.bio}</p>}
                    </div>
                    <ArrowUpRight className={styles.directoryArrow} size={18} aria-hidden="true" />
                  </Link>
                </li>
              )
            })}
          </ul>
        </>
      ) : (
        <p>{page > 1 ? 'There are no profiles on this page.' : filtered ? 'No profiles match. Try a different search or remove a filter.' : 'No profiles to explore yet. Check back soon.'}</p>
      )}

      {!unavailable && (page > 1 || (count ?? 0) > start + pageSize) && (
        <nav className={styles.directoryPagination} aria-label="Directory pages">
          {page > 1 && <Link href={pageHref(page - 1)}>Previous</Link>}
          {(count ?? 0) > start + pageSize && <Link href={pageHref(page + 1)}>Next</Link>}
        </nav>
      )}
    </>
  )
}

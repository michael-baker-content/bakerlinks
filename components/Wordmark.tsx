import Link from 'next/link'
import styles from '@/app/home.module.css'

export default function Wordmark() {
  return (
    <Link className={styles.brand} href="/" aria-label="BakerLinks home">
      <span className={styles.brandIcon} aria-hidden="true">
        <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="7" r="4" />
          <path d="M4 20a8 8 0 0 1 16 0H4Z" />
        </svg>
      </span>
      Baker<span>Links</span>
    </Link>
  )
}

import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Wordmark from '@/components/Wordmark'
import styles from './home.module.css'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.shell + ' ' + styles.nav}>
        <Wordmark />
        <Link className={styles.signIn} href="/auth">Sign in <ArrowRight size={15} /></Link>
      </div>
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className={styles.shell + ' ' + styles.footer}>
      <div className={styles.footerIdentity}>
        <Wordmark />
        <p>Built by Michael Baker</p>
      </div>
      <nav className={styles.footerLinks} aria-label="Footer">
        <Link className={styles.secondary} href="/michael">Live example <ArrowUpRight size={14} /></Link>
        <Link className={styles.secondary} href="/site/directory">Directory</Link>
        <Link className={styles.secondary} href="/site/contact">Contact</Link>
        <Link className={styles.secondary} href="/site/privacy">Privacy</Link>
        <Link className={styles.secondary} href="/site/terms">Terms</Link>
      </nav>
    </footer>
  )
}

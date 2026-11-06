import type { ReactNode } from 'react'
import styles from '../home.module.css'
import { SiteFooter, SiteHeader } from '../site-chrome'

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.home}>
      <SiteHeader />
      <main id="main-content" className={styles.infoPage} tabIndex={-1}>
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}

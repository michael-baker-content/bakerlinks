import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Wordmark from '@/components/Wordmark'
import DashboardFooter from '@/components/dashboard/DashboardFooter'
import styles from '../dashboard.module.css'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className={styles.admin}>
      <header className={styles.header}>
        <div className={styles.shell + ' ' + styles.headerRow}>
          <div className={styles.identity}>
            <Wordmark />
            <span>Admin</span>
          </div>
          <Link className={styles.dashboardLink} href="/dashboard">
            <ArrowLeft size={16} aria-hidden="true" /> Dashboard
          </Link>
        </div>
      </header>

      {children}

      <DashboardFooter label="BakerLinks administration" />
    </div>
  )
}

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import styles from '@/app/dashboard/dashboard.module.css'

export default function DashboardFooter({ label }: { label: string }) {
  return (
    <footer className={styles.shell + ' ' + styles.footer}>
      <p>{label}</p>
      <nav aria-label="Dashboard footer">
        <Link href="/site/directory">Public directory <ArrowUpRight size={14} aria-hidden="true" /></Link>
        <Link href="/site/contact">Support</Link>
        <Link href="/site/privacy">Privacy</Link>
      </nav>
    </footer>
  )
}

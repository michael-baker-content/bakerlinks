import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Terms | BakerLinks' }

export default function TermsPage() {
  return (
    <>
      <h1>Terms</h1>
      <p>BakerLinks gives you a public page for your work, links, and story. These rules apply to how you use the service and what you publish.</p>

      <h2>What you publish</h2>
      <p>Use photos, text, and other material you own or have permission to share. Publish personal information about others only with their permission. Keep your account credentials private.</p>

      <h2>Respect other people</h2>
      <p>Do not use BakerLinks to impersonate someone, harass people, spread malware, run scams, or direct visitors to illegal content.</p>

      <h2>Reporting a problem</h2>
      <p>If a page or link breaks these rules, <Link href="/site/contact">report it to BakerLinks</Link> with the page URL and a short explanation. BakerLinks may remove content or restrict accounts that violate these rules.</p>
    </>
  )
}
